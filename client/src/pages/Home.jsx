import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Header';

// Импорты ассетов
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

  const vectors = [
    { code: 'ССО', title: 'Строительные отряды', slogan: 'на стройке', accent: '#0052FF', logo: ssoLogo },
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
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: max-content; animation: marquee 35s linear infinite; }
      `}</style>

      <Header />

      <main className="pt-24 space-y-24 md:space-y-32">
        
        {/* HERO СЕКЦИЯ */}
        <section className="w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-bold tracking-widest text-rso-blue uppercase">
              <span>Севастопольское отделение</span>
              <span className="w-8 h-[2px] bg-rso-blue/30"></span>
              <span>МООО РСО</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-[5rem] lg:text-[5.5rem] font-black uppercase tracking-tight leading-[0.9] text-black">
              СТУДЕНЧЕСКИЕ <br /> ОТРЯДЫ <br /> <span className="text-rso-blue">СЕВАСТОПОЛЯ</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium max-w-lg leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm group border border-gray-100/50"
          >
            <img src={photoMain} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Студенты РСО" />
            <div className="absolute bottom-6 left-6 bg-white px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-black shadow-lg shadow-black/5">
              Трудовой семестр 2026
            </div>
          </motion.div>
        </section>

        {/* ВОЗМОЖНОСТИ (BENTO ГРИД) */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
            <div className="lg:w-5/12 lg:sticky top-32 space-y-6 flex flex-col justify-center">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-widest">Твои возможности</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black mt-4 leading-[1.1]">
                  Больше, чем <br className="hidden lg:block"/> просто работа
                </h2>
              </div>
            </div>
            
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 auto-rows-fr">
              {[
                { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, title: "Работа летом", text: "Стабильный заработок на крупнейших объектах." },
                { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.314a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.838l9.36 4.314a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>, title: "Бесплатное обучение", text: "Реальная профессия и сертификат государственного образца." },
                { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>, title: "Новые знакомства", text: "Друзья со всей страны на всю жизнь." },
                { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>, title: "Прояви себя", text: "Лидерские навыки и карьерный рост." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2rem] hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8 border border-gray-200 text-rso-blue group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">{item.icon}</div>
                  <h3 className="text-lg font-black uppercase mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* НАПРАВЛЕНИЯ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-widest">Наша Стратегия</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black mt-3">Твой Вектор Развития</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-5">
            {vectors.map((item, i) => (
              <motion.div key={i} whileHover={{ y: -10 }}>
                <Link to={`/brigades#direction-${item.code}`} className="aspect-square sm:aspect-[4/5] rounded-[2rem] p-6 flex flex-col justify-between" style={{ backgroundColor: item.accent }}>
                  <div className="text-white">
                    <div className="text-xl font-black uppercase leading-tight">впереди <br /> лучшее лето</div>
                    <div className="text-xs opacity-90 mt-2">➔ {item.slogan}</div>
                  </div>
                  <img src={item.logo} className="w-[85%] mt-auto" alt={item.code} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ОБЪЕКТЫ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl font-black mb-10">Трудовые объекты</h2>
          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.01 }}
                className="p-6 bg-white border border-gray-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6 hover:shadow-lg transition-all"
              >
                <div><span className="text-[9px] font-bold text-gray-400 uppercase">Проект</span><p className="font-black uppercase">{obj.name}</p></div>
                <div><span className="text-[9px] font-bold text-gray-400 uppercase">Локация</span><p className="font-bold text-gray-500">{obj.location}</p></div>
                <div><span className="text-[9px] font-bold text-gray-400 uppercase">Задача</span><p className="text-sm text-gray-500">{obj.task}</p></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* НОВОСТИ */}
        <section className="max-w-[1400px] mx-auto px-6 pb-20">
          <h2 className="text-4xl font-black mb-10">Новости штаба</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((post) => (
              <div key={post.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
                <h3 className="text-lg font-black uppercase mb-3">{post.title}</h3>
                <Link to="/news" className="text-xs font-bold text-rso-blue uppercase border-b border-blue-200">Подробнее →</Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-10 bg-white text-center">
        <p className="text-[10px] font-bold uppercase text-gray-400">Севастопольское региональное отделение // МООО РСО 2026 // Труд Крут</p>
      </footer>
    </div>
  );
}