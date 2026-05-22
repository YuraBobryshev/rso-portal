import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// Возвращаем оригинальные импорты иконок из твоих ассетов
import ssoLogo from '../assets/icons/sso.svg';
import spoLogo from '../assets/icons/spo.svg';
import sopLogo from '../assets/icons/sop.svg';
import smoLogo from '../assets/icons/smo.svg';
import sservoLogo from '../assets/icons/sservo.svg';

const vectors = [
    { name: 'Строительные отряды', logo: ssoLogo, acronym: 'ССО', description: 'Возводим будущее своими руками.', color: 'border-blue-500' },
    { name: 'Педагогические отряды', logo: spoLogo, acronym: 'СПО', description: 'Зажигаем сердца и дарим детство.', color: 'border-yellow-400' },
    { name: 'Отряды проводников', logo: sopLogo, acronym: 'СОП', description: 'Романтика дорог и стук колес.', color: 'border-slate-500' },
    { name: 'Медицинские отряды', logo: smoLogo, acronym: 'СМО', description: 'Забота и здоровье в каждом сердце.', color: 'border-red-500' },
    { name: 'Сервисные отряды', logo: sservoLogo, acronym: 'ССервО', description: 'Создаем комфорт и настроение.', color: 'border-green-500' },
];

const timelineEvents = [
    { year: '2014', title: 'Возрождение', description: 'Первый сводный отряд Севастополя отправился на всероссийскую стройку в Сочи.' },
    { year: '2019', title: 'Юбилейный год', description: 'СевРО получило официальный статус и флаг организации.' },
    { year: '2021', title: 'Рекордные охваты', description: 'Впервые в регионе численность бойцов превысила 500 человек.' },
    { year: '2026', title: 'Цифровая Эра', description: 'Запуск единой экосистемы управления и геймификации.' },
];

