# Open Questions / TODO (PilotQuests)

Goal of this document: collect decisions/questions we must resolve so implementation does not stay ambiguous.

## Product & Flow
- Who creates quests? (admin-only, partner, or user-generated?)
- Do quests have limits per agent/wallet?
- How do we choose an agent? round-robin, queue, priorities?
- Provider onboarding: what information must a provider submit to create quests (metadata, allowlists, chain constraints)?
- User onboarding: how does a user attach an agent (key storage model, permissions, spending limits)?

## Wallet & Security
- Does each agent have its own wallet, or a shared wallet?
- Where are keys stored (HSM/vault/env vars)? (never in the repo)
- Policy for allowlisting contracts/routers that are allowed to be used.
- Safety controls: max spend per quest/run, denylist/allowlist for programs/routers, rate limits.

## Execution & Reliability
- Retry policy for RPC errors / long pending transactions.
- Timeouts & idempotency: how do we prevent a quest from running twice?
- Multi-tx runs: how do we model and verify quests that require approvals or multiple steps?

## Verification
- What is the primary verification standard (tx/event/balance)?
- Should evidence store raw logs, or is txHash + computed summary enough?
- For Solana: which program IDs are acceptable proof sources? (Byreal programs, aggregators, etc.)
