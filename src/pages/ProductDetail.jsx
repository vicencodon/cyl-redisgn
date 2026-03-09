import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductBySlug, getRelatedProducts } from '../data/mockProducts'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ui/ProductCard'

const ATTRIBUTE_LABELS = {
  tipo: 'Tipo',
  material: 'Material',
  tamaño: 'Tamaño',
  color: 'Color',
  tipoCartera: 'Tipo de cartera',
  tipoCalzado: 'Tipo de calzado',
  tipoCinturon: 'Tipo de cinturón',
  tipoPortadoc: 'Tipo',
  tipoParaguas: 'Tipo',
  tipoRegalo: 'Tipo',
}

function ImageGallery({ images, name, isNew, isOutlet }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imgErrors, setImgErrors] = useState({})

  const validImages = (images ?? []).filter((_, i) => !imgErrors[i])
  const currentSrc = validImages.length > 0
    ? images[selectedIndex] && !imgErrors[selectedIndex]
      ? images[selectedIndex]
      : validImages[0]
    : null

  const handleError = (index) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => handleError(selectedIndex)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Sin imagen</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="bg-brand-600 text-white text-xs font-medium px-2 py-0.5 rounded">
              Nuevo
            </span>
          )}
          {isOutlet && (
            <span className="bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded">
              Outlet
            </span>
          )}
        </div>
      </div>

      {images && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) =>
            imgErrors[i] ? null : (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === selectedIndex ? 'border-brand-600' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={src}
                  alt={`${name} ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleError(i)}
                  loading="lazy"
                />
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

function ProductAttributes({ product }) {
  const displayAttrs = []

  if (product.category) {
    displayAttrs.push({ label: 'Categoría', value: product.category })
  }

  for (const [key, label] of Object.entries(ATTRIBUTE_LABELS)) {
    const val = product[key]
    if (val != null && val !== '') {
      displayAttrs.push({ label, value: val })
    }
  }

  if (displayAttrs.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Características</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        {displayAttrs.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs text-gray-400">{label}</dt>
            <dd className="text-sm text-gray-700">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const related = useMemo(() => getRelatedProducts(product, 4), [product])

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Producto no encontrado</h1>
        <p className="text-gray-500 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    )
  }

  const sectionSlug = product.seccion?.toLowerCase() ?? null

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/carrito')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-brand-700 transition-colors">Inicio</Link>
        <span>/</span>
        {sectionSlug && (
          <>
            <Link to={`/${sectionSlug}`} className="hover:text-brand-700 transition-colors capitalize">
              {product.seccion}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ImageGallery
          images={product.images}
          name={product.name}
          isNew={product.isNew}
          isOutlet={product.isOutlet}
        />

        <div>
          {product.brand && (
            <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-semibold text-brand-700">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
            {product.inStock ? (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                En stock
              </span>
            ) : (
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                Agotado
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          <ProductAttributes product={product} />

          <div className="mt-6">
            <label className="block text-xs font-medium text-gray-600 mb-2">Cantidad</label>
            <div className="flex items-center border border-gray-200 rounded-lg w-fit overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-10 text-center text-sm text-gray-700 select-none">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                added
                  ? 'bg-green-500 text-white'
                  : product.inStock
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {!product.inStock ? 'No disponible' : added ? 'Añadido al carrito' : 'Añadir al carrito'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full btn-secondary py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {product.description && (
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {product.description}
          </p>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Productos relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
