-- Run this in your Supabase SQL Editor

-- Create search_cache table
create table if not exists public.search_cache (
  id uuid default gen_random_uuid() primary key,
  query text not null,
  search_type text not null, -- 'web', 'image', 'news'
  page integer not null default 1,
  options jsonb,
  results jsonb not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(query, search_type, page)
);

-- Note: The unique constraint above is critical for the .upsert() logic to work.

-- Index for fast lookup by query profile
create index if not exists search_cache_lookup_idx 
on public.search_cache (query, search_type, page);

-- Set up Row Level Security (RLS)
alter table public.search_cache enable row level security;

-- Allow public read access (cached results can be shared)
create policy "Public search results are viewable by everyone."
  on public.search_cache for select
  using ( true );

-- Allow public insertion (client-side caching)
create policy "Allow public to add to search cache."
  on public.search_cache for insert
  with check ( true );

-- Optional: Cleanup policy or periodic job would be better, 
-- but we'll handle stale checks in the frontend logic.
