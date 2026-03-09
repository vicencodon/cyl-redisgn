import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useFavorites() {
  const { isLoggedIn, user } = useAuth()
  const [favorites, setFavorites] = useState([])   // array de product_id strings
  const [loading, setLoading] = useState(false)

  // Carga los favoritos del usuario al hacer login
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setFavorites([])
      return
    }
    setLoading(true)
    supabase
      .from('favorites')
      .select('product_id')
      .then(({ data }) => {
        setFavorites(data?.map((f) => f.product_id) ?? [])
        setLoading(false)
      })
  }, [isLoggedIn, user?.id])

  const isFavorite = useCallback(
    (productId) => favorites.includes(productId),
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!isLoggedIn) return   // el componente debería redirigir al login

      const already = favorites.includes(productId)

      // Optimista: actualiza UI antes de esperar a Supabase
      setFavorites((prev) =>
        already ? prev.filter((id) => id !== productId) : [...prev, productId]
      )

      if (already) {
        await supabase
          .from('favorites')
          .delete()
          .eq('product_id', productId)
      } else {
        await supabase
          .from('favorites')
          .insert({ product_id: productId })
      }
    },
    [favorites, isLoggedIn]
  )

  return { favorites, isFavorite, toggleFavorite, loading }
}
