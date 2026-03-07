import { useLocation, Link } from 'react-router-dom'
import ProgressBar from '../components/checkout/ProgressBar'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-gray-500 mb-4">No se encontró información del pedido.</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <ProgressBar currentStep={2} />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">¡Pedido confirmado!</h1>
        <p className="text-gray-500 text-sm">
          Gracias, <strong>{order.customer.nombre}</strong>. Hemos recibido tu pedido.
        </p>
        <div className="mt-3 inline-block bg-gray-100 text-gray-600 text-xs font-mono px-3 py-1.5 rounded-full">
          {order.number}
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Productos</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-300 text-xs">img</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                <p className="text-xs text-gray-400">× {item.quantity}</p>
              </div>
              <p className="text-xs font-semibold text-gray-700 flex-shrink-0">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Resumen económico</h2>
        </div>
        <div className="px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{order.subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{order.shippingMethod}</span>
            <span>{order.shippingCost === 0 ? 'Gratis' : `${order.shippingCost.toFixed(2)} €`}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
            <span>Total pagado</span>
            <span className="text-brand-700">{order.total.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Detalles del pedido</h2>
        </div>
        <div className="px-5 py-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Envío</span>
            <span className="text-gray-700">{order.shippingMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pago</span>
            <span className="text-gray-700">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Entregar a</span>
            <span className="text-gray-700 text-right">
              {order.customer.direccion}, {order.customer.ciudad}
            </span>
          </div>
        </div>
      </div>

      <Link to="/" className="block btn-primary text-center w-full py-3">
        Volver al inicio
      </Link>
    </div>
  )
}
