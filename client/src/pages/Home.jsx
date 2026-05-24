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
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      <Header />
      <main className="pt-24 space-y-24 md:space-y-32">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <h1 className="text-5xl md:text-[5.5rem] font-black uppercase tracking-tight leading-[0.9]">
              СТУДЕНЧЕСКИЕ <br /> ОТРЯДЫ <br /> <span className="text-blue-600">СЕВАСТОПОЛЯ</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-lg">Главное молодежное движение Севастополя. Мы строим города, воспитываем детей и создаем будущее.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm">
            <img src={photoMain} className="w-full h-full object-cover" alt="Главная" />
          </motion.div>
        </section>

        {/* ВОЗМОЖНОСТИ */}
        <section className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: '💼', title: 'Работа летом', text: 'Стабильный заработок на объектах.' },
            { icon: '🎓', title: 'Бесплатное обучение', text: 'Профессия и сертификат.' },
            { icon: '🤝', title: 'Новые знакомства', text: 'Друзья со всей страны.' },
            { icon: '🚀', title: 'Прояви себя', text: 'Лидерство и карьера.' }
          ].map((card, i) => (
            <motion.div key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} className="bg-white border border-gray-100 p-8 rounded-[2rem] hover:shadow-lg transition-all">
              <div className="text-2xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-black uppercase mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.text}</p>
            </motion.div>
          ))}
        </section>

        {/* НАПРАВЛЕНИЯ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl font-black mb-10">Твой вектор развития</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-5">
            {vectors.map((item, index) => (
              <motion.div key={index} whileHover={{ y: -5 }}>
                <Link to={`/brigades#direction-${item.code}`} className="aspect-square sm:aspect-[4/5] rounded-[2rem] p-6 flex flex-col justify-between" style={{ backgroundColor: item.accent }}>
                  <div className="text-white"><div className="text-sm font-black uppercase">впереди <br /> лучшее лето</div></div>
                  <img src={item.logo} className="w-[85%]" alt={item.code} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ТРУДОВЫЕ ОБЪЕКТЫ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl font-black mb-10">Трудовые объекты</h2>
          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <motion.div key={i} whileHover={{ scale: 1.01 }} className="p-6 bg-white border border-gray-100 rounded-[2rem] flex flex-col md:flex-row justify-between gap-4 transition-all">
                <span className="font-black uppercase">{obj.name}</span>
                <span className="text-gray-500">{obj.location}</span>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{obj.task}</span>
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
                <h3 className="font-bold mb-2">{post.title}</h3>
                <Link to="/news" className="text-xs font-bold text-blue-600 uppercase">Подробнее →</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}