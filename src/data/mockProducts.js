export const products = [
  // ── VIAJE ────────────────────────────────────────────
  { id: 1,  name: 'Maleta cabina azul 20"',          slug: 'maleta-cabina-azul',       seccion: 'Viaje',        category: 'Maletas',           brand: 'Samsonite',        color: 'Azul',   price: 89.95,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'Cabina',          material: 'Rígida',  tamaño: 'Cabina' },
  { id: 2,  name: 'Maleta mediana negra 24"',         slug: 'maleta-mediana-negra',     seccion: 'Viaje',        category: 'Maletas',           brand: 'Samsonite',        color: 'Negro', price: 119.95, originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipo: 'Mediana',         material: 'Rígida',  tamaño: 'Mediana' },
  { id: 3,  name: 'Maleta grande roja 28"',           slug: 'maleta-grande-roja',       seccion: 'Viaje',        category: 'Maletas',           brand: 'Carpisa',          color: 'Rojo',  price: 139.00, originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipo: 'Grande',          material: 'Blanda',  tamaño: 'Grande' },
  { id: 4,  name: 'Maleta cabina negra slim',         slug: 'maleta-cabina-negra',      seccion: 'Viaje',        category: 'Maletas',           brand: 'Roncato',          color: 'Negro', price: 79.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'Cabina',          material: 'Rígida',  tamaño: 'Cabina' },
  { id: 5,  name: 'Juego 3 maletas azul marino',     slug: 'juego-maletas-azul',       seccion: 'Viaje',        category: 'Maletas',           brand: 'Carpisa',          color: 'Azul',  price: 199.00, originalPrice: 249.00, inStock: true,  isNew: false, isOutlet: true,  tipo: 'Juego de maletas', material: 'Rígida', tamaño: 'Grande' },
  { id: 6,  name: 'Mochila de viaje verde 40L',       slug: 'mochila-viaje-verde',      seccion: 'Viaje',        category: 'Mochilas de viaje', brand: 'Eastpak',          color: 'Verde', price: 49.95,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false },
  { id: 7,  name: 'Mochila viaje negra cabina',       slug: 'mochila-viaje-negra',      seccion: 'Viaje',        category: 'Mochilas de viaje', brand: 'Kipling',          color: 'Negro', price: 65.00,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false },
  { id: 8,  name: 'Neceser transparente viaje',       slug: 'neceser-transparente',     seccion: 'Viaje',        category: 'Neceseres',         brand: 'Carpisa',          color: 'Beige', price: 12.95,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false },
  { id: 9,  name: 'Bolsa de viaje lona marrón',       slug: 'bolsa-viaje-lona',         seccion: 'Viaje',        category: 'Bolsas de viaje',   brand: 'Carpisa',          color: 'Marrón',price: 39.00,  originalPrice: 55.00, inStock: true,  isNew: false, isOutlet: true },
  { id: 10, name: 'Equipaje de mano gris',            slug: 'equipaje-mano-gris',       seccion: 'Viaje',        category: 'Equipaje de mano',  brand: 'American Tourister',color: 'Gris', price: 55.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false },

  // ── MUJER ────────────────────────────────────────────
  { id: 11, name: 'Bolso bandolera negro piel',       slug: 'bolso-bandolera-negro',    seccion: 'Mujer',        category: 'Bolsos',            brand: 'Vogue',            color: 'Negro', price: 49.95,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'Bandolera',       material: 'Piel' },
  { id: 12, name: 'Bolso shopper beige grande',       slug: 'bolso-shopper-beige',      seccion: 'Mujer',        category: 'Bolsos',            brand: 'Petite Jolie',     color: 'Beige', price: 42.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'Shopper',         material: 'Sintético' },
  { id: 13, name: 'Bolso clutch dorado noche',        slug: 'bolso-clutch-dorado',      seccion: 'Mujer',        category: 'Bolsos',            brand: 'Misako',           color: 'Beige', price: 22.00,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipo: 'Clutch',          material: 'Sintético' },
  { id: 14, name: 'Mochila mujer rosa casual',        slug: 'mochila-mujer-rosa',       seccion: 'Mujer',        category: 'Bolsos',            brand: 'Kipling',          color: 'Rosa',  price: 58.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'Mochila',         material: 'Tela' },
  { id: 15, name: 'Riñonera mujer roja',              slug: 'rinonera-mujer-roja',      seccion: 'Mujer',        category: 'Bolsos',            brand: 'Carpisa',          color: 'Rojo',  price: 18.95,  originalPrice: 25.00, inStock: true,  isNew: false, isOutlet: true,  tipo: 'Riñonera',        material: 'Sintético' },
  { id: 16, name: 'Cartera billetera marrón mediana', slug: 'cartera-billetera-marron', seccion: 'Mujer',        category: 'Carteras',          brand: 'Vogue',            color: 'Marrón',price: 19.95,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipoCartera: 'Mediana',  material: 'Piel' },
  { id: 17, name: 'Cartera grande roja con monedero', slug: 'cartera-grande-roja',      seccion: 'Mujer',        category: 'Carteras',          brand: 'Petite Jolie',     color: 'Rojo',  price: 24.95,  originalPrice: 32.00, inStock: true,  isNew: false, isOutlet: true,  tipoCartera: 'Grande',   material: 'Sintético' },
  { id: 18, name: 'Monedero pequeño negro',           slug: 'monedero-pequeno-negro',   seccion: 'Mujer',        category: 'Carteras',          brand: 'Misako',           color: 'Negro', price: 9.95,   originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipoCartera: 'Monedero', material: 'Sintético' },

  // ── HOMBRE (incluye Juvenil) ──────────────────────────
  { id: 19, name: 'Bolso mensajero negro hombre',     slug: 'bolso-mensajero-negro',    seccion: 'Hombre',       category: 'Bolsos',            brand: 'Samsonite',        color: 'Negro', price: 59.95,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipo: 'Bandolera' },
  { id: 20, name: 'Mochila hombre azul 25L',          slug: 'mochila-hombre-azul',      seccion: 'Hombre',       category: 'Bolsos',            brand: 'Eastpak',          color: 'Azul',  price: 55.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'Mochila' },
  { id: 21, name: 'Riñonera negra sport',             slug: 'rinonera-negra-sport',     seccion: 'Hombre',       category: 'Bolsos',            brand: 'Carpisa',          color: 'Negro', price: 18.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'Riñonera' },
  { id: 22, name: 'Cartera hombre marrón piel',       slug: 'cartera-hombre-marron',    seccion: 'Hombre',       category: 'Carteras',          brand: 'Vogue',            color: 'Marrón',price: 17.95,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipoCartera: 'Sin monedero' },
  { id: 23, name: 'Cinturón piel negro liso',         slug: 'cinturon-piel-negro',      seccion: 'Hombre',       category: 'Cinturones',        brand: 'Vogue',            color: 'Negro', price: 15.95,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipoCinturon: 'Clásicos' },
  { id: 33, name: 'Cinturón sport elástico azul',     slug: 'cinturon-sport-azul',      seccion: 'Hombre',       category: 'Cinturones',        brand: 'Carpisa',          color: 'Azul',  price: 12.95,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipoCinturon: 'Sport' },
  { id: 34, name: 'Tirantes grises ajustables',       slug: 'tirantes-grises',          seccion: 'Hombre',       category: 'Cinturones',        brand: 'Vogue',            color: 'Gris',  price: 18.00,  originalPrice: 24.00, inStock: true,  isNew: false, isOutlet: true,  tipoCinturon: 'Tirantes' },
  { id: 24, name: 'Mochila escolar azul juvenil',     slug: 'mochila-escolar-azul',     seccion: 'Hombre',       category: 'Escolar',           brand: 'Eastpak',          color: 'Azul',  price: 39.95,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false },
  { id: 25, name: 'Bolso juvenil estampado verde',    slug: 'bolso-juvenil-verde',      seccion: 'Hombre',       category: 'Bolsos juveniles',  brand: 'Kipling',          color: 'Verde', price: 29.95,  originalPrice: 38.00, inStock: true,  isNew: false, isOutlet: true,  tipo: 'Mochila' },
  { id: 26, name: 'Bolso de mano hombre gris',        slug: 'bolso-mano-hombre-gris',   seccion: 'Hombre',       category: 'Bolsos',            brand: 'Misako',           color: 'Gris',  price: 24.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipo: 'De mano' },

  // ── COMPLEMENTOS ──────────────────────────────────────
  { id: 27, name: 'Maletín portátil negro 15"',       slug: 'maletin-portatil-negro',   seccion: 'Complementos', category: 'Porta-documentos',  brand: 'Samsonite',        color: 'Negro', price: 55.00,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipoPortadoc: 'Maletín' },
  { id: 28, name: 'Mochila portátil gris 15.6"',      slug: 'mochila-portatil-gris',    seccion: 'Complementos', category: 'Porta-documentos',  brand: 'Samsonite',        color: 'Gris',  price: 45.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipoPortadoc: 'Mochila portátil' },
  { id: 29, name: 'Paraguas automático azul',         slug: 'paraguas-automatico-azul', seccion: 'Complementos', category: 'Paraguas',          brand: 'Misako',           color: 'Azul',  price: 16.95,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipoParaguas: 'Largo' },
  { id: 30, name: 'Paraguas plegable rojo',           slug: 'paraguas-plegable-rojo',   seccion: 'Complementos', category: 'Paraguas',          brand: 'Misako',           color: 'Rojo',  price: 10.95,  originalPrice: 16.00, inStock: true,  isNew: false, isOutlet: true,  tipoParaguas: 'Plegable' },
  { id: 31, name: 'Set regalo neceser y cartera',     slug: 'set-regalo-neceser',       seccion: 'Complementos', category: 'Regalos',           brand: 'Petite Jolie',     color: 'Beige', price: 35.00,  originalPrice: null,  inStock: true,  isNew: true,  isOutlet: false, tipoRegalo: 'Accesorios' },
  { id: 32, name: 'Set joyero manicura regalo',       slug: 'set-joyero-manicura',      seccion: 'Complementos', category: 'Regalos',           brand: 'Tous',             color: 'Rosa',  price: 28.00,  originalPrice: null,  inStock: true,  isNew: false, isOutlet: false, tipoRegalo: 'Joyeros' },
]

export const getProductsBySection = (slug) => {
  if (slug === 'novedades') return products.filter((p) => p.isNew)
  if (slug === 'outlet')    return products.filter((p) => p.isOutlet)
  const name = slug.charAt(0).toUpperCase() + slug.slice(1)
  return products.filter((p) => p.seccion === name)
}

export const getPriceRange = (list) => {
  if (!list.length) return [0, 300]
  const prices = list.map((p) => p.price)
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
}

export const getProductBySlug = (slug) =>
  products.find((p) => p.slug === slug) ?? null

export const getFeaturedProducts = () =>
  products.filter((p) => p.isNew).slice(0, 4)
