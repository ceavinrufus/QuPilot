# PilotQuests — MVP Requirements (Draft)

This document captures the current MVP scope and assumptions based on our discussion. It is meant to be updated continuously.

## 1) Product model (platform roles)
PilotQuests is a quest platform where **agents** execute Web3 actions and the platform verifies completion.

**Roles**
- **Provider**: registers and creates quests (defines the action + verification rules).
- **User**: registers and connects/assigns *their agent*.
- **Agent**: executes quests on behalf of a user (wallet + execution environment).

## 2) Core concept: Quest executed by agents
Unlike typical quest platforms (where users do actions manually), in PilotQuests:
- a user opts-in by attaching their agent,
- the system dispatches quests to agents,
- the system verifies completion and stores evidence.

## 3) MVP scope (current)
### 3.1 Quest types
MVP will start with a **custom mix** of 3–5 quests (to be listed explicitly).

### 3.2 Target chain (initial)
- Primary target for the initial phase: **Solana (Byreal DEX via byreal-cli)**.

### 3.3 Safety rules (MVP)
- **Non-speculative only** quests (capability proof; no directional “trading decisions” for users).
- **User-defined caps are required** before an agent can execute any value-moving quest (swap/LP).
- Execution must be constrained by **allowlisted Solana program IDs**.
- Add **rate limiting** per user/agent to avoid spam and reduce risk.

### 3.4 Verification (default)
Default verification for MVP:
- **Tx receipt baseline**, and
- **store event logs** as the primary proof artifact (tx + relevant logs).

> Note: some quest types may require additional verification (e.g., balance diffs, position state checks).

## 4) Data we must store (minimum)
### 4.1 Quest
- id / slug
- providerId
- title, description
- chain/network
- action type (swap / lp / etc.)
- parameters schema (tokenIn/tokenOut/amount/etc.)
- verification rules (allowlist, expected events, tolerances)
- status (draft/active/paused/archived)

### 4.2 QuestRun (attempt)
- id
- questId
- userId
- agentId / wallet address
- startedAt, finishedAt
- execution result:
  - txHash (or list of tx hashes if multi-tx)
  - status (success/failure)
  - raw CLI outputs (optional, but helpful)
- verification result:
  - verified (boolean)
  - failureReason (if any)
  - evidence:
    - tx receipt (parsed summary)
    - event logs (raw + parsed)

## 5) Decisions (locked for MVP)
### 5.1 Quest creation
- Quest creators: **Admin + Provider**
- Provider onboarding minimum: **metadata + allowlists**

### 5.2 Agents
- Users can register **multiple agents**
- Each user has a **default agent** used for dispatch unless overridden
- Key storage: **local to the agent machine** (platform stores public address only)

### 5.3 Reliability
- Idempotency: **run lock per (questId, userId)** with TTL
- Multi-tx runs: **allowed** (store ordered tx list + step names)
- Retry policy: **limited retries** (e.g., 3x with backoff) for transient failures

## 6) Recommended defaults (MVP)
See: `docs/pilotquests/recommended-defaults.md`

## 7) Execution pipeline (high-level)
1. Provider creates a quest (action + verification rules).
2. User registers and attaches/configures their agent.
3. System dispatches a quest to the user’s agent.
4. Agent executes the action via Byreal tooling (initially `byreal-cli`).
5. System verifies completion from chain data (receipt + event logs).
6. Store evidence, mark run as verified/completed.

## 8) Open items to finalize next
### 6.1 The exact 3–5 MVP quests (must be explicit)
We need the concrete list, for example:
- swap 3 USDC -> SOL
- swap SOL -> USDC
- open/close LP position (if included)

### 6.2 Agent contract / security
- How users provide agent credentials (key management model).
- What is allowed/blocked (allowlist routers/programs, max spend, etc.).

### 6.3 Scheduling & idempotency
- When/how often quests are dispatched.
- Prevent double execution (idempotency keys, run locks).
