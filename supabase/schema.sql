-- ═══════════════════════════════════════════════════════════════
-- Nationwide Haul — Supabase schema  (project: "NH Marketing Dashboard")
-- Run this once in your Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run (everything is IF NOT EXISTS / idempotent).
--
-- These tables are DEDICATED to nationwidehaul.com and prefixed with
-- "nh_" so they never collide with leads from the other website that
-- also lives in this project.
-- ═══════════════════════════════════════════════════════════════

-- ── Website lead forms (contact, lease, municipality, sell, dot) ──
create table if not exists public.nh_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  site          text not null default 'nationwidehaul.com',
  form_type     text not null,          -- contact | financing | lease | municipality | sell | dot
  first_name    text,
  last_name     text,
  full_name     text,
  email         text,
  phone         text,
  organization  text,
  subject       text,
  message       text,
  page_url      text,                   -- which page the form was submitted from
  recipient     text,                   -- team inbox this lead was routed to
  payload       jsonb,                  -- full raw submission (every field, future-proof)
  status        text not null default 'new'  -- new | contacted | won | lost (for your workflow)
);

create index if not exists nh_leads_created_at_idx on public.nh_leads (created_at desc);
create index if not exists nh_leads_form_type_idx  on public.nh_leads (form_type);
create index if not exists nh_leads_email_idx       on public.nh_leads (email);

-- ── Confirmed newsletter subscribers (double opt-in) ─────────────
create table if not exists public.nh_newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  site          text not null default 'nationwidehaul.com',
  email         text not null unique,
  source        text,
  confirmed_at  timestamptz,
  ip            text
);

create index if not exists nh_newsletter_created_at_idx on public.nh_newsletter_subscribers (created_at desc);

-- ── Security: lock the tables down ───────────────────────────────
-- Row Level Security ON with NO policies = the anon/public API key
-- can neither read nor write. Only the server-side service-role key
-- (used by our Vercel functions, and which bypasses RLS) can touch
-- these tables. This is exactly what we want for a lead database.
alter table public.nh_leads                  enable row level security;
alter table public.nh_newsletter_subscribers enable row level security;
