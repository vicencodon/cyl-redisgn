import { SHIPPING_METHODS } from '../cart/CartSummary'

export default function OrderSummary({ items, shippingMethod }) {
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethod) ?? SHIPPING_METHODS[0]
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = method.price
  const total = subtotal + shipping

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Tu pedido</h3>

      <ul className="space-y-3 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">img</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
              {item.brand && <p className="text-xs text-gray-400">{item.brand}</p>}
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-gray-400">× {item.quantity}</p>
                <p className="text-xs font-semibold text-gray-700">{(item.price * item.quantity).toFixed(2)} €</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{method.label}</span>
          <span>{shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-gray-900 pt-1 border-t border-gray-200">
          <span>Total</span>
          <span className="text-brand-700">{total.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  )
}
