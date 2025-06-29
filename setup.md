# 🚀 Setup Rápido - Sistema de Agendamento

## 1. Instalar Dependências

```bash
npm install
# ou
pnpm install
```

## 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá para **SQL Editor** e execute os scripts na ordem:

### Script 1: Criar Tabelas
```sql
-- Copie e cole o conteúdo de scripts/create-tables.sql
```

### Script 2: Dados Iniciais
```sql
-- Copie e cole o conteúdo de scripts/seed-data.sql
```

## 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env.local`:
```bash
cp env.example .env.local
```

2. Edite `.env.local` e adicione suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 4. Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 5. Testar Funcionalidades

### Cliente
1. Acesse a página principal
2. Clique em "Agendar Horário"
3. Faça um agendamento de teste

### Admin
1. Acesse: http://localhost:3000/admin
2. Senha: `admin123`
3. Teste as funcionalidades do painel

## ✅ Pronto!

O sistema está funcionando com todas as funcionalidades implementadas:

- ✅ Página principal com informações da barbearia
- ✅ Formulário de agendamento completo
- ✅ Horários disponíveis filtrados automaticamente
- ✅ Mensagem de sucesso após agendamento
- ✅ Painel administrativo com login
- ✅ Confirmação/cancelamento de agendamentos
- ✅ Cadastro de serviços e barbeiros
- ✅ Botão WhatsApp para confirmação

## 🔧 Personalização

Edite os arquivos para personalizar:
- `app/page.tsx` - Informações da barbearia
- `app/agendar/page.tsx` - Mensagem de sucesso
- `app/admin/page.tsx` - Mensagem WhatsApp 