-- AGREGAR COLUMNAS NECESARIAS A PRODUCTOS
-- Ejecuta TODO esto en el SQL Editor de Supabase.
-- (Supabase: https://supabase.com/dashboard/project/mvgzofhgtlqyjtylhkhl/sql)

-- 1) stock_inicial: cantidad inicial del producto (inicial + compras − salidas = stock actual)
ALTER TABLE public.productos
  ADD COLUMN IF NOT EXISTS stock_inicial integer NOT NULL DEFAULT 0;
UPDATE public.productos SET stock_inicial = stock WHERE stock_inicial = 0;

-- 2) orden: posición personalizada del producto en el inventario (arrastrar para reordenar)
ALTER TABLE public.productos
  ADD COLUMN IF NOT EXISTS orden integer NOT NULL DEFAULT 0;

-- Los productos que aún están en orden 0 quedan en el orden actual (por referencia)
UPDATE public.productos SET orden = sub.rn
FROM (
  SELECT id, row_number() OVER (ORDER BY referencia) AS rn
  FROM public.productos
) sub
WHERE public.productos.id = sub.id AND public.productos.orden = 0;

-- Permisos sobre las columnas
GRANT UPDATE (stock_inicial), SELECT (stock_inicial) ON public.productos TO authenticated;
GRANT UPDATE (stock_inicial), SELECT (stock_inicial) ON public.productos TO anon;
GRANT UPDATE (orden), SELECT (orden) ON public.productos TO authenticated;
GRANT UPDATE (orden), SELECT (orden) ON public.productos TO anon;

-- IMPORTANTE: si RLS está activo en "productos", el UPDATE/INSERT de la app se bloquea.
DROP POLICY IF EXISTS "productos_ins_upd_stock_inicial" ON public.productos;
CREATE POLICY "productos_ins_upd_stock_inicial"
  ON public.productos
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "productos_ins_upd_orden" ON public.productos;
CREATE POLICY "productos_ins_upd_orden"
  ON public.productos
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);