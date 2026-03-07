export default function PriceFilter({ priceRange, value, onChange }) {
  const [min, max] = priceRange
  const [lo, hi] = value
  const pct = (v) => ((v - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1 bg-gray-200 rounded" />
        <div
          className="absolute h-1 bg-brand-500 rounded"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 1)
            onChange([v, hi])
          }}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
          style={{ zIndex: lo > max - 10 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 1)
            onChange([lo, v])
          }}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="number"
            min={min}
            max={hi - 1}
            value={lo}
            onChange={(e) => onChange([Number(e.target.value), hi])}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
        </div>
        <span className="text-gray-300 self-center text-sm">—</span>
        <div className="flex-1 relative">
          <input
            type="number"
            min={lo + 1}
            max={max}
            value={hi}
            onChange={(e) => onChange([lo, Number(e.target.value)])}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
        </div>
      </div>
    </div>
  )
}
