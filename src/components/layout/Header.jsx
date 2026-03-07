import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/viaje', label: 'Viaje' },
  { to: '/mujer', label: 'Mujer' },
  { to: '/hombre', label: 'Hombre' },
  { to: '/complementos', label: 'Complementos' },
  { to: '/novedades', label: 'Novedades' },
  { to: '/outlet', label: 'Outlet' },
]

function UserMenu() {
  const { isLoggedIn, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  if (!isLoggedIn) {
    return (
      <Link
        to="/login"
        className="p-2 text-gray-600 hover:text-brand-700 transition-colors"
        aria-label="Iniciar sesión"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 p-2 text-gray-600 hover:text-brand-700 transition-colors"
        aria-label="Mi cuenta"
      >
        <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
          {user.firstName.charAt(0).toUpperCase()}
        </div>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              Mis pedidos
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              Mi perfil
            </button>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-semibold text-brand-700 tracking-tight">
            CyL Complementos
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-brand-700 font-medium text-sm'
                    : 'text-gray-600 hover:text-brand-700 text-sm transition-colors'
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <UserMenu />

            <Link
              to="/carrito"
              className="relative p-2 text-gray-600 hover:text-brand-700 transition-colors"
              aria-label="Carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-gray-600 hover:text-brand-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-2 py-2 text-sm text-gray-700 hover:text-brand-700"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/carrito"
              className="px-2 py-2 text-sm text-gray-700 hover:text-brand-700 flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              Carrito
              {totalItems > 0 && (
                <span className="bg-brand-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {totalItems}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <button
                className="px-2 py-2 text-sm text-left text-red-600 hover:text-red-700"
                onClick={() => { logout(); navigate('/'); setMenuOpen(false) }}
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="px-2 py-2 text-sm text-gray-700 hover:text-brand-700"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
