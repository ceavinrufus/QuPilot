# Open Questions / TODO (PilotQuests)

Goal of this document: collect decisions/questions we must resolve so implementation does not stay ambiguous.

## Decisions (answered)
As of **2026-05-22**, we agreed on:

### Product & Flow
- Quest creators (MVP): **Admin + Provider**
- User can have **multiple agents**; dispatch uses the **user’s default agent** unless overridden
- Provider onboarding minimum: **metadata + allowlists** (program/router allowlists + chain constraints)

### Wallet & Security
- Key storage: **local to the agent machine** (e.g., Byreal keys under `~/.config/byreal/keys/`); platform stores **public address only**
- Safety controls (MVP): **user-defined caps + allowlist** (plus rate limiting)

### Execution & Reliability
- Idempotency (MVP): **run lock per (questId, userId)** with TTL
- Multi-tx runs: **allowed** (store a list of tx signatures + step names)
- Retry policy: **limited retries** (e.g., 3x with backoff) for transient failures

### Verification
- Primary verification: **tx receipt baseline**
- Evidence: **tx signature + raw logs** (plus parsed summary)
- Solana proof source: **allowlist program IDs**

## Product & Flow
- Quest limits: do we enforce per-agent / per-user / per-quest daily caps (in addition to user-defined caps)?
- User onboarding: exact agent registration flow (what the user/provider uploads, what gets created where, how we “bind” default agent).
- Provider UI/API: how providers submit allowlists and how we validate them (program IDs, token mints, pools).

## Wallet & Security
- Allowlist policy details: which **program IDs** are allowed for swap/CLMM; do we also allow aggregators?
- Rate limiting: default limits (per user / per agent / per quest) and cooldown rules.
- Caps model: how users set caps (per quest, per day, per token, global), and how caps are enforced at runtime.

## Execution & Reliability
- Locking: lock TTL defaults, and what happens on crash (recovery/unlock strategy).
- Retry/backoff: exact retry schedule and which errors are retryable vs terminal.
- Observability: what logs/metrics are required for debugging failed runs.

## Verification
- Solana: list the initial **allowlisted program IDs** and how we maintain/update them.
- What is the minimum “parsed summary” we store from raw logs (transfers, token mints, pool address, etc.)?

## Recommended defaults (MVP)
See: `docs/pilotquests/recommended-defaults.md`
