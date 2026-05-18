create extension if not exists pgcrypto;

create table if not exists public.nutricionistas (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  cpf text not null,
  email text not null,
  telefone text,
  crn text not null,
  regiao text not null,
  tipo_inscricao text not null default 'Pendente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  nutricionista_id uuid not null references public.nutricionistas(id) on delete cascade,
  nome text not null,
  data_nascimento date not null,
  sexo text not null check (sexo in ('MASCULINO', 'FEMININO')),
  cpf text not null,
  email text,
  telefone text,
  objetivo_principal text not null,
  objetivos_secundarios text[] not null default '{}',
  data_cadastro timestamptz not null default now(),
  ultima_consulta timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  nutricionista_id uuid not null references public.nutricionistas(id) on delete cascade,
  status text not null default 'rascunho' check (status in ('rascunho', 'concluida', 'cancelada')),
  data_inicio timestamptz not null default now(),
  data_fim timestamptz,
  schema_id text not null,
  schema_version text not null,
  paciente_snapshot jsonb not null default '{}'::jsonb,
  dados_clinicos jsonb not null default '{}'::jsonb,
  peso numeric,
  altura numeric,
  imc numeric,
  gordura_corporal_pct numeric,
  massa_magra_kg numeric,
  circunferencia_abdominal numeric,
  pressao_sistolica integer,
  pressao_diastolica integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_nutricionistas_updated_at on public.nutricionistas;
create trigger set_nutricionistas_updated_at
  before update on public.nutricionistas
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_pacientes_updated_at on public.pacientes;
create trigger set_pacientes_updated_at
  before update on public.pacientes
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_consultas_updated_at on public.consultas;
create trigger set_consultas_updated_at
  before update on public.consultas
  for each row
  execute function public.set_updated_at();

create or replace function public.get_email_por_crn(p_crn text, p_regiao text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email
  from public.nutricionistas
  where crn = p_crn
    and regiao = p_regiao
  limit 1;
$$;

alter table public.nutricionistas enable row level security;
alter table public.pacientes enable row level security;

grant select, insert, update on public.nutricionistas to authenticated;
grant select, insert, update, delete on public.pacientes to authenticated;
grant execute on function public.get_email_por_crn(text, text) to anon, authenticated;

drop policy if exists nutricionistas_select_own on public.nutricionistas;
drop policy if exists nutricionistas_insert_own on public.nutricionistas;
drop policy if exists nutricionistas_update_own on public.nutricionistas;

create policy nutricionistas_select_own
  on public.nutricionistas
  for select
  to authenticated
  using (auth.uid() = id);

create policy nutricionistas_insert_own
  on public.nutricionistas
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy nutricionistas_update_own
  on public.nutricionistas
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists pacientes_select_own on public.pacientes;
drop policy if exists pacientes_insert_own on public.pacientes;
drop policy if exists pacientes_update_own on public.pacientes;
drop policy if exists pacientes_delete_own on public.pacientes;

create policy pacientes_select_own
  on public.pacientes
  for select
  to authenticated
  using (auth.uid() = nutricionista_id);

create policy pacientes_insert_own
  on public.pacientes
  for insert
  to authenticated
  with check (auth.uid() = nutricionista_id);

create policy pacientes_update_own
  on public.pacientes
  for update
  to authenticated
  using (auth.uid() = nutricionista_id)
  with check (auth.uid() = nutricionista_id);

create policy pacientes_delete_own
  on public.pacientes
  for delete
  to authenticated
  using (auth.uid() = nutricionista_id);
