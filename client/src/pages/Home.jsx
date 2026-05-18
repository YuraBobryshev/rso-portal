import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

export default function Home() {
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);

    const fetchLatestNews = async () => {
      try {
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
    { title: "Педагогические отряды", desc: "Воспитание будущего поколения в лучших детских центрах страны.", img: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=600" },
    { title: "Строительные отряды", desc: "Возведение масштабной инфраструктуры и ключевых объектов.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600" },
    { title: "Отряды проводников", desc: "Романтика железных дорог и обеспечение комфорта в пути.", img: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600" },
    { title: "Медицинские отряды", desc: "Работа в госпиталях, санаториях и забота о здоровье граждан.", img: "https://images.unsplash.com/photo-1584515901367-f1c2a1268a83?q=80&w=600" },
    { title: "Сервисные отряды", desc: "Индустрия гостеприимства высшего класса в премиум-отелях.", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600" },
    { title: "Цифровые отряды", desc: "Развитие IT-экосистемы, автоматизация и цифровизация процессов.", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600" },
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
          animation: marquee 25s linear infinite;
        }
      `}</style>

      {/* Обязательный Хедер */}
      <Header />

      {/* Комфортный отступ сверху, соответствующий новой дизайн-системе */}
      <main className="pt-24">
        
        {/* ================= 1. HERO СЕКЦИЯ (Мягкий Bento разворот) ================= */}
        <section className="w-full max-w-[1600px] mx-auto px-6 pb-12 lg:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Левая текстовая часть */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-rso-blue uppercase">
              <span>Севастопольское региональное отделение</span>
              <span className="w-6 h-[1px] bg-rso-blue/30"></span>
              <span>РСО</span>
            </div>
            
            {/* Базовый стандартизированный размер заголовка */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Энергия. <br />
              <span className="text-rso-blue">Труд.</span> <br />
              Романтика.
            </h1>
            
            <p className="text-base md:text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
          </div>

          {/* Правая часть: Мягкое Bento-фото с закруглением */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-[4/5] bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-15444717305-2782549b5136?q=80&w=1974" 
              className="w-full h-full object-cover" 
              alt="Студенты РСО" 
            />
            <div className="absolute bottom-5 left-6 z-20 text-white text-xs font-bold uppercase tracking-wider opacity-90">
              Трудовой семестр 2026
            </div>
          </div>
        </section>


        {/* ================= 2. КИНЕМАТОГРАФИЧНЫЙ МАНИФЕСТ ================= */}
        <section className="w-full bg-rso-blue text-white py-4 overflow-hidden select-none mb-14">
          <div className="animate-marquee">
            {[...Array(4)].map((_, idx) => (
              <span key={idx} className="text-3xl md:text-4xl font-black uppercase tracking-tighter mx-4 whitespace-nowrap">
                • ТРУД КРУТ • МЫ ШТОРМ У ЧЕРНОГО МОРЯ • РОССИЙСКИЕ СТУДЕНЧЕСКИЕ ОТРЯДЫ • СЕВАСТОПОЛЬ 
              </span>
            ))}
          </div>
        </section>


        {/* ================= 3. СЕКЦИЯ-МАНИФЕСТ: ЧТО ТАКОЕ РСО? (Bento-блоки) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 pb-20 lg:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Манифест движения</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-2 leading-tight">
              Больше чем просто работа. Это стиль жизни.
            </h2>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-3">
              <h3 className="text-lg font-black uppercase text-rso-blue">Профессиональный старт</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">
                Официальное трудоустройство на ключевых объектах и курортах России. Получай востребованную специальность бесплатно и зарабатывай свои первые серьезные деньги уже этим летом.
              </p>
            </div>
            <div className="p-6 md:p-8 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-3">
              <h3 className="text-lg font-black uppercase text-rso-blue">Настоящее комьюнити</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">
                Сотни единомышленников, фестивали, творческие конкурсы, слеты от Владивостока до Калининграда и песни у костра. Здесь ты найдешь друзей на всю жизнь.
              </p>
            </div>
          </div>
        </section>


        {/* ================= 4. НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ (Мягкие Bento карточки) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 pb-20 lg:pb-28">
          <div className="mb-8">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Наши векторы</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-1">Выбери свой фронт</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vectors.map((item, index) => (
              <div key={index} className="group relative aspect-[16/10] bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover opacity-40 transition-transform duration-700 scale-101 group-hover:scale-103 group-hover:opacity-30" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1 text-white group-hover:text-rso-blue transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs opacity-75 font-medium leading-relaxed line-clamp-2 max-w-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 5. ЖУРНАЛЬНЫЙ ВЕСТНИК (Мягкие Bento-карточки новостей) ================= */}
        <section className="w-full bg-gray-50/60 border-y border-gray-100 py-16 lg:py-24 mb-16">
          <div className="max-w-[1600px] mx-auto px-6">
            
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Информационное поле</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-1">Вестник штаба</h2>
              </div>
              <Link to="/news" className="text-xs font-bold uppercase border-b-2 border-black pb-0.5 hover:text-rso-blue hover:border-rso-blue transition-colors">
                Все публикации →
              </Link>
            </div>

            {loadingNews ? (
              <div className="py-20 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">
                Синхронизация новостной ленты...
              </div>
            ) : latestNews.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Главный пост (Слева) */}
                <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between group">
                  <div>
                    <div className="w-full aspect-[16/10] bg-gray-50 overflow-hidden rounded-xl mb-4">
                      {latestNews[0].imageUrl ? (
                        <img src={latestNews[0].imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" alt=""/>
                      ) : (
                        <div className="w-full h-full bg-blue-50 flex items-center justify-center font-black text-2xl text-rso-blue opacity-10">СевРО</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-400">{new Date(latestNews[0].createdAt).toLocaleDateString('ru-RU')}</span>
                      <h3 className="text-xl md:text-2xl font-black uppercase text-black group-hover:text-rso-blue transition-colors">
                        {latestNews[0].title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-3">
                        {latestNews[0].content}
                      </p>
                    </div>
                  </div>
                  <Link to="/news" className="inline-block text-xs font-bold text-rso-blue border-b border-rso-blue w-fit pt-4 hover:text-black hover:border-black transition-colors">Читать материал →</Link>
                </div>

                {/* Два второстепенных поста (Справа) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {latestNews.slice(1, 3).map((post) => (
                    <div key={post.id} className="group flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex-1">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-gray-400">{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
                        <h4 className="text-lg font-black uppercase text-black group-hover:text-rso-blue transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-gray-500 text-xs leading-relaxed font-medium line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                      <Link to="/news" className="inline-block text-[11px] font-bold text-rso-blue border-b border-rso-blue w-fit mt-4 hover:text-black hover:border-black transition-colors">Перейти к статье →</Link>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-xs font-bold uppercase opacity-30">Реестр новостей пуст</div>
            )}
          </div>
        </section>


        {/* ================= 6. МЯГКАЯ СЕКЦИЯ ПРИЗЫВА ================= */}
        {!isLoggedIn && (
          <section className="max-w-[1400px] mx-auto px-6 pb-24 text-center">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              Твоё лето начинается <span className="text-rso-blue">здесь</span>
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
              Не упусти шанс стать частью масштабной истории Севастопольского регионального отделения РСО. Регистрация открыта.
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-rso-blue text-white font-bold uppercase text-xs tracking-wider px-10 py-4.5 rounded-xl hover:bg-black transition-colors shadow-lg shadow-blue-500/10"
            >
              Вступить в отряд →
            </Link>
          </section>
        )}

      </main>

      {/* Мягкий футер */}
      <footer className="border-t border-gray-100 py-10 bg-white text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Севастопольское региональное отделение // МООО РСО 2026 // Труд Крут
        </p>
      </footer>
    </div>
  );
}