export default function Home() {
    const [news, setNews] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsLoggedIn(true);

        const fetchNews = async () => {
            try {
                // Берем только 3 последние новости для превью на главной
                const response = await axios.get('http://176.98.177.3:5000/api/posts');
                setNews(response.data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="bg-white min-h-screen text-gray-900 font-sans">
            <Header />

            <main className="max-w-[1300px] mx-auto px-6 py-16 md:py-24 space-y-24">
                
                {/* --- SECTION 1: HERO & MANIFESTO --- */}
                <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto gap-6">
                    <div className="md:col-span-2 md:row-span-2 bg-gray-50 border border-gray-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-center gap-6 group hover:border-rso-blue hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <img src="https://upload.wikimedia.org/wikipedia/ru/thumb/e/e0/Russian_Student_Squads_logo.svg/1200px-Russian_Student_Squads_logo.svg.png" alt="RSO Logo" className="h-16 w-auto" />
                            <h2 className="text-sm font-semibold text-rso-blue uppercase tracking-widest">Российские Студенческие Отряды</h2>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight text-black group-hover:text-rso-blue transition">
                            Севастопольское <br /> региональное <br /> отделение
                        </h1>
                        <p className="text-gray-500 text-lg max-w-xl">
                            Возрождаем традиции, строим будущее и закаляем характеры. Твой путь в команду сильнейших начинается здесь.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-2 hover:shadow-lg hover:shadow-blue-500/10 transition duration-300">
                        <span className="text-7xl font-extrabold text-rso-blue tracking-tighter">10+</span>
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Лет Летописи</span>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-2 group transition duration-300">
                        <span className="text-7xl font-extrabold text-black group-hover:text-yellow-400 transition tracking-tighter">5</span>
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Направлений</span>
                    </div>

                    <Link to="/register" className="md:col-span-2 bg-rso-blue border border-rso-blue p-8 rounded-[2.5rem] text-center group hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-4 shadow-lg shadow-blue-500/20">
                        <span className="text-3xl font-extrabold text-white uppercase tracking-tighter">Стать бойцом</span>
                        <span className="text-3xl text-white group-hover:translate-x-2 transition-transform">→</span>
                    </Link>
                </section>

                {/* --- SECTION 2: ЛЕТОПИСЬ СЕВРО --- */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between gap-6">
                        <h2 className="text-4xl font-extrabold tracking-tighter text-black">Вехи Летописи СевРО</h2>
                        <div className="flex-grow h-px bg-gray-200"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl space-y-4 hover:border-gray-300 transition">
                            <span className="text-5xl font-black text-rso-blue tracking-tighter">{timelineEvents[0].year}</span>
                            <h3 className="text-2xl font-bold text-black tracking-tight">{timelineEvents[0].title}</h3>
                            <p className="text-gray-500">{timelineEvents[0].description}</p>
                        </div>
                        
                        {/* Главный блок летописи с синим акцентом */}
                        <div className="md:col-span-2 md:row-span-2 bg-rso-blue border border-rso-blue p-10 rounded-3xl flex flex-col justify-between shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
                            <div className="space-y-6">
                                <span className="text-8xl font-black text-white tracking-tighter">{timelineEvents[1].year}</span>
                                <h3 className="text-4xl font-extrabold text-white tracking-tighter">{timelineEvents[1].title}</h3>
                                <p className="text-blue-100 text-lg max-w-md">{timelineEvents[1].description}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl space-y-4 hover:border-gray-300 transition">
                            <span className="text-5xl font-black text-rso-blue tracking-tighter">{timelineEvents[2].year}</span>
                            <h3 className="text-2xl font-bold text-black tracking-tight">{timelineEvents[2].title}</h3>
                            <p className="text-gray-500">{timelineEvents[2].description}</p>
                        </div>
                        
                        <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl space-y-4 group hover:border-rso-blue transition duration-300">
                            <span className="text-5xl font-black text-black group-hover:text-yellow-400 transition tracking-tighter">{timelineEvents[3].year}</span>
                            <h3 className="text-2xl font-bold text-black tracking-tight">{timelineEvents[3].title}</h3>
                            <p className="text-gray-500">{timelineEvents[3].description}</p>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 3: ВЕСТИ ОТРЯДОВ --- */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-grow h-px bg-gray-200"></div>
                        <h2 className="text-4xl font-extrabold tracking-tighter text-black">Вестник СевРО</h2>
                    </div>

                    {news.length === 0 ? (
                        <div className="text-center bg-gray-50 border border-dashed border-gray-200 p-16 rounded-3xl">
                            <p className="text-gray-400 text-xl font-medium">Новостей пока нет, но они скоро появятся!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {news.map(post => (
                                <div key={post.id} className="bg-white border border-gray-100 shadow-sm p-8 rounded-3xl hover:border-rso-blue hover:shadow-md transition flex flex-col justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-rso-blue uppercase tracking-wider mb-3">
                                            {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                                        </div>
                                        <h3 className="text-xl font-bold text-black mb-4 line-clamp-2">{post.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-3 mb-6">{post.content}</p>
                                    </div>
                                    <Link to="/news" className="text-sm font-bold text-rso-blue hover:text-blue-700 transition">Читать →</Link>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="text-center pt-4">
                         <Link to="/news" className="inline-block px-8 py-4 bg-gray-50 border border-gray-200 text-gray-600 font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-gray-100 hover:text-black transition">
                            Открыть все новости
                        </Link>
                    </div>
                </section>

                {/* --- SECTION 4: НАПРАВЛЕНИЯ (Старые карточки с оригинальными лого) --- */}
                <section className="space-y-12 pb-24">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-sm font-semibold text-rso-blue uppercase tracking-widest mb-4">Наша Стратегия</h2>
                        <h1 className="text-5xl font-extrabold tracking-tighter leading-tight text-black">Твой Вектор Развития</h1>
                        <p className="text-gray-500 text-lg mt-6">Выбирай свое призвание среди 5 ключевых трудовых направлений Севастополя.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {vectors.map((item, index) => (
                            <Link to="/brigades" key={index} className={`bg-white border-t-4 border-gray-100 shadow-sm ${item.color} p-8 rounded-3xl flex flex-col justify-between gap-6 hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-2 transition duration-300 group cursor-pointer`}>
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        {/* Возвращаем оригинальный цветной SVG */}
                                        <img 
                                            src={item.logo} 
                                            alt={item.acronym} 
                                            className="h-14 w-14 object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <span className="text-4xl font-black text-gray-100 group-hover:text-gray-200 transition tracking-tighter">{item.acronym}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-black tracking-tight">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}