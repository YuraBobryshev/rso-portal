import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const types = ['ВСЕ', 'ССО', 'СПО', 'ССервО', 'СОП', 'ССхО', 'СМО'];

export default function Brigades() {
  const [brigades, setBrigades] = useState([]);
  const [filter, setFilter] = useState('ВСЕ');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrigades = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/brigades');
        setBrigades(res.data);
      } catch (e) {
        console.error("Ошибка загрузки отрядов");
      } finally {
        setLoading(false);
      }
    };
    fetchBrigades();
  }, []);

  const filteredBrigades = filter === 'ВСЕ' 
    ? brigades 
    : brigades.filter(b => b.type === filter);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      {/* Единый Хедер */}
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-6 mt-10">
        
        {/* ЗАГОЛОВОК СТРАНИЦЫ И СВАЙПАЕМАЯ МОБИЛЬНАЯ ЛЕНТА ФИЛЬТРОВ */}
        <div className="mb-12 lg:mb-16 py-6 border-b border-gray-100">
          <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest block mb-3">
            // РЕЕСТР ЛИНЕЙНЫХ ОТРЯДОВ
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Наши отряды
          </h1>
          
          {/* Фильтры: на мобилках свайпаются вбок без горизонтального скроллбара */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap pb-2">
            {types.map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest border transition-all duration-300 rounded-none inline-block ${
                  filter === t 
                    ? 'bg-rso-blue text-white border-rso-blue shadow-lg shadow-blue-500/10' 
                    : 'text-black border-gray-200 hover:border-rso-blue hover:bg-blue-50/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* СЕТКА С КАРТОЧКАМИ ОТРЯДОВ */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs uppercase tracking-widest opacity-30 animate-pulse">
            Синхронизация реестра ЛСО...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {filteredBrigades.map(brigade => {
              const currentSquadColor = brigade.colorScheme || '#0804FF';
              return (
                <Link 
                  to={`/brigades/${brigade.id}`} 
                  key={brigade.id} 
                  className="group relative border border-gray-100 p-6 md:p-8 hover:border-rso-blue transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 bg-white flex flex-col justify-between overflow-hidden"
                >
                  {/* Тонкий верхний маркер цвета отряда */}
                  <div 
                    className="absolute top-0 left-0 w-full h-1 opacity-70 group-hover:opacity-100 transition-opacity" 
                    style={{ backgroundColor: currentSquadColor }}
                  />

                  <div>
                    {/* ХЕДЕР КАРТОЧКИ */}
                    <div className="flex justify-between items-start mb-6">
                      {/* Круглая журнальная аватарка отряда */}
                      <div className="w-16 h-16 rounded-full border border-gray-100 overflow-hidden p-1 flex items-center justify-center bg-white group-hover:border-rso-blue transition-colors duration-500">
                        {brigade.logoUrl ? (
                          <img 
                            src={brigade.logoUrl} 
                            alt={brigade.name} 
                            className="w-full h-full rounded-full object-cover" 
                          />
                        ) : (
                          <div className="text-[9px] font-mono font-black opacity-30 text-center leading-none uppercase text-rso-blue">
                            {brigade.type}
                          </div>
                        )}
                      </div>
                      
                      {/* Метки */}
                      <div className="text-right space-y-1">
                        <span 
                          className="inline-block text-[9px] font-mono font-bold text-white px-2.5 py-1 uppercase"
                          style={{ backgroundColor: currentSquadColor }}
                        >
                          {brigade.type}
                        </span>
                        <span className="block text-[10px] font-mono font-bold opacity-30 uppercase tracking-tighter">
                          Бойцов: {brigade._count?.users || 0}
                        </span>
                      </div>
                    </div>
                    
                    {/* НАЗВАНИЕ ОТРЯДА */}
                    <h2 className="text-2xl font-black uppercase leading-tight mb-3 text-black group-hover:text-rso-blue transition-colors duration-300">
                      {brigade.name}
                    </h2>
                    
                    {/* КОМПАКТНОЕ ОПИСАНИЕ С ЕДИНЫМ РАЗМЕРОМ ШРИФТА */}
                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-3 h-[60px]">
                      {brigade.description || "Линейный отряд Севастопольского РО. Описание формируется пресс-службой."}
                    </p>
                  </div>
                  
                  {/* ССЫЛКА НА ДЕЛО ОТРЯДА С ЦВЕТОВЫМ АКЦЕНТОМ */}
                  <div 
                    className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest mt-auto border-t border-gray-50 pt-4"
                    style={{ color: currentSquadColor }}
                  >
                    <span>Личное дело отряда</span> 
                    <span className="text-sm transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}