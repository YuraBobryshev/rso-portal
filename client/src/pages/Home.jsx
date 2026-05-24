import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { display: flex; width: max-content; animation: marquee 35s linear infinite; }
      `}</style>

      <Header />

      <main className="pt-24 space-y-24 md:space-y-32">
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

        {/* Секция преимуществ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="lg:w-5/12 lg:sticky top-32 space-y-6">
              <span className="text-[10px] sm:text-xs font-bold text-rso-blue uppercase tracking-widest">Твои возможности</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black mt-4 leading-[1.1]">
                Больше, чем <br className="hidden lg:block"/> просто работа
              </h2>
            </div>
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Работа летом', text: 'Стабильный заработок на объектах. Официально.' },
                { title: 'Бесплатное обучение', text: 'Реальная профессия и сертификат.' },
                { title: 'Новые знакомства', text: 'Друзья со всей страны.' },
                { title: 'Прояви себя', text: 'Карьерный рост и лидерство.' }
              ].map((card, i) => (
                <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2rem] hover:shadow-lg transition-all">
                  <h3 className="text-lg font-black uppercase mb-3">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Направления */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {vectors.map((item, index) => (
              <Link to={`/brigades#direction-${item.code}`} key={index} className="aspect-[4/5] rounded-[2rem] p-6 flex flex-col relative overflow-hidden" style={{ backgroundColor: item.accent }}>
                <div className="text-white space-y-1 relative z-10">
                  <div className="text-base lg:text-2xl font-black uppercase tracking-tight">впереди <br /> лучшее лето</div>
                  <div className="text-xs font-medium opacity-90">➔ {item.slogan}</div>
                </div>
                <img src={item.logo} className="mt-auto w-[85%] h-auto object-contain" alt={item.title} />
              </Link>
            ))}
          </div>
        </section>

        {/* Трудовые объекты */}
        <section className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-4xl font-black mb-10">Наши трудовые объекты</h2>
          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <div key={i} className="p-6 bg-white border border-gray-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><span className="text-[9px] font-bold text-gray-400 block uppercase">Проект</span><p className="font-black uppercase">{obj.name}</p></div>
                <div><span className="text-[9px] font-bold text-gray-400 block uppercase">Локация</span><p className="text-sm font-bold text-gray-500">{obj.location}</p></div>
                <div><span className="text-[9px] font-bold text-gray-400 block uppercase">Задача</span><p className="text-sm text-gray-500">{obj.task}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Новости */}
        <section className="max-w-[1400px] mx-auto px-6 pb-20">
          <h2 className="text-4xl font-black mb-10">Новости штаба</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((post) => (
              <div key={post.id} className="bg-white border border-gray-100 rounded-[2rem] p-8">
                <p className="text-xs font-bold text-gray-400 uppercase mb-4">{new Date(post.createdAt).toLocaleDateString('ru-RU')}</p>
                <h3 className="text-lg font-black uppercase mb-3">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-6">{post.content.substring(0, 120)}...</p>
                <Link to="/news" className="text-xs font-bold text-rso-blue uppercase border-b border-blue-200">Подробнее →</Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-10 mt-12 bg-white text-center">
        <p className="text-[10px] font-bold uppercase text-gray-400">Севастопольское региональное отделение // МООО РСО 2026</p>
      </footer>
    </div>
  );
}