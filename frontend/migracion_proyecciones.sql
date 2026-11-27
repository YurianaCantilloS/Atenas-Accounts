-- Guarda un plan por usuario y año sin modificar las demás tablas.
create table if not exists public.proyecciones (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  anio integer not null check (anio between 2027 and 9999),
  datos jsonb not null check (jsonb_typeof(datos) = 'object'),
  revision bigint not null default 1 check (revision > 0),
  actualizado_en timestamptz not null default now(),
  primary key (usuario_id, anio)
);

alter table public.proyecciones enable row level security;

grant select, insert, update on public.proyecciones to authenticated;

-- Cada usuario solo puede consultar y modificar sus propias proyecciones.
drop policy if exists "proyecciones_ver_propias" on public.proyecciones;
drop policy if exists "proyecciones_crear_propias" on public.proyecciones;
drop policy if exists "proyecciones_editar_propias" on public.proyecciones;
create policy "proyecciones_ver_propias" on public.proyecciones
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "proyecciones_crear_propias" on public.proyecciones
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "proyecciones_editar_propias" on public.proyecciones
  for update to authenticated using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
