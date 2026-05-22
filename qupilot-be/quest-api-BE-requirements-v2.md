# Quest API — Backend Design & Requirements

## Overview

Platform web3 quest yang menghubungkan tiga jenis aktor: **User Provider** (pembuat quest), **User** (viewer via dashboard — tidak mengeksekusi quest), dan **AI Agent** (satu-satunya yang menjalankan quest secara on-chain). Backend dibangun dengan Express + TypeScript, database Supabase PostgreSQL yang hanya bisa diakses melalui Express menggunakan service role key — tidak ada akses publik via PostgREST.

---

## Tech Stack

| Layer | Pilihan |
|---|---|
| Framework | Express v5 + TypeScript |
| Database | Supabase PostgreSQL |
| DB Access | Supabase JS SDK dengan `service_role` key |
| Auth — User Provider | JWT (username + password), role: `user_provider` |
| Auth — User | JWT (wallet signature), role: `user` |
| Auth — AI Agent | Static API key via header `x-api-key` |
| Validation | Zod (request body & query params) |
| Deploy | Railway / Fly.io / VPS |

---

## Database Schema

### Konvensi ID di Semua Tabel

Setiap tabel memiliki dua jenis identifier:

| Column | Type | Fungsi |
|---|---|---|
| `id` | bigint, auto increment PK | Digunakan sebagai foreign key antar tabel — tidak pernah diekspos ke UI |
| `uuid` | uuid, default uuidv4 | Digunakan sebagai identifier publik yang dimunculkan ke UI dan API response |

---

### Tabel: `user_providers`

Menyimpan akun quest provider (entitas seperti Byreal, Bybit, Sui).

| Column | Type | Keterangan |
|---|---|---|
| id | bigint PK auto increment | Internal FK |
| uuid | uuid UNIQUE default uuidv4 | ID publik untuk UI |
| username | text UNIQUE | Untuk login |
| password_hash | text | bcrypt hash |
| display_name | text | Nama tampil di dashboard |
| logo_url | text | URL logo provider |
| created_at | timestamptz | |

---

### Tabel: `users`

Menyimpan akun user berdasarkan wallet address. Tidak ada password — autentikasi via signature. User hanya bisa melihat data di dashboard, tidak bisa mengeksekusi quest.

| Column | Type | Keterangan |
|---|---|---|
| id | bigint PK auto increment | Internal FK |
| uuid | uuid UNIQUE default uuidv4 | ID publik untuk UI |
| wallet_address | text UNIQUE | Solana wallet address (public key) |
| created_at | timestamptz | |

---

### Tabel: `quests`

Menyimpan quest yang dibuat oleh user provider. Quest langsung aktif dan publik setelah dibuat — tidak ada status draft, tidak ada fitur publish, dan tidak bisa diedit.

| Column | Type | Keterangan |
|---|---|---|
| id | bigint PK auto increment | Internal FK |
| uuid | uuid UNIQUE default uuidv4 | ID publik untuk UI dan AI agent |
| provider_id | bigint FK | → user_providers.id |
| title | text | Judul quest |
| description | text | Deskripsi detail quest |
| protocol | text | Enum: `byreal`, `bybit`, `sui` |
| quest_type | text | Enum: `swap`, `lp`, `stake` |
| action_params | jsonb | Parameter siap pakai untuk eksekusi on-chain oleh AI agent |
| reward_amount | numeric | Besar reward jika quest berhasil |
| reward_token | text | Token reward (mint address atau simbol) |
| expires_at | timestamptz | Quest tidak muncul di listing publik setelah tanggal ini |
| created_at | timestamptz | |

**Catatan `action_params`:** Field ini berisi parameter spesifik per `quest_type` yang langsung bisa dikonsumsi AI agent tanpa perlu parsing tambahan. Contoh untuk tipe `swap`: input token, output token, minimum amount.

**Tidak ada kolom `status`:** Quest selalu publik sejak dibuat. Visibilitas di listing publik dikontrol murni oleh `expires_at`.

---

### Tabel: `quest_participations`

Menyimpan record eksekusi quest oleh AI agent atas nama user tertentu.

