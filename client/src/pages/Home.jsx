import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig'
import Header from '../components/Header';

import ssoLogo from '../assets/icons/sso.svg';
import spoLogo from '../assets/icons/spo.svg';
import sopLogo from '../assets/icons/sop.svg';
import smoLogo from '../assets/icons/smo.svg';
import sservoLogo from '../assets/icons/sservo.svg';
import photoMain from '../assets/PhotoMain.jpg';

export default function Home() {
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);

    const fetchLatestNews = async () => {
      try {
        const res = await api.get('/posts');
        setLatestNews(res.data.slice(0, 3)); 
      } catch (e) {
        console.error("Ошибка загрузки вестника");
      } finally {
        setLoadingNews(false);
      }
    };
    fetchLatestNews();
  }, []);

  const vectors = [
    { code: 'ССО', title: 'Строительные отряды', slogan: 'на стройке', accent: '#0804FF', logo: ssoLogo },
    { code: 'СПО', title: 'Педагогические отряды', slogan: 'в лагере', accent: '#4DA6FF', logo: spoLogo },
    { code: 'СОП', title: 'Отряды проводников', slogan: 'в поезде', accent: '#FF4D39', logo: sopLogo },
    { code: 'СМО', title: 'Медицинские отряды', slogan: 'в медицине', accent: '#00E5FF', logo: smoLogo },
    { code: 'ССервО', title: 'Сервисные отряды', slogan: 'в сервисе', accent: '#66BB8A', logo: sservoLogo }
  ];

  const laborObjects = [
    { name: "Mriya Resort & SPA 5*", location: "Ялта, Крым", task: "Сервисное обслуживание и организация премиум-отдыха" },
    { name: "Всероссийская студенческая стройка «БАМ 2.0»", location: "Сибирь / Дальний Восток", task: "Реконструкция легендарной железнодорожной магистрали" },
    { name: "Детские оздоровительные лагеря «Ласпи» и «Горный»", location: "Севастополь", task: "Педагогическое сопровождение и вожатская деятельность" },
    { name: "АО «Гранд Сервис Экспресс» (Поезда «Таврия»)", location: "Маршруты по всей РФ", task: "Пассажирские перевозки в Город-Герой Севастополь" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-rso-black dark:text-white transition-colors duration-300">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
      `}</style>

      {/* БЕГУЩАЯ СТРОКА */}
      <div className="bg-rso-blue text-white overflow-hidden py-3 relative z-10 border-b border-blue-800">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-stolzl text-[10px] sm:text-xs uppercase tracking-widest font-bold">
          <span>Севастопольское региональное отделение</span>
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          <span>Российские Студенческие Отряды</span>
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          <span>Труд Крут</span>
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          
          <span>Севастопольское региональное отделение</span>
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          <span>Российские Студенческие Отряды</span>
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          <span>Труд Крут</span>
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
        </div>
      </div>

      <Header />

      <main className="pt-16 md:pt-24 space-y-24 md:space-y-32">
        
        {/* ================= 1. HERO СЕКЦИЯ ================= */}
        <section className="w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            
            {/* Надзаголовок (Адаптивный для мобилок) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-stolzl font-bold tracking-widest text-rso-blue dark:text-blue-400 uppercase">
              <span>Севастопольское отделение</span>
              <span className="hidden sm:block w-8 h-[2px] bg-rso-blue/30"></span>
              <span className="sm:hidden w-4 h-[2px] bg-rso-blue/30"></span>
              <span>МООО РСО</span>
            </div>
            
            {/* РЕЗИНОВЫЙ H1 (Идеально вписывается и на телефоне, и на ПК) */}
            <h1 className="font-actay text-[clamp(2.2rem,7.5vw,5.5rem)] uppercase tracking-tight leading-[0.95] text-rso-black dark:text-white">
              СТУДЕНЧЕСКИЕ <br />
              ОТРЯДЫ <br />
              <span className="text-rso-blue">СЕВАСТОПОЛЯ</span>
            </h1>
            
            <p className="font-onest text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
          </div>

          <div className="relative w-full aspect-[4/5] lg:aspect-square bg-rso-gray dark:bg-slate-800 rounded-[2rem] overflow-hidden group">
            <img src={photoMain} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Студенты РСО" />
            
            {/* ПЛАШКА КАК НА СКРИНШОТЕ (Тёмная с синим текстом) */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-slate-900/95 backdrop-blur-md px-5 sm:px-6 py-4 rounded-2xl shadow-xl border border-white/10">
              <span className="font-stolzl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white block mb-1">Трудовой семестр</span>
              <span className="font-stolzl-light text-2xl sm:text-3xl text-rso-blue block leading-none">2026</span>
            </div>
          </div>
        </section>

        {/* О ДВИЖЕНИИ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            <div className="lg:w-5/12 lg:sticky top-32 flex flex-col justify-center">
              <span className="font-stolzl text-xs text-rso-blue uppercase tracking-widest">Твои возможности</span>
              {/* РЕЗИНОВЫЙ H2 */}
              <h2 className="font-stolzl font-bold text-[clamp(1.75rem,5vw,3.5rem)] uppercase tracking-tight mt-4 mb-6 leading-[1.05]">
                Больше, чем <br className="hidden lg:block"/> просто работа
              </h2>
              <p className="font-onest text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                Российские Студенческие Отряды — это крупнейшая молодежная организация страны. Мы не просто даем работу на лето, мы создаем среду для твоего роста.
              </p>
            </div>
            
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { title: 'Работа летом', desc: 'Официальное трудоустройство, белая зарплата и первая серьезная запись в трудовой.' },
                { title: 'Обучение', desc: 'Штаб бесплатно обучает новичков. Ты получишь реальную профессию и свидетельство.' },
                { title: 'Знакомства', desc: 'Слеты по всей стране, фестивали и песни. Найди единомышленников на всю жизнь.' },
                { title: 'Прояви себя', desc: 'Стань командиром отряда, организуй проекты и развивай лидерские навыки.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 p-8 rounded-[2rem] hover:shadow-xl transition-all">
                  <h3 className="font-stolzl font-bold text-lg md:text-xl uppercase mb-3 text-rso-black dark:text-white">{item.title}</h3>
                  <p className="font-onest text-xs md:text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* НАПРАВЛЕНИЯ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-8 md:mb-12">
            <span className="font-stolzl text-[10px] sm:text-xs text-rso-blue uppercase tracking-widest">Наша Стратегия</span>
            <h2 className="font-stolzl font-bold text-[clamp(1.75rem,5vw,3.5rem)] uppercase tracking-tight mt-3 mb-4 leading-tight">Твой Вектор Развития</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {vectors.map((item, index) => (
              <Link
                to={`/brigades#direction-${item.code}`}
                key={index}
                className="aspect-square sm:aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative group transition-transform hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: item.accent }}
              >
                <div className="text-white z-10 space-y-1">
                  <div className="font-actay text-[clamp(0.7rem,3vw,1.5rem)] uppercase leading-tight">впереди <br /> лучшее лето</div>
                  <div className="font-stolzl text-[9px] sm:text-xs opacity-90 uppercase">➔ {item.slogan}</div>
                </div>
                <img src={item.logo} className="w-[85%] mt-auto z-10 group-hover:scale-105 transition-transform" alt={item.title} />
              </Link>
            ))}
          </div>
        </section>

        {/* ТРУДОВЫЕ ОБЪЕКТЫ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="mb-8 md:mb-12">
            <span className="font-stolzl text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-widest">География работы</span>
            <h2 className="font-stolzl font-bold text-[clamp(1.75rem,5vw,3.5rem)] uppercase tracking-tight text-rso-black dark:text-white mt-3 leading-tight">Наши объекты</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <div 
                key={i} 
                className="p-5 md:p-6 bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[1.5rem] md:rounded-[2rem] grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:shadow-lg transition-all group"
              >
                <div className="md:col-span-4">
                  <span className="font-stolzl text-[9px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-1">Проект</span>
                  <div className="font-stolzl text-sm md:text-base font-bold uppercase text-rso-black dark:text-white group-hover:text-rso-blue transition-colors leading-tight">
                    {obj.name}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <span className="font-stolzl text-[9px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-1">Локация</span>
                  <div className="font-onest text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {obj.location}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <span className="font-stolzl text-[9px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-1">Производственная задача</span>
                  <div className="font-onest text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {obj.task}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* НОВОСТИ ШТАБА */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8 sm:mb-10 border-b border-rso-gray dark:border-slate-800 pb-4">
            <div>
              <span className="font-stolzl text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-wider">Информационное поле</span>
              <h2 className="font-stolzl font-bold text-[clamp(1.75rem,5vw,3.5rem)] uppercase tracking-tight text-rso-black dark:text-white mt-1 leading-tight">Новости штаба</h2>
            </div>
            <Link to="/news" className="font-stolzl text-[10px] sm:text-xs font-bold uppercase text-gray-400 dark:text-gray-500 hover:text-rso-blue border-b border-transparent hover:border-rso-blue pb-0.5 transition-all self-start sm:self-auto">
              Все публикации →
            </Link>
          </div>

          {loadingNews ? (
            <div className="py-20 text-center font-stolzl text-xs text-gray-400 uppercase tracking-widest animate-pulse">
              Синхронизация ленты...
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] flex flex-col group hover:border-rso-blue/30 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm h-full"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-rso-gray dark:bg-slate-900 relative border-b border-rso-gray dark:border-slate-900">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt=""/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10 font-actay text-xl text-rso-blue dark:text-white uppercase">СевРО</div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <span className="font-stolzl-light text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 block">
                      {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <h3 className="font-stolzl text-lg font-bold uppercase tracking-tight text-rso-black dark:text-white group-hover:text-rso-blue transition-colors duration-200 mb-3 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="font-onest text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed mt-auto">
                      {post.content}
                    </p>
                    <Link 
                      to="/news" 
                      className="font-stolzl mt-auto text-[10px] font-bold text-rso-blue uppercase tracking-wider border-b border-rso-blue/30 self-start pb-0.5 hover:text-rso-black dark:hover:text-white hover:border-rso-black transition-colors"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center font-stolzl text-xs font-bold uppercase opacity-30 tracking-wider dark:text-gray-400">Пусто</div>
          )}
        </section>

        {/* ПРИЗЫВ К ДЕЙСТВИЮ */}
        {!isLoggedIn && (
          <section className="max-w-[1400px] mx-auto px-6 pb-12">
            <div className="bg-rso-gray dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center flex flex-col items-center">
              <h2 className="font-actay text-[clamp(2rem,6vw,4.5rem)] uppercase tracking-tight text-rso-black dark:text-white leading-[1.1] mb-6">
                Твоё лето начинается здесь
              </h2>
              <p className="font-onest text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
                Не упусти шанс стать частью масштабной истории Севастопольского регионального отделения РСО.
              </p>
              <Link to="/register" className="btn-primary text-xs sm:text-sm">
                Вступить в отряд
              </Link>
            </div>
          </section>
        )}

      </main>

      <footer className="border-t border-rso-gray dark:border-slate-800 py-10 mt-12 bg-white dark:bg-slate-900 text-center">
        <p className="font-stolzl text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Севастопольское региональное отделение // МООО РСО <span className="font-stolzl-light">2026</span> // Труд Крут
        </p>
      </footer>
    </div>
  );
}