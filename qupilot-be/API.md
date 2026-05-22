# QuPilot Backend API (ringkas untuk FE)

## Konvensi

- Base URL: `{API_URL}` (contoh: `http://localhost:3000`)
- Content-Type: `application/json`
- Semua timestamp: ISO string (`2026-05-22T00:00:00.000Z`)

## Error Response

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

Validation error (Zod):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "issues": [
      { "path": "field", "message": "..." }
    ]
  }
}
```

## Auth

### Provider (JWT)

Header:

```
Authorization: Bearer <provider_jwt>
```

### User (Wallet JWT)

Header:

```
Authorization: Bearer <user_jwt>
```

### Agent (API Key)

Header:

```
x-api-key: qpk_...
```

## Health

### GET /health

Response:

```json
{ "ok": true }
```

## Auth — Provider

### POST /auth/provider/register

Body:

```json
{
  "username": "byreal",
  "password": "secret",
  "display_name": "Byreal",
  "logo_url": "https://..."
}
```

201 Response:

```json
{
  "provider": {
    "uuid": "uuid",
    "username": "byreal",
    "display_name": "Byreal",
    "logo_url": "https://...",
    "created_at": "..."
  }
}
```

### POST /auth/provider/login

Body:

```json
{ "username": "byreal", "password": "secret" }
```

200 Response:

```json
{
  "token": "jwt",
  "provider": {
    "uuid": "uuid",
    "username": "byreal",
    "display_name": "Byreal",
    "logo_url": "https://...",
    "created_at": "..."
  }
}
```

## Auth — User (Wallet)

### POST /auth/user/login

Body:

```json
{
  "wallet_address": "SolanaPubkeyBase58",
  "signature": "Base58Signature",
  "message": "string yang ditandatangani wallet"
}
```

200/201 Response:

```json
{
  "token": "jwt",
  "user": { "uuid": "uuid", "wallet_address": "SolanaPubkeyBase58", "created_at": "..." }
}
```

## Providers (Public)

### GET /providers

200 Response:

```json
{
  "providers": [
    {
      "uuid": "uuid",
      "username": "byreal",
      "display_name": "Byreal",
      "logo_url": "https://...",
      "created_at": "...",
      "spotlight": false
    }
  ]
}
```

## Quests — Provider

Protocol enum: `byreal | bybit | sui`  
Quest type enum: `swap | lp | stake`

### POST /provider/quests

Auth: Provider JWT

Body:

```json
{
  "title": "Swap on Byreal",
  "description": "Lakukan swap ...",
  "protocol": "byreal",
  "quest_type": "swap",
  "action_params": { "any": "json" },
  "reward_amount": 1,
  "reward_token": "Token/Mint",
  "expires_at": "2026-06-01T00:00:00.000Z"
}
```

201 Response:

```json
{ "quest": { "uuid": "uuid", "title": "...", "description": "...", "protocol": "byreal", "quest_type": "swap", "action_params": {}, "reward_amount": 1, "reward_token": "Token/Mint", "expires_at": "...", "created_at": "..." } }
```

### GET /provider/quests

Auth: Provider JWT

200 Response:

```json
{
  "quests": [
    {
      "uuid": "uuid",
      "title": "...",
      "description": "...",
      "protocol": "byreal",
      "quest_type": "swap",
      "action_params": {},
      "reward_amount": 1,
      "reward_token": "Token/Mint",
      "expires_at": "...",
      "created_at": "...",
      "participation_count": 0
    }
  ]
}
```

### GET /provider/quests/:uuid

Auth: Provider JWT

200 Response:

```json
{
  "quest": {
    "uuid": "uuid",
    "title": "...",
    "description": "...",
    "protocol": "byreal",
    "quest_type": "swap",
    "action_params": {},
    "reward_amount": 1,
    "reward_token": "Token/Mint",
    "expires_at": "...",
    "created_at": "..."
  },
  "analytics": { "total": 0, "success": 0, "failed": 0, "success_rate": 0 }
}
```

### PATCH /provider/quests/:uuid

Auth: Provider JWT  
Selalu 403 (immutable).

### PUT /provider/quests/:uuid

Auth: Provider JWT  
Selalu 403 (immutable).

## Quests — Public

### GET /quests

Query:

- `protocol` (optional): `byreal | bybit | sui`
- `type` (optional): `swap | lp | stake`

200 Response:

```json
{
  "quests": [
    {
      "uuid": "uuid",
      "title": "...",
      "description": "...",
      "protocol": "byreal",
      "quest_type": "swap",
      "action_params": {},
      "reward_amount": 1,
      "reward_token": "Token/Mint",
      "expires_at": "...",
      "created_at": "...",
      "participation_count": 0,
      "provider": { "uuid": "uuid", "display_name": "Byreal", "logo_url": "https://..." }
    }
  ]
}
```

### GET /providers/:uuid/quests

Public. Response sama seperti `GET /quests`.

### GET /quests/:uuid

Public.

200 Response:

```json
{
  "quest": {
    "uuid": "uuid",
    "title": "...",
    "description": "...",
    "protocol": "byreal",
    "quest_type": "swap",
    "action_params": {},
    "reward_amount": 1,
    "reward_token": "Token/Mint",
    "expires_at": "...",
    "created_at": "...",
    "participation_count": 0,
    "provider": { "uuid": "uuid", "display_name": "Byreal", "logo_url": "https://..." }
  }
}
```

## Participations — User

### GET /me/participations

Auth: User JWT

200 Response:

```json
{
  "participations": [
    {
      "uuid": "uuid",
      "status": "inprogress",
      "tx_hash": null,
      "reward_claimed": false,
      "started_at": "...",
      "completed_at": null,
      "quest": {
        "uuid": "uuid",
        "title": "...",
        "description": "...",
        "protocol": "byreal",
        "quest_type": "swap",
        "reward_amount": 1,
        "reward_token": "Token/Mint",
        "expires_at": "...",
        "created_at": "...",
        "provider": { "uuid": "uuid", "display_name": "Byreal", "logo_url": "https://..." }
      }
    }
  ]
}
```

### GET /me/participations/:questUuid

Auth: User JWT

200 Response:

```json
{
  "participation": {
    "uuid": "uuid",
    "status": "success",
    "tx_hash": "txhash",
    "reward_claimed": false,
    "started_at": "...",
    "completed_at": "...",
    "can_claim": true,
    "quest": {
      "uuid": "uuid",
      "title": "...",
      "description": "...",
      "protocol": "byreal",
      "quest_type": "swap",
      "reward_amount": 1,
      "reward_token": "Token/Mint",
      "expires_at": "...",
      "created_at": "...",
      "provider": { "uuid": "uuid", "display_name": "Byreal", "logo_url": "https://..." }
    }
  }
}
```

### POST /me/claim

Auth: User JWT  
Claim semua participation yang `status=success` dan `reward_claimed=false`.

200 Response:

```json
{
  "claimed": [{ "quest_uuid": "uuid", "tx_hash": "txhash", "amount": 1, "token": "Token/Mint" }],
  "failed": [{ "quest_uuid": "uuid", "reason": "..." }]
}
```

## API Key — User (untuk Agent)

### POST /me/api-key

Auth: User JWT

Body:

```json
{ "label": "trading-bot" }
```

201 Response (plaintext hanya muncul sekali):

```json
{
  "plaintext": "qpk_....",
  "api_key": { "uuid": "uuid", "key_prefix": "qpk_abcd", "label": "trading-bot", "created_at": "..." }
}
```

### GET /me/api-key

Auth: User JWT

200 Response:

```json
{
  "api_key": {
    "uuid": "uuid",
    "key_prefix": "qpk_abcd",
    "label": "trading-bot",
    "created_at": "...",
    "last_used_at": "..."
  }
}
```

Jika tidak ada key aktif:

```json
{ "api_key": null }
```

### DELETE /me/api-key

Auth: User JWT

200 Response:

```json
{ "revoked": true }
```

## Agent

### POST /agent/participations

Auth: `x-api-key`

Body:

```json
{ "quest_uuid": "quest_uuid" }
```

201 Response:

```json
{ "participation": { "uuid": "uuid", "status": "inprogress", "started_at": "..." } }
```

### POST /agent/participations/:uuid/complete

Auth: `x-api-key`

Body:

```json
{ "tx_hash": "SolanaTxHash" }
```

200 Response:

```json
{ "participation": { "uuid": "uuid", "status": "success", "completed_at": "..." } }
```

## Leaderboard (Public)

### GET /leaderboard

Query:

- `limit` (optional, max 100)

200 Response:

```json
{
  "entries": [
    { "user_uuid": "uuid", "wallet_address": "SolanaPubkeyBase58", "total_reward": 10, "success_rate": 0.8 }
  ]
}
```

## Contoh Curl Singkat

Provider login:

```bash
curl -sS '{API_URL}/auth/provider/login' \
  -H 'content-type: application/json' \
  -d '{"username":"byreal","password":"secret"}'
```

User generate API key:

```bash
curl -sS '{API_URL}/me/api-key' \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer <user_jwt>' \
  -d '{"label":"agent-1"}'
```
