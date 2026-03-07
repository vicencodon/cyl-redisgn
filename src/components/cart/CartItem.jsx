import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-300 text-xs">Sin imagen</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.brand && (
              <p className="text-xs text-gray-400 mb-0.5">{item.brand}</p>
            )}
            <p className="text-sm font-medium text-gray-800 leading-snug">{item.name}</p>
            {(item.category || item.tipo) && (
              <p className="text-xs text-gray-400 mt-0.5">
                {[item.category, item.tipo].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="flex-shrink-0 text-gray-300 hover:text-brand-600 transition-colors"
            aria-label="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm text-gray-700 select-none">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-brand-700">
              {(item.price * item.quantity).toFixed(2)} €
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">{item.price.toFixed(2)} € / ud.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
