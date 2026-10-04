-- Migración: fotos en ítems de cotizaciones a proveedores
-- Permite guardar la foto de productos personalizados (no inventariados)
ALTER TABLE cotizacion_items ADD COLUMN IF NOT EXISTS foto_url TEXT;