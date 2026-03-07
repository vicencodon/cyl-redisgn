export default function FilterSidebar({ filterGroups, priceRange, activePriceRange, activeFilters, onPriceChange, onFilterChange, onClear }) {
  const hasActiveFilters =
    activePriceRange[0] !== priceRange[0] ||
    activePriceRange[1] !== priceRange[1] ||
    Object.values(activeFilters).some((v) => v.length > 0)

  const toggleOption = (groupId, option) => {
    const current = activeFilters[groupId] ?? []
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option]
    onFilterChange(groupId, next)
  }

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-brand-600 hover:text-brand-800 transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="border-t border-gray-100 pt-5 mb-5">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">Precio</p>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{activePriceRange[0]} €</span>
            <span>{activePriceRange[1]} €</span>
          </div>
          <div className="relative h-1 bg-gray-200 rounded">
            <div
              className="absolute h-1 bg-brand-500 rounded"
              style={{
                left: `${((activePriceRange[0] - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100}%`,
                right: `${100 - ((activePriceRange[1] - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100}%`,
              }}
            />
          </div>
          <div className="relative">
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={activePriceRange[0]}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), activePriceRange[1] - 1)
                onPriceChange([val, activePriceRange[1]])
              }}
              className="absolute w-full h-1 opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={activePriceRange[1]}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), activePriceRange[0] + 1)
                onPriceChange([activePriceRange[0], val])
              }}
              className="absolute w-full h-1 opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <input
              type="number"
              min={priceRange[0]}
              max={activePriceRange[1] - 1}
              value={activePriceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), activePriceRange[1]])}
              className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <span className="text-gray-300 self-center">—</span>
            <input
              type="number"
              min={activePriceRange[0] + 1}
              max={priceRange[1]}
              value={activePriceRange[1]}
              onChange={(e) => onPriceChange([activePriceRange[0], Number(e.target.value)])}
              className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>
        </div>
      </div>

      {filterGroups.map((group) => (
        <div key={group.id} className="border-t border-gray-100 pt-5 mb-5">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
            {group.label}
          </p>
          <ul className="space-y-2">
            {group.options.map((option) => {
              const checked = (activeFilters[group.id] ?? []).includes(option)
              return (
                <li key={option}>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        checked
                          ? 'bg-brand-600 border-brand-600'
                          : 'border-gray-300 group-hover:border-brand-400'
                      }`}
                      onClick={() => toggleOption(group.id, option)}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`text-sm transition-colors ${checked ? 'text-brand-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}
                      onClick={() => toggleOption(group.id, option)}
                    >
                      {option}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </aside>
  )
}
