/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'sabana-blue': '#001C64', // Azul oscuro Sabana para fondo y botones
          'sabana-light': '#E0EDFF', // Azul claro Sabana para fondo
          'sabana-blue-light': '#9DC4FF', // Azul claro Sabana para texto #90CAF9
          'sabana-softGold': '#FFFADA', // Soft Gold Sabana color piel para errores
          'error-red': '#B00020', // Rojo error
          'error-bg-red': '#FFEBEE', // Fondo rojo error
          'default-white': '#FFFFFF', // Blanco por defecto
          'default-gray': '#424242', // Gris por defecto
          'defaultBorder-gray': '#EDF1F3', // Gris por defecto para bordes
        },

        fontFamily: {
          'roboto': ['Roboto', 'sans-serif'],
          'roboto-slab': ['Roboto Slab', 'serif'],
        },
      },
    },
    plugins: [],
  }