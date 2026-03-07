export const SHIPPING_METHODS = [
  { id: 'estandar', label: 'Envío estándar', description: '3-5 días laborables', price: 4.99 },
  { id: 'urgente',  label: 'Envío urgente',  description: '1-2 días laborables', price: 9.99 },
  { id: 'tienda',   label: 'Recogida en tienda', description: 'Disponible en 24 h', price: 0 },
]

export default function CartSummary({ subtotal, shippingMethod = 'estandar', children }) {
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethod) ?? SHIPPING_METHODS[0]
  const shipping = method.price
  const total = subtotal + shipping

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Resumen del pedido</h3>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>{subtotal.toFixed(2)} €</span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{method.label}</span>
        <span>{shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}</span>
      </div>

      <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-semibold text-gray-900">
        <span>Total</span>
        <span className="text-brand-700 text-base">{total.toFixed(2)} €</span>
      </div>

      {children}
    </div>
  )
}
