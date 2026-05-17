import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Чистый импорт из родного пакета
import Header from '../components/Header';

export default function BrigadeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brigade, setBrigade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrigade = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/brigades/${id}`);       
         setBrigade(res.data);
      } catch (err) {
        console.error("Ошибка загрузки отряда");
        navigate('/brigades');
      } finally {
        setLoading(false);
      }
    };
    fetchBrigade();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs uppercase tracking-widest opacity-30 animate-pulse">
      Загрузка личного дела отряда...
    </div>
  );
  if (!brigade) return null;

  const mainColor = brigade.colorScheme || '#0804FF';

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      {/* Единый Хедер */}
      <Header />

      <main className="mt-10">
        
        {/* ================= 1. HERO РАЗВОР ОТ С ПОДЛОЖКОЙ ЦВЕТА ОТРЯДА ================= */}
        <section 
          className="w-full max-w-[1600px] mx-auto min-h-[220px] md:min-h-[320px] relative flex items-end p-6 md:p-12 transition-all duration-500 shadow-xl"
          style={{ backgroundColor: mainColor }}
        >
          {/* Геометрический технический тег вместо огромных букв на фоне */}
          <div className="absolute top-4 right-6 font-mono text-[10px] font-bold text-white/30 uppercase tracking-widest">
            // SQUAD_REGISTRY_FILE_0{id.slice(0, 4).toUpperCase()}
          </div>

          <div className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 text-left">
            {/* Круглая эмблема отряда */}
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-white border-[3px] border-white shadow-2xl overflow-hidden shrink-0 flex items-center justify-center">
              {brigade.logoUrl ? (
                <img src={brigade.logoUrl} className="w-full h-full object-cover p-1 rounded-full" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono font-black text-2xl text-rso-blue opacity-30">
                  {brigade.type}
                </div>
              )}
            </div>
            
            {/* Название отряда (масштабирование строго по дизайн-системе) */}
            <div className="text-center md:text-left text-white space-y-2">
              <span className="inline-block px-3 py-0.5 border border-white/30 rounded-none font-mono text-[9px] font-bold uppercase tracking-widest bg-white/10">
                Линейный Студенческий Отряд // СевРО
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                {brigade.name}
              </h1>
            </div>
          </div>
        </section>


        {/* ================= 2. ЖУРНАЛЬНАЯ АСИММЕТРИЧНАЯ СЕТКА КОНТЕНТА ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ЛЕВАЯ КОЛОНКА (История + Личный Состав) — Занимает 8 колонок */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Блок Истории */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest block">
                // 01 / ДЕЯТЕЛЬНОСТЬ И ХРОНИКА
              </span>
              <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed whitespace-pre-line max-w-4xl">
                {brigade.description || "Информация об отряде подготавливается командным составом ЛСО к публикации."}
              </p>
            </div>

            {/* Блок Состава */}
            <div className="space-y-6">
              <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest block">
                // 02 / ТЕКУЩИЙ СОСТАВ ОТРЯДА ({brigade.users.length} ЧЕЛ.)
              </span>
              
              {/* Сетка бойцов: 1 колонка на мобилках, 2 на десктопе */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brigade.users.map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-100 hover:border-rso-blue/40 bg-white transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono font-black text-xs text-rso-blue bg-blue-50/50 uppercase">
                          {member.firstName[0]}
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="font-black uppercase text-sm text-black group-hover:text-rso-blue transition-colors truncate">
                        {member.firstName} {member.lastName}
                      </div>
                      <div 
                        className="text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5"
                        style={{ color: member.role === 'COMMANDER' ? mainColor : '#9ca3af' }}
                      >
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (Инфо-панель + Кнопка Действия) — Занимает 4 колонки */}
          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-24">
             
             {/* Инфо-Метрики */}
             <div className="p-6 border border-gray-200 bg-gray-50/30 space-y-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-200 pb-2">
                  ФАКТУРА ОТРЯДА
                </span>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-500 uppercase text-xs">Направление ЛСО:</span>
                  <span className="font-mono font-black uppercase text-xs" style={{ color: mainColor }}>
                    {brigade.type}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium border-t border-gray-100 pt-3">
                  <span className="text-gray-500 uppercase text-xs">Год формирования:</span>
                  <span className="font-mono font-black text-xs">
                    {new Date(brigade.createdAt).getFullYear()} год
                  </span>
                </div>
             </div>

             {/* Кнопка заявки с фирменной тенью цвета отряда */}
             <button 
               className="w-full py-5 font-mono font-black text-xs uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-black shadow-xl"
               style={{ backgroundColor: mainColor, boxShadow: `0 15px 30px ${mainColor}25` }}
             >
               Подать заявку в отряд
             </button>
             
             <p className="text-[9px] text-center font-medium uppercase tracking-wider text-gray-400 px-6 leading-relaxed">
               Вступление в ряды ЛСО доступно после прохождения авторизации в закрытой системе СевРО.
             </p>
          </div>

        </section>

      </main>

      {/* Единый футер */}
      <footer className="border-t border-gray-100 py-10 bg-white text-center">
        <p className="text-[10px] font-mono font-bold uppercase opacity-30 tracking-[0.3em]">
          СЕВАСТОПОЛЬСКОЕ РЕГИОНАЛЬНОЕ ОТДЕЛЕНИЕ // МООО РСО 2026 // ТРУД КРУТ
        </p>
      </footer>
    </div>
  );
}