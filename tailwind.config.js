/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root',
  theme: {
    extend: {
      colors: {
        primary: '#005f73',
        secondary: '#94d2bd',
      }
    },
    fontFamily: {
        nunito_sans: ['"Nunito Sans"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',   // Flutua devagar
        'float-medium': 'float 5s ease-in-out infinite', // Flutua médio
        'bounce-slow': 'bounce 3s infinite',             // Pulo bem lento
      }
  },
  plugins: [],
}