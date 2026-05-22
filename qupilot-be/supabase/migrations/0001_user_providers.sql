-- Migration 0001 — user_providers
-- Quest provider accounts (Byreal, Bybit, Sui, etc).

create extension if not exists pgcrypto;

create table if not exists public.user_providers (
  id            bigint generated always as identity primary key,
  uuid          uuid not null unique default gen_random_uuid(),
  username      text not null unique,
  password_hash text not null,
  display_name  text not null,
  logo_url      text,
  created_at    timestamptz not null default now()
);

create index if not exists user_providers_uuid_idx on public.user_providers (uuid);