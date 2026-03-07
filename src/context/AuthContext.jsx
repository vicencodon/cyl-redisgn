import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const MOCK_USER = {
  id: 1,
  firstName: 'Usuario',
  lastName: 'Demo',
  email: 'demo@cylcomplementos.com',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    setError(null)
    await new Promise((r) => setTimeout(r, 600))
    if (email && password) {
      setUser({ ...MOCK_USER, email })
      setIsLoading(false)
      return true
    }
    setError('Credenciales incorrectas')
    setIsLoading(false)
    return false
  }, [])

  const register = useCallback(async (data) => {
    setIsLoading(true)
    setError(null)
    await new Promise((r) => setTimeout(r, 600))
    setUser({ id: Date.now(), firstName: data.firstName, lastName: data.lastName, email: data.email })
    setIsLoading(false)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
