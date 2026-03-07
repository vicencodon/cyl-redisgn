import { Link } from 'react-router-dom'
import { getFeaturedProducts } from '../data/mockProducts'
import ProductCard from '../components/ui/ProductCard'

export default function Home() {
  const featured = getFeaturedProducts()

  return (
    <div>
      <section className="bg-brand-50 border-b border-brand-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Tu tienda de <span className="text-brand-600">complementos</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Bolsos, cinturones, bisutería y mucho más. Descubre nuestra colección.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/categoria/bolsos" className="btn-primary">
              Ver bolsos
            </Link>
            <Link to="/contacto" className="btn-secondary">
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
            <h2 className="section-title">Destacados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
