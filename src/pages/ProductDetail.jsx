import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProductBySlug, fetchRelatedProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ui/ProductCard'

export default function ProductDetail() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded]     = useState(false)
  const [quantity, setQuantity] = useState(1)
  
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center' })

  useEffect(() => {
    setLoading(true)
    fetchProductBySlug(slug).then((p) => {
      setProduct(p)
      if (p) {
        fetchRelatedProducts(p).then(setRecommended)
      }
      setLoading(false)
      setActiveImageIndex(0)
    })
  }, [slug])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/carrito')
  }

  const handleFavorite = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    toggleFavorite(product.id)
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({ transformOrigin: `${x}% ${y}%` })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/4" />
            <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-8 bg-gray-100 rounded animate-pulse w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Producto no encontrado</h1>
        <p className="text-gray-500 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    )
  }

  const sectionSlug = product.section?.toLowerCase() ?? null
  const fav = isFavorite(product.id)

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
        {/* Galería de Imágenes */}
        <div className="flex flex-col gap-4">
          <div 
            className="relative aspect-[4/5] sm:aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden group cursor-crosshair shadow-sm border border-gray-100"
            onMouseMove={handleMouseMove}
          >
            {product.images?.[activeImageIndex] || product.image ? (
              <img
                src={product.images?.[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.8]"
                style={zoomStyle}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <span className="text-gray-300 text-sm">Sin imagen</span>
            )}
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold tracking-wide px-2.5 py-1 rounded shadow-sm z-10 pointer-events-none">
                NUEVO
              </span>
            )}
            {product.isOutlet && (
              <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold tracking-wide px-2.5 py-1 rounded shadow-sm z-10 pointer-events-none">
                OUTLET
              </span>
            )}
            {/* Botón favorito */}
            <button
              onClick={handleFavorite}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10 focus:outline-none"
              aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <svg className={`w-5 h-5 ${fav ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {/* Miniaturas */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scroll-bar">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-brand-600 shadow-sm' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover bg-gray-50" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
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
            <p className="mt-4 text-sm text-gray-600">{product.shortDescription}</p>
          )}

          {(product.category || product.tipo) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.category && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
              )}
              {product.tipo && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {product.tipo}
                </span>
              )}
            </div>
          )}

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
                onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                disabled={quantity >= product.stock}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
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
              {!product.inStock ? 'No disponible' : added ? '✓ Añadido al carrito' : 'Añadir al carrito'}
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

      {/* Descripción completa */}
      {product.description && (
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción del producto</h2>
          <div className="prose prose-sm md:prose-base text-gray-600 max-w-none">
            {product.description.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* Productos Recomendados */}
      {recommended.length > 0 && (
        <div className="mt-20 border-t border-gray-100 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">También te podría interesar...</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {recommended.map(rec => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
