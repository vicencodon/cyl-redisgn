import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import ToastNotification from '../components/ui/ToastNotification'

export const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cyl_favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  // Sincronizar con localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('cyl_favorites', JSON.stringify(favorites))
    } catch (err) {
      console.error('No se pudo guardar favoritos en localStorage', err)
    }
  }, [favorites])

  const isFavorite = useCallback(
    (productId) => favorites.includes(productId),
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (productId) => {
      setFavorites((prev) => {
        const already = prev.includes(productId)
        
        if (already) {
          setToast({ isVisible: true, message: 'Eliminado de favoritos', type: 'info' })
          return prev.filter((id) => id !== productId)
        } else {
          setToast({ isVisible: true, message: 'Guardado en favoritos', type: 'success' })
          return [...prev, productId]
        }
      })
    },
    []
  )

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
      <ToastNotification 
        message={toast.message} 
        isVisible={toast.isVisible} 
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </FavoritesContext.Provider>
  )
}
