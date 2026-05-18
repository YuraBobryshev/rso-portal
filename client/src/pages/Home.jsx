import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

// Импортируем 5 SVG логотипов (экспортированных фреймом с текстом)
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
        // Логика строго не изменена: твой локальный хост
        const res = await axios.get('http://localhost:5000/api/posts');
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
    { title: "Строительные отряды", code: "ССО", slogan: "НА СТРОЙКЕ", desc: "Возведение масштабной инфраструктуры и ключевых объектов страны.", accent: "#0052FF", bgLight: "bg-blue-50/45", logo: ssoLogo },
    { title: "Педагогические отряды", code: "СПО", slogan: "В ЛАГЕРЕ", desc: "Воспитание будущего поколения в лучших детских центрах у моря.", accent: "#4DA6FF", bgLight: "bg-sky-50/40", logo: spoLogo },
    { title: "Отряды проводников", code: "СОП", slogan: "В ПОЕЗДЕ", desc: "Романтика железных дорог, стук колес и путешествия по всей РФ.", accent: "#FF4D39", bgLight: "bg-red-50/40", logo: sopLogo },
    { title: "Медицинские отряды", code: "СМО", slogan: "В МЕДИЦИНЕ", desc: "Работа в госпиталях, забота о здоровье и медицинская практика.", accent: "#00E5FF", bgLight: "bg-cyan-50/40", logo: smoLogo },
    { title: "Сервисные отряды", code: "ССервО", slogan: "В СЕРВИСЕ", desc: "Индустрия гостеприимства высшего класса в премиум-отелях.", accent: "#66BB8A", bgLight: "bg-emerald-50/40", logo: sservoLogo },
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

      {/* Единый Хедер */}
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
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-[0.85] text-black">
              Энергия. <br />
              <span className="text-rso-blue">Труд.</span> <br />
              Романтика.
            </h1>
            <p className="text-sm md:text-base text-gray-400 font-medium max-w-xl leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
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


        {/* ================= 2. БЕГУЩАЯ СТРОКА ================= */}
        <section className="w-full bg-rso-blue text-white py-4.5 overflow-hidden select-none shadow-sm">
          <div className="animate-marquee">
            {[...Array(4)].map((_, idx) => (
              <span key={idx} className="text-xl md:text-2xl font-black uppercase tracking-wide mx-8 whitespace-nowrap">
                • ТРУД КРУТ • МЫ ШТОРМ У ЧЕРНОГО МОРЯ • РОССИЙСКИЕ СТУДЕНЧЕСКИЕ ОТРЯДЫ • СЕВАСТОПОЛЬ 
              </span>
            ))}
          </div>
        </section>


        {/* ================= 3. МАНИФЕСТ: ПОЛНОСТЬЮ БЕЛЫЙ BENTO-СТИЛЬ ================= */}
        <section className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Карта 1: Перекрашено в чистый белый Bento-блок */}
          <div className="p-8 bg-gray-50/70 border border-gray-100 rounded-3xl flex flex-col justify-between min-h-[300px] md:col-span-1 shadow-sm relative overflow-hidden group hover:border-rso-blue/20 transition-all duration-300 hover:bg-white">
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-50 rounded-full blur-3xl opacity-50 transition-transform group-hover:scale-110" />
            
            <span className="text-[10px] font-bold text-rso-blue uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-md relative z-10 border border-blue-100/50">
              Манифест движения
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight relative z-10 mt-12 text-black transition-colors group-hover:text-rso-blue">
              Больше чем <br />просто работа. <br />Это стиль жизни.
            </h2>
          </div>

          {/* Карта 2: Профессиональный старт */}
          <div className="p-8 bg-gray-50/70 border border-gray-100 rounded-3xl flex flex-col justify-between min-h-[300px] hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-rso-blue text-xl font-black shadow-sm group-hover:scale-105 transition-transform">
                💼
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">
                Профессиональный старт
              </h3>
              <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                Официальное трудоустройство на ключевых объектах и курортах России. Получай востребованную специальность бесплатно и зарабатывай свои первые серьезные деньги уже этим летом.
              </p>
            </div>
          </div>

          {/* Карта 3: Настоящее комьюнити */}
          <div className="p-8 bg-gray-50/70 border border-gray-100 rounded-3xl flex flex-col justify-between min-h-[300px] hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#FF4D39] text-xl font-black shadow-sm group-hover:scale-105 transition-transform">
                🔥
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">
                Настоящее комьюнити
              </h3>
              <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                Сотни единомышленников, фестивали, творческие конкурсы, слеты от Владивостока до Калининграда и песни у костра. Здесь ты найдешь друзей на всю жизнь.
              </p>
            </div>
          </div>

        </section>


        {/* ================= 4. НАПРАВЛЕНИЯ: ГАРАНТИРОВАННАЯ ЦВЕТОПЕРЕДАЧА SVG ================= */}
        <section className="max-w-[1500px] mx-auto px-6">
          <div className="mb-10">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Наши векторы</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1">Выбери свой фронт</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vectors.map((item, index) => (
              <div 
                key={index} 
                className={`p-6 md:p-8 ${item.bgLight} border border-gray-100/70 rounded-3xl flex flex-col justify-between h-[300px] hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300 group relative overflow-hidden`}
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-15 transition-transform group-hover:scale-150" style={{ backgroundColor: item.accent }} />

                <div>
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-[10px] font-bold uppercase text-gray-400 opacity-90">➔ {item.slogan}</span>
                  </div>
                  
                  {/* ПРИМЕНИЛИ СУПЕР-ХАК: Сдвигаем картинку влево, а её цветную тень выводим в поле видимости */}
                  <div className="h-20 w-full overflow-hidden relative mb-6 shrink-0">
                    <img 
                      src={item.logo} 
                      className="h-full w-auto absolute left-[-200px] transition-transform duration-300 group-hover:scale-102" 
                      style={{ filter: `drop-shadow(200px 0 0 ${item.accent})` }}
                      alt={item.title} 
                    />
                  </div>

                  <p className="text-xs text-gray-400 font-medium leading-relaxed mt-2 line-clamp-2 max-w-xs">
                    {item.desc}
                  </p>
                </div>
                
                {/* Ссылка-Якорь */}
                <Link 
                  to={`/brigades#direction-${item.code}`} 
                  className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 pt-4 border-t border-gray-100/50 w-full group-hover:text-black transition-colors"
                  style={{ color: item.accent }}
                >
                  <span>Посмотреть команды</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
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
                    <p className="text-xs text-gray-400 line-clamp-3 mb-5 leading-relaxed font-medium">
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
              <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto font-medium leading-relaxed">
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