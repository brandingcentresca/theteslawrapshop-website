-- The Tesla Wrap Shop — initial schema
-- Tables: quote_submissions, blog_posts, gallery_items
-- Public site reads blog_posts (published) and gallery_items via the anon key.
-- All writes happen server-side with the service-role key (bypasses RLS).

create extension if not exists "pgcrypto";

-- ---------- Quote submissions ----------------------------------------------
create table if not exists public.quote_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text not null,
  model       text not null,
  message     text default '',
  photo_urls  text[] not null default '{}',
  status      text not null default 'new'
);

alter table public.quote_submissions enable row level security;
-- No anon policies: submissions are private. Inserts/reads use service role.

-- ---------- Blog posts ------------------------------------------------------
create table if not exists public.blog_posts (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  excerpt        text default '',
  content        text default '',
  featured_image text,
  author         text not null default 'The Tesla Wrap Shop',
  category       text not null default 'Vehicle Wrap',
  published      boolean not null default true,
  published_at   date not null default current_date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true);

-- ---------- Gallery ---------------------------------------------------------
create table if not exists public.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  model       text not null,
  image_url   text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists "public read gallery" on public.gallery_items;
create policy "public read gallery"
  on public.gallery_items for select
  to anon, authenticated
  using (true);

-- keep updated_at fresh on blog_posts
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();
