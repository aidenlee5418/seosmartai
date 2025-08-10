
create or replace function decrement_credits(uid uuid, delta int)
returns int
language plpgsql
security definer
as $$
declare remaining int;
begin
  update users_public set credits = greatest(0, credits - delta) where id = uid returning credits into remaining;
  return remaining;
end;
$$;
