# Eval 2 — Execute Swap Quest End-to-End (without skill)

**Mode:** DRY RUN (no real network / CLI calls)
**Date:** 2026-05-22
**User prompt:** Please execute quest `qst_01HXYABCDEF` (assumed SOL→USDC swap). `QUPILOT_API_URL=https://api.qupilot.xyz/v1`, `QUPILOT_API_KEY` set.

No public QuPilot spec exists — endpoint shapes below are guesses based on typical DEX-aggregator/quest-platform REST conventions.

---

## Step 1 — Fetch quest metadata

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "$QUPILOT_API_URL/quests/qst_01HXYABCDEF"
```

Expected:

```json
{
  "id": "qst_01HXYABCDEF",
  "title": "Swap SOL to USDC on byreal",
  "status": "active",
  "type": "swap",
  "chain": "solana",
  "venue": "byreal",
  "params": {
    "input_mint": "So11111111111111111111111111111111111111112",
    "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "min_amount_in_lamports": 10000000,
    "min_amount_in_ui": 0.01,
    "slippage_bps_max": 100
  },
  "reward": {"points": 250, "currency": "QPP"},
  "expires_at": "2026-05-29T00:00:00Z"
}
```

Reasoning: Confirms the user's guess (SOL→USDC). Mints match wrapped SOL and mainnet USDC. Quest is active, has a min-amount and slippage cap. OK to proceed.

---

## Step 2 — Check account balance

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "$QUPILOT_API_URL/account/balances?chain=solana"
```

Expected:

```json
{
  "wallet": "7xKX...9aBc",
  "balances": [
    {"mint": "So111...1112", "symbol": "SOL", "ui": 0.842, "lamports": 842000000},
    {"mint": "EPjFW...Dt1v", "symbol": "USDC", "ui": 12.40}
  ]
}
```

Reasoning: Need ≥ 0.01 SOL plus ~5,000 lamports gas. 0.842 SOL is more than sufficient.

---

## Step 3 — Request a quote from byreal

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
     -H "Content-Type: application/json" \
     -X POST "$QUPILOT_API_URL/venues/byreal/quote" \
     -d '{
       "input_mint": "So11111111111111111111111111111111111111112",
       "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
       "amount_in": 10000000,
       "slippage_bps": 50
     }'
```

Expected:

```json
{
  "quote_id": "q_byr_8f3a2c",
  "in_amount": 10000000,
  "out_amount_estimated": 1685200,
  "out_amount_min": 1676773,
  "price_impact_bps": 7,
  "route": [{"pool": "byreal-SOL-USDC", "fee_bps": 20}],
  "expires_at_unix": 1747915200
}
```

Reasoning: ~1.685 USDC for 0.01 SOL implies ~$168.50/SOL — plausible for May 2026. Price impact 7 bps, well under the 100-bps quest cap. Using 50 bps slippage as a conservative default below the cap.

---

## Step 4 — Pre-flight quest validation

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
     -H "Content-Type: application/json" \
     -X POST "$QUPILOT_API_URL/quests/qst_01HXYABCDEF/preflight" \
     -d '{"quote_id":"q_byr_8f3a2c"}'
```

Expected:

```json
{"ok": true, "checks": {"amount_min": "pass", "venue": "pass", "slippage": "pass", "mints": "pass"}}
```

---

## Step 5 — Execute the quest

In a real (non-dry) run I would still surface the quote and require an explicit confirm even though the user said "I trust you" — spending funds deserves a checkpoint. In DRY RUN we proceed.

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
     -H "Content-Type: application/json" \
     -X POST "$QUPILOT_API_URL/quests/qst_01HXYABCDEF/execute" \
     -d '{"quote_id":"q_byr_8f3a2c","confirm":true}'
```

Expected:

```json
{
  "execution_id": "exe_01HXYZ123",
  "status": "submitted",
  "tx_signature": "5KJp...c9Qx",
  "submitted_at": "2026-05-22T14:31:08Z"
}
```

---

## Step 6 — Poll until finalized

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "$QUPILOT_API_URL/executions/exe_01HXYZ123"
```

Expected after ~5–15 s:

```json
{
  "execution_id": "exe_01HXYZ123",
  "status": "confirmed",
  "tx_signature": "5KJp...c9Qx",
  "slot": 312456789,
  "in_amount": 10000000,
  "out_amount": 1683900,
  "fee_lamports": 5000,
  "quest": {"id": "qst_01HXYABCDEF", "status": "completed", "reward_credited": 250}
}
```

---

## Step 7 — Verify quest completion

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "$QUPILOT_API_URL/quests/qst_01HXYABCDEF"
```

Expected: `"status": "completed"`, `"completed_at": "2026-05-22T14:31:23Z"`, `"reward_credited": 250`.

---

## Final user-facing message

> Quest `qst_01HXYABCDEF` (Swap SOL→USDC on byreal) executed successfully.
>
> - Swapped: 0.01 SOL → 1.6839 USDC (price impact 0.07%, slippage cap 50 bps)
> - Tx: `5KJp...c9Qx` (slot 312,456,789)
> - Reward: +250 QPP credited
> - Quest status: completed
>
> Note: this was DRY RUN — no transaction was actually submitted. Endpoint paths and payload shapes are my best guess at the QuPilot API; the real surface may differ. Before a live run I'd want to confirm the exact endpoints and that the quest ID/venue match your intent.

---

## Assumptions & caveats (no skill consulted)

- Endpoint structure (`/quests/:id`, `/venues/:venue/quote`, `/quests/:id/execute`, `/executions/:id`) is invented; QuPilot may expose a single `/run` endpoint, a CLI, a websocket stream, or require signing client-side.
- I assumed QuPilot custodies the signing key (server-side execution). If it's actually a transaction-building API that returns an unsigned tx for the user's wallet, steps 5–6 would instead be: fetch tx → sign locally → submit → confirm.
- I assumed "byreal" is a Solana DEX/venue reachable through QuPilot. With no spec I can't verify the actual venue id string.
- Slippage default of 50 bps is my pick under the 100-bps cap; the real client may have a different default.
- Amount used: the quest's `min_amount_in` (0.01 SOL). A real run might use a larger user-specified amount.
- Reward currency "QPP" is a guess.
- No retry/backoff logic shown for the polling step.
- No idempotency key on the execute call — a real implementation should include one to prevent double-spend on retry.
