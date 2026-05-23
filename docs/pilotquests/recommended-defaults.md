# PilotQuests — Recommended Defaults (MVP)

This document proposes safe, implementation-friendly defaults for the MVP. Users/providers may override within policy constraints.

## 1) Safety & scope
- **Non-speculative quests only** by default (capability proof / safe automation).
- Any value-moving quest (swap/LP) requires **user-defined caps**.
- Verification accepts only **allowlisted Solana program IDs**.

## 2) Caps model (USD-equivalent)
**Hierarchy (recommended):**
1. **Global daily cap per user** (required)
2. **Per-quest daily cap per user** (defaulted by template; user can reduce)
3. **Per-run cap** (prevents one run from consuming the entire daily cap)

**Suggested MVP defaults (users must explicitly confirm):**
- Global daily cap: **$10 / day**
- Per-quest daily cap: **$5 / day**
- Per-run cap: **$2 / run**

## 3) Rate limiting & cooldown
- Max **3 runs / 10 minutes / user** (value-moving quests)
- Per-quest cooldown: **30 minutes** (per user)
- Read-only quests can be higher, but still rate-limited.

## 4) Idempotency & crash recovery
- Lock key: **(questId, userId)**
- Lock TTL: **15 minutes**
- Heartbeat interval: **1 minute**
- Stuck rule: heartbeat stale > **3 minutes** → mark “stuck”
- Auto-retry: **1 retry max**, only if **no tx signature** has been recorded yet

## 5) Verification & evidence storage
### 5.1 Evidence minimum per transaction
Store raw logs, plus this parsed summary:
- `txSignature` (full, never truncated)
- `network` (e.g., Solana mainnet)
- `walletAddress` (signer)
- `slot` and `blockTime` (if available)
- `programIdsTouched[]` (full strings)
- `tokenMintsTouched[]` (full strings)
- `transfers[]` (best-effort): `{mint, from, to, amount, decimals}`
- `questStep` (for multi-tx): `{index, name}`

### 5.2 Allowlist policy (Solana)
- MVP policy: allowlist only the **program IDs required** for the quest templates we ship.
- Aggregators: **off by default** for MVP unless strictly required.

