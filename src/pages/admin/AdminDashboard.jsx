import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function StatCard({ label, value, sub, color = 'brand', to }) {
  const colors = {
    brand: 'bg-brand-600',
    green: 'bg-green-500',
    blue:  'bg-blue-500',
    amber: 'bg-amber-500',
  }
  const card = (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-9 h-1 rounded-full ${colors[color]} mb-4`} />
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

function OrderRow({ order }) {
  const STATUS = {
    pending:   { label: 'Pendiente',  cls: 'bg-amber-50 text-amber-700' },
    shipped:   { label: 'Enviado',    cls: 'bg-blue-50 text-blue-700' },
    delivered: { label: 'Entregado',  cls: 'bg-green-50 text-green-700' },
    cancelled: { label: 'Cancelado',  cls: 'bg-red-50 text-red-600' },
  }
  const s = STATUS[order.status] ?? STATUS.pending
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-4 text-xs text-gray-400 font-mono">{order.id.slice(0, 8)}…</td>
      <td className="py-3 px-4 text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString('es-ES')}</td>
      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{Number(order.total).toFixed(2)} €</td>
      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
      </td>
    </tr>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, total, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('total'),
      supabase.from('user_roles').select('id', { count: 'exact', head: true }),
    ]).then(([products, orders, allOrders, users]) => {
      const revenue = (allOrders.data ?? []).reduce((s, o) => s + Number(o.total ?? 0), 0)
      setStats({
        products: products.count ?? 0,
        orders: allOrders.data?.length ?? 0,
        users: users.count ?? '—',
        revenue,
      })
      setRecentOrders(orders.data ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
        <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Productos" value={stats.products} sub="en catálogo" color="brand" to="/admin/productos" />
        <StatCard label="Pedidos totales" value={stats.orders} color="blue" to="/admin/pedidos" />
        <StatCard label="Ingresos" value={`${stats.revenue.toFixed(0)} €`} color="green" />
        <StatCard label="Usuarios" value={stats.users} color="amber" to="/admin/usuarios" />
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Últimos pedidos</h2>
          <Link to="/admin/pedidos" className="text-xs text-brand-600 hover:underline">Ver todos</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Aún no hay pedidos</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="py-2 px-4 font-medium">ID</th>
                <th className="py-2 px-4 font-medium">Fecha</th>
                <th className="py-2 px-4 font-medium">Total</th>
                <th className="py-2 px-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => <OrderRow key={o.id} order={o} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
