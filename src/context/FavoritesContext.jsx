import { createContext, useContext, useState, useEffect, useCallback } from 'react'

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
        return already 
          ? prev.filter((id) => id !== productId) 
          : [...prev, productId]
      })
    },
    []
  )

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  )
}
