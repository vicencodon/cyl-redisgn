export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-sm font-semibold text-gray-800">CyL Complementos</p>
        <p className="mt-1 text-sm text-gray-500">
          Tu tienda de complementos de moda en Castilla y León.
        </p>
        <p className="mt-4 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} CyL Complementos. Prototipo de rediseño.
        </p>
      </div>
    </footer>
  )
}
