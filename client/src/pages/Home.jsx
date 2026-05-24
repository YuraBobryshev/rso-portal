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
      <Header />

      <main className="pt-24 space-y-24 md:space-y-32">
        
        {/* 1. HERO - Пофикшен под мобилу + анимация */}
        <section className="w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-rso-blue uppercase">
              <span>Севастопольское отделение</span>
            </div>
            <h1 className="text-5xl md:text-[5.5rem] font-black uppercase tracking-tight leading-[0.9] text-black">
              СТУДЕНЧЕСКИЕ <br /> ОТРЯДЫ <br /> <span className="text-rso-blue">СЕВАСТОПОЛЯ</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium max-w-lg">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative w-full aspect-square lg:aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100/50">
            <img src={photoMain} className="w-full h-full object-cover" alt="Студенты РСО" />
          </motion.div>
        </section>

        {/* 2. ВОЗМОЖНОСТИ - Анимация при скролле + подсветка */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              { icon: '💼', title: 'Работа летом', text: 'Стабильный заработок.' },
              { icon: '🎓', title: 'Бесплатное обучение', text: 'Реальная профессия.' },
              { icon: '🤝', title: 'Новые знакомства', text: 'Друзья на всю жизнь.' },
              { icon: '🚀', title: 'Прояви себя', text: 'Карьерный рост.' }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white border border-gray-100 p-8 rounded-[2rem] transition-all"
              >
                <div className="text-2xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-black uppercase mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. НАПРАВЛЕНИЯ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-5">
            {vectors.map((item, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                <Link to={`/brigades#direction-${item.code}`} className="aspect-square sm:aspect-[4/5] rounded-[2rem] p-6 flex flex-col justify-between" style={{ backgroundColor: item.accent }}>
                  <div className="text-white">
                    <div className="text-sm font-black uppercase">впереди <br /> лучшее лето</div>
                  </div>
                  <img src={item.logo} className="w-[80%]" alt={item.code} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. ОБЪЕКТЫ - Анимация карточек */}
        <section className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl font-black mb-10">Трудовые объекты</h2>
          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ backgroundColor: "#f8fafc", scale: 1.01 }}
                className="p-6 bg-white border border-gray-100 rounded-[2rem] flex flex-col md:flex-row justify-between gap-4 transition-all"
              >
                <div className="font-black uppercase">{obj.name}</div>
                <div className="text-sm text-gray-500">{obj.location}</div>
                <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">{obj.task}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. НОВОСТИ */}
        <section className="max-w-[1400px] mx-auto px-6 pb-20">
          <h2 className="text-4xl font-black mb-10">Новости штаба</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((post) => (
              <div key={post.id} className="border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                <h3 className="font-bold mb-2">{post.title}</h3>
                <Link to="/news" className="text-xs font-bold text-rso-blue uppercase">Подробнее →</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}