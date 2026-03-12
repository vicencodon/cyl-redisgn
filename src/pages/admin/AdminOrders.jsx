import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Pendiente',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'shipped',   label: 'Enviado',    cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'delivered', label: 'Entregado',  cls: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'cancelled', label: 'Cancelado',  cls: 'bg-red-50 text-red-600 border-red-200' },
]

function StatusBadge({ status, onChange }) {
  const s = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0]
  return (
    <select value={status} onChange={(e) => onChange(e.target.value)}
      className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${s.cls}`}>
      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function OrderDetail({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Pedido</h2>
            <p className="text-xs text-gray-400 font-mono">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-gray-400">Fecha</p><p className="font-medium">{new Date(order.created_at).toLocaleDateString('es-ES')}</p></div>
            <div><p className="text-xs text-gray-400">Total</p><p className="font-bold text-brand-700">{Number(order.total).toFixed(2)} €</p></div>
            <div><p className="text-xs text-gray-400">Envío</p><p className="font-medium">{order.shipping_method ?? '—'}</p></div>
            <div><p className="text-xs text-gray-400">Pago</p><p className="font-medium">{order.payment_method ?? '—'}</p></div>
          </div>
          {order.shipping_address && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Dirección de envío</p>
              <pre className="text-xs bg-gray-50 rounded-lg px-3 py-2 text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(order.shipping_address, null, 2)}
              </pre>
            </div>
          )}
          {order.order_items?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Artículos</p>
              <div className="space-y-1.5">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                    <span className="font-medium">{(Number(item.price) * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders.length} pedidos en total</p>
      </div>

      {/* Filtro estado */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ value: 'all', label: 'Todos' }, ...STATUS_OPTIONS].map((o) => (
          <button key={o.value} onClick={() => setFilter(o.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === o.value ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {o.label}
            <span className="ml-1.5 text-[10px] opacity-70">
              {o.value === 'all' ? orders.length : orders.filter((x) => x.status === o.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No hay pedidos</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3 hidden md:table-cell">Fecha</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Ver</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{o.id.slice(0, 8)}…</td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-600">{new Date(o.created_at).toLocaleDateString('es-ES')}</td>
                  <td className="px-5 py-3 font-semibold">{Number(o.total).toFixed(2)} €</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} onChange={(s) => updateStatus(o.id, s)} /></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelected(o)} className="text-xs text-brand-600 hover:underline">Ver detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
