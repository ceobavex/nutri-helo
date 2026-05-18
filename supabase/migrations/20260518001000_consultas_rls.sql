alter table public.consultas enable row level security;

grant select, insert, update on public.consultas to authenticated;

drop policy if exists consultas_select_own on public.consultas;
drop policy if exists consultas_insert_own_patient on public.consultas;
drop policy if exists consultas_update_own on public.consultas;

create policy consultas_select_own
  on public.consultas
  for select
  to authenticated
  using (auth.uid() = nutricionista_id);

create policy consultas_insert_own_patient
  on public.consultas
  for insert
  to authenticated
  with check (
    auth.uid() = nutricionista_id
    and exists (
      select 1
      from public.pacientes
      where pacientes.id = consultas.paciente_id
        and pacientes.nutricionista_id = auth.uid()
    )
  );

create policy consultas_update_own
  on public.consultas
  for update
  to authenticated
  using (auth.uid() = nutricionista_id)
  with check (auth.uid() = nutricionista_id);
