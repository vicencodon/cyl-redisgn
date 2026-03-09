import { useState, useMemo, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getSectionConfig } from '../data/sectionFilters'
import { fetchProductsBySection, getPriceRange } from '../data/products'
import { buildInitialFilters, normalizeFilters } from '../utils/filterUtils'
import FilterSidebar from '../components/filters/FilterSidebar'
import ProductCard from '../components/ui/ProductCard'

export default function SectionPage() {
  const { pathname } = useLocation()
  const slug = pathname.replace('/', '').trim()

  const config = useMemo(() => getSectionConfig(slug), [slug])

  const [allProducts, setAllProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [filters, setFilters] = useState(() => buildInitialFilters([0, 300]))
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Carga productos desde Supabase al cambiar de sección
  useEffect(() => {
    setLoadingProducts(true)
    setSidebarOpen(false)
    fetchProductsBySection(slug).then((prods) => {
      setAllProducts(prods)
      setFilters(buildInitialFilters(getPriceRange(prods)))
      setLoadingProducts(false)
    })
  }, [slug])

  const globalPriceRange = useMemo(() => getPriceRange(allProducts), [allProducts])

  const safeFilters = useMemo(
    () => normalizeFilters(filters, config, globalPriceRange),
    [filters, config, globalPriceRange]
  )

  const handleChange = (updated) =>
    setFilters(normalizeFilters(updated, config, globalPriceRange))

  const handleClear = () => setFilters(buildInitialFilters(globalPriceRange))

  const filtered = useMemo(() => {
    if (!allProducts.length) return []
    return allProducts.filter((p) => {
      if (p.price < safeFilters.priceRange[0] || p.price > safeFilters.priceRange[1]) return false
      if (safeFilters.brands.length > 0 && !safeFilters.brands.includes(p.brand)) return false
      if (safeFilters.categories.length > 0 && !safeFilters.categories.includes(p.category)) return false
      for (const [key, values] of Object.entries(safeFilters.attrs)) {
        if (Array.isArray(values) && values.length > 0 && p[key] != null && !values.includes(p[key])) return false
      }
      return true
    })
  }, [allProducts, safeFilters])

  const activeCount =
    (safeFilters.priceRange[0] !== globalPriceRange[0] || safeFilters.priceRange[1] !== globalPriceRange[1] ? 1 : 0) +
    safeFilters.brands.length +
    safeFilters.categories.length +
    Object.values(safeFilters.attrs).flat().length

  if (!config) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Sección no encontrada</h1>
        <p className="text-gray-500 mb-6">La sección que buscas no existe.</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-400 mb-5 flex items-center gap-1.5">
        <Link to="/" className="hover:text-brand-700 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-gray-700">{config.name}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
        {!loadingProducts && (
          <span className="text-sm text-gray-400">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <button
        className="md:hidden flex items-center justify-center gap-2 mb-5 w-full text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2"
        onClick={() => setSidebarOpen((v) => !v)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h4" />
        </svg>
        {sidebarOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        {activeCount > 0 && (
          <span className="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      <div className="flex gap-8 items-start">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-60 flex-shrink-0`}>
          <FilterSidebar
            config={config}
            priceRange={globalPriceRange}
            filters={safeFilters}
            onChange={handleChange}
            onClear={handleClear}
          />
        </div>

        <div className="flex-1 min-w-0">
          {loadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
              ))}
            </div>
          ) : allProducts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-gray-400 text-sm">No hay productos en esta sección todavía.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-gray-400 text-sm mb-4">
                No hay productos con los filtros seleccionados.
              </p>
              <button onClick={handleClear} className="btn-secondary text-xs">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
