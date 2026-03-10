import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useImageUpload } from '../../hooks/useImageUpload'
import { getProductImageUrl } from '../../components/ui/ProductImage'

// ── Sección badge ────────────────────────────────────────────────────────────
const SECTION_COLORS = {
  viaje:        'bg-blue-50 text-blue-600',
  mujer:        'bg-pink-50 text-pink-600',
  hombre:       'bg-slate-100 text-slate-600',
  complementos: 'bg-amber-50 text-amber-600',
  novedades:    'bg-green-50 text-green-600',
  outlet:       'bg-red-50 text-red-600',
}

function SectionBadge({ section }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${SECTION_COLORS[section] ?? 'bg-gray-100 text-gray-500'}`}>
      {section}
    </span>
  )
}

// ── Tarjeta de producto con zona de drop ─────────────────────────────────────
function ProductCard({ product, onUploaded }) {
  const { uploadImage, deleteImage, uploading, error } = useImageUpload()
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [success, setSuccess]   = useState(false)
  const inputRef = useRef(null)

  // Cargar preview desde Supabase al montar
  useEffect(() => {
    const url = getProductImageUrl(product.id)
    if (url) {
      // Verificar si la imagen existe realmente
      fetch(url, { method: 'HEAD' })
        .then((r) => { if (r.ok) setPreview(url) })
        .catch(() => {})
    }
  }, [product.id])

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    // Preview local inmediato
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
    // Subir a Supabase
    const url = await uploadImage(file, product.id)
    if (url) {
      setPreview(url)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      onUploaded?.(product.id, url)
    }
  }, [product.id, uploadImage, onUploaded])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleDelete = async () => {
    await deleteImage(product.id)
    setPreview(null)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Zona de imagen / drop */}
      <div
        className={`relative aspect-square cursor-pointer transition-all ${
          dragging ? 'ring-2 ring-brand-400 bg-brand-50' : 'bg-gray-50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {preview ? (
          <img
            src={preview}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.043 11.095H6.75z" />
            </svg>
            <p className="text-xs font-medium">
              {dragging ? 'Suelta aquí' : 'Arrastra o haz clic'}
            </p>
          </div>
        )}

        {/* Overlay de carga */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Tick de éxito */}
        {success && (
          <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        )}

        {/* Botón borrar */}
        {preview && !uploading && (
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete() }}
            className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center shadow transition-colors"
            title="Eliminar imagen"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Info del producto */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </p>
          <SectionBadge section={product.section} />
        </div>
        <p className="text-xs text-gray-400">{product.brand}</p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  )
}

// ── Panel principal ──────────────────────────────────────────────────────────
export default function AdminImages() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [section, setSection]     = useState('all')
  const [uploadedCount, setUploadedCount] = useState(0)

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, brand, section, images')
      .order('section')
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
        setUploadedCount((data ?? []).filter((p) => p.images?.length > 0).length)
      })
  }, [])

  const handleUploaded = (productId) => {
    setProducts((prev) =>
      prev.map((p) => p.id === productId ? { ...p, images: ['uploaded'] } : p)
    )
    setUploadedCount((c) => c + 1)
  }

  const sections = ['all', ...new Set(products.map((p) => p.section))]

  const filtered = products.filter((p) => {
    const matchSection = section === 'all' || p.section === section
    const matchSearch  = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchSection && matchSearch
  })

  const withImage    = filtered.filter((p) => p.images?.length > 0).length
  const withoutImage = filtered.filter((p) => !p.images?.length).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Gestión de imágenes</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {uploadedCount} de {products.length} productos con imagen
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xs">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${products.length ? (uploadedCount / products.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {products.length ? Math.round((uploadedCount / products.length) * 100) : 0}%
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> {withImage} con imagen
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block ml-2" /> {withoutImage} sin imagen
          </div>
        </div>

        {/* Filtros */}
        <div className="max-w-7xl mx-auto px-6 pb-4 flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 w-52"
          />
          <div className="flex gap-1 flex-wrap">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  section === s
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-square bg-gray-100 animate-pulse" />
                <div className="p-3 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm">No hay productos que coincidan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onUploaded={handleUploaded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
