# 🪒 Sistema de Agendamento - Barbearia Clássica

Sistema completo de agendamento online para barbearia desenvolvido com Next.js, TypeScript e Supabase.

## ✨ Funcionalidades

### 🏠 Página Principal
- **Informações da Barbearia**: Nome, endereço, horário de funcionamento
- **Serviços Disponíveis**: Lista com preços e duração
- **Equipe de Barbeiros**: Perfis dos profissionais
- **Botão de Agendamento**: Acesso direto ao formulário

### 📅 Sistema de Agendamento
- **Seleção de Serviço**: Corte, barba, combo, etc.
- **Escolha de Barbeiro**: Opcional - qualquer barbeiro disponível
- **Calendário Inteligente**: Apenas horários disponíveis são exibidos
- **Formulário Completo**: Nome, telefone e email (opcional)
- **Confirmação**: Mensagem de sucesso após agendamento

### 🔐 Painel Administrativo
- **Login Seguro**: Acesso restrito com senha
- **Agendamentos do Dia**: Visualização e gestão
- **Confirmação/Cancelamento**: Controle de status dos agendamentos
- **Cadastro de Serviços**: Adicionar novos serviços
- **Cadastro de Barbeiros**: Gerenciar equipe
- **WhatsApp Integration**: Envio automático de confirmações

## 🚀 Como Usar

### 1. Configuração do Ambiente

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
```

### 2. Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Execute os scripts SQL na ordem:

```sql
-- 1. Criar tabelas
\i scripts/create-tables.sql

-- 2. Inserir dados iniciais
\i scripts/seed-data.sql
```

3. Configure as variáveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📱 Funcionalidades Específicas

### Agendamento de Cliente
1. Acesse a página principal
2. Clique em "Agendar Horário"
3. Selecione serviço, barbeiro (opcional), data e horário
4. Preencha seus dados
5. Confirme o agendamento
6. **Mensagem exibida**: "Agendamento Realizado! Seu agendamento foi enviado com sucesso. Entraremos em contato para confirmação."

### Painel Administrativo
- **URL**: `/admin`
- **Senha**: `admin123`
- **Funcionalidades**:
  - Visualizar agendamentos do dia
  - Confirmar ou cancelar agendamentos
  - Cadastrar novos serviços e barbeiros
  - **Botão WhatsApp**: Envia mensagem de confirmação

### Mensagem WhatsApp de Confirmação
```
Olá! Seu horário foi confirmado com sucesso.
Muito obrigado pela preferência! ✂️
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `services`
- `id` (UUID, PK)
- `name` (VARCHAR)
- `price` (DECIMAL)
- `duration` (INTEGER) - em minutos
- `active` (BOOLEAN)

#### `barbers`
- `id` (UUID, PK)
- `name` (VARCHAR)
- `active` (BOOLEAN)

#### `bookings`
- `id` (UUID, PK)
- `service_id` (UUID, FK)
- `barber_id` (UUID, FK, opcional)
- `date` (DATE)
- `time` (TIME)
- `client_name` (VARCHAR)
- `client_phone` (VARCHAR)
- `client_email` (VARCHAR, opcional)
- `status` (ENUM: 'pending', 'confirmed', 'cancelled')

## 🎨 Tecnologias Utilizadas

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Sistema simples de senha
- **Deploy**: Vercel (recomendado)

## 📋 Regras de Negócio

### Horários de Funcionamento
- **Segunda a Sexta**: 8h às 18h
- **Sábado**: 8h às 16h
- **Domingo**: Fechado

### Agendamentos
- Intervalo de 30 minutos entre horários
- Horários passados são automaticamente desabilitados
- Horários já agendados ficam indisponíveis
- Agendamentos iniciam com status "pending"

### Confirmações
- Apenas agendamentos "confirmed" podem receber WhatsApp
- Mensagem de confirmação é enviada automaticamente
- Cliente recebe notificação de agendamento pendente

## 🔧 Personalização

### Alterar Informações da Barbearia
Edite o arquivo `app/page.tsx`:
- Nome da barbearia
- Endereço
- Telefone
- Horários de funcionamento

### Adicionar Novos Serviços
1. Via painel administrativo
2. Ou diretamente no banco de dados

### Modificar Mensagens
- **Sucesso de agendamento**: `app/agendar/page.tsx`
- **WhatsApp de confirmação**: `app/admin/page.tsx`

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
- Netlify
- Railway
- Heroku

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato: contato@barbeariaclassica.com

---

**Desenvolvido com ❤️ para Barbearia Clássica** 