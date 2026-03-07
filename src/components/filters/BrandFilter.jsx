import { useState } from 'react'

export default function BrandFilter({ brands, selected, onChange }) {
  const [query, setQuery] = useState('')

  const visible = brands.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase())
  )

  const toggle = (brand) => {
    onChange(
      selected.includes(brand)
        ? selected.filter((b) => b !== brand)
        : [...selected, brand]
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar marca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-200 rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
      </div>

      <ul className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
        {visible.length === 0 && (
          <li className="text-xs text-gray-400 py-1">Sin resultados</li>
        )}
        {visible.map((brand) => {
          const checked = selected.includes(brand)
          return (
            <li key={brand}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <span
                  onClick={() => toggle(brand)}
                  className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                    checked ? 'bg-brand-600 border-brand-600' : 'border-gray-300 group-hover:border-brand-400'
                  }`}
                >
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span
                  onClick={() => toggle(brand)}
                  className={`text-sm transition-colors ${checked ? 'text-brand-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}
                >
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
