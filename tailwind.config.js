/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff1f0',
          100: '#ffe0de',
          200: '#ffbcb9',
          300: '#ff9390',
          400: '#f96b6b',
          500: '#e85454',
          600: '#d03c3c',
          700: '#b02c2c',
          800: '#8e2424',
          900: '#731e1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
