import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import CreatePostModal from '../components/CreatePostModal';

const ssoLogo = '/logos/sso.svg';
const spoLogo = '/logos/spo.svg';
const sopLogo = '/logos/sop.svg';
const smoLogo = '/logos/smo.svg';
const sservoLogo = '/logos/sservo.svg';

const vectors = [
    { name: 'Строительные отряды', logo: ssoLogo, acronym: 'ССО', description: 'Возводим будущее своими руками.', color: 'border-blue-500' },
    { name: 'Педагогические отряды', logo: spoLogo, acronym: 'СПО', description: 'Зажигаем сердца и дарим детство.', color: 'border-yellow-400' },
    { name: 'Отряды проводников', logo: sopLogo, acronym: 'СОП', description: 'Романтика дорог и стук колес.', color: 'border-slate-500' },
    { name: 'Медицинские отряды', logo: smoLogo, acronym: 'СМО', description: 'Забота и здоровье в каждом сердце.', color: 'border-red-500' },
    { name: 'Сервисные отряды', logo: sservoLogo, acronym: 'ССервО', description: 'Создаем комфорт и настроение.', color: 'border-green-500' },
];

// Летопись - перенесли и переработали данные из About.jsx
const timelineEvents = [
    { year: '2014', title: 'Возрождение', description: 'Первый сводный отряд Севастополя отправился на всероссийскую стройку в Сочи.' },
    { year: '2019', title: 'Юбилейный год', description: 'СевРО получило официальный статус и флаг организации.' },
    { year: '2021', title: 'Рекордные охваты', description: 'Впервые в регионе численность бойцов превысила 500 человек.' },
    { year: '2026', title: 'Цифровая Эра', description: 'Запуск единой экосистемы управления и геймификации.' },
];

