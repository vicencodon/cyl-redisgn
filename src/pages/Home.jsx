import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeaturedProducts } from '../data/products'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ui/ProductCard'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 14) return 'Buenos días'
  if (h < 21) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Home() {
  const { isLoggedIn, user } = useAuth()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts().then((prods) => {
      setFeatured(prods)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-50 border-b border-brand-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          {isLoggedIn ? (
            <p className="text-brand-600 font-medium text-lg mb-2">
              {getGreeting()}, {user.firstName} 👋
            </p>
          ) : null}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Tu tienda de <span className="text-brand-600">complementos</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Bolsos, maletas, cinturones y mucho más. Descubre nuestra colección.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/novedades" className="btn-primary">Ver novedades</Link>
            <Link to="/outlet" className="btn-secondary">Outlet</Link>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="section-title">Destacados</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-square animate-pulse" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Secciones */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="section-title">Explorar por sección</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { slug: 'viaje',        label: 'Viaje',        emoji: '🧳' },
              { slug: 'mujer',        label: 'Mujer',        emoji: '👜' },
              { slug: 'hombre',       label: 'Hombre',       emoji: '💼' },
              { slug: 'complementos', label: 'Complementos', emoji: '☂️' },
              { slug: 'novedades',    label: 'Novedades',    emoji: '✨' },
              { slug: 'outlet',       label: 'Outlet',       emoji: '🏷️' },
            ].map(({ slug, label, emoji }) => (
              <Link
                key={slug}
                to={`/${slug}`}
                className="flex flex-col items-center justify-center gap-2 py-8 bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-200 rounded-xl transition-colors"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
