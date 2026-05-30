-- Seed: 3 categorias, 3 receitas e 3 despesas
insert into public.categories (id, name, color, icon, type) values
  ('11111111-1111-1111-1111-111111111101', 'Salário', '#34d399', '💰', 'income'),
  ('11111111-1111-1111-1111-111111111102', 'Alimentação', '#f472b6', '🍔', 'expense'),
  ('11111111-1111-1111-1111-111111111103', 'Transporte', '#fbbf24', '🚗', 'expense')
on conflict (name, type) do nothing;

insert into public.transactions (description, category_id, value, date, type) values
  ('Salário Mensal', '11111111-1111-1111-1111-111111111101', 5500.00, '2025-05-01', 'income'),
  ('Freelance Website', '11111111-1111-1111-1111-111111111101', 1200.00, '2025-05-10', 'income'),
  ('Bônus de Desempenho', '11111111-1111-1111-1111-111111111101', 800.00, '2025-05-15', 'income'),
  ('Supermercado', '11111111-1111-1111-1111-111111111102', 450.00, '2025-05-08', 'expense'),
  ('Restaurante', '11111111-1111-1111-1111-111111111102', 120.00, '2025-05-12', 'expense'),
  ('Uber', '11111111-1111-1111-1111-111111111103', 85.00, '2025-05-09', 'expense');
