import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-contrast text-white mt-auto pt-16 pb-8 border-t border-contrast-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight text-white mb-4 block">
              CyL Complementos
            </Link>
            <p className="text-contrast-light text-sm leading-relaxed mb-6">
              Tu tienda especializada en bolsos, maletas y complementos de moda en Castilla y León. Diseños exclusivos para cada ocasión.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-contrast-light hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-contrast-light hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tienda</h3>
            <ul className="space-y-3">
              <li><Link to="/novedades" className="text-contrast-light hover:text-white transition-colors text-sm">Novedades</Link></li>
              <li><Link to="/mujer" className="text-contrast-light hover:text-white transition-colors text-sm">Mujer</Link></li>
              <li><Link to="/hombre" className="text-contrast-light hover:text-white transition-colors text-sm">Hombre</Link></li>
              <li><Link to="/viaje" className="text-contrast-light hover:text-white transition-colors text-sm">Equipaje</Link></li>
              <li><Link to="/outlet" className="text-contrast-light hover:text-white transition-colors text-sm">Outlet</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Ayuda</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-contrast-light hover:text-white transition-colors text-sm">Contacto</a></li>
              <li><a href="#" className="text-contrast-light hover:text-white transition-colors text-sm">Envíos y devoluciones</a></li>
              <li><a href="#" className="text-contrast-light hover:text-white transition-colors text-sm">Preguntas frecuentes</a></li>
              <li><a href="#" className="text-contrast-light hover:text-white transition-colors text-sm">Términos y condiciones</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Únete al club</h3>
            <p className="text-contrast-light text-sm mb-4">
              Suscríbete para recibir novedades exclusivas y un 10% dto en tu primera compra.
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none transition-all"
                required
              />
              <button 
                type="submit" 
                className="text-white bg-brand-600 hover:bg-brand-500 focus:ring-4 focus:ring-brand-500/30 font-medium rounded-lg text-sm px-5 py-2.5 transition-all w-full sm:w-auto text-center"
              >
                Suscribir
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-contrast-light">
            &copy; {new Date().getFullYear()} CyL Complementos. Prototipo de rediseño.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-contrast-light">Pago seguro garantizado</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
