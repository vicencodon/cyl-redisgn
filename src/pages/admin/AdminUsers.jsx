import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminUsers() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    // Obtiene usuarios desde las orders (los que han comprado)
    // y desde user_roles (los que se han registrado)
    supabase
      .from('user_roles')
      .select('user_id, role')
      .then(async ({ data: roles }) => {
        // Para cada user_id, buscar sus pedidos
        const usersWithOrders = await Promise.all(
          (roles ?? []).map(async (r) => {
            const { data: orders } = await supabase
              .from('orders')
              .select('id, total, created_at')
              .eq('user_id', r.user_id)
              .order('created_at', { ascending: false })
            return {
              id: r.user_id,
              role: r.role,
              orders: orders ?? [],
              totalSpent: (orders ?? []).reduce((s, o) => s + Number(o.total ?? 0), 0),
              lastOrder: orders?.[0]?.created_at ?? null,
            }
          })
        )
        setUsers(usersWithOrders)
        setLoading(false)
      })
  }, [])

  const filtered = users.filter((u) =>
    !search || u.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-sm text-gray-400 mt-0.5">{users.length} usuarios registrados</p>
      </div>

      <div className="mb-5">
        <input type="text" placeholder="Buscar por ID…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No hay usuarios registrados aún</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">ID usuario</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3 hidden md:table-cell">Pedidos</th>
                <th className="px-5 py-3 hidden md:table-cell">Total gastado</th>
                <th className="px-5 py-3 hidden lg:table-cell">Último pedido</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{u.id.slice(0, 16)}…</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      u.role === 'admin' ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-700">{u.orders.length}</td>
                  <td className="px-5 py-3 hidden md:table-cell font-semibold text-gray-900">{u.totalSpent.toFixed(2)} €</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-xs">
                    {u.lastOrder ? new Date(u.lastOrder).toLocaleDateString('es-ES') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        * Los datos de email y nombre están gestionados por Supabase Auth y solo son accesibles desde el panel de Supabase &gt; Authentication.
      </p>
    </div>
  )
}
