import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

const SECTIONS = ['viaje', 'mujer', 'hombre', 'complementos', 'novedades', 'outlet']
const EMPTY = {
  id: '', slug: '', name: '', brand: '', section: 'viaje', category: '', subcategory: '',
  price: '', old_price: '', stock: '', short_description: '', description: '',
  is_new: false, is_outlet: false, is_featured: false,
}

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Modal de formulario ──────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const isNew = !product?.id
  const [form, setForm] = useState(isNew ? EMPTY : {
    ...EMPTY, ...product,
    price: product.price ?? '',
    old_price: product.old_price ?? '',
    stock: product.stock ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.section) {
      setError('Nombre, precio y sección son obligatorios'); return
    }
    setSaving(true); setError(null)
    const payload = {
      ...form,
      id:        form.id || `prod-${Date.now()}`,
      slug:      form.slug || slugify(form.name + '-' + form.brand),
      price:     Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      stock:     Number(form.stock) || 0,
    }
    const { error: err } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', payload.id)
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  const Input = ({ label, field, type = 'text', half }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isNew ? 'Nuevo producto' : 'Editar producto'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre *" field="name" />
            <Input label="Marca" field="brand" half />
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Sección *</label>
              <select value={form.section} onChange={(e) => set('section', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
                {SECTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <Input label="Categoría" field="category" half />
            <Input label="Subcategoría" field="subcategory" half />
            <Input label="Slug (URL)" field="slug" half />
            <Input label="Precio (€) *" field="price" type="number" half />
            <Input label="Precio anterior (€)" field="old_price" type="number" half />
            <Input label="Stock" field="stock" type="number" half />
            <Input label="Descripción corta" field="short_description" />
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Descripción completa</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            </div>
            {/* Flags */}
            <div className="col-span-2 flex gap-6">
              {[['is_new', 'Nuevo'], ['is_outlet', 'Outlet'], ['is_featured', 'Destacado']].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)}
                    className="w-4 h-4 accent-brand-600" />
                  <span className="text-sm text-gray-700">{l}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm py-2">Cancelar</button>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary text-sm py-2 disabled:opacity-60">
            {saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [section, setSection]   = useState('all')
  const [modal, setModal]       = useState(null)  // null | 'new' | product

  const load = useCallback(() => {
    setLoading(true)
    supabase.from('products').select('*').order('section').then(({ data }) => {
      setProducts(data ?? [])
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  const filtered = products.filter((p) => {
    const matchS = section === 'all' || p.section === section
    const matchQ = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
    return matchS && matchQ
  })

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} productos en catálogo</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary text-sm py-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input type="text" placeholder="Buscar por nombre o marca…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-400" />
        <div className="flex gap-1 flex-wrap">
          {['all', ...SECTIONS].map((s) => (
            <button key={s} onClick={() => setSection(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                section === s ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {s === 'all' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No hay productos que coincidan</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3 hidden md:table-cell">Sección</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3 hidden lg:table-cell">Stock</th>
                <th className="px-5 py-3 hidden lg:table-cell">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 leading-tight">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{p.section}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    {Number(p.price).toFixed(2)} €
                    {p.old_price && <span className="text-xs text-gray-400 line-through ml-1">{Number(p.old_price).toFixed(2)} €</span>}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className={`text-xs font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 4 ? 'text-amber-500' : 'text-green-600'}`}>
                      {p.stock} ud.
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {p.is_new     && <span className="text-xs bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded">Nuevo</span>}
                      {p.is_outlet  && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Outlet</span>}
                      {p.is_featured && <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">Dest.</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setModal(p)}
                        className="text-xs text-gray-500 hover:text-brand-600 px-2 py-1 rounded hover:bg-brand-50 transition-colors">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
