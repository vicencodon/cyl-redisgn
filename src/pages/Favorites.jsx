import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ui/ProductCard'

export default function Favorites() {
  const { isLoggedIn } = useAuth()
  const { favorites, toggleFavorite, loading: favLoading } = useFavorites()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const navigate = useNavigate()

  // Redirigir si no está logueado
  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])

  // Cargar productos favoritos desde Supabase
  useEffect(() => {
    if (!favorites.length) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .in('id', favorites)
      .then(({ data }) => {
        setProducts(data?.map((p) => ({
          ...p,
          seccion:       p.section ? p.section.charAt(0).toUpperCase() + p.section.slice(1) : null,
          category:      p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : null,
          originalPrice: p.old_price ? Number(p.old_price) : null,
          inStock:       p.stock > 0,
          price:         Number(p.price),
          color: Array.isArray(p.attributes?.color) ? p.attributes.color[0] : (p.attributes?.color ?? null),
          ...(p.attributes ?? {}),
        })) ?? [])
        setLoading(false)
      })
  }, [favorites.join(',')])

  if (!isLoggedIn) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis favoritos</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">
              {products.length} producto{products.length !== 1 ? 's' : ''} guardado{products.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {products.length > 0 && (
          <Link to="/" className="btn-secondary text-sm py-2">
            Seguir comprando
          </Link>
        )}
      </div>

      {/* Estados */}
      {loading || favLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Aún no tienes favoritos</h2>
          <p className="text-sm text-gray-400 mb-6">
            Guarda los productos que más te gusten para encontrarlos fácilmente.
          </p>
          <Link to="/" className="btn-primary">Explorar productos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              {/* Botón quitar favorito */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 hover:bg-red-50"
                title="Quitar de favoritos"
              >
                <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
