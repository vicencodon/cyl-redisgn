export default function RangeSlider({ min, max, value, onChange }) {
  const safeMin = Number.isFinite(min) ? min : 0
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1
  const [lo, hi] = Array.isArray(value) ? value : [safeMin, safeMax]
  const safeLo = Math.max(safeMin, Math.min(lo, safeMax))
  const safeHi = Math.max(safeLo, Math.min(hi, safeMax))

  const range = safeMax - safeMin || 1
  const pct = (v) => ((v - safeMin) / range) * 100

  if (safeMin === safeMax) {
    return (
      <p className="text-xs text-gray-400 text-center py-1">
        Precio fijo: {safeMin} €
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative h-5 flex items-center select-none">
        <div className="absolute w-full h-1 bg-gray-200 rounded-full" />
        <div
          className="absolute h-1 bg-brand-500 rounded-full"
          style={{ left: `${pct(safeLo)}%`, right: `${100 - pct(safeHi)}%` }}
        />
        <input
          type="range" min={safeMin} max={safeMax} value={safeLo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), safeHi - 1)
            onChange([v, safeHi])
          }}
          className="absolute w-full opacity-0 cursor-pointer h-5"
          style={{ zIndex: safeLo > safeMax - 10 ? 5 : 3 }}
        />
        <input
          type="range" min={safeMin} max={safeMax} value={safeHi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), safeLo + 1)
            onChange([safeLo, v])
          }}
          className="absolute w-full opacity-0 cursor-pointer h-5"
          style={{ zIndex: 4 }}
        />
        <div
          className="absolute w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full shadow pointer-events-none"
          style={{ left: `calc(${pct(safeLo)}% - 7px)` }}
        />
        <div
          className="absolute w-3.5 h-3.5 bg-white border-2 border-brand-500 rounded-full shadow pointer-events-none"
          style={{ left: `calc(${pct(safeHi)}% - 7px)` }}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="number" min={safeMin} max={safeHi - 1} value={safeLo}
            onChange={(e) => {
              const v = Math.max(safeMin, Math.min(Number(e.target.value), safeHi - 1))
              onChange([v, safeHi])
            }}
            className="w-full border border-gray-200 rounded-lg px-2 pr-6 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">€</span>
        </div>
        <span className="text-gray-300 self-center">—</span>
        <div className="flex-1 relative">
          <input
            type="number" min={safeLo + 1} max={safeMax} value={safeHi}
            onChange={(e) => {
              const v = Math.min(safeMax, Math.max(Number(e.target.value), safeLo + 1))
              onChange([safeLo, v])
            }}
            className="w-full border border-gray-200 rounded-lg px-2 pr-6 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">€</span>
        </div>
      </div>
    </div>
  )
}
