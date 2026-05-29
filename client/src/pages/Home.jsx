import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig'
import Header from '../components/Header';

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
    <div className="min-h-screen bg-white dark:bg-slate-900 text-rso-black dark:text-white transition-colors duration-300">
      <Header />

      <main className="pt-24 space-y-24 md:space-y-32">
        
        {/* HERO СЕКЦИЯ */}
        <section className="w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-xs font-stolzl uppercase tracking-widest text-rso-blue dark:text-blue-400">
              <span>Севастопольское отделение</span>
              <span className="w-8 h-[2px] bg-rso-blue/30"></span>
              <span>МООО РСО</span>
            </div>
            
            {/* Actay Wide Bold: Исключительный заголовок */}
            <h1 className="font-actay text-5xl sm:text-6xl md:text-[4.5rem] lg:text-[5rem] uppercase tracking-tight leading-[1] text-rso-black dark:text-white">
              СТУДЕНЧЕСКИЕ <br />
              <span className="text-rso-blue">ОТРЯДЫ</span>
            </h1>
            
            {/* Onest Regular: Текстовый блок */}
            <p className="font-onest text-base text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране. Это твоё лучшее студенчество.
            </p>
          </div>

          <div className="relative w-full aspect-[4/5] lg:aspect-square bg-rso-gray dark:bg-slate-800 rounded-[2rem] overflow-hidden">
            <img src={photoMain} className="w-full h-full object-cover" alt="Студенты РСО" />
            <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-lg">
              <span className="font-stolzl text-xs uppercase tracking-wider text-rso-black dark:text-white block mb-1">Трудовой семестр</span>
              {/* Stolzl Light: Только для чисел */}
              <span className="font-stolzl-light text-3xl text-rso-blue block leading-none">2026</span>
            </div>
          </div>
        </section>

        {/* О ДВИЖЕНИИ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            <div className="lg:w-5/12 lg:sticky top-32 flex flex-col justify-center">
              <span className="font-stolzl text-xs text-rso-blue uppercase tracking-widest">Твои возможности</span>
              {/* Stolzl: Подзаголовок */}
              <h2 className="font-stolzl font-bold text-4xl md:text-5xl uppercase tracking-tight mt-4 mb-6 leading-tight">
                Больше, чем <br/> просто работа
              </h2>
              <p className="font-onest text-gray-600 dark:text-gray-400 leading-relaxed">
                Российские Студенческие Отряды — это крупнейшая молодежная организация страны. Мы не просто даем работу на лето, мы создаем среду для твоего роста.
              </p>
            </div>
            
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Работа летом', desc: 'Официальное трудоустройство, белая зарплата и первая серьезная запись в трудовой.' },
                { title: 'Обучение', desc: 'Штаб бесплатно обучает новичков. Ты получишь реальную профессию и свидетельство.' },
                { title: 'Знакомства', desc: 'Слеты по всей стране, фестивали и песни. Найди единомышленников на всю жизнь.' },
                { title: 'Прояви себя', desc: 'Стань командиром отряда, организуй проекты и развивай лидерские навыки.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 p-8 rounded-[2rem] hover:shadow-xl transition-all">
                  <h3 className="font-stolzl font-bold text-xl uppercase mb-3 text-rso-black dark:text-white">{item.title}</h3>
                  <p className="font-onest text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* НАПРАВЛЕНИЯ */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-stolzl text-xs text-rso-blue uppercase tracking-widest">Наша Стратегия</span>
            <h2 className="font-stolzl font-bold text-4xl md:text-5xl uppercase mt-3 mb-4">Твой Вектор Развития</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {vectors.map((item, index) => (
              <Link
                to={`/brigades#direction-${item.code}`}
                key={index}
                className="aspect-[4/5] rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden relative group transition-transform hover:-translate-y-2"
                style={{ backgroundColor: item.accent }}
              >
                <div className="text-white z-10">
                  <div className="font-actay text-xl sm:text-2xl uppercase leading-tight">впереди <br /> лучшее лето</div>
                  <div className="font-stolzl text-xs mt-2 opacity-90">➔ {item.slogan}</div>
                </div>
                <img src={item.logo} className="w-[85%] mt-auto z-10 group-hover:scale-105 transition-transform" alt={item.title} />
              </Link>
            ))}
          </div>
        </section>

        {/* ПРИЗЫВ К ДЕЙСТВИЮ */}
        {!isLoggedIn && (
          <section className="max-w-[1400px] mx-auto px-6 pb-12">
            <div className="bg-rso-gray dark:bg-slate-800 rounded-[3rem] p-12 md:p-20 text-center">
              <h2 className="font-actay text-3xl md:text-5xl uppercase mb-6 text-rso-black dark:text-white">
                Твоё лето начинается здесь
              </h2>
              <p className="font-onest text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
                Не упусти шанс стать частью истории. Отряды уже начали набор новичков.
              </p>
              <Link to="/register" className="btn-primary">
                Вступить в отряд
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}