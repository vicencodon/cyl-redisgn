import { useState, useEffect, useRef } from 'react'
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
  const carouselRef = useRef(null)

  useEffect(() => {
    fetchFeaturedProducts().then((prods) => {
      setFeatured(prods)
      setLoading(false)
    })
  }, [])

  // Auto-scroll logic every 5 seconds
  useEffect(() => {
    if (featured.length === 0 || loading) return;
    
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 10
        
        if (isEnd) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          carouselRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' })
        }
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [featured.length, loading])

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -(carouselRef.current.clientWidth * 0.8), behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth * 0.8, behavior: 'smooth' })
    }
  }

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
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title mb-0">Destacados</h2>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-2">
                <button onClick={scrollLeft} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={scrollRight} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <Link to="/novedades" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 group">
                Ver todos
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scroll-bar">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[240px] md:min-w-[280px] shrink-0 snap-start">
                  <div className="bg-gray-200 rounded-lg aspect-square mb-3 animate-pulse" />
                  <div className="bg-gray-200 rounded h-4 w-3/4 animate-pulse mb-2" />
                  <div className="bg-gray-200 rounded h-4 w-1/4 animate-pulse" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="group relative -mx-4 px-4 sm:mx-0 sm:px-0">
              <div 
                ref={carouselRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scroll-smooth hide-scroll-bar"
              >
                {featured.map((product) => (
                  <div key={product.id} className="w-[65vw] min-w-[65vw] sm:w-[240px] sm:min-w-[240px] md:w-[280px] md:min-w-[280px] shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
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
