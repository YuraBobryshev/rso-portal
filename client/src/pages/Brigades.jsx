import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig'
import Header from '../components/Header';
import { Link } from 'react-router-dom';

import ssoLogo from '../assets/icons/sso.svg';
import spoLogo from '../assets/icons/spo.svg';
import sopLogo from '../assets/icons/sop.svg';
import smoLogo from '../assets/icons/smo.svg';
import sservoLogo from '../assets/icons/sservo.svg';

const directionsConfig = [
  {
    typeCode: 'СПО',
    title: 'Педагогические отряды',
    shortTitle: 'Вожатые',
    slogan: 'в лагере',
    desc: 'Работа вожатыми в детских оздоровительных лагерях и центрах Севастополя, Крыма и всей страны. Организация масштабных смен, творчество и воспитание будущего поколения.',
    accent: '#4DA6FF', 
    logo: spoLogo
  },
  {
    typeCode: 'ССО',
    title: 'Строительные отряды',
    shortTitle: 'Строители',
    slogan: 'на стройке',
    desc: 'Возведение стратегических объектов инфраструктуры, дорог и жилых комплексов. Бойцы получают востребованные рабочие специальности и трудятся на всероссийских стройках.',
    accent: '#0804FF', 
    logo: ssoLogo
  },
  {
    typeCode: 'СОП',
    title: 'Отряды проводников',
    shortTitle: 'Проводники',
    slogan: 'в поезде',
    desc: 'Обеспечение комфорта пассажиров на поездах дальнего следования. Настоящая романтика железных дорог, путешествия по всей России и бесценный опыт общения.',
    accent: '#FF4D39', 
    logo: sopLogo
  },
  {
    typeCode: 'СМО',
    title: 'Медицинские отряды',
    shortTitle: 'Медики',
    slogan: 'в медицине',
    desc: 'Труд в качестве младшего и среднего медицинского персонала в больницах, санаториях и курортных зонах. Практика для студентов-медиков и реальная помощь людям.',
    accent: '#00E5FF', 
    logo: smoLogo
  },
  {
    typeCode: 'ССервО',
    title: 'Сервисные отряды',
    shortTitle: 'Сервис',
    slogan: 'в сервисе',
    desc: 'Индустрия гостеприимства высшего класса. Работа в премиальных отелях и курортных комплексах: ресторанный сервис, администрирование и организация ивентов.',
    accent: '#66BB8A', 
    logo: sservoLogo
  }
];

export default function Brigades() {
  const [brigades, setBrigades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrigades = async () => {
      try {
        const res = await api.get('/brigades');
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
    <div className="min-h-screen transition-colors duration-300 pb-24">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        {/* ШАПКА СТРАНИЦЫ */}
        <div className="mb-10 pb-4 border-b border-rso-gray dark:border-slate-800">
          <span className="font-stolzl text-[10px] sm:text-xs font-bold text-[#0804FF] dark:text-blue-400 uppercase tracking-wider block mb-1">
            Движение Севастополя
          </span>
          <h1 className="heading-1">
            Направления и отряды
          </h1>
          <p className="font-onest text-sm text-gray-500 dark:text-gray-400 font-medium mt-3 max-w-xl">
            Выбери вектор своего развития. Каждое направление предлагает уникальный трудовой опыт, официальную зарплату и верных друзей.
          </p>
        </div>

        {/* МЯГКАЯ BENTO ПАНЕЛЬ С ЯКОРЯМИ */}
        <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 p-2.5 rounded-2xl mb-16 overflow-x-auto scrollbar-hide whitespace-nowrap shadow-sm">
          {directionsConfig.map((dir) => (
            <a
              key={dir.typeCode}
              href={`#direction-${dir.typeCode}`}
              className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-xl font-stolzl text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-[#0804FF] dark:hover:text-blue-400 transition-all flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dir.accent }}></span>
              <span>{dir.typeCode} // {dir.shortTitle}</span>
            </a>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center font-stolzl text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse border border-dashed border-rso-gray dark:border-slate-700 rounded-[2rem]">
            Синхронизация реестра отрядов...
          </div>
        ) : (
          <div className="space-y-28">
            {directionsConfig.map((direction) => {
              const currentBrigades = brigades.filter(b => b.type === direction.typeCode);

              return (
                <section 
                  key={direction.typeCode} 
                  id={`direction-${direction.typeCode}`} 
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
                >
                  
                  {/* ЛЕВАЯ ЧАСТЬ: ПЛАКАТ */}
                  <div 
                    className="lg:col-span-4 aspect-[4/5] rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-sm group shrink-0"
                    style={{ backgroundColor: direction.accent }}
                  >
                    <div className="text-white space-y-1 relative z-10">
                      <div className="font-actay text-2xl md:text-3xl leading-[1.1] uppercase tracking-tight">
                        впереди <br /> лучшее лето
                      </div>
                      <div className="font-stolzl text-xs md:text-sm opacity-90 uppercase pt-1">
                        ➔ {direction.slogan}
                      </div>
                    </div>

                    <div className="w-full flex justify-start items-end h-28 opacity-95 group-hover:scale-105 transition-transform duration-500 relative z-10">
                      <img 
                        src={direction.logo} 
                        className="h-full w-auto object-contain max-w-full drop-shadow-md" 
                        alt={direction.title} 
                      />
                    </div>
                  </div>

                  {/* ПРАВАЯ ЧАСТЬ: ОПИСАНИЕ + ОТРЯДЫ */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="p-6 md:p-8 bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <h2 className="heading-2">
                          {direction.title}
                        </h2>
                        <p className="font-onest text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                          {direction.desc}
                        </p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-rso-gray dark:border-slate-700 pt-4 sm:pt-0 sm:pl-6">
                        <div className="number-display text-[clamp(2rem,5vw,3rem)]">{currentBrigades.length}</div>
                        <span className="font-stolzl text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1">отрядов</span>
                      </div>
                    </div>

                    {/* СЕТКА ОТРЯДОВ */}
                    {currentBrigades.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentBrigades.map((brigade) => (
                          <Link 
                            to={`/brigades/${brigade.id}`} 
                            key={brigade.id} 
                            className="group bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 hover:shadow-md hover:border-[#0804FF]/40 dark:hover:border-blue-400/40 transition-all duration-300 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full border border-rso-gray dark:border-slate-600 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-900 shrink-0">
                                  {brigade.logoUrl ? (
                                    <img src={brigade.logoUrl} alt={brigade.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="font-stolzl text-[10px] font-bold text-gray-400">{brigade.type}</span>
                                  )}
                                </div>
                                <span className="font-stolzl text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg">
                                  Бойцов: <span className="number-display text-[12px]">{brigade._count?.users || 0}</span>
                                </span>
                              </div>
                              <h3 className="heading-3 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors">
                                {brigade.name}
                              </h3>
                              <p className="font-onest text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 h-[40px] mb-2">
                                {brigade.description || "Линейный студенческий отряд Севастопольского регионального отделения."}
                              </p>
                            </div>
                            <div 
                              className="flex items-center gap-2 font-stolzl text-[10px] font-bold uppercase tracking-wider pt-4 border-t border-rso-gray dark:border-slate-700 transition-colors mt-4"
                              style={{ color: direction.accent }}
                            >
                              <span>Личное дело</span>
                              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-slate-50 dark:bg-slate-900 border border-dashed border-rso-gray dark:border-slate-700 rounded-[2rem] font-stolzl text-xs font-bold text-gray-400 uppercase tracking-wider">
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