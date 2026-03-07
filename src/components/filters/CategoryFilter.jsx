function Checkbox({ checked, onChange, small }) {
  const size = small ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const iconSize = small ? 'w-2 h-2' : 'w-2.5 h-2.5'
  return (
    <span
      onClick={onChange}
      className={`${size} rounded border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
        checked ? 'bg-brand-600 border-brand-600' : 'border-gray-300 hover:border-brand-400'
      }`}
    >
      {checked && (
        <svg className={`${iconSize} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  )
}

export default function CategoryFilter({ categories = [], selected = [], attrs = {}, onChange }) {
  const toggleCategory = (cat) => {
    const isChecked = selected.includes(cat.label)
    let newSelected, newAttrs

    if (isChecked) {
      newSelected = selected.filter((c) => c !== cat.label)
      newAttrs = { ...attrs }
      ;(cat.subfilters ?? []).forEach((sf) => { newAttrs[sf.id] = [] })
    } else {
      newSelected = [...selected, cat.label]
      newAttrs = attrs
    }
    onChange(newSelected, newAttrs)
  }

  const toggleSubfilter = (filterId, option) => {
    const current = Array.isArray(attrs[filterId]) ? attrs[filterId] : []
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option]
    onChange(selected, { ...attrs, [filterId]: next })
  }

  if (!categories.length) return null

  return (
    <ul className="space-y-1">
      {categories.map((cat) => {
        if (!cat?.label) return null
        const checked = selected.includes(cat.label)
        const subfilters = cat.subfilters ?? []

        return (
          <li key={cat.label}>
            <label className="flex items-center gap-2.5 cursor-pointer group py-0.5 select-none">
              <Checkbox checked={checked} onChange={() => toggleCategory(cat)} />
              <span
                className={`text-sm transition-colors ${checked ? 'text-brand-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat.label}
              </span>
            </label>

            {checked && subfilters.length > 0 && (
              <div className="ml-6 mt-2 mb-1 space-y-3 border-l-2 border-brand-100 pl-3">
                {subfilters.map((sf) => {
                  if (!sf?.id || !Array.isArray(sf.options)) return null
                  const currentVals = Array.isArray(attrs[sf.id]) ? attrs[sf.id] : []
                  return (
                    <div key={sf.id}>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                        {sf.label ?? sf.id}
                      </p>
                      <ul className="space-y-1">
                        {sf.options.map((opt) => {
                          const sfChecked = currentVals.includes(opt)
                          return (
                            <li key={opt}>
                              <label className="flex items-center gap-2 cursor-pointer group py-0.5 select-none">
                                <Checkbox checked={sfChecked} onChange={() => toggleSubfilter(sf.id, opt)} small />
                                <span
                                  className={`text-xs transition-colors ${sfChecked ? 'text-brand-700 font-medium' : 'text-gray-500 group-hover:text-gray-800'}`}
                                  onClick={() => toggleSubfilter(sf.id, opt)}
                                >
                                  {opt}
                                </span>
                              </label>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
