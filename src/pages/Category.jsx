import { useParams, Link } from 'react-router-dom'
import { getCategoryBySlug } from '../data/mockCategories'
import { getProductsByCategory } from '../data/mockProducts'
import ProductCard from '../components/ui/ProductCard'

export default function Category() {
  const { slug } = useParams()
  const category = getCategoryBySlug(slug)

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Categoría no encontrada</h1>
        <p className="text-gray-500 mb-6">La categoría que buscas no existe o ha sido eliminada.</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    )
  }

  const products = getProductsByCategory(slug)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-brand-700 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-gray-700">{category.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-500">{category.description}</p>
        )}
      </header>

      {category.subcategories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-brand-600 text-white">
            Todos
          </button>
          {category.subcategories.map((sub) => (
            <button
              key={sub}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-400">
          <p className="text-sm">No hay productos disponibles en esta categoría todavía.</p>
        </div>
      )}
    </div>
  )
}
