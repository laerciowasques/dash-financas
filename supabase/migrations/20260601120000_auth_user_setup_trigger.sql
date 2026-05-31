-- Ao criar usuario no Auth, alimenta tabela senha e categorias automaticamente

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.senha (user_id, email, atualizada_em)
  values (new.id, coalesce(new.email, ''), now())
  on conflict (user_id) do update
    set email = excluded.email,
        atualizada_em = now();

  perform public.seed_default_categories_for_user(new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();
