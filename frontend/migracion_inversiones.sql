-- ============================================================
-- MIGRACIÓN: INVERSIONES (inversionistas + movimientos)
-- Ejecutar en SQL Editor de Supabase
-- ============================================================

-- Tabla de inversionistas
create table if not exists public.inversionistas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  notas text default '',
  created_at timestamptz default now()
);

-- Movimientos por inversionista
-- tipo:  inversion = aporte inicial | abono = aporte adicional | egreso = dinero gastado
-- origen: manual | compra | simulacion  (referencia_id guarda el id de la compra/cotizacion)
create table if not exists public.inversiones_movimientos (
  id uuid primary key default gen_random_uuid(),
  inversionista_id uuid not null references public.inversionistas(id) on delete cascade,
  tipo text not null check (tipo in ('inversion','abono','egreso')),
  origen text not null default 'manual' check (origen in ('manual','compra','simulacion')),
  referencia_id text,
  concepto text default '',
  monto numeric(14,2) not null default 0,
  fecha date not null default current_date,
  created_at timestamptz default now()
);

create index if not exists inv_mov_inv_idx on public.inversiones_movimientos (inversionista_id, fecha desc);

-- ============================================================
-- PERMISOS (RLS): permite a la app (clave anónima) leer/escribir
-- ============================================================
alter table public.inversionistas enable row level security;
alter table public.inversiones_movimientos enable row level security;

drop policy if exists "inv-select"         on public.inversionistas;
drop policy if exists "inv-insert"         on public.inversionistas;
drop policy if exists "inv-update"         on public.inversionistas;
drop policy if exists "inv-delete"         on public.inversionistas;
create policy "inv-select" on public.inversionistas          for select using (true);
create policy "inv-insert" on public.inversionistas          for insert with check (true);
create policy "inv-update" on public.inversionistas          for update using (true);
create policy "inv-delete" on public.inversionistas          for delete using (true);

drop policy if exists "inv-mov-select"     on public.inversiones_movimientos;
drop policy if exists "inv-mov-insert"     on public.inversiones_movimientos;
drop policy if exists "inv-mov-update"     on public.inversiones_movimientos;
drop policy if exists "inv-mov-delete"     on public.inversiones_movimientos;
create policy "inv-mov-select" on public.inversiones_movimientos for select using (true);
create policy "inv-mov-insert" on public.inversiones_movimientos for insert with check (true);
create policy "inv-mov-update" on public.inversiones_movimientos for update using (true);
create policy "inv-mov-delete" on public.inversiones_movimientos for delete using (true);

grant all on public.inversionistas            to anon, authenticated;
grant all on public.inversiones_movimientos   to anon, authenticated;