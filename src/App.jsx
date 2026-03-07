import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import SectionPage from './pages/SectionPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Register from './pages/Register'

const SECTIONS = ['viaje', 'mujer', 'hombre', 'complementos', 'novedades', 'outlet']

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        {SECTIONS.map((slug) => (
          <Route key={slug} path={`/${slug}`} element={<SectionPage key={slug} />} />
        ))}

        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/carrito"        element={<Cart />} />
        <Route path="/checkout"       element={<Checkout />} />
        <Route path="/confirmacion"   element={<OrderConfirmation />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/registro"       element={<Register />} />

        <Route
          path="*"
          element={
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
              <h1 className="text-2xl font-semibold text-gray-800 mb-3">Página no encontrada</h1>
              <p className="text-gray-500">La dirección que buscas no existe.</p>
            </div>
          }
        />
      </Routes>
    </Layout>
  )
}
