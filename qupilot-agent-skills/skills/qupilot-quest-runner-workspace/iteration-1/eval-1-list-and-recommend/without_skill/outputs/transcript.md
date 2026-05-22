# QuPilot Quest Triage — Dry Run Transcript

**Date:** 2026-05-22
**User constraint:** ~20 minutes before a meeting, low risk tolerance ("don't want to lose money on something dumb")
**Available tools:** `QUPILOT_API_KEY` env var, API base `https://api.qupilot.xyz/v1`, `byreal-cli`, `byreal-perps-cli`
**Mode:** DRY RUN (simulated responses)

---

## Step 1 — List active quests

I'll start by hitting the most obvious endpoint for a "quests" resource.

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "https://api.qupilot.xyz/v1/quests?status=active"
```

**Simulated response:**

```json
{
  "quests": [
    {
      "id": "q_8821",
      "title": "Byreal Spot Maker — USDC/SOL",
      "category": "spot-lp",
      "protocol": "byreal",
      "reward": { "amount": 12.5, "token": "USDC" },
      "estimated_time_minutes": 8,
      "estimated_gas_usd": 0.02,
      "risk_level": "low",
      "requirements": {
        "min_balance_usdc": 25,
        "actions": ["place_limit_order", "wait_for_fill_or_cancel"]
      },
      "expires_at": "2026-05-22T23:59:00Z",
      "completion_rate": 0.94
    },
    {
      "id": "q_8830",
      "title": "Byreal Perps — Open & Close 2x SOL-PERP",
      "category": "perps",
      "protocol": "byreal-perps",
      "reward": { "amount": 35.0, "token": "USDC" },
      "estimated_time_minutes": 15,
      "estimated_gas_usd": 0.05,
      "risk_level": "medium-high",
      "requirements": {
        "min_collateral_usdc": 100,
        "min_notional_usd": 200,
        "actions": ["open_perp", "hold_min_5_min", "close_perp"]
      },
      "expires_at": "2026-05-23T12:00:00Z",
      "completion_rate": 0.71,
      "notes": "Price exposure during 5-min hold. Funding rate currently -0.012%/hr."
    },
    {
      "id": "q_8845",
      "title": "Byreal LP — JLP/USDC concentrated range",
      "category": "concentrated-lp",
      "protocol": "byreal",
      "reward": { "amount": 22.0, "token": "USDC" },
      "estimated_time_minutes": 25,
      "estimated_gas_usd": 0.08,
      "risk_level": "medium",
      "requirements": {
        "min_balance_usd": 250,
        "actions": ["add_liquidity", "hold_24h", "remove_liquidity"]
      },
      "expires_at": "2026-05-24T00:00:00Z",
      "completion_rate": 0.62,
      "notes": "Requires 24h hold — not completable in one session."
    },
    {
      "id": "q_8851",
      "title": "Daily Check-in",
      "category": "social",
      "protocol": "qupilot",
      "reward": { "amount": 0.5, "token": "USDC" },
      "estimated_time_minutes": 1,
      "estimated_gas_usd": 0.0,
      "risk_level": "none",
      "requirements": { "actions": ["click_checkin"] },
      "expires_at": "2026-05-22T23:59:00Z",
      "completion_rate": 1.0
    }
  ],
  "page": 1,
  "total": 4
}
```

---

## Step 2 — Check user balance and wallet readiness

Before recommending anything, I want to know if the user actually meets the requirements.

```bash
curl -sS -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "https://api.qupilot.xyz/v1/user/balances"
```

**Simulated response:**

```json
{
  "wallet": "8xqT...9kPm",
  "balances": [
    { "token": "USDC", "amount": 312.40, "usd_value": 312.40 },
    { "token": "SOL",  "amount": 1.85,    "usd_value": 277.50 }
  ],
  "perps_collateral_usdc": 0.0,
  "open_positions": []
}
```

OK — user has $312 USDC and 1.85 SOL liquid. No perps collateral deposited and no open positions. That matters: the perps quest needs $100 collateral deposited *and* the user would have to deposit, open, wait 5 min, close, and withdraw — tight in 20 minutes, and price moves count against the reward.

---

## Step 3 — Check current market conditions for the perps quest

```bash
byreal-perps-cli market info SOL-PERP
```

**Simulated response:**

```json
{
  "symbol": "SOL-PERP",
  "mark_price": 150.12,
  "index_price": 150.08,
  "funding_rate_1h": -0.00012,
  "open_interest_usd": 18420000,
  "24h_volatility": 0.041,
  "spread_bps": 6
}
```

4.1% daily vol → roughly ~0.6% expected move over a 5-minute hold (rough sqrt-of-time scaling). On a $200 notional 2x position that's about $1.20 of noise either direction, with a fat tail. Reward is $35 — so EV is positive in expectation, but variance is real and the user explicitly said "don't lose money on something dumb."

---

## Step 4 — Sanity check the spot maker quest fill probability

```bash
byreal-cli orderbook USDC-SOL --depth 10
```

**Simulated response:**

```json
{
  "pair": "USDC-SOL",
  "best_bid": 149.98,
  "best_ask": 150.06,
  "spread_bps": 5,
  "bid_depth_usd_top5": 84000,
  "ask_depth_usd_top5": 91000,
  "recent_fills_per_min": 14
}
```

Tight spread, active book, 14 fills/min. A limit maker order placed inside the spread should fill within a couple of minutes. Quest says "place_limit_order, wait_for_fill_or_cancel" — low risk, the only way to "lose" is if price walks away and you cancel, costing only gas (~$0.02).

---

## Step 5 — Reasoning

Filtering by the user's constraints:

| Quest | Fits 20 min? | Risk | Reward | EV-adjusted? |
|---|---|---|---|---|
| q_8851 Daily Check-in | yes (1 min) | none | $0.50 | trivially positive — always do it |
| q_8821 Spot Maker | yes (~8 min) | low (price exposure only while order resting; can cancel) | $12.50 | strongly positive, near-zero downside |
| q_8830 Perps Open/Close | tight (~15 min + deposit/withdraw) | medium-high (price moves on $200 notional) | $35 | positive EV but real variance; user said no |
| q_8845 Concentrated LP | NO — 24h hold | medium | $22 | doesn't fit the window at all |

**The user's exact words were "don't want to lose money on something dumb."** That rules out the perps quest in this session, even though it pays the most — a bad 5-minute candle can wipe more than $35 of the reward. The LP quest is disqualified by time. The daily check-in is free money but only $0.50.

The spot maker quest is the clear answer: 8 minutes, $12.50 reward, downside is bounded to a couple of cents of gas if the order doesn't fill.

---

## Final answer to the user

Do these two, in this order — both fit comfortably in 20 minutes and neither can really go wrong:

1. **Daily Check-in (q_8851)** — 1 minute, $0.50, zero risk. Just claim it.
2. **Byreal Spot Maker USDC/SOL (q_8821)** — ~8 minutes, $12.50 reward. Place a limit maker order inside the current spread (best bid 149.98 / best ask 150.06). Book is active (~14 fills/min) so it should fill quickly. If it doesn't, just cancel — you only lose ~$0.02 in gas.

**Skip for now:**
- **Perps Open/Close (q_8830, $35)** — highest reward but you'd be holding a 2x SOL-PERP position with $200 notional for 5+ minutes. SOL is at 4.1% daily vol; a bad candle can eat the entire reward. Not "dumb," but not what you asked for given your constraints. Come back to this when you have time and aren't pre-meeting.
- **Concentrated LP JLP/USDC (q_8845, $22)** — requires a 24h hold. Doesn't fit your window at all.

Suggested commands to execute right now:

```bash
# 1. Daily check-in
curl -sS -X POST -H "Authorization: Bearer $QUPILOT_API_KEY" \
  "https://api.qupilot.xyz/v1/quests/q_8851/complete"

# 2. Spot maker — place a limit buy slightly inside the spread
byreal-cli order place \
  --pair USDC-SOL \
  --side buy \
  --type limit \
  --price 150.00 \
  --size 0.1 \
  --post-only

# Mark the quest as in-progress so QuPilot tracks the fill
curl -sS -X POST -H "Authorization: Bearer $QUPILOT_API_KEY" \
  -d '{"quest_id":"q_8821"}' \
  "https://api.qupilot.xyz/v1/quests/start"
```

Total expected reward this session: **$13.00** with effectively no downside. You'll be done in under 10 minutes with buffer left before your meeting.
