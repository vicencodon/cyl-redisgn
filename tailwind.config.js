/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal refinada (Rojo/Coral elegante)
        brand: {
          50:  '#fcf4f4',
          100: '#f9e7e7',
          200: '#f3c9c9',
          300: '#eaa1a1',
          400: '#df6e6e',
          500: '#d34343', // Color principal pulido
          600: '#bc3030', // Hover
          700: '#9d2424',
          800: '#822121',
          900: '#6d2020',
        },
        // Color de contraste (Carbón azulado oscuro) para textos importantes o fondos de banners
        contrast: {
          light: '#4a5568',
          DEFAULT: '#1a202c', // Carbón
          dark: '#0f172a',
        },
        // Medios tonos para fondos sutiles y tarjetas
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
        }
      },
      fontFamily: {
        // Letra principal un poco más geométrica/moderna (si está instalada, fallback a system-ui)
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
