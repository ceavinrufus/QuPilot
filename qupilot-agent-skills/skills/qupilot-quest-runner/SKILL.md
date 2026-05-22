---
name: qupilot-quest-runner
description: "Fetch, dispatch, and verify on-chain quests from the QuPilot API by composing the byreal-cli (Solana CLMM/swap) and byreal-perps-cli (Hyperliquid perpetuals) skills. Use whenever the user mentions QuPilot, quests, quest runner, on-chain tasks, quest rewards, agent missions, Byreal quests, RealClaw quests, or asks an agent to complete an on-chain task for them — even if they don't explicitly name QuPilot. Also use when the user wants to list, claim, execute, or submit completion proof for any on-chain quest tied to swaps, liquidity, or perp trading on Byreal/Hyperliquid."
metadata:
  qupilot:
    homepage: https://github.com/byreal-git/byreal-agent-skills
    composes:
      - byreal-cli
      - byreal-perps-cli
    env:
      - QUPILOT_API_URL
      - QUPILOT_API_KEY
---

# QuPilot Quest Runner

This skill teaches an agent the three-phase lifecycle of a QuPilot quest: **fetch** an open quest, **dispatch** it to the right byreal CLI to execute on-chain, then **verify** completion by submitting proof back to the QuPilot API.

You are not reimplementing trading logic — `byreal-cli` and `byreal-perps-cli` already do that, and they handle wallets, slippage, and confirmations correctly. Your job is to read a quest's structured `action` payload, pick the right CLI command, run it cleanly, and report the resulting tx hash or order ID back.

## Before doing anything else

1. Confirm both companion skills are available. If `byreal-cli` or `byreal-perps-cli` isn't installed and the quest requires them, stop and tell the user to install them — don't try to call npm packages directly, the byreal skills encode safety rails (preview-then-confirm, slippage warnings, no key display) that we inherit by composing them.
2. Confirm `QUPILOT_API_URL` and `QUPILOT_API_KEY` are set in the environment. If either is missing, stop and ask the user to set them. Do not invent defaults beyond the `http://localhost:3000/v1` fallback for local dev.
3. Read `references/qupilot-api.md` once at the start of a session — it's the source of truth for endpoint shapes and error codes.

## The three-phase workflow

### Phase 1 — Fetch

Default to listing open quests scoped to the venues we can actually dispatch:

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "$QUPILOT_API_URL/quests?status=open&limit=20"
```

Parse the JSON envelope. If `success` is `false`, surface `error.message` to the user verbatim and stop — don't guess at fixes.

When presenting the quest list to the user, show:
- `id`, `title`, `venue`, `reward`
- A one-line summary derived from `action.kind` + key params (e.g. "swap ≥ $50 SOL→USDC, slippage ≤ 50bps")
- `expires_at` rendered as a human-readable countdown

If the user asks "which one should I do," weigh by **reward ÷ estimated execution cost** rather than by reward alone — a $5 reward isn't worth a quest that costs $4 in slippage and fees. Be honest about uncertainty; it's better to flag a quest as "needs preview" than to silently rank it high.

### Phase 2 — Dispatch

Once the user picks a quest (or you've been told to auto-execute the easiest one), claim it first:

```bash
curl -sS -X POST -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "$QUPILOT_API_URL/quests/<id>/claim"
```

Save the returned `claim_token` — you'll need it for completion. Then look up `action.kind` in `references/quest-mapping.md` and run the prescribed byreal command(s). A few principles to follow regardless of kind:

- **Always `-o json`.** Text output is for humans; we're parsing.
- **Always preview first when the byreal skill exposes a preview.** Skipping preview is exactly the kind of shortcut that turns a $50 swap into a $500 loss.
- **Never paste private keys into commands.** The byreal CLIs handle auth via their own SQLite stores or env vars they document themselves.
- **If a command returns `success: false`, abandon the claim.** Call `POST /quests/{id}/abandon` so the quest goes back to `open` instead of expiring locked, then report the error to the user.

If the quest's `action.kind` isn't in the mapping table, stop. Surface the kind to the user with a note that the skill needs an explicit mapping before it can execute — don't infer.

### Phase 3 — Verify

Build the completion body from the proof fields the quest's `verification.required_fields` lists, plus the `claim_token` from phase 2:

```bash
curl -sS -X POST -H "Authorization: Bearer $QUPILOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "claim_token": "...", "proof": { "tx_hash": "..." }, "agent_metadata": {...} }' \
  "$QUPILOT_API_URL/quests/<id>/complete"
