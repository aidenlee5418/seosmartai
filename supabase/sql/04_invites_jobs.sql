
create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('owner','admin','member')),
  status text not null default 'pending' check (status in ('pending','accepted','expired','cancelled')),
  created_at timestamp with time zone default now()
);

alter table invites enable row level security;
create policy "invites visible to team admins" on invites for select using (
  exists (select 1 from team_members tm where tm.team_id = invites.team_id and tm.user_id = auth.uid() and tm.role in ('owner','admin'))
);
create policy "invites admins insert" on invites for insert with check (
  exists (select 1 from team_members tm where tm.team_id = invites.team_id and tm.user_id = auth.uid() and tm.role in ('owner','admin'))
);

-- Jobs status update function
create or replace function set_job_status(jid uuid, st text)
returns void language sql as $$
  update jobs set status = st where id = jid;
$$;
