export const categories = [
  {
    id: 'bolsos',
    name: 'Bolsos',
    slug: 'bolsos',
    description: 'Bolsos de mano, bandoleras y mochilas para cada ocasión.',
    image: null,
    subcategories: ['Bolsos de mano', 'Bandoleras', 'Mochilas', 'Clutches'],
  },
  {
    id: 'cinturones',
    name: 'Cinturones',
    slug: 'cinturones',
    description: 'Cinturones de piel y sintéticos para hombre y mujer.',
    image: null,
    subcategories: ['Piel', 'Sintético', 'Elástico'],
  },
  {
    id: 'monederos',
    name: 'Monederos y Carteras',
    slug: 'monederos',
    description: 'Monederos, carteras y tarjeteros.',
    image: null,
    subcategories: ['Monederos', 'Carteras', 'Tarjeteros'],
  },
  {
    id: 'bisuteria',
    name: 'Bisutería',
    slug: 'bisuteria',
    description: 'Collares, pulseras, pendientes y anillos.',
    image: null,
    subcategories: ['Collares', 'Pulseras', 'Pendientes', 'Anillos'],
  },
  {
    id: 'pañuelos',
    name: 'Pañuelos y Fulares',
    slug: 'panuelos',
    description: 'Pañuelos, fulares y bufandas de temporada.',
    image: null,
    subcategories: ['Pañuelos', 'Fulares', 'Bufandas'],
  },
  {
    id: 'sombreros',
    name: 'Sombreros y Gorros',
    slug: 'sombreros',
    description: 'Sombreros, gorros y complementos de cabeza.',
    image: null,
    subcategories: ['Sombreros', 'Gorros', 'Gorras'],
  },
]

export const getCategoryBySlug = (slug) =>
  categories.find((c) => c.slug === slug) ?? null
