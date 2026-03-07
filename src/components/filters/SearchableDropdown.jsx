import { useState } from 'react'

export default function SearchableDropdown({ brands, selected, onChange }) {
  const [query, setQuery] = useState('')

  const visible = query
    ? brands.filter((b) => b.toLowerCase().includes(query.toLowerCase()))
    : brands

  const toggle = (brand) =>
    onChange(
      selected.includes(brand)
        ? selected.filter((b) => b !== brand)
        : [...selected, brand]
    )

  return (
    <div className="space-y-2">
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar marca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2 py-0.5 rounded-full"
            >
              {b}
              <button onClick={() => toggle(b)} className="hover:text-brand-900">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <ul className="max-h-44 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        {visible.length === 0 && (
          <li className="text-xs text-gray-400 py-1 text-center">Sin resultados</li>
        )}
        {visible.map((brand) => {
          const checked = selected.includes(brand)
          return (
            <li key={brand}>
              <label
                className="flex items-center gap-2.5 cursor-pointer group py-0.5"
                onClick={() => toggle(brand)}
              >
                <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${checked ? 'bg-brand-600 border-brand-600' : 'border-gray-300 group-hover:border-brand-400'}`}>
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={`text-sm select-none transition-colors ${checked ? 'text-brand-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {brand}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
