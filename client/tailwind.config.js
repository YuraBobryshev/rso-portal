/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rso-blue': '#0804FF', // Строго по брендбуку
        'rso-gray': '#EEEEEE',
        'rso-black': '#000000',
      },
      fontFamily: {
        'actay': ['"Actay Wide"', 'sans-serif'],       // Титульный
        'stolzl': ['Stolzl', 'sans-serif'],            // Заголовки
        'stolzl-light': ['"Stolzl Light"', 'sans-serif'],// Только для цифр
        'onest': ['Onest', 'sans-serif'],              // Для массивов текста
      }
    },
  },
  plugins: [],
};