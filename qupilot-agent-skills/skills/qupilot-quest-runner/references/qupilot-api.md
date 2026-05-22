# QuPilot Quest API — Proposed Shape

This document is the contract between the `qupilot-quest-runner` skill and the QuPilot backend. The skill issues HTTP calls in this exact shape; the backend exposes endpoints matching this contract. Treat it as a living spec — when the backend evolves, update this file and the skill workflow together.

## Base URL & Auth

- **Base URL**: read from env `QUPILOT_API_URL` (e.g. `https://api.qupilot.xyz/v1`). Default to `http://localhost:3000/v1` for local development.
- **Auth header**: `Authorization: Bearer <QUPILOT_API_KEY>`. The key identifies the agent's user account.
- Every response returns JSON with a top-level `{ success: boolean, data?: ..., error?: { code, message } }` envelope — mirroring the byreal CLI convention so a single parser handles all three surfaces.

## Resource: Quest

A quest is an on-chain task a user (or their agent) can complete for a reward. The API never embeds private keys — execution always happens off the API, through the byreal CLIs, then the agent reports proof.

```jsonc
{
  "id": "qst_01HXY...",            // opaque, stable
  "title": "Swap $50 of SOL → USDC on Byreal",
  "description": "Execute one swap of at least $50 notional...",
  "status": "open",                 // open | claimed | submitted | verified | failed | expired
  "venue": "byreal-clmm",           // byreal-clmm | byreal-perps
  "action": {                       // structured target the agent must satisfy
    "kind": "swap",                 // swap | open-position | close-position | provide-liquidity | hold-position | trade-volume
    "params": {
      "from_token": "SOL",
      "to_token": "USDC",
      "min_notional_usd": 50,
      "max_slippage_bps": 50
    }
  },
  "reward": { "amount": "5", "token": "QPT" },
  "expires_at": "2026-05-29T00:00:00Z",
  "verification": {
    "mode": "tx-hash",              // tx-hash | order-id | onchain-watch
    "required_fields": ["tx_hash"]  // what `POST /complete` must include
  }
}
```

### Action kinds the v1 skill knows how to dispatch

| `action.kind`        | Required params                                       | Maps to                          |
|----------------------|-------------------------------------------------------|----------------------------------|
| `swap`               | `from_token`, `to_token`, `min_notional_usd`, `max_slippage_bps` | `byreal-cli swap …`              |
| `provide-liquidity`  | `pool_id`, `min_notional_usd`, `range_pct`            | `byreal-cli position open …`     |
| `open-position`      | `coin`, `side`, `size`, `min_leverage`                | `byreal-perps-cli order market …`|
| `close-position`     | `coin`                                                | `byreal-perps-cli position close-market …` |
| `hold-position`      | `coin`, `min_duration_seconds`                        | observation only — `position list` polling |
| `trade-volume`       | `min_volume_usd`, `venue`                             | composed loop of `order` / `swap` calls    |

Unknown `action.kind` values must fail closed — the skill refuses to execute and surfaces the kind back to the user so the mapping can be extended.

## Endpoints

### `GET /quests` — list quests

Query params (all optional):
- `status` — defaults to `open`. Pass `claimed,submitted` etc. for multi-status filters.
- `venue` — `byreal-clmm` or `byreal-perps` to scope by surface.
- `limit` — default 20, max 100.

Response:
```json
{ "success": true, "data": { "quests": [ /* Quest, … */ ], "cursor": null } }
```

### `GET /quests/{id}` — fetch one

Used to refresh state before claiming or after dispatching.

### `POST /quests/{id}/claim` — reserve a quest for this agent

Body: `{}` (the API key identifies the claimer).

Response on success: the quest with `status: "claimed"` and a `claim_token` the agent must include in the completion submission. Claims expire after `expires_at` or after a server-side TTL (e.g. 1h), whichever is sooner.

Failure cases worth surfacing to the user:
- `QUEST_ALREADY_CLAIMED` — someone else (or another session of this user) has it.
- `QUEST_EXPIRED` — past `expires_at`.
- `QUEST_PRECONDITION_FAILED` — e.g. wallet doesn't hold the required balance.

### `POST /quests/{id}/complete` — submit proof

Body shape depends on `verification.mode`:

```json
{
  "claim_token": "ctk_…",
  "proof": {
    "tx_hash": "5n3…",            // for mode = "tx-hash"
    "order_id": "ord_…",          // for mode = "order-id"
    "wallet": "9Wz…"              // for mode = "onchain-watch"
  },
  "agent_metadata": {
    "cli": "byreal-cli@0.4.1",
    "command": "swap --from SOL --to USDC --amount 0.5 -o json",
    "executed_at": "2026-05-22T10:14:33Z"
  }
}
```

Response: the quest with updated `status`. Most often `submitted` (backend will verify async) — the skill should poll `GET /quests/{id}` until it reaches `verified` or `failed`, or hand off to the user with a "check back later" message if verification takes > 60s.

### `POST /quests/{id}/abandon` — release a claim

Used if execution fails or the user decides not to proceed. Returns the quest to `open` so other agents can pick it up. No body required.

## Errors the skill must handle gracefully

| `error.code`                | Meaning & recovery                                                                 |
|-----------------------------|------------------------------------------------------------------------------------|
| `UNAUTHORIZED`              | `QUPILOT_API_KEY` missing or invalid. Stop, tell the user to set the env var.       |
| `QUEST_NOT_FOUND`           | The ID is wrong or the quest was deleted. Refresh the list.                         |
| `QUEST_ALREADY_CLAIMED`     | Don't retry. Pick a different quest or check if this agent already holds the claim. |
| `QUEST_EXPIRED`             | Filter it out and move on.                                                          |
| `QUEST_PRECONDITION_FAILED` | Show the precondition message to the user; do not silently work around it.         |
| `VERIFICATION_PENDING`      | Not a hard error — poll again in 5–10s.                                             |
| `VERIFICATION_FAILED`       | The proof didn't match the requirement. Surface the server's message verbatim.     |

## Why this shape (notes for the backend team)

1. **Structured `action` over freeform strings.** Keeping the action as `{kind, params}` instead of a plain description means the skill can deterministically pick a CLI command. Freeform titles can stay human-facing in `title` and `description`.
2. **Claim/complete as separate steps.** A two-phase flow lets the backend reserve quests (prevent double-claim races) and gives the agent a stable `claim_token` to attach to the eventual on-chain proof.
3. **Verification as a hint, not a rule.** `verification.mode` and `required_fields` tell the skill *what to send back*; the backend stays free to swap in stronger on-chain verification later without changing the skill's request shape.
4. **Mirror the byreal envelope.** Identical `{success, data, error}` wrapping across QuPilot and both byreal CLIs means one JSON parser and one error-handling path everywhere.
