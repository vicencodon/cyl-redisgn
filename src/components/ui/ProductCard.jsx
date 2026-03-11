import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group block bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <ProductImage
        productId={product.id}
        productName={product.name}
        section={product.section}
          updatedAt={product.image_updated_at} 
        size="card"
      />
      <div className="p-3">
        {product.brand && (
          <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
        )}
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-brand-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-brand-700 font-semibold text-sm">
            {product.price.toFixed(2)} €
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {product.originalPrice.toFixed(2)} €
            </span>
          )}
          {!product.inStock && (
            <span className="text-xs text-gray-400 ml-auto">Agotado</span>
          )}
        </div>
      </div>
    </Link>
  )
}
