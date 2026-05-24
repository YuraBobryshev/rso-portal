import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
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
        
        {/* 1. HERO СЕКЦИЯ */}
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
          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm group border border-gray-100/50">
            <img src={photoMain} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Студенты РСО" />
            <div className="absolute bottom-6 left-6 bg-white px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-black shadow-lg shadow-black/5">
              Трудовой семестр 2026
            </div>
          </div>
        </section>

        {/* 2. О ДВИЖЕНИИ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
            <div className="lg:w-5/12 lg:sticky top-32 space-y-6 flex flex-col justify-center">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-widest">Твои возможности</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black mt-4 leading-[1.1]">Больше, чем <br className="hidden lg:block"/> просто работа</h2>
              </div>
            </div>
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 auto-rows-fr">
              {[
                { icon: '💼', title: 'Работа летом', text: 'Стабильный заработок на объектах.' },
                { icon: '🎓', title: 'Бесплатное обучение', text: 'Профессия и сертификат.' },
                { icon: '🤝', title: 'Новые знакомства', text: 'Друзья на всю жизнь.' },
                { icon: '🚀', title: 'Прояви себя', text: 'Лидерство и карьера.' }
              ].map((card, i) => (
                <motion.div key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2rem] hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl mb-8">{card.icon}</div>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-black mb-3">{card.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. НАПРАВЛЕНИЯ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {vectors.map((item, index) => (
              <motion.div key={index} whileHover={{ y: -5 }}>
                <Link to={`/brigades#direction-${item.code}`} className="aspect-square sm:aspect-[4/5] rounded-[1.25rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300" style={{ backgroundColor: item.accent }}>
                  <div className="text-white space-y-0.5"><div className="text-sm font-black uppercase">впереди <br /> лучшее лето</div></div>
                  <img src={item.logo} className="w-[90%] mt-auto" alt={item.title} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. ОБЪЕКТЫ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl font-black mb-10">Трудовые объекты</h2>
          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.01 }} className="p-6 bg-white border border-gray-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-sm hover:shadow-lg transition-all">
                <div className="md:col-span-4"><span className="text-[9px] font-bold text-gray-400 block uppercase">Проект</span><p className="font-black uppercase">{obj.name}</p></div>
                <div className="md:col-span-3"><span className="text-[9px] font-bold text-gray-400 block uppercase">Локация</span><p className="text-sm font-bold text-gray-500">{obj.location}</p></div>
                <div className="md:col-span-5"><span className="text-[9px] font-bold text-gray-400 block uppercase">Задача</span><p className="text-sm text-gray-500">{obj.task}</p></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. НОВОСТИ */}
        <section className="max-w-[1400px] mx-auto px-6 pb-20">
          <h2 className="text-4xl font-black mb-10">Новости штаба</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((post) => (
              <div key={post.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">{new Date(post.createdAt).toLocaleDateString('ru-RU')}</p>
                <h3 className="text-lg font-black uppercase mb-3">{post.title}</h3>
                <Link to="/news" className="text-xs font-bold text-rso-blue uppercase border-b border-blue-200">Подробнее →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CTA */}
        {!isLoggedIn && (
          <section className="max-w-[1400px] mx-auto px-6 pb-12">
            <div className="bg-gray-50 border border-gray-100 rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center shadow-sm">
              <h2 className="text-3xl md:text-6xl font-black uppercase mb-6">Твоё лето начинается здесь</h2>
              <Link to="/register" className="inline-block bg-rso-blue text-white font-bold uppercase text-sm px-12 py-5 rounded-2xl hover:bg-black transition-colors">Вступить в отряд →</Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}