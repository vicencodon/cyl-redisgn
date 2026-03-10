import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSiteSettings(key) {
  const [value, setValue]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()
      .then(({ data }) => {
        setValue(data?.value ?? null)
        setLoading(false)
      })
  }, [key])

  const save = useCallback(async (newValue) => {
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('site_settings')
      .upsert({ key, value: newValue, updated_at: new Date().toISOString() })
    if (err) setError(err.message)
    else setValue(newValue)
    setSaving(false)
    return !err
  }, [key])

  return { value, loading, saving, error, save }
}

// Carga todos los settings de una vez
export function useAllSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data }) => {
        const map = {}
        data?.forEach((row) => { map[row.key] = row.value })
        setSettings(map)
        setLoading(false)
      })
  }, [])

  return { settings, loading }
}
