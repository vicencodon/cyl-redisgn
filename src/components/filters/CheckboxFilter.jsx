export default function CheckboxFilter({ options, selected, onChange }) {
  const toggle = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    )
  }

  return (
    <ul className="space-y-1.5">
      {options.map((option) => {
        const checked = selected.includes(option)
        return (
          <li key={option}>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <span
                onClick={() => toggle(option)}
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
                onClick={() => toggle(option)}
                className={`text-sm transition-colors ${checked ? 'text-brand-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}
              >
                {option}
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}
