-- ============================================================
-- BlackBiz Platform — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for full-text search

-- ============================================================
-- USER PROFILES
-- ============================================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text default 'user' check (role in ('user', 'owner', 'admin')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BUSINESSES
-- ============================================================
create table public.businesses (
  id                   uuid default uuid_generate_v4() primary key,
  slug                 text unique not null,
  owner_id             uuid references public.profiles(id) on delete cascade not null,
  name                 text not null,
  tagline              text,
  description          text,
  category             text not null,
  province             text not null,
  city                 text,
  size                 text default 'Small' check (size in ('Micro','Small','Medium','Large')),
  founded_year         integer,
  employee_count       integer,
  annual_revenue_band  text,
  website              text,
  email                text,
  phone                text,
  address              text,
  logo_url             text,
  cover_url            text,
  cipc_number          text,
  tax_number           text,
  bbee_level           integer check (bbee_level between 1 and 8),
  verification_status  text default 'unverified' check (verification_status in ('unverified','pending','verified')),
  subscription_tier    text default 'free' check (subscription_tier in ('free','verified','pro','enterprise')),
  profile_completeness integer default 0 check (profile_completeness between 0 and 100),
  rating_average       decimal(3,2) default 0,
  rating_count         integer default 0,
  view_count           integer default 0,
  is_featured          boolean default false,
  is_active            boolean default true,
  services             text[] default '{}',
  products             text[] default '{}',
  certifications       text[] default '{}',
  social_links         jsonb default '{}',
  search_vector        tsvector,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- Full-text search index
create index businesses_search_idx on public.businesses using gin(search_vector);
create index businesses_category_idx on public.businesses(category);
create index businesses_province_idx on public.businesses(province);
create index businesses_active_idx on public.businesses(is_active);
create index businesses_name_trgm_idx on public.businesses using gin(name gin_trgm_ops);

-- Auto-update search_vector
create or replace function public.update_business_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(new.category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.city, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.services, ' '), '')), 'B');
  return new;
end;
$$;

create trigger business_search_vector_update
  before insert or update on public.businesses
  for each row execute procedure public.update_business_search_vector();

-- Auto-update profile completeness
create or replace function public.calculate_completeness(b public.businesses)
returns integer language plpgsql as $$
declare score integer := 0;
begin
  if b.name is not null and b.name != '' then score := score + 10; end if;
  if b.tagline is not null then score := score + 5; end if;
  if b.description is not null and length(b.description) > 50 then score := score + 15; end if;
  if b.logo_url is not null then score := score + 10; end if;
  if b.cover_url is not null then score := score + 5; end if;
  if b.website is not null then score := score + 5; end if;
  if b.email is not null then score := score + 5; end if;
  if b.phone is not null then score := score + 5; end if;
  if b.address is not null then score := score + 5; end if;
  if b.cipc_number is not null then score := score + 10; end if;
  if b.bbee_level is not null then score := score + 10; end if;
  if array_length(b.services, 1) > 0 then score := score + 10; end if;
  if b.founded_year is not null then score := score + 5; end if;
  return least(score, 100);
end;
$$;

-- ============================================================
-- REVIEWS
-- ============================================================
create table public.reviews (
  id                       uuid default uuid_generate_v4() primary key,
  business_id              uuid references public.businesses(id) on delete cascade not null,
  reviewer_id              uuid references public.profiles(id) on delete cascade not null,
  rating                   integer not null check (rating between 1 and 5),
  title                    text,
  body                     text,
  is_verified_transaction  boolean default false,
  created_at               timestamptz default now(),
  unique(business_id, reviewer_id)
);

-- Auto-update business rating on review insert/update/delete
create or replace function public.update_business_rating()
returns trigger language plpgsql as $$
declare bid uuid;
begin
  bid := coalesce(new.business_id, old.business_id);
  update public.businesses set
    rating_average = (select coalesce(avg(rating), 0) from public.reviews where business_id = bid),
    rating_count   = (select count(*) from public.reviews where business_id = bid)
  where id = bid;
  return coalesce(new, old);
end;
$$;

create trigger reviews_update_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_business_rating();

-- ============================================================
-- BUSINESS DOCUMENTS
-- ============================================================
create table public.business_documents (
  id           uuid default uuid_generate_v4() primary key,
  business_id  uuid references public.businesses(id) on delete cascade not null,
  type         text not null check (type in ('cipc','tax','bbee','other')),
  name         text not null,
  url          text not null,
  verified     boolean default false,
  created_at   timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (Fort Knox)
-- ============================================================
alter table public.profiles           enable row level security;
alter table public.businesses         enable row level security;
alter table public.reviews            enable row level security;
alter table public.business_documents enable row level security;

-- Profiles: users see their own, admins see all
create policy "Users can view own profile"    on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid() = id);

-- Businesses: public read, owner write
create policy "Anyone can view active businesses"
  on public.businesses for select using (is_active = true);

create policy "Owners can insert own businesses"
  on public.businesses for insert with check (auth.uid() = owner_id);

create policy "Owners can update own businesses"
  on public.businesses for update using (auth.uid() = owner_id);

create policy "Owners can delete own businesses"
  on public.businesses for delete using (auth.uid() = owner_id);

-- Reviews: public read, authenticated write
create policy "Anyone can view reviews"
  on public.reviews for select using (true);

create policy "Auth users can create reviews"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

create policy "Reviewers can update own reviews"
  on public.reviews for update using (auth.uid() = reviewer_id);

-- Documents: owner only
create policy "Owners can manage own documents"
  on public.business_documents for all using (
    auth.uid() = (select owner_id from public.businesses where id = business_id)
  );

-- ============================================================
-- SEED DATA (sample businesses for dev)
-- ============================================================
-- Note: insert a user first via auth, then use their UUID below
-- insert into public.businesses (slug, owner_id, name, ...) values (...)
