const allBrands = [
  'Samsonite', 'American Tourister', 'Roncato', 'Carpisa',
  'Gabol', 'Coronel Tapiocca', 'Benzi', 'Vogue',
  'Petite Jolie', 'Misako',
]

const COLORS = ['Negro', 'Marrón', 'Beige', 'Azul', 'Rojo', 'Verde', 'Rosa', 'Blanco', 'Gris']
const MATERIALS = ['Piel', 'Sintético', 'Tela', 'Rígida', 'Blanda']

export const sectionConfig = {
  viaje: {
    name: 'Viaje',
    brands: ['Samsonite', 'American Tourister', 'Roncato', 'Carpisa', 'Gabol', 'Coronel Tapiocca', 'Misako', 'Benzi'],
    categories: [
      {
        label: 'Maletas',
        subfilters: [
          { id: 'tipo',     label: 'Tipo',     options: ['Cabina', 'Mediana', 'Grande', 'Juego de maletas'] },
          { id: 'material', label: 'Material', options: ['Rígida', 'Blanda'] },
          { id: 'tamaño',   label: 'Tamaño',   options: ['Cabina', 'Mediana', 'Grande'] },
        ],
      },
      { label: 'Equipaje de mano',    subfilters: [] },
      { label: 'Mochilas de viaje',   subfilters: [] },
      { label: 'Bolsas de viaje',     subfilters: [] },
      { label: 'Neceseres',           subfilters: [] },
      { label: 'Accesorios',          subfilters: [] },
    ],
    globalFilters: [
      { id: 'color', label: 'Color', options: COLORS },
    ],
  },

  mujer: {
    name: 'Mujer',
    brands: ['Vogue', 'Petite Jolie', 'Misako', 'Carpisa'],
    categories: [
      {
        label: 'Bolsos',
        subfilters: [
          { id: 'tipo', label: 'Tipo', options: ['Bandolera', 'Mochila', 'Asas cortas', 'Shopper', 'Clutch', 'Riñonera', 'Portátil', 'Playa'] },
        ],
      },
      {
        label: 'Carteras',
        subfilters: [
          { id: 'tipoCartera', label: 'Tipo', options: ['Pequeña', 'Mediana', 'Grande', 'Monedero', 'Tarjetero', 'Llavero'] },
        ],
      },
      {
        label: 'Calzado',
        subfilters: [
          { id: 'tipoCalzado', label: 'Tipo', options: ['Casa', 'Sport', 'Manoletinas', 'Deportivo'] },
        ],
      },
      { label: 'Accesorios', subfilters: [] },
    ],
    globalFilters: [
      { id: 'color',    label: 'Color',    options: COLORS },
      { id: 'material', label: 'Material', options: MATERIALS },
    ],
  },

  hombre: {
    name: 'Hombre',
    brands: ['Samsonite', 'Coronel Tapiocca', 'Carpisa', 'Vogue', 'Misako', 'Benzi'],
    categories: [
      {
        label: 'Bolsos',
        subfilters: [
          { id: 'tipo', label: 'Tipo', options: ['Bandolera', 'Mochila', 'De mano', 'Riñonera'] },
        ],
      },
      {
        label: 'Carteras',
        subfilters: [
          { id: 'tipoCartera', label: 'Tipo', options: ['Con monedero', 'Sin monedero', 'Tarjeteros', 'Llaveros', 'Para monedas'] },
        ],
      },
      {
        label: 'Cinturones',
        subfilters: [
          { id: 'tipoCinturon', label: 'Tipo', options: ['Clásicos', 'Sport', 'Tirantes'] },
        ],
      },
      { label: 'Calzado',         subfilters: [] },
      { label: 'Escolar',         subfilters: [] },
      { label: 'Viaje',           subfilters: [] },
      { label: 'Bolsos juveniles', subfilters: [
          { id: 'tipo', label: 'Tipo', options: ['Bandolera', 'Mochila', 'De mano', 'Riñonera'] },
        ],
      },
      { label: 'Accesorios', subfilters: [] },
    ],
    globalFilters: [
      { id: 'color',    label: 'Color',    options: ['Negro', 'Marrón', 'Azul', 'Gris', 'Verde'] },
      { id: 'material', label: 'Material', options: MATERIALS },
    ],
  },

  complementos: {
    name: 'Complementos',
    brands: ['Samsonite', 'Misako', 'Petite Jolie', 'Vogue'],
    categories: [
      {
        label: 'Porta-documentos',
        subfilters: [
          { id: 'tipoPortadoc', label: 'Tipo', options: ['Maletín', 'Mochila portátil', 'Maletín ruedas', 'Carpetas'] },
        ],
      },
      {
        label: 'Paraguas',
        subfilters: [
          { id: 'tipoParaguas', label: 'Tipo', options: ['Largo', 'Plegable'] },
        ],
      },
      {
        label: 'Regalos',
        subfilters: [
          { id: 'tipoRegalo', label: 'Tipo', options: ['Accesorios', 'Bisutería', 'Joyeros', 'Manicuras', 'Mascarillas'] },
        ],
      },
    ],
    globalFilters: [],
  },

  novedades: {
    name: 'Novedades',
    brands: allBrands,
    categories: [
      { label: 'Maletas',          subfilters: [] },
      { label: 'Bolsos',           subfilters: [] },
      { label: 'Carteras',         subfilters: [] },
      { label: 'Calzado',          subfilters: [] },
      { label: 'Accesorios',       subfilters: [] },
      { label: 'Paraguas',         subfilters: [] },
      { label: 'Porta-documentos', subfilters: [] },
    ],
    globalFilters: [
      { id: 'tipo',     label: 'Tipo',     options: ['Cabina', 'Mediana', 'Grande', 'Bandolera', 'Mochila', 'Shopper', 'Clutch', 'Riñonera'] },
      { id: 'color',    label: 'Color',    options: COLORS },
      { id: 'material', label: 'Material', options: MATERIALS },
    ],
  },

  outlet: {
    name: 'Outlet',
    brands: allBrands,
    categories: [
      { label: 'Maletas',          subfilters: [] },
      { label: 'Bolsos',           subfilters: [] },
      { label: 'Carteras',         subfilters: [] },
      { label: 'Calzado',          subfilters: [] },
      { label: 'Accesorios',       subfilters: [] },
      { label: 'Paraguas',         subfilters: [] },
      { label: 'Porta-documentos', subfilters: [] },
    ],
    globalFilters: [
      { id: 'tipo',     label: 'Tipo',     options: ['Cabina', 'Mediana', 'Grande', 'Bandolera', 'Mochila', 'Shopper', 'Clutch', 'Riñonera'] },
      { id: 'color',    label: 'Color',    options: COLORS },
      { id: 'material', label: 'Material', options: MATERIALS },
    ],
  },
}

export const getSectionConfig = (slug) => sectionConfig[slug] ?? null
