import React from 'react';

// export default function — это стандартный способ объявить компонент в React,
// чтобы другие файлы могли его импортировать.
export default function Home() {
  return (
    // Тег main оборачивает всю страницу. 
    // flex flex-col - элементы идут колонкой (сверху вниз)
    // items-center - центрируем всё по горизонтали
    <main className="w-full flex flex-col items-center bg-white">
      
      {/* СЕКЦИЯ 1: Главный экран (Hero) */}
      {/* max-w-7xl ограничивает ширину на огромных мониторах, чтобы текст не разъезжался */}
      {/* py-20 - это padding (отступы) сверху и снизу */}
      <section className="w-full max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
        
        {/* Заголовок. 
            text-5xl для мобилок, md:text-7xl - для экранов шире планшета (Desktop).
            Это и есть магия адаптивной верстки Tailwind! 
            font-title - наш кастомный шрифт из конфига */}
        <h1 className="text-5xl md:text-7xl font-title text-black leading-none uppercase">
          Студенческие<br />
          отряды<br />
          Севастополя
        </h1>
        
        {/* Подзаголовок */}
        <p className="mt-6 font-heading text-black text-sm uppercase tracking-widest">
          Мы шторм у Черного моря!
        </p>

      </section>

      {/* СЕКЦИЯ 2: Место под твою сетку с квадратами (Пока заглушка) */}
      {/* Здесь мы будем использовать CSS Grid, как в твоем брендбуке "Шаг 3: Определение размера фигур" */}
      <section className="w-full max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-32 bg-black rounded-3xl"></div>
          <div className="h-32 bg-rso-blue rounded-full"></div>
          <div className="h-32 bg-rso-blue col-span-2 rounded-3xl"></div>
        </div>
      </section>

    </main>
  );
}