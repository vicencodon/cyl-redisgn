const PAYMENT_METHODS = [
  {
    id: 'tarjeta',
    label: 'Tarjeta de crédito / débito',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
      </svg>
    ),
  },
  {
    id: 'bizum',
    label: 'Bizum',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export { PAYMENT_METHODS }

export default function PaymentMethodSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      {PAYMENT_METHODS.map((method) => {
        const selected = value === method.id
        return (
          <label
            key={method.id}
            className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
              selected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                selected ? 'border-brand-600' : 'border-gray-300'
              }`}
            >
              {selected && <span className="w-2 h-2 rounded-full bg-brand-600" />}
            </span>
            <span className={`${selected ? 'text-brand-600' : 'text-gray-400'}`}>
              {method.icon}
            </span>
            <span className={`text-sm font-medium ${selected ? 'text-brand-700' : 'text-gray-700'}`}>
              {method.label}
            </span>
            <input
              type="radio"
              name="payment"
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
