import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import ProductImage from '../../components/ui/ProductImage'

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
const ModalInput = ({ label, value, onChange, type = 'text', half }) => (
  <div className={half ? 'col-span-1' : 'col-span-2'}>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
    />
  </div>
)

const SelectOrInput = ({ label, value, onChange, options, half }) => {
  const isCustom = value && !options.includes(value);
  const [mode, setMode] = useState(isCustom ? 'input' : 'select');

  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="flex justify-between items-end text-xs font-medium text-gray-600 mb-1">
        <span>{label}</span>
        <button 
          type="button" 
          onClick={() => {
            setMode(mode === 'select' ? 'input' : 'select');
            onChange({ target: { value: '' } });
          }} 
          className="text-brand-600 hover:text-brand-700 hover:underline text-[10px] uppercase font-bold tracking-wider"
          tabIndex="-1"
        >
          {mode === 'select' ? '+ Nueva' : '‹ Lista'}
        </button>
      </label>
      {mode === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="">-- Seleccionar --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Escribe..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      )}
    </div>
  );
};

function ProductModal({ product, products = [], onClose, onSaved }) {
  const isNew = !product?.id
  const [form, setForm] = useState(isNew ? EMPTY : {
    ...EMPTY, ...product,
    price: product.price ?? '',
    old_price: product.old_price ?? '',
    stock: product.stock ?? '',
    images: product.images || [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const uniqueSections = [...new Set([...SECTIONS, ...products.map(p => p.section).filter(Boolean)])]
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))].sort()
  const uniqueSubcategories = [...new Set(products.filter(p => !form.category || p.category === form.category).map(p => p.subcategory).filter(Boolean))].sort()

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setForm(f => ({ ...f, images: [...(f.images || []), newImageUrl.trim()] }));
    setNewImageUrl('');
  }

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (validFiles.length === 0) return
    
    setUploading(true)
    setError(null) // Reset error before uploading
    const newUrls = []
    
    for (const file of validFiles) {
      // Forzar extensión .jpg para Supabase (como en AdminImages)
      const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
      const path = `products/${fileName}`
      
      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { contentType: file.type, upsert: true })
        
      if (!uploadErr) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path)
        newUrls.push(data.publicUrl)
      } else {
        setError(`Error al subir imagen: ${uploadErr.message}`)
        console.error('Error al subir la imagen:', uploadErr)
      }
    }
    
    setForm(f => ({ ...f, images: [...(f.images || []), ...newUrls] }))
    setUploading(false)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveImage = (index) => {
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== index)
    }));
  }

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
            <ModalInput label="Nombre *" value={form.name} onChange={(e) => set('name', e.target.value)} />
            <ModalInput label="Marca" value={form.brand} onChange={(e) => set('brand', e.target.value)} half />
            <SelectOrInput label="Sección *" value={form.section} onChange={(e) => set('section', e.target.value)} options={uniqueSections} half />
            <SelectOrInput label="Categoría" value={form.category} onChange={(e) => set('category', e.target.value)} options={uniqueCategories} half />
            <SelectOrInput label="Subcategoría" value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} options={uniqueSubcategories} half />
            <ModalInput label="Slug (URL)" value={form.slug} onChange={(e) => set('slug', e.target.value)} half />
            <ModalInput label="Precio (€) *" value={form.price} onChange={(e) => set('price', e.target.value)} type="number" half />
            <ModalInput label="Precio anterior (€)" value={form.old_price} onChange={(e) => set('old_price', e.target.value)} type="number" half />
            <ModalInput label="Stock" value={form.stock} onChange={(e) => set('stock', e.target.value)} type="number" half />
            <ModalInput label="Descripción corta" value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Descripción completa</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            </div>
            {/* Images */}
            <div className="col-span-2 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <label className="block text-sm font-medium text-gray-800 mb-3">Imágenes del producto</label>
              
              <div 
                className={`relative border-2 border-dashed rounded-xl p-6 mb-4 text-center transition-colors ${
                  isDragging ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => handleFiles(e.target.files)}
                  disabled={uploading}
                  className={`absolute inset-0 w-full h-full opacity-0 ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  title="Haz clic o arrastra imágenes"
                />
                {uploading ? (
                  <div className="mx-auto h-8 w-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mb-2" />
                ) : (
                  <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <p className="text-sm font-medium text-gray-700">
                  {uploading ? (
                    <span className="text-brand-600">Subiendo imágenes...</span>
                  ) : (
                    <><span className="text-brand-600">Haz clic para subir</span> o arrastra y suelta</>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP hasta 5MB</p>
              </div>

              <div className="flex gap-2 items-center mb-4">
                <hr className="flex-1 border-gray-200" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">O usa un enlace web</span>
                <hr className="flex-1 border-gray-200" />
              </div>

              <div className="flex gap-2 mb-4">
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                />
                <button 
                  type="button" 
                  onClick={handleAddImage}
                  className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Añadir URL
                </button>
              </div>

              {form.images && form.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="group relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-white">
                      <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                        title="Eliminar imagen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-brand-600/90 text-white text-[10px] font-bold uppercase tracking-wider text-center py-1">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-400">No hay imágenes. Añade una URL arriba.</p>
                </div>
              )}
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
    let matchS = false
    if (section === 'all') {
      matchS = true
    } else if (section === 'novedades') {
      matchS = p.is_new
    } else if (section === 'outlet') {
      matchS = p.is_outlet
    } else {
      matchS = p.section === section
    }
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
                <th className="px-5 py-3 w-16">Img</th>
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
                    <div className="relative group w-10 h-10">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                        <ProductImage productId={p.id} section={p.section} imageUrl={p.images?.[0] || p.image} className="w-full h-full" />
                      </div>
                      
                      {/* Hover image */}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block z-50 pointer-events-none">
                        <div className="w-64 h-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                          <ProductImage productId={p.id} section={p.section} imageUrl={p.images?.[0] || p.image} size="detail" className="w-full h-full" />
                        </div>
                      </div>
                    </div>
                  </td>
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
          products={products}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
