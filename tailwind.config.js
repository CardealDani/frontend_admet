/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root', // ESTRATÉGIA CRUCIAL: Aumenta a prioridade do Tailwind
  theme: {
    extend: {
      colors: {
        primary: '#005f73', // Adicione as cores do seu tema aqui também
        secondary: '#94d2bd',
      }
    },
  },
  plugins: [],
}