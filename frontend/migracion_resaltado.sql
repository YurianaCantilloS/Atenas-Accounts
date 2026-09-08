-- AGREGAR COLUMNA PARA RESALTADO DE PENDIENTES (persiste en todos los dispositivos)
-- Ejecuta esto en el SQL Editor de Supabase (https://supabase.com/dashboard/project/mvgzofhgtlqyjtylhkhl/sql)
-- Después de ejecutar, el resaltado se guarda en la base de datos y NO se borra al cambiar de dispositivo.

ALTER TABLE public.pendientes
  ADD COLUMN IF NOT EXISTS resaltado boolean DEFAULT false;

-- Permisos sobre la columna (privilegios de tabla; no bastan si hay RLS)
GRANT UPDATE (resaltado), SELECT (resaltado) ON public.pendientes TO authenticated;
GRANT UPDATE (resaltado), SELECT (resaltado) ON public.pendientes TO anon;

-- IMPORTANTE: si RLS está activo en "pendientes", el UPDATE de la app se bloquea.
-- Estas políticas permiten marcar/desmarcar el resaltado desde la app en todos los dispositivos.
DROP POLICY IF EXISTS "pendientes_update_resaltado" ON public.pendientes;
CREATE POLICY "pendientes_update_resaltado"
  ON public.pendientes
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);