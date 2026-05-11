/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- IDENTIDAD INSTITUCIONAL ---
        'sabana-blue': '#001C64', // Azul oscuro Sabana para fondo y botones (cambio de estado con el mouse)
        'sabana-blue-hover': '#002A96', // Azul más oscuro para botones
        'sabana-light': '#E0EDFF', // Azul claro Sabana para fondo
        'sabana-blue-light': '#9DC4FF', // Azul claro Sabana para texto
        'sabana-softGold': '#FFFADA', // Soft Gold Sabana color piel para errores
        
        // --- ESTADOS Y SEMÁNTICA ---
        'error-red': '#B00020', // Rojo error
        'error-bg-red': '#FFEBEE', // Fondo rojo error
        
        // --- NEUTROS Y UI ---
        'default-white': '#FFFFFF', // Blanco por defecto
        'default-black': '#1A1C1E', // Negro/gris muy oscuro para texto
        'default-gray': '#424242', // Gris por defecto
        'defaultBorder-gray': '#EDF1F3', // Gris por defecto para bordes
      },

      fontFamily: {
        'roboto': ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'], //Fuente para Texto y UI
        'roboto-slab': ['Roboto Slab', 'ui-serif', 'Georgia', 'serif'], //Fuente para Títulos y Encabezados        
      },

      // OPTIMIZACIÓN EXTRA: Sombras personalizadas para las tarjetas de la App
      boxShadow: {
        'sabana-card': '0 20px 50px rgba(0, 28, 100, 0.1)', // Sombra sutil con el azul institucional
      },

      // OPTIMIZACIÓN EXTRA: Bordes más suaves para el estilo moderno que llevamos
      borderRadius: {
        'sabana': '32px',
        'sabana-xl': '40px',
      },
    },
  },
  plugins: [],
}