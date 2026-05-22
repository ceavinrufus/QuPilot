-- Migration 0002 — users
-- Wallet-authenticated viewers. No password — auth via wallet signature.

create table if not exists public.users (
  id             bigint generated always as identity primary key,
  uuid           uuid not null unique default gen_random_uuid(),
  wallet_address text not null unique,
  created_at     timestamptz not null default now()
);

create index if not exists users_uuid_idx on public.users (uuid);