import { Navigate } from 'react-router-dom'
import { useAdmin } from '../../hooks/useAdmin'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from './AdminLayout'

export default function AdminGuard({ children }) {
  const { isLoading: authLoading } = useAuth()
  const { isAdmin, checking } = useAdmin()

    // Esperar a que tanto el auth como el rol estén resueltos
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return <AdminLayout>{children}</AdminLayout>
}
