-- ============================================================
-- CyL Complementos — Configurar Supabase Storage
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- Crear bucket público para imágenes de productos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,   -- 5 MB máximo por imagen
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Política: lectura pública (cualquiera puede ver las imágenes)
drop policy if exists "Imágenes públicas" on storage.objects;
create policy "Imágenes públicas"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Política: solo usuarios autenticados pueden subir (tú, el admin)
drop policy if exists "Solo admin sube imágenes" on storage.objects;
create policy "Solo admin sube imágenes"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Política: solo usuarios autenticados pueden borrar
drop policy if exists "Solo admin borra imágenes" on storage.objects;
create policy "Solo admin borra imágenes"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Política: solo usuarios autenticados pueden actualizar
drop policy if exists "Solo admin actualiza imágenes" on storage.objects;
create policy "Solo admin actualiza imágenes"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
