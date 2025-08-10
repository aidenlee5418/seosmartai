
-- Basic tables
create table if not exists users_public (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  credits int not null default 20,
  plan text default 'free',
  created_at timestamp with time zone default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain text not null,
  created_at timestamp with time zone default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('technical','content','eeat','competitor')),
  url text not null,
  status text not null default 'queued',
  created_at timestamp with time zone default now()
);

create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  summary text,
  payload jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  properties jsonb,
  created_at timestamp with time zone default now()
);

-- RLS
alter table users_public enable row level security;
alter table projects enable row level security;
alter table jobs enable row level security;
alter table results enable row level security;
alter table events enable row level security;

create policy "users select own" on users_public for select using (auth.uid() = id);
create policy "users update own" on users_public for update using (auth.uid() = id);

create policy "projects own" on projects for all using (auth.uid() = user_id);
create policy "jobs own" on jobs for all using (auth.uid() = user_id);
create policy "results own" on results for all using (auth.uid() = user_id);
create policy "events own" on events for all using (auth.uid() = user_id);
