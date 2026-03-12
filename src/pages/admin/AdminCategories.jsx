import { useState } from 'react'

const initialCategories = [
  {
    id: 'bolsos',
    name: 'Bolsos',
    slug: 'bolsos',
    description: 'Bolsos de mano, bandoleras y mochilas para cada ocasión.',
    subcategories: ['Bolsos de mano', 'Bandoleras', 'Mochilas', 'Clutches'],
  },
  {
    id: 'cinturones',
    name: 'Cinturones',
    slug: 'cinturones',
    description: 'Cinturones de piel y sintéticos para hombre y mujer.',
    subcategories: ['Piel', 'Sintético', 'Elástico'],
  },
  {
    id: 'monederos',
    name: 'Monederos y Carteras',
    slug: 'monederos',
    description: 'Monederos, carteras y tarjeteros.',
    subcategories: ['Monederos', 'Carteras', 'Tarjeteros'],
  },
  {
    id: 'bisuteria',
    name: 'Bisutería',
    slug: 'bisuteria',
    description: 'Collares, pulseras, pendientes y anillos.',
    subcategories: ['Collares', 'Pulseras', 'Pendientes', 'Anillos'],
  },
]

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function CategoryModal({ category, onClose, onSave }) {
  const isNew = !category?.id
  const [form, setForm] = useState(isNew ? { name: '', slug: '', description: '', subcategories: '' } : {
    ...category,
    subcategories: category.subcategories.join(', ')
  })
  
  const [error, setError] = useState(null)

  const handleSubmit = () => {
    if (!form.name) {
      setError('El nombre es obligatorio')
      return
    }

    const subcats = form.subcategories.split(',')
      .map(s => s.trim())
      .filter(Boolean)

    onSave({
      ...form,
      id: form.id || `cat-${Date.now()}`,
      slug: form.slug || slugify(form.name),
      subcategories: subcats
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isNew ? 'Nueva categoría' : 'Editar categoría'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug (URL)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="Se generará si se deja en blanco"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subcategorías (separadas por coma)</label>
              <textarea value={form.subcategories} onChange={(e) => setForm({ ...form, subcategories: e.target.value })} rows={3}
                placeholder="Ej: Mochilas, Bandoleras, Bolsos de mano"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            </div>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button onClick={onClose} className="btn-secondary text-sm py-2">Cancelar</button>
          <button onClick={handleSubmit} className="btn-primary text-sm py-2">{isNew ? 'Crear categoría' : 'Guardar cambios'}</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta categoría?')) {
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  const handleSave = (category) => {
    if (categories.find(c => c.id === category.id)) {
      setCategories(categories.map(c => c.id === category.id ? category : c))
    } else {
      setCategories([...categories, category])
    }
    setModal(null)
  }

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.subcategories.some(sub => sub.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías y Subcategorías</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona la estructura de tu catálogo</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary text-sm py-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nueva categoría
        </button>
      </div>

      <div className="mb-5">
        <input type="text" placeholder="Buscar por categoría o subcategoría..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No hay categorías que coincidan</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3 hidden md:table-cell">Subcategorías</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.slug}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.subcategories.length > 0 ? c.subcategories.map(sub => (
                        <span key={sub} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full border border-gray-200">
                          {sub}
                        </span>
                      )) : (
                        <span className="text-gray-400 text-xs italic">Ninguna</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setModal(c)}
                        className="text-xs text-gray-500 hover:text-brand-600 px-2 py-1 rounded hover:bg-brand-50 transition-colors">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(c.id)}
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

      {modal && (
        <CategoryModal
          category={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
