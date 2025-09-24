-- Inserir dados iniciais

-- Inserir categorias de custos
INSERT INTO cost_categories (id, name, description, icon) VALUES
('rent', 'Aluguel', 'Custos de aluguel do estabelecimento', '🏢'),
('utilities', 'Utilidades', 'Energia, água, internet, telefone', '⚡'),
('employees', 'Mão de Obra', 'Salários, encargos e benefícios', '👥'),
('marketing', 'Marketing', 'Publicidade e promoções', '📢'),
('supplies', 'Suprimentos', 'Material de limpeza, embalagens', '📦'),
('maintenance', 'Manutenção', 'Equipamentos e instalações', '🔧'),
('other', 'Outros', 'Custos diversos', '📋')
ON CONFLICT (id) DO NOTHING;

-- Inserir marcas iniciais
INSERT INTO brands (id, name, type, fixed_price, status, color) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'KEBRADA BURGUER', 'popular', 15.00, 'active', '#10b981'),
('550e8400-e29b-41d4-a716-446655440002', 'N1 BURGUER', 'premium', NULL, 'active', '#8b5cf6')
ON CONFLICT (id) DO NOTHING;

-- Inserir custos fixos globais iniciais
INSERT INTO global_fixed_costs (category_id, name, amount, description, is_active) VALUES
('rent', 'Aluguel do Ponto', 3500.00, 'Aluguel mensal do estabelecimento', true),
('utilities', 'Energia Elétrica', 500.00, 'Conta de luz mensal', true),
('utilities', 'Água', 150.00, 'Conta de água mensal', true),
('utilities', 'Internet', 150.00, 'Internet e telefone', true),
('employees', 'Funcionários', 6000.00, 'Salários e encargos', true),
('marketing', 'Redes Sociais', 800.00, 'Gestão de redes sociais', true),
('marketing', 'Delivery', 400.00, 'Taxas de aplicativos de delivery', true),
('supplies', 'Embalagens', 300.00, 'Embalagens para delivery', true),
('other', 'Contador', 200.00, 'Serviços contábeis', true);

-- Inserir produtos iniciais
INSERT INTO products (id, name, brand_id, price, cmv) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Kebrada Clássico', '550e8400-e29b-41d4-a716-446655440001', 15.00, 7.50),
('550e8400-e29b-41d4-a716-446655440004', 'N1 Premium', '550e8400-e29b-41d4-a716-446655440002', 28.00, 15.00)
ON CONFLICT (id) DO NOTHING;

-- Inserir ingredientes iniciais
INSERT INTO ingredients (product_id, name, cost, unit) VALUES
-- Ingredientes do Kebrada Clássico
('550e8400-e29b-41d4-a716-446655440003', 'Pão', 1.50, 'un'),
('550e8400-e29b-41d4-a716-446655440003', 'Carne 120g', 4.00, 'un'),
('550e8400-e29b-41d4-a716-446655440003', 'Queijo', 1.20, 'fatia'),
('550e8400-e29b-41d4-a716-446655440003', 'Alface/Tomate', 0.80, 'porção'),
-- Ingredientes do N1 Premium
('550e8400-e29b-41d4-a716-446655440004', 'Pão Artesanal', 3.00, 'un'),
('550e8400-e29b-41d4-a716-446655440004', 'Carne 180g Premium', 8.00, 'un'),
('550e8400-e29b-41d4-a716-446655440004', 'Queijo Especial', 2.50, 'fatia'),
('550e8400-e29b-41d4-a716-446655440004', 'Vegetais Premium', 1.50, 'porção');

-- Inserir métricas financeiras iniciais
INSERT INTO financial_metrics (total_revenue, total_costs, total_profit, profit_margin, break_even_point) VALUES
(45000.00, 32000.00, 13000.00, 28.90, 850);
