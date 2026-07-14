/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0B3D20',
          darkBg: '#0A1410',
          darkSurface: '#101F16',
          gold: '#D4AF37',
          goldDark: '#C9A93E',
          textSecondaryLight: '#5A6B5F',
          textSecondaryDark: '#8FA396',
          borderLight: 'rgba(11, 61, 32, 0.08)',
          borderDark: 'rgba(212, 175, 55, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Tamil', 'sans-serif'],
        heading: ['Poppins', 'Noto Sans Tamil', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
