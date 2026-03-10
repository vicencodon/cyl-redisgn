import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useAdmin() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin]   = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Esperar a que el auth termine de cargar
    if (authLoading) return

    if (!isLoggedIn || !user) {
      setIsAdmin(false)
      setChecking(false)
      return
    }

    setChecking(true)
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.role === 'admin')
        setChecking(false)
      })
  }, [isLoggedIn, user?.id, authLoading])

  return { isAdmin, checking: checking || authLoading }
}