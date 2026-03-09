import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)   // true al arrancar (comprobando sesión)
  const [error, setError]     = useState(null)

  // Comprueba si hay sesión activa al montar y escucha cambios
  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listener para login / logout / refresh de token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Email o contraseña incorrectos')
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    return true
  }, [])

  const register = useCallback(async ({ firstName, lastName, email, password }) => {
    setIsLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    })
    if (err) {
      setError(err.message)
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    return true
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setError(null)
  }, [])

  // Datos del perfil aplanados para compatibilidad con el resto de la app
  const profile = user
    ? {
        id:        user.id,
        email:     user.email,
        firstName: user.user_metadata?.first_name ?? user.email.split('@')[0],
        lastName:  user.user_metadata?.last_name  ?? '',
      }
    : null

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        isLoggedIn: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
