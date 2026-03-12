import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminGuard from './components/admin/AdminGuard'

// Páginas públicas
import Home from './pages/Home'
import SectionPage from './pages/SectionPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
// Las páginas Category y Section fueron eliminadas (duplicadas)

// Páginas admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts  from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminImages    from './pages/admin/AdminImages'
import AdminOrders    from './pages/admin/AdminOrders'
import AdminUsers     from './pages/admin/AdminUsers'
import {
  SettingsHome,
  SettingsBanners,
  SettingsShipping,
  SettingsPayment,
  SettingsContact,
} from './pages/admin/AdminSettings'

const SECTIONS = ['viaje', 'mujer', 'hombre', 'complementos', 'novedades', 'outlet']

function AdminRoute({ children }) {
  return <AdminGuard>{children}</AdminGuard>
}

export default function App() {
  return (
    <Routes>
      {/* ── ADMIN (sin Layout público) ── */}
      <Route path="/admin/productos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/categorias" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/admin/imagenes" element={<AdminRoute><AdminImages /></AdminRoute>} />
      <Route path="/admin/pedidos" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/settings/home" element={<AdminRoute><SettingsHome /></AdminRoute>} />
      <Route path="/admin/settings/banners" element={<AdminRoute><SettingsBanners /></AdminRoute>} />
      <Route path="/admin/settings/envio" element={<AdminRoute><SettingsShipping /></AdminRoute>} />
      <Route path="/admin/settings/pago" element={<AdminRoute><SettingsPayment /></AdminRoute>} />
      <Route path="/admin/settings/contacto" element={<AdminRoute><SettingsContact /></AdminRoute>} />
      {/* ── TIENDA (con Layout público) ── */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      {SECTIONS.map((slug) => (
        <Route key={slug} path={`/${slug}`} element={<Layout><SectionPage /></Layout>} />
      ))}
      <Route path="/producto/:slug" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/carrito"        element={<Layout><Cart /></Layout>} />
      <Route path="/checkout"       element={<Layout><Checkout /></Layout>} />
      <Route path="/confirmacion"   element={<Layout><OrderConfirmation /></Layout>} />
      <Route path="/login"          element={<Layout><Login /></Layout>} />
      <Route path="/registro"       element={<Layout><Register /></Layout>} />
      <Route path="/favoritos"      element={<Layout><Favorites /></Layout>} />
      {/* ── ADMIN (sin Layout público) ── */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/productos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/categorias" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="*" element={
        <Layout>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-3">Página no encontrada</h1>
            <p className="text-gray-500">La dirección que buscas no existe.</p>
          </div>
        </Layout>
      } />
    </Routes>
  )
}
