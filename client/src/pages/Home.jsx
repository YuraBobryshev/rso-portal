import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig'
import Header from '../components/Header';

// Импортируем 5 SVG логотипов
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
    <div className="min-h-screen bg-white dark:bg-slate-900 text-rso-black dark:text-white font-onest antialiased selection:bg-rso-blue selection:text-white transition-colors duration-300">
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

      {/* Бегущая строка */}
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
        <section className="w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-stolzl font-bold tracking-widest text-rso-blue uppercase">
              <span>Севастопольское отделение</span>
              <span className="w-8 h-[2px] bg-rso-blue/30"></span>
              <span>МООО РСО</span>
            </div>
            
            <h1 className="font-actay text-5xl sm:text-6xl md:text-[5rem] lg:text-[5.5rem] uppercase tracking-tight leading-[0.9] text-rso-black dark:text-white">
              СТУДЕНЧЕСКИЕ <br />
              ОТРЯДЫ <br />
              <span className="text-rso-blue">СЕВАСТОПОЛЯ</span>
            </h1>
            
            <p className="font-onest text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
          </div>

          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-rso-gray dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm group border border-gray-100/50 dark:border-slate-700">
            <img 
              src={photoMain} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Студенты РСО" 
            />
            <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-lg flex flex-col items-start">
              <span className="font-stolzl text-[10px] font-bold uppercase tracking-wider text-rso-black dark:text-white">Трудовой семестр</span>
              <span className="font-stolzl-light text-2xl text-rso-blue leading-none mt-1">2026</span>
            </div>
          </div>
        </section>

        {/* ================= 2. О ДВИЖЕНИИ ================= */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
            
            <div className="lg:w-5/12 lg:sticky top-32 space-y-6 flex flex-col justify-center">
              <div>
                <span className="font-stolzl text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-widest">Твои возможности</span>
                <h2 className="font-stolzl text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-rso-black dark:text-white mt-4 leading-[1.1]">
                  Больше, чем <br className="hidden lg:block"/> просто работа
                </h2>
              </div>
              <p className="font-onest text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-md">
                Российские Студенческие Отряды — это крупнейшая молодежная организация страны. Мы не просто даем работу на лето, мы создаем среду для твоего масштабного роста.
              </p>
            </div>
            
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 auto-rows-fr">
              {/* Карточка 1 */}
              <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 p-8 md:p-10 rounded-[2rem] hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-rso-gray dark:border-slate-600 text-gray-700 dark:text-gray-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <h3 className="font-stolzl text-lg md:text-xl font-bold uppercase tracking-tight text-rso-black dark:text-white mb-3">Работа летом</h3>
                <p className="font-onest text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-auto">Стабильный заработок на крупнейших объектах страны. Официальное трудоустройство, белая зарплата и первая серьезная запись в твоей трудовой книжке.</p>
              </div>
              
              {/* Карточка 2 */}
              <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 p-8 md:p-10 rounded-[2rem] hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-rso-gray dark:border-slate-600 text-rso-blue transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.314a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.838l9.36 4.314a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                </div>
                <h3 className="font-stolzl text-lg md:text-xl font-bold uppercase tracking-tight text-rso-black dark:text-white mb-3">Бесплатное обучение</h3>
                <p className="font-onest text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-auto">До начала трудового семестра штаб бесплатно обучает новичков. Ты получишь реальную профессию и свидетельство государственного образца.</p>
              </div>

              {/* Карточка 3 */}
              <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 p-8 md:p-10 rounded-[2rem] hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-rso-gray dark:border-slate-600 text-yellow-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
                <h3 className="font-stolzl text-lg md:text-xl font-bold uppercase tracking-tight text-rso-black dark:text-white mb-3">Новые знакомства</h3>
                <p className="font-onest text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-auto">Слеты от Калининграда до Владивостока, творческие фестивали и песни у костра. Здесь ты найдешь настоящих друзей и единомышленников на всю жизнь.</p>
              </div>

              {/* Карточка 4 */}
              <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 p-8 md:p-10 rounded-[2rem] hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-rso-gray dark:border-slate-600 text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                </div>
                <h3 className="font-stolzl text-lg md:text-xl font-bold uppercase tracking-tight text-rso-black dark:text-white mb-3">Прояви себя</h3>
                <p className="font-onest text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-auto">Твоя площадка для карьерного роста. Стань командиром отряда, организуй масштабные проекты, участвуй в спорте и развивай лидерские навыки.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. НАПРАВЛЕНИЯ (ФИРМЕННЫЕ ПЛАКАТЫ) ================= */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="font-stolzl text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-widest">Наша Стратегия</span>
            <h2 className="font-stolzl text-3xl md:text-5xl font-bold tracking-tight text-rso-black dark:text-white mt-3 mb-4 uppercase">Твой Вектор Развития</h2>
            <p className="font-onest text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto">Выбирай свое призвание среди 5 ключевых трудовых направлений Севастополя.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {vectors.map((item, index) => (
              <Link
                to={`/brigades#direction-${item.code}`}
                key={index}
                className="aspect-square sm:aspect-[4/5] rounded-[1.25rem] sm:rounded-[2rem] p-4 sm:p-5 lg:p-6 flex flex-col relative overflow-hidden shadow-sm group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: item.accent }}
              >
                <div className="text-white space-y-0.5 sm:space-y-1 relative z-10">
                  <div className="font-actay text-[11px] sm:text-base lg:text-2xl leading-tight sm:leading-none uppercase tracking-tight">
                    впереди <br /> лучшее лето
                  </div>
                  <div className="font-stolzl text-[9px] sm:text-xs lg:text-sm font-medium opacity-90 pt-0.5 sm:pt-1 uppercase">
                    ➔ {item.slogan}
                  </div>
                </div>
                
                <div className="mt-auto pt-4 w-full opacity-95 group-hover:scale-105 transition-transform duration-500 relative z-10">
                  <img 
                    src={item.logo} 
                    className="w-[90%] md:w-[85%] h-auto object-contain object-left-bottom drop-shadow-md" 
                    alt={item.title} 
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= 4. ТРУДОВЫЕ ОБЪЕКТЫ ================= */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="mb-8 sm:mb-12">
            <span className="font-stolzl text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-widest">География работы</span>
            <h2 className="font-stolzl text-3xl md:text-5xl font-bold tracking-tight text-rso-black dark:text-white mt-3 uppercase">Наши трудовые объекты</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <div 
                key={i} 
                className="p-5 md:p-6 bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[1.5rem] md:rounded-[2rem] grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:shadow-lg transition-all duration-300 group"
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

        {/* ================= 5. НОВОСТИ ШТАБА ================= */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10 border-b border-rso-gray dark:border-slate-800 pb-4">
            <div>
              <span className="font-stolzl text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-wider">Информационное поле</span>
              <h2 className="font-stolzl text-3xl sm:text-4xl font-bold uppercase tracking-tight text-rso-black dark:text-white mt-1">Новости штаба</h2>
            </div>
            <Link to="/news" className="font-stolzl text-[10px] sm:text-xs font-bold uppercase text-gray-400 dark:text-gray-500 hover:text-rso-blue border-b border-transparent hover:border-rso-blue pb-0.5 transition-all">
              Все публикации →
            </Link>
          </div>

          {loadingNews ? (
            <div className="py-20 text-center text-xs font-stolzl text-gray-400 dark:text-gray-600 uppercase tracking-widest animate-pulse">
              Синхронизация новостной ленты...
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
                    <p className="font-onest text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed font-medium mt-auto">
                      {post.content}
                    </p>
                    <Link 
                      to="/news" 
                      className="font-stolzl mt-auto text-[10px] font-bold text-rso-blue uppercase tracking-wider border-b border-rso-blue/30 self-start pb-0.5 hover:text-rso-black dark:hover:text-white hover:border-rso-black dark:hover:border-white transition-colors"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center font-stolzl text-xs font-bold uppercase opacity-30 tracking-wider dark:text-gray-400">Реестр новостей пуст</div>
          )}
        </section>

        {/* ================= 6. ПРИЗЫВ К ДЕЙСТВИЮ ================= */}
        {!isLoggedIn && (
          <section className="max-w-[1400px] mx-auto px-6 pb-12">
            <div className="bg-rso-gray dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center shadow-sm flex flex-col items-center justify-center">
              <h2 className="font-actay text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight text-rso-black dark:text-white leading-[1.1] mb-6">
                Твоё лето начинается здесь
              </h2>
              <p className="font-onest text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium leading-relaxed mb-8">
                Не упусти шанс стать частью масштабной истории Севастопольского регионального отделения РСО. Отряды уже начали набор новичков.
              </p>
              <Link 
                to="/register" 
                className="inline-flex justify-center items-center bg-rso-blue text-white font-stolzl font-medium uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-black dark:hover:bg-slate-700 transition-all shadow-lg hover:shadow-rso-blue/30 transform hover:-translate-y-1 text-xs sm:text-sm"
              >
                Вступить в отряд →
              </Link>
            </div>
          </section>
        )}

      </main>

      <footer className="border-t border-rso-gray dark:border-slate-800 py-10 mt-12 bg-white dark:bg-slate-900 text-center transition-colors duration-300">
        <p className="font-stolzl text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Севастопольское региональное отделение // МООО РСО <span className="font-stolzl-light">2026</span> // Труд Крут
        </p>
      </footer>
    </div>
  );
}