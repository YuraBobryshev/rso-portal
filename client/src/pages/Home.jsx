import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

// Импортируем 5 SVG логотипов из папки ассетов для плакатов
import ssoLogo from '../assets/icons/sso.svg';
import spoLogo from '../assets/icons/spo.svg';
import sopLogo from '../assets/icons/sop.svg';
import smoLogo from '../assets/icons/smo.svg';
import sservoLogo from '../assets/icons/sservo.svg';

export default function Home() {
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);

    const fetchLatestNews = async () => {
      try {
        const res = await axios.get('http://176.98.177.3:5000/api/posts');
        setLatestNews(res.data.slice(0, 3)); 
      } catch (e) {
        console.error("Ошибка загрузки вестника");
      } finally {
        setLoadingNews(false);
      }
    };
    fetchLatestNews();
  }, []);

  // Новая конфигурация направлений (Дизайн фирменных плакатов ЛСО)
  const vectors = [
    { code: 'ССО', title: 'Строительные отряды', slogan: 'на стройке', accent: '#0052FF', logo: ssoLogo },
    { code: 'СПО', title: 'Педагогические отряды', slogan: 'в лагере', accent: '#4DA6FF', logo: spoLogo },
    { code: 'СОП', title: 'Отряды проводников', slogan: 'в поезде', accent: '#FF4D39', logo: sopLogo },
    { code: 'СМО', title: 'Медицинские отряды', slogan: 'в медицине', accent: '#00E5FF', logo: smoLogo },
    { code: 'ССервО', title: 'Сервисные отряды', slogan: 'в сервисе', accent: '#66BB8A', logo: sservoLogo }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
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

      <Header />

      <main className="pt-24 space-y-24 md:space-y-36">
        
        {/* ================= 1. HERO СЕКЦИЯ ================= */}
        <section className="w-full max-w-[1500px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 text-xs font-bold tracking-widest text-rso-blue uppercase">
              <span>Севастопольское отделение</span>
              <span className="w-8 h-[1px] bg-rso-blue/20"></span>
              <span>МООО РСО</span>
            </div>
            
            {/* Обновленный заголовок */}
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] lg:text-[5.5rem] font-black uppercase tracking-tight leading-[0.9] text-black">
              СТУДЕНЧЕСКИЕ <br />
              ОТРЯДЫ <br />
              <span className="text-rso-blue">СЕВАСТОПОЛЯ</span>
            </h1>
            
            <p className="text-sm md:text-base text-gray-500 font-medium max-w-xl leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
            <div className="pt-2">
                <Link to="/register" className="inline-block bg-rso-blue text-white font-bold uppercase text-xs tracking-wider px-10 py-4.5 rounded-xl hover:bg-black transition-colors shadow-lg shadow-blue-500/20">
                  Вступить в отряд →
                </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-[5/6] bg-gray-50 border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-15444717305-2782549b5136?q=80&w=1974" 
              className="w-full h-full object-cover transition-transform duration-700 scale-101 group-hover:scale-103" 
              alt="Студенты РСО" 
            />
            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-black border border-white/20 shadow-sm">
              Трудовой семестр 2026
            </div>
          </div>
        </section>


        {/* ================= 4. НАПРАВЛЕНИЯ (ФИРМЕННЫЕ ПЛАКАТЫ) ================= */}
        <section className="max-w-[1300px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-widest">Наша Стратегия</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black mt-3 mb-4">Твой Вектор Развития</h2>
            <p className="text-gray-500 text-sm md:text-base font-medium">Выбирай свое призвание среди 5 ключевых трудовых направлений Севастополя.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {vectors.map((item, index) => (
              <Link
                to={`/brigades#direction-${item.code}`}
                key={index}
                className="aspect-[4/5] rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden shadow-sm group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: item.accent }}
              >
                <div className="text-white space-y-1 relative z-10">
                  <div className="text-2xl font-black leading-none uppercase tracking-tight">
                    впереди <br /> лучшее лето
                  </div>
                  <div className="text-sm font-medium opacity-90 pt-1">
                    ➔ {item.slogan}
                  </div>
                </div>
                
                <div className="w-full flex justify-start items-end h-24 sm:h-28 opacity-95 group-hover:scale-105 transition-transform duration-500 relative z-10">
                  <img 
                    src={item.logo} 
                    className="h-full w-auto object-contain max-w-full drop-shadow-md" 
                    alt={item.title} 
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* ================= 5. НОВОСТИ ШТАБА ================= */}
        <section className="max-w-[1500px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Информационное поле</span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">Новости штаба</h2>
            </div>
            <Link to="/news" className="text-xs font-bold uppercase text-gray-400 hover:text-rso-blue border-b border-transparent hover:border-rso-blue pb-0.5 transition-all">
              Все публикации →
            </Link>
          </div>

          {loadingNews ? (
            <div className="py-20 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">
              Синхронизация новостной ленты...
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white border border-gray-100 rounded-3xl flex flex-col group hover:border-rso-blue/20 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-50 relative border-b border-gray-50">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" alt=""/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10 font-black text-xl text-rso-blue">СевРО</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:text-rso-blue transition-colors duration-200 mb-2 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-5 leading-relaxed font-medium">
                      {post.content}
                    </p>
                    <Link 
                      to="/news" 
                      className="mt-auto text-[10px] font-bold text-rso-blue uppercase tracking-wider border-b border-rso-blue/20 self-start pb-0.5 hover:text-black hover:border-black transition-colors"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center text-xs font-bold uppercase opacity-30 tracking-wider">Реестр новостей пуст</div>
          )}
        </section>


        {/* ================= 6. ПРИЗЫВ К ДЕЙСТВИЮ ================= */}
        {!isLoggedIn && (
          <section className="max-w-[1300px] mx-auto px-6 pb-12">
            <div className="bg-gray-50/70 border border-gray-100 rounded-[2rem] p-8 md:p-14 text-center shadow-sm space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
                Твоё лето начинается здесь
              </h2>
              <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
                Не упусти шанс стать частью масштабной истории Севастопольского регионального отделения РСО. Регистрация открыта.
              </p>
              <div className="pt-3">
                <Link 
                  to="/register" 
                  className="inline-block bg-rso-blue text-white font-bold uppercase text-xs tracking-wider px-12 py-4 rounded-xl hover:bg-black transition-colors shadow-md shadow-blue-500/10"
                >
                  Вступить в отряд →
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>

      <footer className="border-t border-gray-100 py-10 bg-white text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Севастопольское региональное отделение // МООО РСО 2026 // Труд Крут
        </p>
      </footer>
    </div>
  );
}