-- AGREGAR COLUMNA stock_inicial A PRODUCTOS (persiste la cantidad inicial del producto)
-- Ejecuta esto en el SQL Editor de Supabase (https://supabase.com/dashboard/project/mvgzofhgtlqyjtylhkhl/sql)
-- La lógica de stock es: inicial + compras − salidas = stock actual.
-- Para los productos ya existentes, la cantidad inicial queda igual al stock actual
-- (puedes corregirla luego desde "Editar Producto" y el stock actual se ajusta solo).

ALTER TABLE public.productos
  ADD COLUMN IF NOT EXISTS stock_inicial integer NOT NULL DEFAULT 0;

-- Para los productos ya existentes, la cantidad inicial queda igual al stock actual
-- (puedes corregirla luego desde "Editar Producto" y el stock actual se ajusta solo).
UPDATE public.productos SET stock_inicial = stock WHERE stock_inicial = 0;

-- Permisos sobre la columna (privilegios de tabla; no bastan si hay RLS)
GRANT UPDATE (stock_inicial), SELECT (stock_inicial) ON public.productos TO authenticated;
GRANT UPDATE (stock_inicial), SELECT (stock_inicial) ON public.productos TO anon;

-- IMPORTANTE: si RLS está activo en "productos", el UPDATE/INSERT de la app se bloquea.
DROP POLICY IF EXISTS "productos_ins_upd_stock_inicial" ON public.productos;
CREATE POLICY "productos_ins_upd_stock_inicial"
  ON public.productos
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);