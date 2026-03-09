import productsData from './products.json'

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const flattenProduct = (p) => {
  const { attributes = {}, ...rest } = p
  const { color, ...otherAttrs } = attributes
  return {
    ...rest,
    seccion: capitalize(p.section),
    category: capitalize(p.category),
    originalPrice: p.oldPrice,
    inStock: p.stock > 0,
    color: Array.isArray(color) ? color[0] : color ?? null,
    ...otherAttrs,
  }
}

export const products = productsData.map(flattenProduct)

export const getProductsBySection = (slug) => {
  if (slug === 'novedades') return products.filter((p) => p.isNew)
  if (slug === 'outlet')    return products.filter((p) => p.isOutlet)
  const name = capitalize(slug)
  return products.filter((p) => p.seccion === name)
}

export const getPriceRange = (list) => {
  if (!list.length) return [0, 300]
  const prices = list.map((p) => p.price)
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
}

export const getProductBySlug = (slug) =>
  products.find((p) => p.slug === slug) ?? null

export const getFeaturedProducts = () =>
  products.filter((p) => p.isFeatured).slice(0, 6)

export const getRelatedProducts = (product, limit = 4) => {
  if (!product) return []
  return products
    .filter((p) =>
      p.id !== product.id &&
      (p.seccion === product.seccion || p.category === product.category)
    )
    .slice(0, limit)
}
