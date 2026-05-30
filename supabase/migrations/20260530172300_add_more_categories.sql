-- Categorias adicionais para receitas e despesas
insert into public.categories (name, color, icon, type) values
  ('Freelance', '#22d3ee', '💻', 'income'),
  ('Investimentos', '#a855f7', '📈', 'income'),
  ('Entretenimento', '#a855f7', '🎮', 'expense'),
  ('Contas', '#ef4444', '📄', 'expense'),
  ('Saúde', '#34d399', '💊', 'expense')
on conflict (name, type) do nothing;
