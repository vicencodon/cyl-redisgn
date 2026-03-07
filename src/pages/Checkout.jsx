import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProgressBar from '../components/checkout/ProgressBar'
import ShippingMethodSelector from '../components/checkout/ShippingMethodSelector'
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector'
import OrderSummary from '../components/checkout/OrderSummary'
import { SHIPPING_METHODS } from '../components/cart/CartSummary'
import { PAYMENT_METHODS } from '../components/checkout/PaymentMethodSelector'

const PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares',
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
  'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca',
  'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid',
  'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo',
  'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
]

const INITIAL_FORM = {
  nombre: '', apellidos: '', email: '', telefono: '',
  direccion: '', ciudad: '', provincia: '', codigoPostal: '', pais: 'España',
}

function Field({ label, id, type = 'text', value, onChange, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">
        {label}{required && <span className="text-brand-500 ml-0.5">*</span>}
      </label>
      {children ?? (
        <input
          id={id} name={id} type={type} value={value} onChange={onChange} required={required}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
        />
      )}
    </div>
  )
}

function SectionTitle({ children }) {
  return <h2 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">{children}</h2>
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
  const [shippingMethod, setShippingMethod] = useState('estandar')
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')

  const handleField = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const shippingCost = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price ?? 0
  const total = subtotal + shippingCost

  const handleSubmit = (e) => {
    e.preventDefault()
    const orderNumber = `CYL-${Math.floor(10000000 + Math.random() * 90000000)}`
    const paymentLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label ?? paymentMethod
    const shippingLabel = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.label ?? shippingMethod

    clearCart()
    navigate('/confirmacion', {
      state: {
        order: {
          number: orderNumber,
          items,
          subtotal,
          shippingCost,
          total,
          shippingMethod: shippingLabel,
          paymentMethod: paymentLabel,
          customer: form,
        },
      },
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 mb-4">No hay productos en el carrito.</p>
        <a href="/carrito" className="btn-primary">Volver al carrito</a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <ProgressBar currentStep={1} />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-7">
            <div>
              <SectionTitle>Datos del cliente</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre" id="nombre" value={form.nombre} onChange={handleField} required />
                <Field label="Apellidos" id="apellidos" value={form.apellidos} onChange={handleField} required />
                <Field label="Correo electrónico" id="email" type="email" value={form.email} onChange={handleField} required />
                <Field label="Teléfono" id="telefono" type="tel" value={form.telefono} onChange={handleField} required />
              </div>
            </div>

            <div>
              <SectionTitle>Dirección de envío</SectionTitle>
              <div className="space-y-4">
                <Field label="Dirección" id="direccion" value={form.direccion} onChange={handleField} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Ciudad" id="ciudad" value={form.ciudad} onChange={handleField} required />
                  <Field label="Código postal" id="codigoPostal" value={form.codigoPostal} onChange={handleField} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Provincia" id="provincia" required>
                    <select
                      id="provincia" name="provincia" value={form.provincia} onChange={handleField} required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition bg-white"
                    >
                      <option value="">Selecciona...</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="País" id="pais" value={form.pais} onChange={handleField} required />
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Método de envío</SectionTitle>
              <ShippingMethodSelector value={shippingMethod} onChange={setShippingMethod} />
            </div>

            <div>
              <SectionTitle>Método de pago</SectionTitle>
              <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
              <p className="mt-3 text-xs text-gray-400">
                * Esto es un prototipo. No se procesarán pagos reales.
              </p>
            </div>

            <button type="submit" className="w-full btn-primary py-3 text-base">
              Confirmar pedido — {total.toFixed(2)} €
            </button>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
            <OrderSummary items={items} shippingMethod={shippingMethod} />
          </div>
        </div>
      </form>
    </div>
  )
}