```

The server may return `status: "submitted"` rather than `"verified"` — that means verification is async. Poll `GET /quests/{id}` once every 5–10 seconds, up to a minute or so. If it's still pending after that, hand off to the user: "Verification is taking longer than expected; check `qupilot-cli quests show <id>` later or rerun this skill."

When the quest reaches `verified`, report the reward to the user. When it reaches `failed`, report the failure reason from `error.message` verbatim — don't soften it, the user needs the actual signal.

## Hard constraints

These are non-negotiable because they're the difference between a useful agent and a runaway one:

1. **One quest at a time.** Don't fan out and claim multiple quests in parallel unless the user explicitly asks for batch execution. Claims hold real value (they block other agents) and parallel failure modes are nasty.
2. **No silent retries on on-chain failures.** A rejected swap or order means stop and abandon — not "try again with different params." The byreal CLIs already retry their own RPC-level transients; if their final answer is failure, that's the answer.
3. **JSON only for parsing decisions.** If a byreal command's `success` is `true` but the JSON shape doesn't have the field you expected, do not invent a value — surface the shape mismatch to the user. The byreal skills version their CLIs and the contract might have shifted.
4. **Surface API errors verbatim.** QuPilot's backend knows things you don't (e.g. that the user already completed this quest from another device). Don't paraphrase; quote.
5. **Preview big trades.** For any quest with `min_notional_usd ≥ 1000` (or its perp equivalent), preview the trade and ask the user to confirm before submitting, even if the rest of the flow is automated. The byreal skills enforce this themselves above $1k — don't try to bypass.

## What to keep in your head vs. consult on demand

- **In head**: the three-phase shape (fetch / dispatch / verify), the envelope `{success, data, error}`, the hard constraints.
- **Consult `references/qupilot-api.md`** when you need exact endpoint paths, query params, or the meaning of an error code.
- **Consult `references/quest-mapping.md`** every time you dispatch — even when you "remember" the mapping. The byreal CLIs change flags occasionally and the file is the canonical source.

## Examples

**Example 1 — list and pick:**
> User: "What's on my QuPilot queue?"
>
> Agent: calls `GET /quests?status=open`, renders the table, sorts by reward÷cost where cost can be estimated, recommends one.

**Example 2 — execute end-to-end:**
> User: "Do quest qst_01HXY for me."
>
> Agent: claims it, looks up `action.kind` in the mapping, runs the byreal command with `-o json`, captures the proof field, POSTs completion with the `claim_token`, polls for verification, reports the reward.

**Example 3 — graceful failure:**
> User: "Do quest qst_01HXY for me."
>
> Agent: claims it, runs `byreal-cli swap execute`, sees `{success: false, error: {code: "INSUFFICIENT_BALANCE"}}`, calls `POST /quests/qst_01HXY/abandon`, tells the user: "Quest abandoned — your wallet doesn't hold enough SOL to cover this swap. Top up and rerun me."

## Why this skill exists (not just what)

QuPilot's value is that *any* AI agent can clear on-chain tasks for a user. That promise only holds if the dispatch layer is boring, deterministic, and refuses to improvise on safety-critical paths. This skill is intentionally narrow: it's a router from quest descriptions to known-good CLI commands, with explicit verification. When in doubt, prefer "stop and ask" over "try and see" — the on-chain blast radius makes silent failures genuinely costly.
