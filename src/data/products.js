import { supabase } from '../lib/supabase'
import { getFeaturedProducts as getMockFeatured, getProductsBySection as getMockBySection, getProductBySlug as getMockBySlug, products as mockProducts } from './mockProducts'

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
  isNew:            Boolean(row.is_new),
  isOutlet:         Boolean(row.is_outlet),
  isFeatured:       Boolean(row.is_featured),
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
  if (error || !data || data.length === 0) return mockProducts
  return data.map(mapProduct)
}

// ── Productos por sección ────────────────────────────────────────────────────
export async function fetchProductsBySection(slug) {
  // En lugar de filtrar solo en la BD, obtenemos todo para saber qué overrides existen
  const { data, error } = await supabase.from('products').select('*')
  
  const mockData = getMockBySection(slug)
  if (error || !data || data.length === 0) return mockData
  
  const dbProductsAll = data.map(mapProduct)
  // Filtramos localmente la sección
  const dbProductsSection = dbProductsAll.filter(p => {
    if (slug === 'novedades') return p.isNew
    if (slug === 'outlet') return p.isOutlet
    return p.section === slug
  })
  
  // Excluimos del mockCualquier producto que ya exista en la BD (independientemente de su sección)
  const dbSlugsAll = new Set(dbProductsAll.map(p => p.slug))
  const merged = [...dbProductsSection, ...mockData.filter(p => !dbSlugsAll.has(p.slug))]
  
  return merged
}

// ── Producto por slug ────────────────────────────────────────────────────────
export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return getMockBySlug(slug)
  return mapProduct(data)
}

// ── Productos destacados ─────────────────────────────────────────────────────
export async function fetchFeaturedProducts() {
  // Obtenemos todos los productos para asegurar que las desmarcaciones prevalecen sobre el mock
  const { data, error } = await supabase.from('products').select('*')
    
  const mockData = getMockFeatured()
  if (error || !data || data.length === 0) return mockData
  
  const dbProductsAll = data.map(mapProduct)
  const dbFeatured = dbProductsAll.filter(p => p.isFeatured)
  
  // Un producto local no debe salir como destacado si existe en la BD y no lo es.
  // Es decir, descartamos los mock que coinciden en slug con CUALQUIER producto de la BD.
  const dbSlugsAll = new Set(dbProductsAll.map(p => p.slug))
  const merged = [...dbFeatured, ...mockData.filter(p => !dbSlugsAll.has(p.slug))]
  
  return merged.slice(0, 12)
}

// ── Rango de precios de una lista ────────────────────────────────────────────
export function getPriceRange(list) {
  if (!list.length) return [0, 300]
  const prices = list.map((p) => p.price)
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
}