| Column | Type | Keterangan |
|---|---|---|
| id | bigint PK auto increment | Internal FK |
| uuid | uuid UNIQUE default uuidv4 | ID publik |
| user_id | bigint FK | → users.id |
| quest_id | bigint FK | → quests.id |
| status | text | Enum: `inprogress` → `success` / `failed` |
| tx_hash | text | Hash transaksi on-chain yang disubmit AI agent |
| reward_claimed | bool | Default false, true setelah claim berhasil |
| started_at | timestamptz | Waktu AI agent mulai mengeksekusi quest |
| completed_at | timestamptz | Waktu status berubah ke success/failed |

---

## JWT Payload

Semua JWT mengandung field `role` untuk membedakan aktor di middleware.

**User Provider:**
| Field | Value |
|---|---|
| `sub` | uuid provider |
| `role` | `user_provider` |
| `username` | username provider |
| `exp` | 7 hari |

**User:**
| Field | Value |
|---|---|
| `sub` | uuid user |
| `role` | `user` |
| `wallet_address` | Solana wallet address |
| `exp` | 7 hari |

Middleware auth membaca field `role` untuk menentukan hak akses endpoint — satu middleware dapat mendukung multiple role jika diperlukan.

---

## Fitur & Requirements per Aktor

---

### 1. Auth — User Provider

**Register**
- Input: `username`, `password`, `display_name`
- Password di-hash dengan bcrypt sebelum disimpan
- Username harus unik — return error 409 jika sudah ada
- Return: data provider yang baru dibuat (uuid, username, display_name) — tanpa password hash

**Login**
- Input: `username`, `password`
- Verifikasi password dengan bcrypt
- Return: JWT dengan payload role `user_provider`
- JWT expire: 7 hari

---

### 2. Auth — User (Wallet)

**Login / Register**
- Input: `wallet_address`, `signature`, `message`
- Flow: user sign sebuah pesan arbitrary di frontend menggunakan wallet mereka, BE memverifikasi bahwa signature tersebut valid untuk wallet address yang diberikan menggunakan `tweetnacl`
- Jika wallet address belum ada di tabel `users`, otomatis buat akun baru (upsert)
- Return: JWT dengan payload role `user`
- JWT expire: 7 hari

---

### 3. Fitur User Provider

Semua endpoint memerlukan JWT dengan role `user_provider`.

**Create Quest**
- Quest langsung aktif dan publik setelah dibuat — tidak ada tahap draft atau publish
- Quest tidak bisa diedit dalam kondisi apapun setelah dibuat — enforce di level backend, return 403 jika ada request PUT/PATCH
- Input wajib: `title`, `description`, `protocol`, `quest_type`, `action_params`, `reward_amount`, `reward_token`, `expires_at`
- Validasi: `expires_at` harus di masa depan
- Response mengembalikan `uuid` quest sebagai identifier publik

**Lihat Daftar Quest Milik Provider**
- Menampilkan semua quest yang dibuat oleh provider tersebut
- Setiap quest menampilkan jumlah AI agent yang sudah mengeksekusi quest (`quest_participations count`)

**Lihat Detail Quest**
- Menampilkan detail lengkap satu quest berdasarkan `uuid`
- Termasuk analytics: jumlah eksekusi, jumlah success, jumlah failed, success rate

---

### 4. Fitur User

Semua endpoint memerlukan JWT dengan role `user`. User hanya bisa **melihat data** — tidak bisa join atau execute quest. Seluruh eksekusi dilakukan oleh AI Agent.

**Lihat Achievement & Daftar Quest**
- Menampilkan semua quest yang pernah dieksekusi AI agent atas nama user ini, beserta statusnya (`inprogress`, `success`, `failed`)
- Dibagi dua section: achievement (quest yang berhasil) dan quest list (semua)

**Lihat Detail Quest yang Diikuti**
- Menampilkan detail quest + status partisipasi user saat ini
- Menampilkan apakah reward sudah bisa di-claim (`status = success` dan `reward_claimed = false`)

**Claim Reward**
- Endpoint bulk: claim semua reward dari quest yang sudah `success` dan belum di-claim
- Trigger transaksi on-chain untuk mengirim reward ke wallet user
- Setelah berhasil, update `reward_claimed = true` pada semua participation yang di-claim

