-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  bio text,
  avatar_url text,
  avatar_color text default 'blue',
  role text default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Allow public read access (optional, but good for search engine feel)
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

-- Allow users to insert their own profile
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Allow users to update their own profile
create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 3. Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_color)
  values (new.id, new.email, 'blue');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
