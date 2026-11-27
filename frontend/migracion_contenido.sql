-- Planificador de contenido: cada cuenta solo ve y modifica sus propios datos.
begin;
create table if not exists public.contenido_publicaciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null check (length(trim(titulo)) between 1 and 200),
  redes text[] not null check (cardinality(redes) > 0 and redes <@ array['instagram','tiktok']::text[]),
  formato text not null default 'video' check (formato in ('video','carrusel','foto')),
  estado text not null default 'idea' check (estado in ('idea','desarrollo','listo','publicado')),
  hook text not null default '',
  guion text not null default '',
  llamada_accion text not null default '',
  fecha date,
  portada_path text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists public.contenido_perfiles (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  red text not null check (red in ('instagram','tiktok')),
  nombre text not null default '',
  orden uuid[] not null default '{}',
  primary key (usuario_id, red)
);

create index if not exists contenido_publicaciones_usuario_idx
  on public.contenido_publicaciones (usuario_id, creado_en desc);

alter table public.contenido_publicaciones enable row level security;
alter table public.contenido_perfiles enable row level security;
grant select, insert, update, delete on public.contenido_publicaciones to authenticated;
grant select, insert, update on public.contenido_perfiles to authenticated;

drop policy if exists "contenido_publicaciones_propias" on public.contenido_publicaciones;
create policy "contenido_publicaciones_propias" on public.contenido_publicaciones
  for all to authenticated using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
drop policy if exists "contenido_perfiles_propios" on public.contenido_perfiles;
create policy "contenido_perfiles_propios" on public.contenido_perfiles
  for all to authenticated using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

-- Las portadas de ideas quedan privadas, no se publican en GitHub.
insert into storage.buckets (id, name, public, file_size_limit)
values ('contenido-portadas', 'contenido-portadas', false, 5242880)
on conflict (id) do nothing;
do $$
begin
  if exists (select 1 from storage.buckets where id = 'contenido-portadas' and public) then
    raise exception 'El espacio contenido-portadas ya existe y es público. Debe ser privado antes de continuar.';
  end if;
end $$;

drop policy if exists "contenido_portadas_ver_propias" on storage.objects;
drop policy if exists "contenido_portadas_crear_propias" on storage.objects;
drop policy if exists "contenido_portadas_eliminar_propias" on storage.objects;
create policy "contenido_portadas_ver_propias" on storage.objects
  for select to authenticated using (
    bucket_id = 'contenido-portadas' and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "contenido_portadas_crear_propias" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'contenido-portadas' and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "contenido_portadas_eliminar_propias" on storage.objects
  for delete to authenticated using (
    bucket_id = 'contenido-portadas' and (storage.foldername(name))[1] = (select auth.uid())::text
  );
commit;
