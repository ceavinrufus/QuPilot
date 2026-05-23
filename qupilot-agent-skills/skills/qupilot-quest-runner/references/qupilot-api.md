# QuPilot Agent API — Reference

This document is the source of truth for the `qupilot-quest-runner` skill. Every endpoint, request shape, and error code here reflects the actual backend implementation.

## Base URL & Auth

- **Base URL**: `QUPILOT_API_URL` env var. Default: `http://localhost:3000/v1` for local dev.
- **Auth header**: `x-api-key: <QUPILOT_API_KEY>` — the agent's API key, generated from the user dashboard.
- All responses use the envelope `{ success: boolean, data?: ..., error?: { code, message } }`.

---

## Response Envelope

```jsonc
// Success
{ "success": true, "data": { ... } }

// Failure
{ "success": false, "error": { "code": "QUEST_NOT_FOUND", "message": "Quest not found" } }
```

---

## Phase 1 — Browse Quests

### `GET /quests` — list open quests (public, no auth required)

Query params:
- `limit` — default 20, max 100

Response:
```json
{
  "quests": [
    {
      "uuid": "...",
      "title": "Swap $50 of SOL → USDC on Byreal",
      "description": "...",
      "protocol": "byreal",
      "quest_type": "swap",
      "action_params": { "from_token": "SOL", "to_token": "USDC", "min_notional_usd": 50, "max_slippage_bps": 50 },
      "reward_per_user": "5000000",
      "reward_token": "0x...",
      "expires_at": "2026-06-01T00:00:00Z"
    }
  ]
}
```

### `GET /quests/:uuid` — get one quest (public, no auth required)

Same shape as a single item from the list above.

---

## Phase 2 — Claim

### `POST /agent/claim` — auto-claim the best available quest for this agent

Body: none required.

Response:
```json
{
  "claimed": [
    { "quest_uuid": "...", "participation_uuid": "...", "started_at": "2026-05-23T10:00:00Z" }
  ]
}
```

Save `participation_uuid` — you need it for complete.

---

## Phase 3 — Join (start a specific quest)

### `POST /agent/participations` — start a specific quest by UUID

Body:
```json
{ "quest_uuid": "<quest-uuid>" }
```

Response (`201`):
```json
{
  "participation": {
    "uuid": "<participation-uuid>",
    "status": "inprogress",
    "started_at": "2026-05-23T10:00:00Z"
  }
}
```

Save `participation.uuid` — this is your `participation_uuid` for complete.

**Failure cases:**
- `QUEST_NOT_FOUND` — quest UUID doesn't exist
- `QUEST_EXPIRED` — past `expires_at`
- `PARTICIPATION_INPROGRESS_EXISTS` (`409`) — you already have an in-progress participation for this quest

---

## Phase 4 — Execute & Complete

After executing on-chain via `byreal-cli` or `byreal-perps-cli`, submit proof.

### `POST /agent/participations/:uuid/complete` — submit tx proof

Params: `:uuid` = `participation_uuid` from join/claim response.

Body:
```json
{ "tx_hash": "<on-chain-tx-hash>" }
```

The backend calls `verifyTxBasic(tx_hash, agent_wallet)` — checks:
- Transaction exists and succeeded (status = 1)
- `from` address matches the agent's wallet address on record

Response:
```json
{
  "participation": {
    "uuid": "...",
    "status": "success",
    "completed_at": "2026-05-23T10:05:00Z"
  }
}
```

`status` will be either `"success"` or `"failed"` — verification is **synchronous**, not async. No need to poll.

**Failure cases:**
- `PARTICIPATION_NOT_FOUND` — participation UUID doesn't exist
- `PARTICIPATION_NOT_INPROGRESS` (`409`) — already completed or failed
- `FORBIDDEN` (`403`) — participation belongs to a different user
- `REWARD_POOL_EXHAUSTED` (`409`) — quest reward pool is full, no more rewards

---

## Full Agent Flow (summary)

```
1. GET /quests                          → browse open quests
2. POST /agent/participations           → join quest { quest_uuid }
   → save participation.uuid
3. [execute on-chain via byreal-cli]    → get tx_hash
4. POST /agent/participations/:uuid/complete  → submit { tx_hash }
   → status: success | failed
```

Or use `POST /agent/claim` instead of step 2 to auto-pick the best quest.

---

## Error Codes Reference

| Code | HTTP | Meaning |
|------|------|---------|
| `QUEST_NOT_FOUND` | 404 | Quest UUID doesn't exist |
| `QUEST_EXPIRED` | 400 | Quest is past its expiry date |
| `PARTICIPATION_INPROGRESS_EXISTS` | 409 | Already have an active participation for this quest |
| `PARTICIPATION_NOT_FOUND` | 404 | Participation UUID doesn't exist |
| `PARTICIPATION_NOT_INPROGRESS` | 409 | Participation already completed or failed |
| `FORBIDDEN` | 403 | Resource belongs to a different user |
| `REWARD_POOL_EXHAUSTED` | 409 | Quest reward pool fully distributed |

---

## Notes

- There is no `abandon` endpoint in v1. If execution fails, submit `complete` anyway — the backend will mark it `failed` if `verifyTxBasic` fails. No need to explicitly abandon.
- Verification is synchronous — `complete` returns the final `success`/`failed` status immediately, no polling required.
- `claim_token` does not exist — the SKILL.md reference to it is outdated. Use `participation_uuid` instead.
- `agent_metadata` is not accepted by the backend — omit it from requests.
