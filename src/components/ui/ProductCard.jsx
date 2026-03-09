import { useState } from 'react'
import { Link } from 'react-router-dom'

const PLACEHOLDER = '/images/placeholder-product.svg'

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false)
  const imageSrc = !imgError && product.images?.length > 0 ? product.images[0] : null

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group block bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-brand-600 text-white text-xs font-medium px-2 py-0.5 rounded">
              Nuevo
            </span>
          )}
          {product.isOutlet && (
            <span className="bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded">
              Outlet
            </span>
          )}
        </div>
      </div>
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
