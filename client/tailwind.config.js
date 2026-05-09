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
        'title': ['"Actay Wide"', 'sans-serif'], 
        'heading': ['Stolzl', 'sans-serif'],    
        'body': ['Onest', 'sans-serif'],        
      },
      // НОВЫЙ БЛОК: Описываем сами движения
      keyframes: {
        'slide-arrow': {
          // Стрелка стоит на месте 80% времени, потом делает быстрый рывок влево и возвращается
          '0%, 80%, 100%': { transform: 'translateX(0)' },
          '90%': { transform: 'translateX(-15px)' },
        },
        'breathe': {
          // Плавное увеличение и уменьшение (эффект дыхания)
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      // НОВЫЙ БЛОК: Создаем классы, которые мы будем писать в HTML
      animation: {
        // Рывок стрелки каждые 4 секунды бесконечно
        'slide-arrow': 'slide-arrow 4s ease-in-out infinite',
        // Медленное дыхание квадрата каждые 5 секунд бесконечно
        'breathe': 'breathe 5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}