---

### 5. Fitur Publik

Tidak memerlukan autentikasi apapun.

**Daftar User Provider**
- Menampilkan semua user provider yang terdaftar
- Termasuk field "spotlight" untuk menandai provider yang difeatured di landing page

**Daftar Quest per Provider**
- Menampilkan quest yang belum expired dari satu provider tertentu
- Menampilkan jumlah AI agent yang sudah mengeksekusi quest per quest

**Daftar Quest (Agregat)**
- Menampilkan semua quest yang belum expired dari semua provider
- Filter yang tersedia: `protocol` (byreal/bybit/sui), `type` (swap/lp/stake)
- Setiap quest menampilkan nama dan logo provider asalnya

**Detail Quest**
- Menampilkan detail lengkap satu quest berdasarkan `uuid` termasuk `action_params`
- Field `action_params` digunakan AI agent untuk mengeksekusi quest secara otomatis

**Leaderboard**
- Menampilkan ranking user berdasarkan dua metrik:
  - `total_reward`: jumlah akumulasi reward dari semua quest yang berhasil diklaim
  - `success_rate`: persentase quest yang berhasil dari total yang dieksekusi
- Urutan: `total_reward DESC`, lalu `success_rate DESC` sebagai tiebreaker
- Limit default: 100 entri teratas
- Tidak menggunakan materialized view — query langsung ke tabel

---

### 6. Fitur AI Agent

AI agent mengakses API menggunakan static API key via header `x-api-key`. Agent adalah satu-satunya aktor yang bisa join dan complete quest.

**Discovery Quest**
- Menggunakan endpoint publik `GET /quests` dengan filter `protocol` dan `type`
- Membaca `action_params` dari `GET /quests/:uuid` untuk mendapatkan parameter eksekusi

**Join Quest**
- Membuat record baru di `quest_participations` dengan status `inprogress`
- Input: `quest_uuid`, `user_uuid` (wallet user yang akan mendapat credit)
- Validasi: belum ada record `inprogress` untuk kombinasi user + quest yang sama
- Validasi: quest belum expired

**Complete Quest**
- Mengirimkan `tx_hash` dari transaksi on-chain yang sudah dieksekusi
- Backend **wajib memverifikasi `tx_hash` ke Solana RPC** sebelum mengubah status — tidak bisa langsung percaya input dari agent
- Jika transaksi valid dan sesuai dengan `action_params` quest: update status ke `success`
- Jika transaksi tidak valid: update status ke `failed`
- Set `completed_at` ke waktu sekarang

---

## Business Rules Lintas Fitur

| Rule | Detail |
|---|---|
| Quest immutable | Quest tidak bisa diedit setelah dibuat — tidak ada status draft, tidak ada publish step, return 403 untuk semua request edit |
| Tidak ada status quest | Visibilitas quest dikontrol murni oleh `expires_at` — quest expired tidak muncul di listing publik |
| Eksekusi hanya oleh AI Agent | Hanya AI Agent yang bisa join dan complete quest — endpoint ini tidak bisa diakses dengan JWT user maupun user_provider |
| User hanya view | User dengan role `user` hanya bisa membaca data partisipasi mereka dan claim reward |
| Verifikasi tx wajib | Status tidak boleh diubah ke `success` tanpa verifikasi `tx_hash` ke Solana RPC |
| Upsert wallet login | Wallet baru otomatis didaftarkan saat pertama kali login |
| Partisipasi unik | AI Agent tidak bisa membuat dua record `inprogress` untuk kombinasi user + quest yang sama |
| UUID untuk publik | Semua identifier yang diekspos ke UI dan API response menggunakan `uuid` — bigint `id` tidak pernah diekspos |
| Foreign key pakai bigint | Semua relasi antar tabel menggunakan kolom `id` bigint, bukan `uuid` |
| Reward hanya untuk success | Endpoint claim hanya memproses participation dengan status `success` |
| DB access tertutup | Semua akses ke database wajib melalui Express — tidak ada endpoint Supabase publik yang dibuka |