-- Chattogram Driver Bazar initial database schema.
-- Run this in Supabase SQL Editor after creating a project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('driver','owner','admin')),
  full_name text not null default '',
  phone text,
  address text,
  photo_path text,
  bio text,
  verification_status text not null default 'not_submitted'
    check (verification_status in ('not_submitted','pending','under_review','verified','rejected','expired','resubmission_required')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  vehicle_type text,
  location text not null,
  salary numeric,
  description text,
  status text not null default 'open' check (status in ('open','closed','filled','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.substitute_duties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_type text not null,
  location text not null,
  duty_date date not null,
  start_time time,
  end_time time,
  pay numeric,
  details text,
  status text not null default 'open' check (status in ('open','accepted','active','completed','cancelled','expired')),
  created_at timestamptz not null default now()
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_type text not null,
  location text not null,
  destination text,
  start_at timestamptz not null,
  duration text not null,
  pay numeric,
  details text,
  status text not null default 'open' check (status in ('open','accepted','active','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('job','substitute_duty','booking')),
  listing_id uuid not null,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','shortlisted','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  unique(listing_type, listing_id, driver_id)
);

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.substitute_duties enable row level security;
alter table public.booking_requests enable row level security;
alter table public.applications enable row level security;

-- Profiles: authenticated users may read public profile fields; only owners edit their own.
create policy "profiles readable by authenticated users" on public.profiles
for select to authenticated using (true);
create policy "users insert own profile" on public.profiles
for insert to authenticated with check (auth.uid() = id);
create policy "users update own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Public listing visibility; only signed-in owners may create and manage their listings.
create policy "open jobs visible" on public.jobs for select using (status = 'open' or auth.uid() = owner_id);
create policy "owners create jobs" on public.jobs for insert to authenticated with check (auth.uid() = owner_id);
create policy "owners update jobs" on public.jobs for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "open duties visible" on public.substitute_duties for select using (status = 'open' or auth.uid() = owner_id);
create policy "owners create duties" on public.substitute_duties for insert to authenticated with check (auth.uid() = owner_id);
create policy "owners update duties" on public.substitute_duties for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "open bookings visible" on public.booking_requests for select using (status = 'open' or auth.uid() = owner_id);
create policy "owners create bookings" on public.booking_requests for insert to authenticated with check (auth.uid() = owner_id);
create policy "owners update bookings" on public.booking_requests for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "users see own applications" on public.applications for select to authenticated
using (auth.uid() = driver_id or exists (select 1 from public.jobs j where j.id = listing_id and j.owner_id = auth.uid())
or exists (select 1 from public.substitute_duties d where d.id = listing_id and d.owner_id = auth.uid())
or exists (select 1 from public.booking_requests b where b.id = listing_id and b.owner_id = auth.uid()));
create policy "drivers apply as themselves" on public.applications for insert to authenticated
with check (auth.uid() = driver_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'driver'));
create policy "owners update applications" on public.applications for update to authenticated
using (exists (select 1 from public.jobs j where j.id = listing_id and j.owner_id = auth.uid())
or exists (select 1 from public.substitute_duties d where d.id = listing_id and d.owner_id = auth.uid())
or exists (select 1 from public.booking_requests b where b.id = listing_id and b.owner_id = auth.uid()));

-- Automatically create a basic profile on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'role','driver'),
          coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
