import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/categoria/${category.slug}`}
      className="group block bg-white border border-gray-100 rounded-lg p-6 hover:shadow-md hover:border-brand-200 transition-all duration-200"
    >
      <div className="w-10 h-10 bg-brand-100 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-brand-600 text-lg font-semibold">
          {category.name.charAt(0)}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">
        {category.name}
      </h3>
      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{category.description}</p>
    </Link>
  )
}
