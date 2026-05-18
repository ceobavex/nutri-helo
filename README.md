# Nutri Helo

Sistema clínico para nutricionistas, com autenticação por CRN, cadastro de pacientes, prontuário e atendimento com anamnese dinâmica.

## Stack

- Next.js 16, App Router e React 19
- Supabase Auth, Postgres e Row Level Security
- Tailwind CSS 4 e componentes shadcn/radix
- React Hook Form e Zod

## Fluxo Principal

1. A nutricionista acessa o sistema com CRN, região e senha.
2. O app resolve o e-mail pelo RPC `get_email_por_crn` no Supabase.
3. Pacientes são cadastrados com dados básicos e objetivos nutricionais.
4. O prontuário reúne visão geral, anamnese, evolução, dietas, consultas e exames.
5. Ao iniciar consulta, o sistema cria ou retoma um rascunho em `consultas`.
6. A anamnese é renderizada por schema versionado e salva automaticamente em `dados_clinicos`.

## Variáveis de Ambiente

Crie um `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Supabase

As migrations ficam em `supabase/migrations`.

- `20260518000000_base_schema.sql`: cria tabelas, triggers, RPC de login por CRN e policies base.
- `20260518001000_consultas_rls.sql`: libera a criação e atualização de rascunhos da tabela `consultas` apenas para a nutricionista dona do paciente.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Qualidade

```bash
npm run lint
npm run typegen
npm run typecheck
npm run build
```

Sempre rode `npm run typegen` depois de mudanças relevantes em rotas do App Router.
