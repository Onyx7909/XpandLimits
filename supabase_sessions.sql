create extension if not exists pgcrypto;

create table if not exists public.sessions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  groups text[] not null default '{}',
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

drop policy if exists "Users can manage their own sessions" on public.sessions;
create policy "Users can manage their own sessions"
on public.sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
