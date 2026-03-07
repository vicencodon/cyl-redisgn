import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function CartDrawer() {
  const { items, removeFromCart, subtotal, isDrawerOpen, closeDrawer } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isDrawerOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen, closeDrawer])

  const goTo = (path) => { closeDrawer(); navigate(path) }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mini carrito"
        className={`fixed right-0 top-0 h-full w-full sm:max-w-sm bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">
            Mi carrito
            {items.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({items.length} {items.length === 1 ? 'artículo' : 'artículos'})
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Cerrar carrito"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-1">Tu carrito está vacío</p>
            <p className="text-xs text-gray-400 mb-5">Añade productos para comenzar</p>
            <button onClick={closeDrawer} className="btn-primary text-sm">
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-100 px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-300 text-xs">img</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {item.brand && (
                      <p className="text-xs text-gray-400 leading-none mb-0.5">{item.brand}</p>
                    )}
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs text-gray-400">× {item.quantity}</p>
                      <p className="text-xs font-semibold text-brand-700">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex-shrink-0 self-start mt-0.5 text-gray-300 hover:text-brand-600 transition-colors"
                    aria-label="Eliminar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-semibold text-gray-900">{subtotal.toFixed(2)} €</span>
              </div>
              <p className="text-xs text-gray-400">Gastos de envío calculados en el siguiente paso.</p>

              <button
                onClick={() => goTo('/checkout')}
                className="w-full btn-primary py-2.5 text-sm"
              >
                Finalizar compra
              </button>
              <button
                onClick={() => goTo('/carrito')}
                className="w-full btn-secondary py-2.5 text-sm"
              >
                Ver carrito completo
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
