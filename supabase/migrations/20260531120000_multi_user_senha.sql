-- Multi-usuario: tabela senha, user_id nas tabelas financeiras e RLS por ambiente

create table public.senha (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  cadastrada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now(),
  constraint senha_user_id_unique unique (user_id)
);

create index senha_user_id_idx on public.senha (user_id);

comment on table public.senha is
  'Registro de cadastro de credencial por usuario. A senha real fica apenas no Supabase Auth.';

alter table public.senha enable row level security;

create policy "senha_select_own" on public.senha
  for select using (auth.uid() = user_id);

create policy "senha_insert_own" on public.senha
  for insert with check (auth.uid() = user_id);

create policy "senha_update_own" on public.senha
  for update using (auth.uid() = user_id);

alter table public.categories add column if not exists user_id uuid references auth.users (id) on delete cascade;
alter table public.transactions add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists categories_user_id_idx on public.categories (user_id);
create index if not exists transactions_user_id_idx on public.transactions (user_id);

alter table public.categories drop constraint if exists categories_name_type_unique;
alter table public.categories add constraint categories_name_type_user_unique unique (name, type, user_id);

drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "categories_public_insert" on public.categories;
drop policy if exists "categories_public_update" on public.categories;
drop policy if exists "categories_public_delete" on public.categories;
drop policy if exists "transactions_public_read" on public.transactions;
drop policy if exists "transactions_public_insert" on public.transactions;
drop policy if exists "transactions_public_update" on public.transactions;
drop policy if exists "transactions_public_delete" on public.transactions;

create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);

create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);

create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id);

create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);

create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);

create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

create or replace function public.seed_default_categories_for_user(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.categories where user_id = p_user_id limit 1) then
    return;
  end if;

  insert into public.categories (name, color, icon, type, user_id) values
    ('Salário', '#34d399', '💰', 'income', p_user_id),
    ('Freelance', '#22d3ee', '💻', 'income', p_user_id),
    ('Investimentos', '#a855f7', '📈', 'income', p_user_id),
    ('Alimentação', '#f472b6', '🍔', 'expense', p_user_id),
    ('Transporte', '#fbbf24', '🚗', 'expense', p_user_id),
    ('Entretenimento', '#a855f7', '🎮', 'expense', p_user_id),
    ('Contas', '#ef4444', '📄', 'expense', p_user_id),
    ('Saúde', '#34d399', '💊', 'expense', p_user_id);
end;
$$;

revoke all on function public.seed_default_categories_for_user(uuid) from public;
grant execute on function public.seed_default_categories_for_user(uuid) to authenticated;
