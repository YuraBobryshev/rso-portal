import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

// Импортируем 5 SVG логотипов из папки ассетов
import ssoLogo from '../assets/icons/sso.svg';
import spoLogo from '../assets/icons/spo.svg';
import sopLogo from '../assets/icons/sop.svg';
import smoLogo from '../assets/icons/smo.svg';
import sservoLogo from '../assets/icons/sservo.svg';

// Конфигурация 5 направлений СевРО РСО (сельхоз полностью удален)
const directionsConfig = [
  {
    typeCode: 'СПО',
    title: 'Педагогические отряды',
    shortTitle: 'Вожатые',
    slogan: 'в лагере',
    desc: 'Работа вожатыми в детских оздоровительных лагерях и центрах Севастополя, Крыма и всей страны. Организация масштабных смен, творчество и воспитание будущего поколения.',
    accent: '#4DA6FF', // Голубой плакат
    logo: spoLogo
  },
  {
    typeCode: 'ССО',
    title: 'Строительные отряды',
    shortTitle: 'Строители',
    slogan: 'на стройке',
    desc: 'Возведение стратегических объектов инфраструктуры, дорог и жилых комплексов. Бойцы получают востребованные рабочие специальности и трудятся на всероссийских стройках.',
    accent: '#0052FF', // Синий плакат
    logo: ssoLogo
  },
  {
    typeCode: 'СОП',
    title: 'Отряды проводников',
    shortTitle: 'Проводники',
    slogan: 'в поезде',
    desc: 'Обеспечение комфорта пассажиров на поездах дальнего следования. Настоящая романтика железных дорог, путешествия по всей России и бесценный опыт общения.',
    accent: '#FF4D39', // Красный плакат
    logo: sopLogo
  },
  {
    typeCode: 'СМО',
    title: 'Медицинские отряды',
    shortTitle: 'Медики',
    slogan: 'в медицине',
    desc: 'Труд в качестве младшего и среднего медицинского персонала в больницах, санаториях и курортных зонах. Практика для студентов-медиков и реальная помощь людям.',
    accent: '#00E5FF', // Бирюзовый плакат
    logo: smoLogo
  },
  {
    typeCode: 'ССервО',
    title: 'Сервисные отряды',
    shortTitle: 'Сервис',
    slogan: 'в сервисе',
    desc: 'Индустрия гостеприимства высшего класса. Работа в премиальных отелях и курортных комплексах: ресторанный сервис, администрирование и организация ивентов.',
    accent: '#66BB8A', // Зеленый плакат
    logo: sservoLogo
  }
];

export default function Brigades() {
  const [brigades, setBrigades] = useState([]);
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

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white scroll-smooth">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-6 pt-24 pb-24">
        
        {/* ШАПКА СТРАНИЦЫ */}
        <div className="mb-10 py-4">
          <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block mb-1">
            Движение Севастополя
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black">
            Направления и отряды
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1 max-w-xl">
            Выбери вектор своего развития. Каждое направление предлагает уникальный трудовой опыт, официальную зарплату и верных друзей.
          </p>
        </div>

        {/* МЯГКАЯ BENTO ПАНЕЛЬ С ЯКОРЯМИ ДЛЯ БЫСТРОЙ НАВИГАЦИИ */}
        <div className="flex flex-wrap gap-2 bg-gray-50/70 border border-gray-100 p-2.5 rounded-2xl mb-16 overflow-x-auto scrollbar-none whitespace-nowrap shadow-sm">
          {directionsConfig.map((dir) => (
            <a
              key={dir.typeCode}
              href={`#direction-${dir.typeCode}`}
              className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-rso-blue hover:border-rso-blue/30 hover:shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dir.accent }}></span>
              <span>{dir.typeCode} // {dir.shortTitle}</span>
            </a>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">
            Синхронизация реестра отрядов...
          </div>
        ) : (
          <div className="space-y-28">
            {directionsConfig.map((direction) => {
              const currentBrigades = brigades.filter(b => b.type === direction.typeCode);

              return (
                /* scroll-mt-24 намертво защищает заголовок от заползания под верхний фиксированный хедер */
                <section 
                  key={direction.typeCode} 
                  id={`direction-${direction.typeCode}`} 
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
                >
                  
                  {/* ЛЕВАЯ ЧАСТЬ: ФИРМЕННЫЙ ПЛАКАТ (ИЗ ФИГМЫ) */}
                  <div 
                    className="lg:col-span-4 aspect-[4/5] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-md group shrink-0"
                    style={{ backgroundColor: direction.accent }}
                  >
                    <div className="text-white space-y-1">
                      <div className="text-2xl md:text-3xl font-black leading-none uppercase tracking-tight">
                        впереди <br /> лучшее лето
                      </div>
                      <div className="text-sm md:text-base font-medium opacity-90">
                        ➔ {direction.slogan}
                      </div>
                    </div>

                    {/* Фирменный SVG со скриншота (Экспортирован фреймом вместе с текстом) */}
                    <div className="w-full flex justify-start items-end h-28 opacity-95 group-hover:scale-103 transition-transform duration-500">
                      <img 
                        src={direction.logo} 
                        className="h-full w-auto object-contain max-w-full" 
                        alt={direction.title} 
                      />
                    </div>
                  </div>

                  {/* ПРАВАЯ ЧАСТЬ: ОПИСАНИЕ НАПРАВЛЕНИЯ + СПИСОК ОТРЯДОВ */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Текстовая Bento-плашка описания */}
                    <div className="p-6 bg-gray-50/70 border border-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h2 className="text-xl font-black uppercase tracking-tight text-black">
                          {direction.title}
                        </h2>
                        <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
                          {direction.desc}
                        </p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-gray-200/60 pt-3 sm:pt-0 sm:pl-6">
                        <div className="text-2xl md:text-3xl font-black text-black leading-none">{currentBrigades.length}</div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1">отрядов</span>
                      </div>
                    </div>

                    {/* Сетка линейных отрядов направления */}
                    {currentBrigades.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentBrigades.map((brigade) => (
                          <Link 
                            to={`/brigades/${brigade.id}`} 
                            key={brigade.id} 
                            className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-all duration-300 hover:shadow-sm flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden flex items-center justify-center bg-white group-hover:border-rso-blue/30 transition-colors duration-300 shadow-sm shrink-0">
                                  {brigade.logoUrl ? (
                                    <img src={brigade.logoUrl} alt={brigade.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[10px] font-black text-rso-blue opacity-30">{brigade.type}</span>
                                  )}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                  Бойцов: {brigade._count?.users || 0}
                                </span>
                              </div>
                              <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:text-rso-blue transition-colors duration-200 mb-1">
                                {brigade.name}
                              </h3>
                              <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2 h-[32px] mb-2">
                                {brigade.description || "Линейный студенческий отряд Севастопольского регионального отделения."}
                              </p>
                            </div>
                            <div 
                              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider pt-2 border-t border-gray-50 transition-colors mt-2"
                              style={{ color: direction.accent }}
                            >
                              <span>Личное дело</span>
                              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-50/20 border border-dashed border-gray-200 rounded-2xl text-xs font-medium text-gray-400 uppercase tracking-wider">
                        В данном векторе отряды формируются штабом
                      </div>
                    )}
                  </div>

                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}