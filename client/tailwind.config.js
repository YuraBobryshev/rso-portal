/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rso-blue': '#0804FF',
        'rso-gray': '#EEEEEE',
      },
      fontFamily: {
        'title': ['"Actay Wide"', 'sans-serif'], // Для главных заголовков (до 4 слов)
        'heading': ['Stolzl', 'sans-serif'],    // Для подзаголовков и чисел
        'body': ['Onest', 'sans-serif'],        // Для основного текста
      }
    },
  },
  plugins: [],
}