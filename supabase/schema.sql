create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('event', 'place')),
  title text not null,
  description text not null,
  category text not null,
  city_slug text not null default 'baku',
  lat double precision not null,
  lng double precision not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  event_date date null,
  start_time text null,
  place_type text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint pins_event_requirements check (
    (type <> 'event')
    or event_date is not null
  )
);

create index if not exists pins_created_at_idx on public.pins (created_at desc);
create index if not exists pins_status_idx on public.pins (status);
create index if not exists pins_city_slug_idx on public.pins (city_slug);
create index if not exists pins_lat_lng_idx on public.pins (lat, lng);

alter table public.profiles enable row level security;
alter table public.pins enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "pins_public_read" on public.pins;
create policy "pins_public_read"
on public.pins
for select
to anon, authenticated
using (status = 'active' or auth.uid() = created_by);

drop policy if exists "pins_authenticated_insert" on public.pins;
create policy "pins_authenticated_insert"
on public.pins
for insert
to authenticated
with check (
  auth.uid() = created_by
  and status in ('active', 'archived')
);

drop policy if exists "pins_owner_update" on public.pins;
create policy "pins_owner_update"
on public.pins
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

alter publication supabase_realtime add table public.pins;
