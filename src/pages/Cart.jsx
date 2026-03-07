import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import ProgressBar from '../components/checkout/ProgressBar'

export default function Cart() {
  const { items, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ProgressBar currentStep={0} />
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-400 text-sm mb-6">Añade productos para comenzar tu compra.</p>
          <Link to="/" className="btn-primary">Seguir comprando</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <ProgressBar currentStep={0} />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Mi carrito
        <span className="ml-2 text-base font-normal text-gray-400">
          ({items.length} {items.length === 1 ? 'artículo' : 'artículos'})
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-xl px-5">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="w-full lg:w-80 flex-shrink-0">
          <CartSummary subtotal={subtotal} shippingMethod="estandar">
            <Link to="/checkout" className="block mt-4 btn-primary text-center w-full">
              Finalizar compra
            </Link>
            <Link to="/" className="block mt-2 text-center text-xs text-gray-400 hover:text-brand-600 transition-colors">
              Seguir comprando
            </Link>
          </CartSummary>
        </div>
      </div>
    </div>
  )
}
