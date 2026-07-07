-- ===========================================
-- Tabelas da Plataforma Prof. Davi Ribeiro
-- ===========================================

-- Tabela de respostas das atividades
CREATE TABLE IF NOT EXISTS respostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  atividade_id TEXT NOT NULL,
  username TEXT NOT NULL,
  resposta TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de redações
CREATE TABLE IF NOT EXISTS redacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  status TEXT DEFAULT 'enviada' CHECK (status IN ('enviada', 'em_revisao', 'corrigida')),
  nota TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE redacoes ENABLE ROW LEVEL SECURITY;

-- Política: permitir leitura e escrita para todos (via anon key)
-- Em produção, substituir por políticas baseadas em auth.uid()
CREATE POLICY "Permitir tudo para respostas" ON respostas
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para redacoes" ON redacoes
  FOR ALL USING (true) WITH CHECK (true);
