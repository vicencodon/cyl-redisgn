export const sections = {
  viaje: {
    slug: 'viaje',
    name: 'Viaje',
    filterGroups: [
      {
        id: 'tipo',
        label: 'Tipo',
        options: [
          'Maletas Cabina',
          'Maletas Medianas',
          'Maletas Grandes',
          'Juegos de Maletas',
          'Equipaje de Mano',
          'Mochilas de Viaje',
          'Bolsas de Viaje',
          'Neceser',
          'Portatrajes',
          'Accesorios',
        ],
      },
    ],
  },
  mujer: {
    slug: 'mujer',
    name: 'Mujer',
    filterGroups: [
      {
        id: 'tipo',
        label: 'Tipo',
        options: ['Bolsos', 'Carteras', 'Calzado', 'Accesorios'],
      },
    ],
  },
  hombre: {
    slug: 'hombre',
    name: 'Hombre',
    filterGroups: [
      {
        id: 'tipo',
        label: 'Tipo',
        options: [
          'Bolsos',
          'Carteras',
          'Cinturones',
          'Calzado',
          'Escolar',
          'Viaje',
          'Bolsos Juveniles',
          'Accesorios',
        ],
      },
    ],
  },
  complementos: {
    slug: 'complementos',
    name: 'Complementos',
    filterGroups: [
      {
        id: 'tipo',
        label: 'Tipo',
        options: ['Porta-documentos', 'Paraguas', 'Regalos'],
      },
    ],
  },
  novedades: {
    slug: 'novedades',
    name: 'Novedades',
    filterGroups: [
      {
        id: 'seccion',
        label: 'Categoría',
        options: ['Viaje', 'Mujer', 'Hombre', 'Complementos'],
      },
      {
        id: 'brand',
        label: 'Marca',
        options: ['Samsonite', 'Carpisa', 'Vogue', 'Petite Jolie', 'Misako'],
      },
      {
        id: 'tipo',
        label: 'Tipo',
        options: ['Bolsos', 'Maletas', 'Carteras', 'Accesorios', 'Calzado'],
      },
      {
        id: 'color',
        label: 'Color',
        options: ['Negro', 'Marrón', 'Azul', 'Rojo', 'Beige', 'Verde'],
      },
    ],
  },
  outlet: {
    slug: 'outlet',
    name: 'Outlet',
    filterGroups: [
      {
        id: 'seccion',
        label: 'Categoría',
        options: ['Viaje', 'Mujer', 'Hombre', 'Complementos'],
      },
      {
        id: 'brand',
        label: 'Marca',
        options: ['Samsonite', 'Carpisa', 'Vogue', 'Petite Jolie', 'Misako'],
      },
      {
        id: 'tipo',
        label: 'Tipo',
        options: ['Bolsos', 'Maletas', 'Carteras', 'Accesorios', 'Calzado'],
      },
      {
        id: 'color',
        label: 'Color',
        options: ['Negro', 'Marrón', 'Azul', 'Rojo', 'Beige', 'Verde'],
      },
    ],
  },
}

export const getSectionBySlug = (slug) => sections[slug] ?? null
