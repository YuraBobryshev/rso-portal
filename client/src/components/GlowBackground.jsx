import React from 'react';

export default function GlowBackground({ children }) {
  return (
    <div className="relative min-h-screen bg-white text-rso-blue dark:bg-dark-bg dark:text-white transition-colors duration-300">
      {/* Слой с бликами (Blobs) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Блик 1 - Сверху слева (Фирменный синий) */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rso-blue opacity-5 dark:opacity-15 blur-[150px] animate-pulse transition-opacity duration-1000"></div>
        
        {/* Блик 2 - Снизу справа (Бирюзовый акцент) */}
        <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-400 opacity-5 dark:opacity-10 blur-[180px] animate-pulse delay-700 transition-opacity duration-1000"></div>

        {/* Блик 3 - Центр (Супер мягкое свечение только в темной теме) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600 opacity-0 dark:opacity-5 blur-[200px] transition-opacity duration-1000"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}