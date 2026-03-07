import { SHIPPING_METHODS } from '../cart/CartSummary'

export default function ShippingMethodSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      {SHIPPING_METHODS.map((method) => {
        const selected = value === method.id
        return (
          <label
            key={method.id}
            className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
              selected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  selected ? 'border-brand-600' : 'border-gray-300'
                }`}
              >
                {selected && <span className="w-2 h-2 rounded-full bg-brand-600" />}
              </span>
              <div>
                <p className={`text-sm font-medium ${selected ? 'text-brand-700' : 'text-gray-700'}`}>
                  {method.label}
                </p>
                <p className="text-xs text-gray-400">{method.description}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold flex-shrink-0 ${selected ? 'text-brand-700' : 'text-gray-600'}`}>
              {method.price === 0 ? 'Gratis' : `${method.price.toFixed(2)} €`}
            </span>
            <input
              type="radio"
              name="shipping"
              value={method.id}
              checked={selected}
              onChange={() => onChange(method.id)}
              className="sr-only"
            />
          </label>
        )
      })}
    </div>
  )
}
