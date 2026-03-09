import { supabase } from '../lib/supabase'

// Transforma una fila de Supabase al formato que usa la app
const mapProduct = (row) => ({
  id:               row.id,
  slug:             row.slug,
  name:             row.name,
  brand:            row.brand ?? null,
  section:          row.section,
  seccion:          row.section
    ? row.section.charAt(0).toUpperCase() + row.section.slice(1)
    : null,
  category:         row.category
    ? row.category.charAt(0).toUpperCase() + row.category.slice(1)
    : null,
  subcategory:      row.subcategory ?? null,
  price:            Number(row.price),
  originalPrice:    row.old_price ? Number(row.old_price) : null,
  isNew:            row.is_new,
  isOutlet:         row.is_outlet,
  isFeatured:       row.is_featured,
  stock:            row.stock,
  inStock:          row.stock > 0,
  shortDescription: row.short_description ?? null,
  description:      row.description ?? null,
  images:           row.images ?? [],
  // Atributos dinámicos aplanados
  ...(row.attributes ?? {}),
  color: Array.isArray(row.attributes?.color)
    ? row.attributes.color[0]
    : (row.attributes?.color ?? null),
})

// ── Obtener todos los productos ──────────────────────────────────────────────
export async function fetchAllProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) throw error
  return data.map(mapProduct)
}

// ── Productos por sección ────────────────────────────────────────────────────
export async function fetchProductsBySection(slug) {
  let query = supabase.from('products').select('*')

  if (slug === 'novedades') {
    query = query.eq('is_new', true)
  } else if (slug === 'outlet') {
    query = query.eq('is_outlet', true)
  } else {
    query = query.eq('section', slug)
  }

  const { data, error } = await query
  if (error) throw error
  return data.map(mapProduct)
}

// ── Producto por slug ────────────────────────────────────────────────────────
export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return mapProduct(data)
}

// ── Productos destacados ─────────────────────────────────────────────────────
export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(6)
  if (error) throw error
  return data.map(mapProduct)
}

// ── Rango de precios de una lista ────────────────────────────────────────────
export function getPriceRange(list) {
  if (!list.length) return [0, 300]
  const prices = list.map((p) => p.price)
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
}
