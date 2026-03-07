export function buildInitialFilters(priceRange) {
  return {
    priceRange: [priceRange[0], priceRange[1]],
    brands: [],
    categories: [],
    attrs: {},
  }
}

export function normalizeFilters(filters, config, priceRange) {
  if (!config || !filters) return buildInitialFilters(priceRange)

  const [gMin, gMax] = priceRange

  const validCategoryLabels = new Set(
    (config.categories ?? []).map((c) => c.label)
  )

  const validAttrIds = new Set()
  ;(config.categories ?? []).forEach((cat) => {
    ;(cat.subfilters ?? []).forEach((sf) => validAttrIds.add(sf.id))
  })
  ;(config.globalFilters ?? []).forEach((gf) => validAttrIds.add(gf.id))

  const validBrands = new Set(config.brands ?? [])

  const lo = Math.max(gMin, Math.min(filters.priceRange?.[0] ?? gMin, gMax))
  const hi = Math.min(gMax, Math.max(filters.priceRange?.[1] ?? gMax, gMin))

  const validAttrs = {}
  for (const [key, values] of Object.entries(filters.attrs ?? {})) {
    if (validAttrIds.has(key) && Array.isArray(values)) {
      validAttrs[key] = values
    }
  }

  return {
    priceRange: lo <= hi ? [lo, hi] : [gMin, gMax],
    brands: (filters.brands ?? []).filter((b) => validBrands.has(b)),
    categories: (filters.categories ?? []).filter((c) => validCategoryLabels.has(c)),
    attrs: validAttrs,
  }
}
