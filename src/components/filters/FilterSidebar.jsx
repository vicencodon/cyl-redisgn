import FilterSection from './FilterSection'
import RangeSlider from './RangeSlider'
import SearchableDropdown from './SearchableDropdown'
import CategoryFilter from './CategoryFilter'
import CheckboxFilter from './CheckboxFilter'

export default function FilterSidebar({ config, priceRange, filters, onChange, onClear }) {
  if (!config) return null

  const brands       = config.brands        ?? []
  const categories   = config.categories    ?? []
  const globalFilters = config.globalFilters ?? []

  if (!filters || !priceRange) return null

  const hasActive =
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1] ||
    (filters.brands?.length  ?? 0) > 0 ||
    (filters.categories?.length ?? 0) > 0 ||
    Object.values(filters.attrs ?? {}).some((v) => Array.isArray(v) && v.length > 0)

  const handleCategoryChange = (newCategories, newAttrs) => {
    onChange({ ...filters, categories: newCategories, attrs: { ...(filters.attrs ?? {}), ...newAttrs } })
  }

  const handleGlobalFilter = (id, values) => {
    onChange({ ...filters, attrs: { ...(filters.attrs ?? {}), [id]: values } })
  }

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtros</span>
        {hasActive && (
          <button onClick={onClear} className="text-xs text-brand-600 hover:text-brand-800 transition-colors">
            Limpiar todo
          </button>
        )}
      </div>

      <FilterSection label="Precio" defaultOpen>
        <RangeSlider
          min={priceRange[0]}
          max={priceRange[1]}
          value={filters.priceRange}
          onChange={(v) => onChange({ ...filters, priceRange: v })}
        />
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection label="Marca" defaultOpen={false}>
          <SearchableDropdown
            brands={brands}
            selected={filters.brands ?? []}
            onChange={(v) => onChange({ ...filters, brands: v })}
          />
        </FilterSection>
      )}

      {categories.length > 0 && (
        <FilterSection label="Categoría" defaultOpen>
          <CategoryFilter
            categories={categories}
            selected={filters.categories ?? []}
            attrs={filters.attrs ?? {}}
            onChange={handleCategoryChange}
          />
        </FilterSection>
      )}

      {globalFilters.map((gf) => (
        <FilterSection key={gf.id} label={gf.label} defaultOpen={false}>
          <CheckboxFilter
            options={gf.options ?? []}
            selected={(filters.attrs ?? {})[gf.id] ?? []}
            onChange={(v) => handleGlobalFilter(gf.id, v)}
          />
        </FilterSection>
      ))}
    </aside>
  )
}
