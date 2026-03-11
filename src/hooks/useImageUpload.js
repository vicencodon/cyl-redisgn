import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState(null)

  const uploadImage = useCallback(async (file, productId) => {
    setUploading(true)
    setError(null)

    // Siempre guarda como .jpg para simplificar — Supabase acepta JPEG con cualquier extensión
    const path = `products/${productId}.jpg`

    // Eliminar imagen anterior si existe (upsert manual)
    await supabase.storage.from('product-images').remove([path])

    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(path, file, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadErr) {
      setError(uploadErr.message)
      setUploading(false)
      return null
    }

    // Devolver URL pública
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(path)

    // Actualizar el campo images y timestamp en la tabla products
    await supabase
      .from('products')
      .update({
        images: [data.publicUrl],
        image_updated_at: new Date().toISOString(),
      })
      .eq('id', productId)

    setUploading(false)
    return data.publicUrl
  }, [])

  const deleteImage = useCallback(async (productId) => {
    const path = `products/${productId}.jpg`
    const { error: delErr } = await supabase.storage
      .from('product-images')
      .remove([path])

    if (!delErr) {
      await supabase
        .from('products')
        .update({ images: [], image_updated_at: new Date().toISOString() })
        .eq('id', productId)
    }
    return !delErr
  }, [])

  return { uploadImage, deleteImage, uploading, error }
}
