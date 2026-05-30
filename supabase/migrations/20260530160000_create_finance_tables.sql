-- Tipos e tabelas do dashboard financeiro
create type public.transaction_type as enum ('income', 'expense');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null,
  icon text not null,
  type public.transaction_type not null,
  created_at timestamptz not null default now(),
  constraint categories_name_type_unique unique (name, type)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  value numeric(12, 2) not null check (value >= 0),
  date date not null,
  type public.transaction_type not null,
  created_at timestamptz not null default now()
);

create index transactions_date_idx on public.transactions (date desc);
create index transactions_type_idx on public.transactions (type);
create index categories_type_idx on public.categories (type);

alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "categories_public_read" on public.categories
  for select using (true);

create policy "categories_public_insert" on public.categories
  for insert with check (true);

create policy "categories_public_update" on public.categories
  for update using (true);

create policy "categories_public_delete" on public.categories
  for delete using (true);

create policy "transactions_public_read" on public.transactions
  for select using (true);

create policy "transactions_public_insert" on public.transactions
  for insert with check (true);

create policy "transactions_public_update" on public.transactions
  for update using (true);

create policy "transactions_public_delete" on public.transactions
  for delete using (true);
