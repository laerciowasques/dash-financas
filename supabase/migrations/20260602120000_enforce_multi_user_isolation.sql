-- Garante isolamento: remove dados sem dono e reforca RLS

delete from public.transactions where user_id is null;
delete from public.categories where user_id is null;

alter table public.categories alter column user_id set not null;
alter table public.transactions alter column user_id set not null;

drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "categories_public_insert" on public.categories;
drop policy if exists "categories_public_update" on public.categories;
drop policy if exists "categories_public_delete" on public.categories;
drop policy if exists "transactions_public_read" on public.transactions;
drop policy if exists "transactions_public_insert" on public.transactions;
drop policy if exists "transactions_public_update" on public.transactions;
drop policy if exists "transactions_public_delete" on public.transactions;

drop policy if exists "categories_select_own" on public.categories;
drop policy if exists "categories_insert_own" on public.categories;
drop policy if exists "categories_update_own" on public.categories;
drop policy if exists "categories_delete_own" on public.categories;
drop policy if exists "transactions_select_own" on public.transactions;
drop policy if exists "transactions_insert_own" on public.transactions;
drop policy if exists "transactions_update_own" on public.transactions;
drop policy if exists "transactions_delete_own" on public.transactions;

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
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.categories c
      where c.id = category_id and c.user_id = auth.uid()
    )
  );

create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);

create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);
