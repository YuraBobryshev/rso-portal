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

  // Массив из 6 уменьшенных направлений
  const vectors = [
    { title: "Педагогические отряды", desc: "Воспитание будущего поколения в лучших детских центрах.", img: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=600" },
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

      {/* Поджали отступ сверху с mt-16 до mt-10 */}
      <main className="mt-10">
        
        {/* ================= 1. HERO СЕКЦИЯ (Уменьшили вертикальные отступы py) ================= */}
        <section className="w-full max-w-[1600px] mx-auto px-6 py-8 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Левая колонка */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-rso-blue uppercase">
              <span>[ СЕВАСТОПОЛЬ ]</span>
              <span className="w-8 h-[1px] bg-rso-blue"></span>
              <span>МОЛОДЕЖЬ НАШЕГО ВРЕМЕНИ</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Энергия. <br />
              <span className="text-rso-blue">Труд.</span> <br />
              Романтика.
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 font-medium max-w-xl leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
          </div>

          {/* Правая колонка */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-[4/5] bg-gray-100 overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1974" 
              className="w-full h-full object-cover" 
              alt="Студенты РСО" 
            />
            <div className="absolute bottom-4 left-6 z-20 text-white font-mono text-[10px] uppercase tracking-widest opacity-80">
              // LINE_OF_STUDENT_BRIGADES_2026
            </div>
          </div>
        </section>


        {/* ================= 2. КИНЕМАТОГРАФИЧНЫЙ МАНИФЕСТ ================= */}
        <section className="w-full bg-rso-blue text-white py-4 overflow-hidden select-none">
          <div className="animate-marquee">
            {[...Array(4)].map((_, idx) => (
              <span key={idx} className="text-4xl md:text-5xl font-black uppercase tracking-tighter mx-4 whitespace-nowrap">
                • ТРУД КРУТ • МЫ ШТОРМ У ЧЕРНОГО МОРЯ • РОССИЙСКИЕ СТУДЕНЧЕСКИЕ ОТРЯДЫ • СЕВАСТОПОЛЬ 
              </span>
            ))}
          </div>
        </section>


        {/* ================= 3. СЕКЦИЯ-МАНИФЕСТ: ЧТО ТАКОЕ РСО? ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-rso-blue">// МАНФИЕСТ ДВИЖЕНИЯ</h2>
            <p className="text-3xl font-black uppercase tracking-tighter mt-4 leading-tight">
              Больше чем просто работа. <br />Это стиль жизни.
            </p>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase text-rso-blue">01 / Профессиональный старт</h3>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                Официальное трудоустройство на ключевых объектах и курортах России. Получай востребованную специальность бесплатно и зарабатывай свои первые серьезные деньги уже этим летом.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase text-rso-blue">02 / Настоящее комьюнити</h3>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                Сотни единомышленников, фестивали, творческие конкурсы, слеты от Владивостока до Калининграда и песни у костра. Здесь ты найдешь друзей на всю жизнь.
              </p>
            </div>
          </div>
        </section>


        {/* ================= 4. ОБНОВЛЕННЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ (6 ШТ, МЕНЬШЕ РАЗМЕРОМ) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 pb-24">
          <div className="mb-10">
            <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest">// НАШИ ВЕКТОРЫ</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter mt-1">Выбери свой фронт</h2>
          </div>

          {/* Компактная адаптивная сетка: 1 колонка на мобилках, 2 на планшетах, 3 на ПК */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vectors.map((item, index) => (
              <div key={index} className="group relative aspect-[16/10] bg-gray-950 overflow-hidden shadow-md border border-gray-100">
                {/* Фоновое фото с затемнением */}
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover opacity-40 transition-transform duration-700 scale-101 group-hover:scale-105 group-hover:opacity-25" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                
                {/* Текстовый блок */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20">
                  <span className="text-[10px] font-mono opacity-50 mb-1 block">0{index + 1} // DIRECTION</span>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-1 text-white group-hover:text-rso-blue transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] opacity-70 font-medium leading-relaxed line-clamp-2 max-w-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 5. АСИММЕТРИЧНЫЙ ЖУРНАЛЬНЫЙ ВЕСТНИК ================= */}
        <section className="w-full bg-gray-50 border-y border-gray-100 py-20">
          <div className="max-w-[1600px] mx-auto px-6">
            
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest">// ИНФОРМАЦИОННОЕ ПОЛЕ</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter mt-1">Вестник штаба</h2>
              </div>
              <Link to="/news" className="text-xs font-bold uppercase border-b-2 border-black pb-0.5 hover:text-rso-blue hover:border-rso-blue transition-colors">
                Все публикации →
              </Link>
            </div>

            {loadingNews ? (
              <div className="py-20 text-center font-mono text-xs uppercase tracking-widest opacity-30 animate-pulse">
                Синхронизация медиа-потока...
              </div>
            ) : latestNews.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Главный пост (Слева) */}
                <div className="lg:col-span-7 flex flex-col justify-between group">
                  <div className="w-full aspect-[16/10] bg-white overflow-hidden shadow-sm mb-4">
                    {latestNews[0].imageUrl ? (
                      <img src={latestNews[0].imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" alt=""/>
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center font-black text-3xl text-rso-blue opacity-20">SEVRO</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-mono opacity-50">{new Date(latestNews[0].createdAt).toLocaleDateString('ru-RU')}</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-rso-blue group-hover:text-black transition-colors">
                      {latestNews[0].title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium line-clamp-3">
                      {latestNews[0].content}
                    </p>
                    <Link to="/news" className="inline-block text-xs font-bold text-rso-blue border-b border-rso-blue pt-1 hover:text-black hover:border-black transition-colors">Читать материал →</Link>
                  </div>
                </div>

                {/* Два второстепенных поста списком (Справа) */}
                <div className="lg:col-span-5 divide-y divide-gray-200 space-y-6 lg:space-y-0 lg:divide-y">
                  {latestNews.slice(1, 3).map((post, idx) => (
                    <div key={post.id} className={`group flex flex-col justify-between ${idx > 0 ? 'pt-6' : 'lg:pb-6'}`}>
                      <div className="space-y-1">
                        <span className="text-xs font-mono opacity-50">{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
                        <h4 className="text-lg font-black uppercase text-rso-blue group-hover:text-black transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-gray-500 text-xs leading-relaxed font-medium line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                      <Link to="/news" className="inline-block text-[11px] font-bold text-rso-blue border-b border-rso-blue w-fit mt-3 hover:text-black hover:border-black transition-colors">Перейти →</Link>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-sm font-bold uppercase opacity-30">Реестр новостей пуст</div>
            )}
          </div>
        </section>


        {/* ================= 6. УМНАЯ СЕКЦИЯ ПРИЗЫВА (СКРЫВАЕТСЯ ПРИ ВХОДЕ) ================= */}
        {!isLoggedIn && (
          <section className="max-w-[1400px] mx-auto px-6 py-20 lg:py-28 text-center border-t border-gray-100">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              Твоё лето <br />начинается <span className="text-rso-blue">здесь</span>
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto mb-10 font-medium leading-relaxed">
              Не упусти шанс стать частью масштабной истории Севастопольского регионального отделения РСО. Регистрация открыта.
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-rso-blue text-white font-black uppercase text-xs tracking-[0.2em] px-12 py-5 hover:bg-black transition-colors shadow-xl shadow-blue-500/10"
            >
              Вступить в отряд →
            </Link>
          </section>
        )}

      </main>

      {/* Футер */}
      <footer className="border-t border-gray-100 py-10 bg-white text-center">
        <p className="text-[10px] font-mono font-bold uppercase opacity-30 tracking-[0.3em]">
          СЕВАСТОПОЛЬСКОЕ РЕГИОНАЛЬНОЕ ОТДЕЛЕНИЕ // МООО РСО 2026 // ТРУД КРУТ
        </p>
      </footer>
    </div>
  );
}