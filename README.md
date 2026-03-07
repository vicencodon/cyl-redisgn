# CyL Complementos — Rediseño Frontend

Prototipo inicial de rediseño para [cylcomplementos.com](https://cylcomplementos.com/).

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx       # Cabecera con navegación simplificada
│   │   ├── Footer.jsx       # Pie de página con enlaces a categorías
│   │   └── Layout.jsx       # Wrapper de página (Header + main + Footer)
│   └── ui/
│       ├── ProductCard.jsx  # Tarjeta de producto reutilizable
│       └── CategoryCard.jsx # Tarjeta de categoría reutilizable
├── pages/
│   ├── Home.jsx             # Página de inicio
│   ├── Category.jsx         # Listado de productos por categoría
│   ├── ProductDetail.jsx    # Detalle de producto
│   └── Contact.jsx          # Formulario de contacto
├── data/
│   ├── mockCategories.js    # Categorías de ejemplo
│   └── mockProducts.js      # Productos de ejemplo
└── styles/
    └── index.css            # Estilos base con directivas Tailwind
```

## Rutas

| Ruta | Página |
|------|--------|
| `/` | Inicio |
| `/categoria/:slug` | Categoría |
| `/producto/:slug` | Detalle de producto |
| `/contacto` | Contacto |

## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS 3**
- **React Router v6**

## Notas

- Este proyecto es un prototipo de rediseño. No incluye backend, autenticación, pagos ni base de datos.
- Los datos de productos y categorías son ficticios (`src/data/`).
- El formulario de contacto no envía mensajes reales.