const Home = () => {
    const [news, setNews] = useState([]);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://176.98.177.3:5000/api/posts');
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.role) {
            setUserRole(userData.role);
        }

        fetchNews();
    }, []);

    const handlePostCreated = (newPost) => {
        setNews([newPost, ...news]);
    };

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 dark font-sans">
            <Header />

            <main className="container mx-auto px-4 py-16 md:py-24 space-y-24">
                
                {/* --- SECTION 1: HERO & MANIFESTO (BENTO-STYLE) --- */}
                {/* Уходим от центрированного текста к сложному Bento-гриду по референсу */}
                <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto gap-6">
                    {/* Big Title Box - Спанним на 2 колонки и 2 ряда (YOUR UNLIMITED AI SIDEKICK VIBE) */}
                    <div className="md:col-span-2 md:row-span-2 bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-xl flex flex-col justify-center gap-6 group hover:border-blue-700 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <img src="https://upload.wikimedia.org/wikipedia/ru/thumb/e/e0/Russian_Student_Squads_logo.svg/1200px-Russian_Student_Squads_logo.svg.png" alt="RSO Logo" className="h-16 w-auto" />
                            <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest">Российские Студенческие Отряды</h2>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight text-white group-hover:text-blue-200 transition">
                            Севастопольское <br /> региональное <br /> отделение
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl">
                            Возрождаем традиции, строим будущее и закаляем характеры. Твой путь в команду сильнейших начинается здесь.
                        </p>
                    </div>

                    {/* Smaller Feature Boxes (Как блоки со статистикой/кнопками на рефе) */}
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-2 hover:drop-shadow-blue transition duration-300">
                        <span className="text-7xl font-extrabold text-blue-500 tracking-tighter">10+</span>
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Лет Летописи</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-2 group transition duration-300">
                        <span className="text-7xl font-extrabold text-white group-hover:text-yellow-300 transition tracking-tighter">5</span>
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Направлений</span>
                    </div>

                    {/* Кнопка действия - Большая, агрессивная */}
                    <a href="/register" className="md:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center group hover:border-blue-500 hover:drop-shadow-blue transition-all duration-300 flex items-center justify-center gap-4">
                        <span className="text-3xl font-extrabold text-blue-400 uppercase tracking-tighter">Стать бойцом</span>
                        <i className="fa-solid fa-arrow-right text-2xl text-blue-500 group-hover:translate-x-2 transition-transform"></i>
                    </a>
                </section>


                {/* --- SECTION 2: ЛЕТОПИСЬ СЕВРО (Redesigned Bento History) --- */}
                {/* Вместо скучного списка - сложный грид с разным размером плиток, как на рефе */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between gap-6">
                        <h2 className="text-4xl font-extrabold tracking-tighter text-white">Вехи Летописи СевРО</h2>
                        <div className="flex-grow h-px bg-slate-800"></div>
                        <i className="fa-solid fa-timeline text-3xl text-blue-500"></i>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* 2014 - Старт */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 hover:border-blue-700 transition">
                            <div className="flex items-center justify-between">
                                <span className="text-5xl font-black text-blue-600 tracking-tighter">{timelineEvents[0].year}</span>
                                <i className="fa-solid fa-flag-checkered text-xl text-slate-700"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{timelineEvents[0].title}</h3>
                            <p className="text-slate-400">{timelineEvents[0].description}</p>
                        </div>
                        
                        {/* 2019 - Спан на 2 колонки (более важный этап, как большой блок на рефе) */}
                        <div className="md:col-span-2 md:row-span-2 bg-slate-900 border border-slate-800 p-10 rounded-3xl flex flex-col justify-between hover:drop-shadow-blue transition-all duration-300">
                            <div className="space-y-6">
                                <span className="text-8xl font-black text-white tracking-tighter">{timelineEvents[1].year}</span>
                                <h3 className="text-4xl font-extrabold text-white tracking-tighter">{timelineEvents[1].title}</h3>
                                <p className="text-slate-400 text-lg max-w-md">{timelineEvents[1].description}</p>
                            </div>
                            <div className="flex gap-4">
                                <i className="fa-solid fa-medal text-4xl text-yellow-400"></i>
                                <i className="fa-solid fa-shield-blank text-4xl text-yellow-400"></i>
                            </div>
                        </div>

                        {/* 2021 */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 hover:border-blue-700 transition">
                            <span className="text-5xl font-black text-blue-600 tracking-tighter">{timelineEvents[2].year}</span>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{timelineEvents[2].title}</h3>
                            <p className="text-slate-400">{timelineEvents[2].description}</p>
                        </div>
                        
                        {/* 2026 - Финал/Цифра */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 group hover:border-blue-500 hover:drop-shadow-blue transition duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-5xl font-black text-white group-hover:text-yellow-300 transition tracking-tighter">{timelineEvents[3].year}</span>
                                <i className="fa-solid fa-microchip text-xl text-slate-700"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{timelineEvents[3].title}</h3>
                            <p className="text-slate-400">{timelineEvents[3].description}</p>
                        </div>
                    </div>
                </section>


                {/* --- SECTION 3: ВЕСТИ ОТРЯДОВ (Dark Bento News) --- */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between gap-6">
                        <i className="fa-solid fa-newspaper text-3xl text-blue-500"></i>
                        <div className="flex-grow h-px bg-slate-800"></div>
                        <h2 className="text-4xl font-extrabold tracking-tighter text-white">Вестник СевРО</h2>
                    </div>

                    {(userRole === 'COMMANDER' || userRole === 'REG_HQ') && (
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center mb-10 hover:border-blue-700 transition">
                            <CreatePostModal onPostCreated={handlePostCreated} />
                        </div>
                    )}

                    {news.length === 0 ? (
                        <div className="text-center bg-slate-900 border border-slate-800 p-16 rounded-3xl hover:border-red-600 transition">
                            <i className="fa-solid fa-hourglass-half text-6xl text-slate-700 mb-6 block"></i>
                            <p className="text-slate-500 text-xl font-medium">Новостей пока нет, но они скоро появятся!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.map(post => <NewsCard key={post.id} post={post} />)}
                        </div>
                    )}
                </section>


                {/* --- SECTION 4: НАПРАВЛЕНИЯ (Refined Vectors) --- */}
                <section className="space-y-12 pb-24">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-4">Наша Стратегия</h2>
                        <h1 className="text-5xl font-extrabold tracking-tighter leading-tight text-white">Твой Вектор Развития</h1>
                        <p className="text-slate-400 text-lg mt-6">Выбирай свое призвание среди 5 ключевых трудовых направлений Севастополя.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {vectors.map((item, index) => (
                            <div key={index} className={`bg-slate-900 border-2 ${item.color} p-8 rounded-3xl flex flex-col justify-between gap-6 hover:drop-shadow-blue transition duration-300 group`}>
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div 
                                            className="h-16 w-16 bg-slate-700 group-hover:scale-110 transition-transform duration-300"
                                            style={{
                                                mask: `url(${item.logo}) no-repeat center`,
                                                WebkitMask: `url(${item.logo}) no-repeat center`,
                                                maskSize: 'contain',
                                                WebkitMaskSize: 'contain'
                                            }}
                                        />
                                        <span className="text-5xl font-black text-slate-800 group-hover:text-slate-600 transition tracking-tighter">{item.acronym}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-slate-100 transition tracking-tight">{item.name}</h3>
                                    <p className="text-slate-400 group-hover:text-slate-300 transition">{item.description}</p>
                                </div>
                                <a href="/brigades" className="text-blue-500 font-semibold group-hover:text-blue-300 transition flex items-center gap-2">
                                    Найти отряд
                                    <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Home;