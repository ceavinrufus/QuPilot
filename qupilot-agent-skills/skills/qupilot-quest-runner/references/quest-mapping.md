# Quest → byreal CLI Mapping

Use this table when dispatching a claimed quest. Each row shows a quest `action` payload and the exact byreal CLI command(s) that satisfy it. Always run the CLI with `-o json` so the output stays parseable, and capture the field listed under "proof" to send back to `POST /agent/participations/:participation_uuid/complete`.

If a quest's `action.kind` isn't covered here, **stop and surface the kind to the user** rather than guessing. Extending coverage is a deliberate update to this file, not an inference.

---

## 1. `swap` — execute a token swap on Byreal CLMM

**Quest action payload:**
```json
{
  "kind": "swap",
  "params": {
    "from_token": "SOL",
    "to_token": "USDC",
    "min_notional_usd": 50,
    "max_slippage_bps": 50
  }
}
```

**Pre-flight:**
1. `byreal-cli wallet balance -o json` — confirm `from_token` balance covers `min_notional_usd` + gas headroom.
2. `byreal-cli swap quote --from SOL --to USDC --amount <calc> -o json` — verify the quote's notional ≥ `min_notional_usd` and slippage ≤ `max_slippage_bps`.

**Execute:**
```bash
byreal-cli swap execute --from SOL --to USDC --amount <calc> --slippage-bps 50 -o json
```

**Proof to send back:** `tx_hash` (from `data.tx_hash` in the JSON response).

**Complete curl:**
```bash
curl -sS -X POST -H "x-api-key: $QUPILOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "tx_hash": "<tx_hash>" }' \
  "$QUPILOT_API_URL/agent/participations/<participation_uuid>/complete"
```

---

## 2. `provide-liquidity` — open a CLMM position

**Quest action payload:**
```json
{
  "kind": "provide-liquidity",
  "params": {
    "pool_id": "SOL-USDC-0.05%",
    "min_notional_usd": 100,
    "range_pct": 5
  }
}
```

**Pre-flight:**
1. `byreal-cli pool show <pool_id> -o json` — confirm pool exists and current tick.
2. `byreal-cli wallet balance -o json` — confirm token balances for both sides (or that Auto Swap can cover the gap).
3. Preview the position with the dry-run flag the byreal-cli skill prescribes before committing.

**Execute:**
```bash
byreal-cli position open --pool <pool_id> --notional-usd 100 --range-pct 5 -o json
```

**Proof to send back:** `tx_hash` (from `data.tx_hash` in the JSON response).

**Complete curl:**
```bash
curl -sS -X POST -H "x-api-key: $QUPILOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "tx_hash": "<tx_hash>" }' \
  "$QUPILOT_API_URL/agent/participations/<participation_uuid>/complete"
```

---

## 3. `open-position` — open a perpetual on Hyperliquid

**Quest action payload:**
```json
{
  "kind": "open-position",
  "params": {
    "coin": "BTC",
    "side": "long",
    "size": 0.01,
    "min_leverage": 5
  }
}
```

**Pre-flight:**
1. `byreal-perps-cli account info -o json` — confirm available collateral.
2. If `min_leverage` is set and the current leverage is lower:
   ```bash
   byreal-perps-cli position leverage BTC <min_leverage> -o json
   ```

**Execute:**
```bash
byreal-perps-cli order market buy 0.01 BTC -o json
```
(For `side: short`, use `sell` instead of `buy`.)

**Proof to send back:** Use the Hyperliquid `order_id` as the `tx_hash` value — the backend stores this in the `tx_hash` field. Pass it as `{ "tx_hash": "<order_id>" }`.

**Complete curl:**
```bash
curl -sS -X POST -H "x-api-key: $QUPILOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "tx_hash": "<order_id>" }' \
  "$QUPILOT_API_URL/agent/participations/<participation_uuid>/complete"
```

---

## 4. `close-position` — close an open perp

**Quest action payload:**
```json
{ "kind": "close-position", "params": { "coin": "BTC" } }
```

**Pre-flight:** `byreal-perps-cli position list -o json` — confirm a non-zero position in `coin` exists, otherwise submit `complete` with the failed tx anyway (the backend will mark the participation as `failed`).

**Execute:**
```bash
byreal-perps-cli position close-market BTC -o json
```

**Proof to send back:** Use the Hyperliquid `order_id` as the `tx_hash` value — the backend stores this in the `tx_hash` field. Pass it as `{ "tx_hash": "<order_id>" }`.

**Complete curl:**
```bash
curl -sS -X POST -H "x-api-key: $QUPILOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "tx_hash": "<order_id>" }' \
  "$QUPILOT_API_URL/agent/participations/<participation_uuid>/complete"
```

---

## 5. `hold-position` — passive observation

**Quest action payload:**
```json
{ "kind": "hold-position", "params": { "coin": "BTC", "min_duration_seconds": 3600 } }
```

This quest doesn't require sending a new transaction — it requires *not* closing an existing one for the duration. The skill should:

1. Verify the position exists now: `byreal-perps-cli position list -o json`.
2. Note `opened_at` from the position metadata (or use claim time as a fallback).
3. Don't poll the QuPilot API in a tight loop — let the user resume the session after the hold window; on resume, re-check the position is still open and *then* call complete with the original position's `order_id` as `tx_hash`.

**Proof to send back:** Use the Hyperliquid `order_id` of the held position as the `tx_hash` value. Pass it as `{ "tx_hash": "<order_id>" }`.

**Complete curl:**
```bash
curl -sS -X POST -H "x-api-key: $QUPILOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "tx_hash": "<order_id>" }' \
  "$QUPILOT_API_URL/agent/participations/<participation_uuid>/complete"
```

---

## 6. `trade-volume` — accumulate notional across many trades

**Quest action payload:**
```json
{ "kind": "trade-volume", "params": { "min_volume_usd": 500, "venue": "byreal-perps" } }
```

Volume quests need composition. The skill should:

1. Ask the user how to fulfill it — small market orders, a single bigger order, etc. Don't pick a strategy unilaterally; this affects risk.
2. Run the chosen commands in sequence, summing notional from each JSON response's `data.notional_usd` (or equivalent).
3. Stop as soon as the cumulative notional ≥ `min_volume_usd`.
4. Collect every `order_id` along the way.

**Proof to send back:** Use the Hyperliquid `order_id` of the final (or most significant) trade as the `tx_hash` value. The backend stores this in the `tx_hash` field. Pass it as `{ "tx_hash": "<order_id>" }`.

**Complete curl:**
```bash
curl -sS -X POST -H "x-api-key: $QUPILOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "tx_hash": "<order_id>" }' \
  "$QUPILOT_API_URL/agent/participations/<participation_uuid>/complete"
```

---

## A note on partial fills and rejected orders

Every byreal CLI returns `{ success: false, error: { code, message } }` on rejection. Treat rejection as a hard stop for that quest attempt:

1. Submit `complete` with the failed tx_hash anyway. The backend's `verifyTxBasic` will mark the participation as `failed` automatically. No explicit abandon needed.
2. Report the byreal error message verbatim to the user.
3. Do not silently retry — quest-execution loops are exactly where runaway agents lose money.
