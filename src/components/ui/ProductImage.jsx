import { useState } from 'react'
import { supabase } from '../../lib/supabase'

// Genera la URL pública de Supabase Storage para una imagen de producto
export function getProductImageUrl(productId, updatedAt) {
  if (!productId) return null
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(`products/${productId}.jpg`)
  
  // Añadir timestamp como cache-buster
  const ts = updatedAt ? new Date(updatedAt).getTime() : ''
  return ts ? `${data?.publicUrl}?v=${ts}` : (data?.publicUrl ?? null)
}

// Placeholder SVG con el icono apropiado según la sección
function PlaceholderIcon({ section }) {
  const icons = {
    viaje: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a1 1 0 00-1 1v3h10V4a1 1 0 00-1-1z" />
    ),
    mujer: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    ),
    hombre: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    complementos: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    ),
  }
  const d = icons[section] ?? icons.complementos

  return (
    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      {d}
    </svg>
  )
}

/**
 * ProductImage — muestra la imagen del producto desde Supabase Storage.
 * Si no existe o falla, muestra un placeholder elegante con icono de sección.
 *
 * Props:
 *   productId  — id del producto (ej. "prod-001")
 *   productName — texto para el alt
 *   section    — sección del producto para elegir el icono del placeholder
 *   className  — clases extra para el contenedor
 *   size       — "card" (por defecto) | "detail" (imagen grande en detalle)
 */
export default function ProductImage({
  productId,
  productName = '',
  section = 'complementos',
  className = '',
  size = 'card',
}) {
  const [errored, setErrored] = useState(false)
  const [loaded, setLoaded]   = useState(false)

  const url = !errored ? getProductImageUrl(productId) : null

  const containerClass = size === 'detail'
    ? 'relative aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center'
    : 'relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden'

  return (
    <div className={`${containerClass} ${className}`}>
      {url && !errored ? (
        <>
          {/* Skeleton mientras carga */}
          {!loaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <img
            src={url}
            alt={productName}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      ) : (
        /* Placeholder */
        <div className="flex flex-col items-center justify-center gap-2 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
          <PlaceholderIcon section={section} />
          {size === 'detail' && (
            <p className="text-xs text-gray-300 font-medium tracking-wide uppercase">
              Sin imagen
            </p>
          )}
        </div>
      )}
    </div>
  )
}
