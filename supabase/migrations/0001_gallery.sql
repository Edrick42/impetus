-- =============================================================
-- Galeria — schema inicial
-- =============================================================
-- Aplicar via Supabase Studio (SQL Editor) ou Supabase CLI:
--   supabase db push
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- events
-- -------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  event_date date,
  cover_photo_id uuid,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_slug_idx on public.events (slug);
create index if not exists events_published_idx on public.events (published, event_date desc);

-- -------------------------------------------------------------
-- event_photographers (atribuição N:N)
-- -------------------------------------------------------------
create table if not exists public.event_photographers (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index if not exists event_photographers_user_idx on public.event_photographers (user_id);

-- -------------------------------------------------------------
-- photos
-- -------------------------------------------------------------
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  r2_key_thumb text not null,
  r2_key_medium text not null,
  r2_key_original text not null,
  width int,
  height int,
  caption text,
  uploaded_at timestamptz not null default now()
);

create index if not exists photos_event_idx on public.photos (event_id, uploaded_at desc);

-- FK circular: cover_photo_id → photos (definida agora que photos existe)
alter table public.events
  drop constraint if exists events_cover_photo_fk;
alter table public.events
  add constraint events_cover_photo_fk
  foreign key (cover_photo_id) references public.photos(id) on delete set null;

-- -------------------------------------------------------------
-- Helpers de role
-- -------------------------------------------------------------
-- Role no app_metadata do auth.users:
--   { "role": "admin" }  | { "role": "photographer" }
create or replace function public.has_role(role_name text)
returns boolean
language sql stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = role_name,
    false
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select public.has_role('admin');
$$;

create or replace function public.is_photographer()
returns boolean
language sql stable
as $$
  select public.has_role('photographer') or public.is_admin();
$$;

-- -------------------------------------------------------------
-- Row-Level Security
-- -------------------------------------------------------------
alter table public.events enable row level security;
alter table public.event_photographers enable row level security;
alter table public.photos enable row level security;

-- events
drop policy if exists "events: public read of published" on public.events;
create policy "events: public read of published"
  on public.events for select
  using (published = true or public.is_admin() or public.is_photographer());

drop policy if exists "events: admin all" on public.events;
create policy "events: admin all"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

-- event_photographers
drop policy if exists "event_photographers: photographer read own" on public.event_photographers;
create policy "event_photographers: photographer read own"
  on public.event_photographers for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "event_photographers: admin all" on public.event_photographers;
create policy "event_photographers: admin all"
  on public.event_photographers for all
  using (public.is_admin())
  with check (public.is_admin());

-- photos
drop policy if exists "photos: public read of published event" on public.photos;
create policy "photos: public read of published event"
  on public.photos for select
  using (
    exists (
      select 1 from public.events e
      where e.id = photos.event_id and e.published = true
    )
    or public.is_admin()
    or exists (
      select 1 from public.event_photographers ep
      where ep.event_id = photos.event_id and ep.user_id = auth.uid()
    )
  );

drop policy if exists "photos: photographer insert in own event" on public.photos;
create policy "photos: photographer insert in own event"
  on public.photos for insert
  with check (
    public.is_admin()
    or (
      uploaded_by = auth.uid()
      and exists (
        select 1 from public.event_photographers ep
        where ep.event_id = photos.event_id and ep.user_id = auth.uid()
      )
    )
  );

drop policy if exists "photos: owner delete own" on public.photos;
create policy "photos: owner delete own"
  on public.photos for delete
  using (uploaded_by = auth.uid() or public.is_admin());

drop policy if exists "photos: admin update" on public.photos;
create policy "photos: admin update"
  on public.photos for update
  using (public.is_admin())
  with check (public.is_admin());

-- -------------------------------------------------------------
-- Trigger: updated_at
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();
