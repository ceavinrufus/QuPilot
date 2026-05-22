# QuPilot BE — Execution Checklist

Step-by-step buat execute `quest-api-BE-requirements-v2.md`. Setiap step dipecah semodular mungkin biar tiap commit/PR kecil dan mudah di-review. Tandai `- [x]` setelah step selesai.

> **Keputusan teknis (sudah dikonfirmasi):**
> - Schema DB: SQL migration files di `supabase/migrations/`, dijalanin manual via Supabase SQL editor / CLI.
> - Verifikasi tx_hash: **basic** — confirmed status di Solana RPC + signer match wallet user.
> - Claim reward: **real on-chain** SPL transfer dari treasury keypair, simpan tx_hash hasil claim.

> **Cara apply migrations manual:**
> 1. Buka Supabase Dashboard → SQL Editor.
> 2. Jalanin isi `supabase/migrations/0001_*.sql` sampai `0004_*.sql` berurutan.
> 3. Cek di Table Editor: `user_providers`, `users`, `quests`, `quest_participations` muncul.

---

## Phase 0 — Foundation

- [x] **0.1** Tambah folder structure: `src/config/`, `src/lib/`, `src/middlewares/`, `src/modules/`, `src/types/`, `supabase/migrations/` (`.gitkeep` boleh kalau masih kosong).
- [x] **0.2** `src/config/env.ts` — load + validate env pakai zod: `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `AI_AGENT_API_KEY`, `SOLANA_RPC_URL`, `TREASURY_SECRET_KEY` (base58). Fail fast saat boot.
- [x] **0.3** `src/config/supabase.ts` — export single supabase client pakai service role key.
- [x] **0.4** `src/lib/errors.ts` — class `AppError(status, code, message)` + helper `throw404/409/403/401/400`.
- [x] **0.5** `src/middlewares/error-handler.ts` — central error middleware, format response konsisten `{ error: { code, message } }`.
- [x] **0.6** `src/middlewares/validate.ts` — generic zod validator untuk `body` / `query` / `params`.
- [x] **0.7** `src/types/express.d.ts` — augment `Request` dengan `auth?: { role, sub, ... }`.
- [x] **0.8** `src/app.ts` — extract express setup dari `src/index.ts`, pasang error handler di akhir. Update `.env.example` tambahin `TREASURY_SECRET_KEY`.

## Phase 1 — Database Schema (SQL migrations)

- [x] **1.1** `supabase/migrations/0001_user_providers.sql` — table sesuai spec, unique index `username` & `uuid`, default `gen_random_uuid()` + enable extension `pgcrypto` jika belum.
- [x] **1.2** `supabase/migrations/0002_users.sql` — table users, unique `wallet_address` & `uuid`.
- [x] **1.3** `supabase/migrations/0003_quests.sql` — table quests, FK ke `user_providers(id)`, index `(provider_id)`, `(expires_at)`, `(protocol)`, `(quest_type)`.
- [x] **1.4** `supabase/migrations/0004_quest_participations.sql` — table participations, FK user/quest, **partial unique index** `(user_id, quest_id) WHERE status='inprogress'` untuk enforce "satu inprogress per kombinasi".
- [ ] **1.5** Apply semua migration di Supabase SQL editor; verifikasi ke-4 table ada. _(manual — user execute di Supabase Dashboard)_

## Phase 2 — Auth Libraries

- [ ] **2.1** `src/lib/password.ts` — `hashPassword`, `verifyPassword` pakai bcrypt (cost 10).
- [ ] **2.2** `src/lib/jwt.ts` — `signProviderJwt({sub, username})`, `signUserJwt({sub, wallet_address})`, `verifyJwt()` return discriminated union by `role`.
- [ ] **2.3** `src/lib/wallet-signature.ts` — `verifySolanaSignature(walletAddress, message, signatureBase58)` pakai `tweetnacl` + `bs58`.
- [ ] **2.4** `src/middlewares/auth-provider.ts` — extract Bearer, verify JWT, assert `role=user_provider`, set `req.auth`.
- [ ] **2.5** `src/middlewares/auth-user.ts` — sama dengan 2.4 tapi `role=user`.
- [ ] **2.6** `src/middlewares/auth-agent.ts` — cek header `x-api-key` equal `AI_AGENT_API_KEY`, set `req.auth = { role: 'agent' }`.

## Phase 3 — Module: Auth User Provider

- [ ] **3.1** `src/modules/auth-provider/auth-provider.schema.ts` — zod `registerBody`, `loginBody`.
- [ ] **3.2** `src/modules/auth-provider/auth-provider.service.ts` — `register()` (hash + insert + handle 23505→409), `login()` (lookup + verify + sign JWT).
- [ ] **3.3** `src/modules/auth-provider/auth-provider.controller.ts` — `POST /register`, `POST /login`.
- [ ] **3.4** `src/modules/auth-provider/auth-provider.routes.ts` — router, mount di `app.ts` di `/auth/provider`.

## Phase 4 — Module: Auth User (Wallet)

- [ ] **4.1** `src/modules/auth-user/auth-user.schema.ts` — zod `walletLoginBody { wallet_address, signature, message }`.
- [ ] **4.2** `src/modules/auth-user/auth-user.service.ts` — verify signature → upsert by `wallet_address` → sign user JWT.
- [ ] **4.3** `src/modules/auth-user/auth-user.controller.ts` + routes — `POST /auth/user/login`.

## Phase 5 — Module: Providers (public listing)

- [ ] **5.1** `src/modules/providers/providers.service.ts` — `listAll()` (field `spotlight` ada di response, default false).
- [ ] **5.2** Controller + routes — `GET /providers` (public, no auth).

## Phase 6 — Module: Quests (Provider side)

- [ ] **6.1** `src/modules/quests/quests.schema.ts` — zod `createQuestBody` dengan enum protocol & quest_type, validasi `expires_at` di masa depan (`refine`).
- [ ] **6.2** `src/modules/quests/quests.service.ts` — `create(providerId, body)`, `listByProvider(providerId)` dengan participation count, `getDetailForProvider(providerId, questUuid)` dengan analytics (total/success/failed/success_rate).
- [ ] **6.3** Controller + routes (provider-only): `POST /provider/quests`, `GET /provider/quests`, `GET /provider/quests/:uuid`. Mount dengan `authProvider`.
- [ ] **6.4** Handler `PUT`/`PATCH /provider/quests/:uuid` → return **403** ("Quest is immutable") sesuai business rule.

## Phase 7 — Module: Quests (Public side)

- [ ] **7.1** Extend `quests.service.ts`: `listPublic({ protocol?, type? })` filter `expires_at > now()`, join provider untuk nama+logo, plus participation count.
- [ ] **7.2** `listPublicByProvider(providerUuid)` — sama tapi filter by provider uuid.
- [ ] **7.3** `getPublicDetail(uuid)` — full detail termasuk `action_params`.
- [ ] **7.4** Controller + routes (no auth): `GET /quests`, `GET /providers/:uuid/quests`, `GET /quests/:uuid`.

## Phase 8 — Module: User Participations & Achievements

- [ ] **8.1** `src/modules/participations/participations.service.ts` — `listByUser(userId)` return semua participations + quest detail.
- [ ] **8.2** `getDetailForUser(userId, questUuid)` — participation + quest + flag `can_claim` (`status='success' && !reward_claimed`).
- [ ] **8.3** Controller + routes (user-only): `GET /me/participations`, `GET /me/participations/:questUuid`.

## Phase 9 — Module: Claim Reward (on-chain)

- [ ] **9.1** `src/lib/solana.ts` extend: `getConnection()`, `loadTreasuryKeypair()` dari env (base58), `transferSpl(to, mint, amount)` return tx signature.
- [ ] **9.2** `participations.service.ts` — `claimAll(userId)`: select participations `status='success' AND reward_claimed=false` + quest reward info; loop transfer SPL ke wallet user; update `reward_claimed=true` per row sukses; handle partial failure.
- [ ] **9.3** Controller + route: `POST /me/claim` (user-only). Response: `{ claimed: [{ quest_uuid, tx_hash, amount, token }], failed: [...] }`.

## Phase 10 — Module: AI Agent (join + complete)

- [ ] **10.1** `src/modules/agent/agent.schema.ts` — `joinBody { quest_uuid, user_uuid }`, `completeBody { tx_hash }`.
- [ ] **10.2** `agent.service.ts` — `join()`: resolve quest by uuid (cek belum expired), resolve user by uuid, insert participation status `inprogress` (partial unique index handle race).
- [ ] **10.3** `agent.service.ts` — `complete(participationUuid, txHash)`: panggil `verifyTxBasic(txHash, userWallet)` di `lib/solana.ts` (RPC `getTransaction` + cek confirmed + signer match wallet). Set status success/failed + `completed_at` + `tx_hash`.
- [ ] **10.4** Controller + routes (agent-only via `authAgent`): `POST /agent/participations` (join), `POST /agent/participations/:uuid/complete`.

## Phase 11 — Module: Leaderboard

- [ ] **11.1** `src/modules/leaderboard/leaderboard.service.ts` — single SQL query: join users + participations + quests, `total_reward` dari `status=success AND reward_claimed=true`, `success_rate = success/total`. `ORDER BY total_reward DESC, success_rate DESC LIMIT 100`.
- [ ] **11.2** Controller + route public: `GET /leaderboard`.

## Phase 12 — Wiring & Smoke Test

- [ ] **12.1** `src/app.ts` — semua router ter-mount, urutan middleware bener (helmet → cors → json → routes → error-handler).
- [ ] **12.2** `npm run typecheck` lulus tanpa error.
- [ ] **12.3** Smoke flow manual (curl/Postman):
  - [ ] `POST /auth/provider/register` → 201 + uuid
  - [ ] `POST /auth/provider/login` → JWT
  - [ ] `POST /provider/quests` (Bearer) → 201 + quest uuid
  - [ ] `PATCH /provider/quests/:uuid` → **403**
  - [ ] `POST /auth/user/login` (wallet + signature) → JWT user
  - [ ] `GET /quests` (public) → quest muncul, ada nama+logo provider
  - [ ] `POST /agent/participations` (x-api-key) → 201 participation uuid
  - [ ] Eksekusi tx devnet manual → `POST /agent/participations/:uuid/complete` → status `success`
  - [ ] `GET /me/participations` (Bearer user) → success + `can_claim=true`
  - [ ] `POST /me/claim` → on-chain transfer terjadi, tx_hash claim ada
  - [ ] `GET /leaderboard` → user muncul dengan `total_reward` & `success_rate`
- [ ] **12.4** (Opsional) Bikin `API.md` ringkas — daftar endpoint + contoh request.

---

## Cara Tandai Progress

Pas execute step `X.Y`, ubah `- [ ] **X.Y** ...` → `- [x] **X.Y** ...` di file ini. Commit per phase (atau per step kalau mau granular) biar reviewer bisa cocokan diff dengan checkbox.