const PLACEHOLDER = '/images/placeholder.svg'

export function getProductImage(product, index = 0) {
  const images = product?.images
  if (!Array.isArray(images) || images.length === 0) return PLACEHOLDER
  return images[index] ?? PLACEHOLDER
}

export function getProductImages(product) {
  const images = product?.images
  if (!Array.isArray(images) || images.length === 0) return [PLACEHOLDER]
  return images
}

export function getPlaceholder() {
  return PLACEHOLDER
}

export function handleImgError(e) {
  const img = e.currentTarget
  if (img.src.endsWith(PLACEHOLDER)) return
  img.src = PLACEHOLDER
}
