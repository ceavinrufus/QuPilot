# QuPilot Quest Runner — Eval 1: List and Recommend (with_skill)

## Pre-flight checks (per SKILL.md "Before doing anything else")

1. **Companion skills**: User confirmed `byreal-cli` and `byreal-perps-cli` are installed. Good — we can dispatch both CLMM and perps quests if needed.
2. **Env vars**: User says `QUPILOT_API_KEY` is set and API base is `https://api.qupilot.xyz/v1`. I'll treat that as `QUPILOT_API_URL=https://api.qupilot.xyz/v1`.
3. **References**: Loaded `references/qupilot-api.md` (envelope shape, error codes, endpoint contract) and `references/quest-mapping.md` (action.kind → CLI mapping) into working memory before dispatching anything.

User scope: 20 minutes, doesn't want to lose money. So we're firmly in Phase 1 (Fetch + recommend). No claim, no dispatch yet — that's a separate confirmation.

---

## Phase 1 — Fetch open quests

### Command

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "$QUPILOT_API_URL/quests?status=open&limit=20"
```

### Simulated response

```json
{
  "success": true,
  "data": {
    "quests": [
      {
        "id": "qst_01HXYABC123SWAPSOLUSDC",
        "title": "Swap $50 of SOL → USDC on Byreal",
        "description": "Execute one swap of at least $50 notional from SOL to USDC on Byreal CLMM.",
        "status": "open",
        "venue": "byreal-clmm",
        "action": {
          "kind": "swap",
          "params": {
            "from_token": "SOL",
            "to_token": "USDC",
            "min_notional_usd": 50,
            "max_slippage_bps": 50
          }
        },
        "reward": { "amount": "5", "token": "QPT" },
        "expires_at": "2026-05-22T18:30:00Z",
        "verification": { "mode": "tx-hash", "required_fields": ["tx_hash"] }
      },
      {
        "id": "qst_01HXYDEF456LPSOLUSDC",
        "title": "Provide $250 of liquidity to SOL/USDC 0.05% pool",
        "description": "Open a CLMM position of at least $250 with a ±5% range around the current tick.",
        "status": "open",
        "venue": "byreal-clmm",
        "action": {
          "kind": "provide-liquidity",
          "params": {
            "pool_id": "SOL-USDC-0.05%",
            "min_notional_usd": 250,
            "range_pct": 5
          }
        },
        "reward": { "amount": "18", "token": "QPT" },
        "expires_at": "2026-05-24T00:00:00Z",
        "verification": { "mode": "tx-hash", "required_fields": ["tx_hash", "position_id"] }
      },
      {
        "id": "qst_01HXYGHI789PERPBTC",
        "title": "Open a 0.01 BTC long on Hyperliquid (≥5x)",
        "description": "Open a perpetual long position on BTC sized 0.01 with leverage ≥ 5x.",
        "status": "open",
        "venue": "byreal-perps",
        "action": {
          "kind": "open-position",
          "params": {
            "coin": "BTC",
            "side": "long",
            "size": 0.01,
            "min_leverage": 5
          }
        },
        "reward": { "amount": "12", "token": "QPT" },
        "expires_at": "2026-05-23T00:00:00Z",
        "verification": { "mode": "order-id", "required_fields": ["order_id"] }
      },
      {
        "id": "qst_01HXYJKL012HOLDETH",
        "title": "Hold an ETH perp for 1 hour",
        "description": "Maintain any open ETH perp position for ≥ 3600 seconds without closing.",
        "status": "open",
        "venue": "byreal-perps",
        "action": {
          "kind": "hold-position",
          "params": { "coin": "ETH", "min_duration_seconds": 3600 }
        },
        "reward": { "amount": "8", "token": "QPT" },
        "expires_at": "2026-05-22T23:00:00Z",
        "verification": { "mode": "order-id", "required_fields": ["order_id"] }
      },
      {
        "id": "qst_01HXYMNO345VOLPERPS",
        "title": "Trade $500 of volume on Byreal Perps",
        "description": "Accumulate at least $500 of notional volume across one or more perp trades.",
        "status": "open",
        "venue": "byreal-perps",
        "action": {
          "kind": "trade-volume",
          "params": { "min_volume_usd": 500, "venue": "byreal-perps" }
        },
        "reward": { "amount": "25", "token": "QPT" },
        "expires_at": "2026-05-25T00:00:00Z",
        "verification": { "mode": "order-id", "required_fields": ["order_ids"] }
      }
    ],
    "cursor": null
  }
}
```

`success: true`, 5 quests, no error to surface verbatim. Proceeding to analysis.

---

## Reasoning — which one fits a 20-minute window without losing money?

Per SKILL.md Phase 1: rank by **reward ÷ estimated execution cost**, not raw reward. Also weigh time-to-complete against the 20 minute hard deadline, and the loss-aversion signal the user gave me.

Today is 2026-05-22. Countdowns (assuming "now" is the start of the user's 20-minute window, somewhere mid-day UTC):

| ID (short) | Title | Reward | Expires | Cost profile | Fits 20 min? |
|---|---|---|---|---|---|
| qst_…SWAPSOLUSDC | Swap $50 SOL→USDC | 5 QPT | ~hours | One swap, ≤50bps slippage = ~$0.25 + gas (~cents). Cheap. | Yes — ~2 min |
| qst_…LPSOLUSDC | LP $250 SOL/USDC ±5% | 18 QPT | ~2 days | Two-sided deposit, IL exposure, range-bound. "Loss" risk if SOL moves. Notional 5x higher. | Tight, and explicit IL risk |
| qst_…PERPBTC | Long 0.01 BTC ≥5x | 12 QPT | ~hours | Open-only quest. Leaves you with a live position. Funding + price risk after meeting. | Risky — leaves position open |
| qst_…HOLDETH | Hold ETH 1h | 8 QPT | ~hours | Requires already holding ETH perp. Also expires before the hold window can finish if started near deadline. | No — needs prior position and >1h |
| qst_…VOLPERPS | $500 perp volume | 25 QPT | ~3 days | Multi-trade composition, needs user strategy decision. Highest reward but highest fee drag and decision overhead. | No — wider window, not 20 min |

Honest cost notes:
- **Swap quest**: at 50 bps slippage cap and $50 notional, worst-case slippage cost ≈ $0.25, plus Solana priority fee (cents). Reward 5 QPT vs ~$0.25–0.50 cost is the cleanest reward÷cost ratio of the bunch, and the byreal-cli preview will confirm slippage before commit. Genuinely low-risk.
- **LP quest**: 18 QPT looks juicy but the $250 deposit sits in a ±5% range — if SOL ticks outside, you're holding one-sided exposure when the user comes back from the meeting. That's the "lose money on something dumb" scenario they flagged.
- **Open-position BTC**: opening a 5x long means the user walks into their meeting with an open leveraged position. Funding + price gap = exactly the loss they want to avoid.
- **Hold ETH**: requires a position that already exists; the user didn't mention one. Also the hold window won't fit in 20 minutes regardless.
- **Trade-volume**: per quest-mapping.md §6, this needs an explicit strategy conversation with the user. Not a "do it before a meeting" quest.

Per the "Preview big trades" hard constraint: only the LP quest is close to the $1k preview threshold ($250 < $1k, so technically below), but I'd still preview it given IL risk. Doesn't matter for the recommendation — we're not picking it.

Conclusion: **the SOL→USDC swap is the only quest that fits the constraints cleanly.** Lowest notional, lowest residual risk (no open position after), cheapest execution, fastest to complete. The action.kind `swap` is in the mapping table so dispatch is straightforward when the user gives the go-ahead.

I'm intentionally **not** claiming anything yet — Phase 2 (claim + dispatch) requires explicit user confirmation per the skill's "one quest at a time" and "stop and ask" defaults.

---

## Final user-facing answer

Here's what's on your QuPilot queue (5 open quests). Given your 20-minute window and "don't lose money" guardrail, my pick is the SOL→USDC swap. Quick rundown:

| # | Quest | Reward | Fits 20 min? | Risk |
|---|---|---|---|---|
| 1 | **Swap $50 SOL → USDC** (`qst_…SWAPSOLUSDC`) | 5 QPT | Yes (~2 min) | Very low — ~$0.25 slippage cap, no residual position |
| 2 | LP $250 into SOL/USDC ±5% (`qst_…LPSOLUSDC`) | 18 QPT | Tight | Medium — impermanent loss if SOL moves while you're in the meeting |
| 3 | Open 0.01 BTC long ≥5x (`qst_…PERPBTC`) | 12 QPT | Yes to open | High — you'd walk into your meeting holding a leveraged perp |
| 4 | Hold ETH perp 1h (`qst_…HOLDETH`) | 8 QPT | No | Needs an ETH position you already hold, and 1h > 20 min |
| 5 | $500 volume on perps (`qst_…VOLPERPS`) | 25 QPT | No | Multi-trade — needs a strategy decision, not a pre-meeting task |

**Recommendation: do quest 1 (the swap).** Best reward-to-cost ratio, finishes in ~2 minutes, leaves nothing open while you're in your meeting. The 18 QPT LP quest is more lucrative but the $250 sitting in a tight range while you're away is exactly the "dumb loss" you said you want to avoid. The BTC long is a worse version of the same problem.

Want me to run it? I'll claim `qst_01HXYABC123SWAPSOLUSDC`, preview the swap with `byreal-cli swap quote` first so you can see the exact slippage, then execute and submit the tx hash as proof. Say the word and I'll go.
