-- Run this in your Supabase SQL Editor

-- Create mock_results table
create table if not exists public.mock_results (
  id uuid default gen_random_uuid() primary key,
  query_match text not null, -- The search term it matches (e.g., 'google')
  title text not null,
  link text not null,
  snippet text,
  display_link text,
  search_type text default 'web', -- 'web', 'image', 'news'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.mock_results enable row level security;

-- Public read access
create policy "Mock results are viewable by everyone."
  on public.mock_results for select
  using ( true );

-- Seed some professional sample data
insert into public.mock_results (query_match, title, link, snippet, display_link, search_type)
values 
('google', 'Google - Official Website', 'https://www.google.com', 'The official homepage of Google.', 'google.com', 'web'),
('google', 'Working at Google: Career Opportunities', 'https://www.google.com/about/careers', 'Explore careers at Google and build the future of tech.', 'google.com', 'web'),
('supabase', 'Supabase - The Open Source Firebase Alternative', 'https://supabase.com', 'Supabase is an open source Firebase alternative. Build production-grade backends with a Postgres database.', 'supabase.com', 'web'),
('backend', 'What is a Backend Server?', 'https://example.com/backend-guide', 'Learn why every professional search engine needs a dedicated backend to protect API keys.', 'example.com', 'web'),
('ai', 'DeepMind - Research in AI', 'https://deepmind.google', 'DeepMind is a research laboratory that builds artificial intelligence systems.', 'deepmind.google', 'web'),
('wikipedia', 'Wikipedia - The Free Encyclopedia', 'https://www.wikipedia.org', 'Wikipedia is a multilingual open-collaborative online encyclopedia.', 'wikipedia.org', 'web'),
('odde-search', 'Odde Search - Next Generation AI Search', 'https://odde-search.vercel.app', 'A professional, dedicated search engine powered by AI and a custom Node.js backend.', 'odde-search.vercel.app', 'web'),
('odde-search', 'Odde Search Documentation', 'https://github.com/thenameisadityyaa/odde-search', 'Open source documentation and source code for the Odde Search project.', 'github.com', 'web');
