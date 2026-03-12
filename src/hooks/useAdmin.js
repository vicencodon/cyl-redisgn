import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'

export function useAdmin() {
  const { role, isLoading } = useAuth()
  const isAdmin = useMemo(() => role === 'admin', [role])
  const checking = isLoading || role === null
  return { isAdmin, checking }
}
