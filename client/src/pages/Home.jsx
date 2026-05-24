import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// Импорт аватарок/иконок (используем те, что уже есть, либо дефолтные)
import ssoLogo from '../assets/icons/sso.svg';
import spoLogo from '../assets/icons/spo.svg';
import sopLogo from '../assets/icons/sop.svg';

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-[#0052FF] selection:text-white pb-20">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-24">
        
        {/* ================= HERO СЕКЦИЯ (СИНИЙ БЛОК) ================= */}
        <section className="relative bg-[#0052FF] rounded-[2.5rem] md:rounded-[3.5rem] pt-12 md:pt-16 px-6 md:px-14 pb-16 mt-6 shadow-2xl shadow-blue-500/20">
          
          {/* Декоративная плашка сверху */}
          <div className="inline-block border border-white/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm relative z-10">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/90">
              Двухмесячный трудовой семестр
            </span>
          </div>

          <div className="flex flex-col md:flex-row relative">
            
            {/* Левая текстовая часть */}
            <div className="w-full md:w-2/3 relative z-10 flex flex-col">
              
              {/* Ступенчатый заголовок 1-в-1 как на референсе */}
              <div className="flex flex-col text-5xl sm:text-6xl md:text-[5rem] lg:text-[6rem] leading-[0.85] font-black uppercase tracking-tighter">
                <span className="text-[#E1FF00]">СИСТЕМА</span>
                <span className="text-white sm:ml-12 md:ml-32">РОСТА</span>
                <span className="text-white flex items-center flex-wrap gap-2 md:gap-4">
                  БОЙЦА С НУЛЯ
                  {/* Иконка вместо Instagram */}
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-[#E1FF00] rounded-2xl flex items-center justify-center rotate-12 shadow-lg">
                    <span className="text-xl md:text-3xl">🔥</span>
                  </div>
                </span>
              </div>

              <p className="mt-8 text-sm md:text-base font-medium text-blue-100 max-w-sm leading-relaxed">
                Узнаешь, как провести лучшее лето, заработать первые деньги и найти верных друзей без опыта и резюме.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/register" className="bg-[#E1FF00] text-black px-8 py-4 rounded-full font-black uppercase text-xs tracking-wider hover:scale-105 transition-transform shadow-lg shadow-[#E1FF00]/20">
                  Стать бойцом
                </Link>
                <a href="#program" className="border-2 border-white/50 text-white px-8 py-3.5 rounded-full font-black uppercase text-xs tracking-wider hover:bg-white/10 transition-colors">
                  Программа
                </a>
              </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: ВАШЕ ФОТО ДЕВУШКИ В БОЙЦОВКЕ */}
            <div className="w-full md:w-1/3 absolute bottom-0 right-0 md:-right-10 flex justify-end items-end h-[120%] pointer-events-none z-0 hidden md:flex">
              {/* TODO: ВСТАВЬ СЮДА ССЫЛКУ НА ФОТО ДЕВУШКИ В БОЙЦОВКЕ! 
                Для идеального эффекта нужен PNG с прозрачным фоном.
              */}
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
                alt="Девушка в бойцовке" 
                className="h-full w-auto object-cover object-bottom"
                style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)' }}
              />
            </div>

          </div>
        </section>


        {/* ================= СТРОКА ДАТ / НАПРАВЛЕНИЙ (Бегущая/Flex) ================= */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 py-10 md:py-14 border-b border-gray-100">
          {['СТРОИТЕЛИ', 'ВОЖАТЫЕ', 'ПРОВОДНИКИ', 'МЕДИКИ', 'СЕРВИС', 'СТРОИТЕЛИ', 'ВОЖАТЫЕ'].map((tag, idx) => (
            <span key={idx} className="border border-gray-200 text-gray-500 rounded-full px-5 py-1.5 text-[10px] font-black uppercase tracking-widest hover:border-black hover:text-black transition-colors cursor-default">
              {tag}
            </span>
          ))}
        </div>


        {/* ================= СЕКЦИЯ "ДЛЯ КОГО" (6 КАРТОЧЕК) ================= */}
        <section className="py-16 md:py-20">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-center text-black mb-12">
            Для кого это движение?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Карточка 1 (Желтая) */}
            <div className="bg-[#FDFFC2] rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden">
              <div>
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black mb-3">Кто хочет найти друзей, но не знает, с чего начать</h3>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  Для тех, кому не хватает живого общения, выездов на природу и настоящей студенческой романтики.
                </p>
              </div>
              <div className="w-10 h-10 bg-[#E1FF00] rounded-full flex items-center justify-center self-end border border-yellow-300 shadow-sm mt-6">
                <span className="text-lg">👇</span>
              </div>
            </div>

            {/* Карточка 2 (Серая) */}
            <div className="bg-[#F3F4F6] rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black mb-3">Кто хочет яркий досуг</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Нас постоянно окружают форумы, творческие фестивали, спартакиады и гитары у костра. Откладывать жизнь больше не придется.
                </p>
              </div>
              <div className="w-10 h-10 bg-[#E1FF00] rounded-full flex items-center justify-center self-end shadow-sm mt-6">
                <span className="text-lg">👇</span>
              </div>
            </div>

            {/* Карточка 3 (Серая) */}
            <div className="bg-[#F3F4F6] rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black mb-3">Кто хочет иметь официальный доход</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Кому надоело сидеть без денег. Стабильная работа на лето с хорошей зарплатой и записью в трудовой.
                </p>
              </div>
              <div className="w-10 h-10 bg-[#E1FF00] rounded-full flex items-center justify-center self-end shadow-sm mt-6">
                <span className="text-lg">👇</span>
              </div>
            </div>

            {/* Карточка 4 (Серая) */}
            <div className="bg-[#F3F4F6] rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black mb-3">Кто хочет развиваться в офлайне и быть лидером</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Чтобы в будущем занимать управленческие позиции и прокачать свои софт-скиллы на практике.
                </p>
              </div>
              <div className="w-10 h-10 bg-[#E1FF00] rounded-full flex items-center justify-center self-end shadow-sm mt-6">
                <span className="text-lg">👇</span>
              </div>
            </div>

            {/* Карточка 5 (СИНЯЯ АКЦЕНТНАЯ) */}
            <div className="bg-[#0052FF] rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px] text-white">
              <div>
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight mb-3">Кто не может выбрать нишу, не знает, кем стать</h3>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Поможем с реализацией для первого старта в карьере: вожатый, строитель, медик или сервис.
                </p>
              </div>
              <div className="w-10 h-10 bg-[#E1FF00] rounded-full flex items-center justify-center self-end shadow-sm mt-6 text-black">
                <span className="text-lg">👇</span>
              </div>
            </div>

            {/* Карточка 6 (Серая) */}
            <div className="bg-[#F3F4F6] rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black mb-3">Кто хочет вступить в нашу большую семью</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Бесплатное обучение по самым высоким стандартам и сертификат государственного образца.
                </p>
              </div>
              <div className="w-10 h-10 bg-[#E1FF00] rounded-full flex items-center justify-center self-end shadow-sm mt-6">
                <span className="text-lg">👇</span>
              </div>
            </div>

          </div>
        </section>


        {/* ================= СТАТИСТИКА (Вместо Instagram аккаунтов) ================= */}
        <section className="pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {[
              { role: 'Командир отряда', name: 'Иванов Иван', s1: '150+', s2: '4 года', s3: '10', l1: 'бойцов', l2: 'в РСО', l3: 'целин' },
              { role: 'Комиссар отряда', name: 'Петрова Анна', s1: '30+', s2: '2 года', s3: '5', l1: 'ивентов', l2: 'в РСО', l3: 'целин' },
              { role: 'Мастер отряда', name: 'Смирнов Алексей', s1: '4', s2: '3 года', s3: '8', l1: 'объекта', l2: 'в РСО', l3: 'целин' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0052FF] text-white flex items-center justify-center font-black text-lg">
                    {stat.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#0052FF] uppercase tracking-wider">{stat.role}</div>
                    <div className="font-black text-sm uppercase text-black">{stat.name}</div>
                  </div>
                </div>
                <div className="flex justify-between text-center px-2">
                  <div>
                    <div className="font-black text-lg text-black">{stat.s1}</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.l1}</div>
                  </div>
                  <div>
                    <div className="font-black text-lg text-black">{stat.s2}</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.l2}</div>
                  </div>
                  <div>
                    <div className="font-black text-lg text-black">{stat.s3}</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.l3}</div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>


        {/* ================= ПРОГРАММА (Двухцветный блок) ================= */}
        <section id="program" className="max-w-[800px] mx-auto pb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-center text-black mb-10">
            Программа подготовки
          </h2>

          <div className="relative shadow-2xl shadow-blue-500/10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white">
            
            {/* ВЕРХНИЙ БЛОК (ЖЕЛТЫЙ) */}
            <div className="bg-[#E1FF00] rounded-t-[2.5rem] md:rounded-t-[3.5rem] p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-4">
              <span className="bg-black text-[#E1FF00] px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest w-fit">
                1 ЭТАП
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
                ВЕСЕННЯЯ ШКОЛА
              </h3>
            </div>

            {/* НИЖНИЙ БЛОК (СИНИЙ) */}
            <div className="bg-[#0052FF] rounded-b-[2.5rem] md:rounded-b-[3.5rem] rounded-t-3xl -mt-6 p-8 md:p-12 text-white relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <span className="bg-white/20 text-white px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest w-fit backdrop-blur-sm border border-white/30">
                  2 ЭТАП
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                  ТРУДОВОЙ СЕМЕСТР
                </h3>
              </div>

              {/* Рамка со списком */}
              <div className="border-2 border-white/20 bg-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm space-y-4 mb-8">
                {[
                  "Что выбрать без опыта: направления и специфика линейных отрядов.",
                  "Узнаешь, как на самом деле работает система РСО и рейтинг.",
                  "Чем отличается работа в ССО от работы в СПО.",
                  "Какие отряды ведут к высокому заработку, а какие к путешествиям.",
                  "Ошибки: почему новички иногда не проходят строгий отбор штаба.",
                  "Дадим чек-лист, чтобы собрать идеальный рюкзак на твою первую Целину.",
                  "Проведем экзамен и выдадим свидетельство государственного образца."
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-[#E1FF00] font-black mt-0.5">•</span>
                    <p className="text-sm md:text-base font-medium text-blue-50 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              {/* Плавающая кнопка (как на рефе) */}
              <div className="flex justify-center -mb-16 relative z-20">
                <Link to="/register" className="bg-[#E1FF00] text-black px-10 py-5 rounded-full font-black uppercase text-sm tracking-wider hover:scale-105 transition-transform shadow-xl shadow-[#E1FF00]/20">
                  Подать заявку
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}