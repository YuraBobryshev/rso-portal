import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const stats = [
  { label: 'Лет трудовой истории', value: '10+' },
  { label: 'Активных бойцов в регионе', value: '1500+' },
  { label: 'Линейных отрядов (ЛСО)', value: '45+' },
  { label: 'Масштабных проектов', value: '100+' },
];

const values = [
  {
    title: "ЕДИНСТВО",
    desc: "Мы — не просто организация, мы — огромная трудовая семья, где важен вклад каждого бойца."
  },
  {
    title: "ТРУД",
    desc: "Создаем будущее своими руками, работая на благо Города-Героя Севастополя и всей нашей страны."
  },
  {
    title: "ПАТРИОТИЗМ",
    desc: "Любовь к Родине для нас — это не пустые слова, а конкретные дела, помощь ветеранам и созидание."
  },
  {
    title: "РАЗВИТИЕ",
    desc: "Постоянный рост: от бесплатных профессиональных курсов до прокачки лидерских качеств комсостава."
  }
];

const directions = [
  {
    code: "СПО",
    title: "Педагогические отряды",
    desc: "Воспитание будущего поколения. Бойцы работают вожатыми в крупнейших детских центрах, зажигая сердца детей и организуя лучшие лагерные смены.",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600"
  },
  {
    code: "ССО",
    title: "Строительные отряды",
    desc: "Возведение инфраструктуры века. Проектирование, замес бетона, кирпичная кладка и масштабные всероссийские стройки.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600"
  },
  {
    code: "СОП",
    title: "Отряды проводников",
    desc: "Романтика железных дорог. Обеспечение комфорта и безопасности пассажиров на поездах дальнего следования по всей территории России.",
    img: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600"
  },
  {
    code: "СМО",
    title: "Медицинские отряды",
    desc: "Забота о здоровье на передовой. Работа в качестве младшего и среднего медицинского персонала в больницах, санаториях и детских здравницах.",
    img: "https://images.unsplash.com/photo-1584515901367-f1c2a1268a83?q=80&w=600"
  },
  {
    code: "ССервО",
    title: "Сервисные отряды",
    desc: "Индустрия гостеприимства высшего уровня. Работа в пятизвездочных гостиничных комплексах: от ресторанного сервиса до организации крупных ивентов.",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600"
  },
  {
    code: "СЦО",
    title: "Цифровые отряды (IT)",
    desc: "Создание цифрового будущего движения. Автоматизация процессов штабов, ИТ-поддержка, разработка веб-сервисов и управление базами данных.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600"
  }
];

const laborObjects = [
  { name: "Mriya Resort & SPA 5*", location: "Ялта, Крым", task: "Сервисное обслуживание и организация премиум-отдыха" },
  { name: "Всероссийская студенческая стройка «БАМ 2.0»", location: "Сибирь / Дальний Восток", task: "Реконструкция легендарной железнодорожной магистрали" },
  { name: "Детские оздоровительные лагеря «Ласпи» и «Горный»", location: "Севастополь", task: "Педагогическое сопровождение и вожатская деятельность" },
  { name: "АО «Гранд Сервис Экспресс» (Поезда «Таврия»)", location: "Маршруты по всей РФ", task: "Пассажирские перевозки в Город-Герой Севастополь" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      {/* Наш единый мобильно-адаптированный хедер */}
      <Header />
      
      {/* Жесткий отступ pt-24 для предотвращения наезда хедера */}
      <main className="pt-24">
        
        {/* ================= 1. HERO СЕКЦИЯ (Мягкий Bento разворот) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 pb-12 lg:pb-16 border-b border-gray-100">
          <div className="max-w-5xl space-y-4">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block">
              О нашем движении
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-500">
              Мы пишем <br />
              <span className="text-rso-blue">историю</span> <br />
              труда.
            </h1>
            
            <p className="text-base md:text-lg text-gray-500 font-medium max-w-2xl leading-relaxed pt-2">
              Севастопольское региональное отделение МООО «Российские Студенческие Отряды» — это крупнейшее молодежное движение Города-Героя, объединяющее тысячи горящих сердец.
            </p>
          </div>
        </section>


        {/* ================= 2. СЕТКА СТАТИСТИКИ (Мягкие Bento-ячейки) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-gray-50/70 border border-gray-100 rounded-2xl flex flex-col justify-center group hover:border-rso-blue/20 hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <div className="text-3xl md:text-5xl font-black text-rso-blue mb-1 transition-transform group-hover:translate-x-1 duration-300">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </section>


        {/* ================= 3. ЛЕТОПИСЬ СЕВРО (Живой мягкий таймлайн) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-4 flex flex-col justify-start">
              <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Наш путь</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-1 leading-tight">
                Летопись штаба
              </h2>
              <p className="text-sm text-gray-400 font-medium mt-2 max-w-xs leading-relaxed">
                Основные вехи развития и достижений севастопольского регионального отделения.
              </p>
            </div>
            
            <div className="lg:col-span-8 space-y-6">
              {[
                { year: "2014 год", title: "Фундамент и возрождение", desc: "После исторического воссоединения Севастополя с Россией, началось активное возрождение традиций студенческих отрядов. Были сформированы первые линейные отряды вожатых и строителей, готовые доказать, что севастопольская молодежь — это мощная трудовая сила." },
                { year: "2019 год", title: "Масштабирование и новые фронты", desc: "Движение выросло в 3 раза. К классическим строителям и вожатым добавились отряды проводников поездов дальнего следования и сервисные отряды. Севастопольские бойцы закрепились на ключевых трудовых проектах Южного федерального округа." },
                { year: "2026 год", title: "Цифровая эпоха и лидерство", desc: "Сегодня СевРО — это технологичное, современное движение. Мы внедрили ИТ-направления (Цифровые отряды), автоматизировали учет реестра и выгрузку отчетов комсостава. Наши бойцы работают на ключевых всероссийских стройках от Крыма до Дальнего Востока." }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="group p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-2 transition-all duration-300 relative hover:bg-white hover:border-rso-blue/20 hover:shadow-sm"
                >
                  <span className="inline-block text-[10px] font-bold text-rso-blue bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    {item.year}
                  </span>
                  <h3 className="text-lg md:text-xl font-black uppercase text-black group-hover:text-rso-blue transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed max-w-3xl">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* ================= 4. НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ (Bento Карточки) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 pb-20 lg:pb-28">
          <div className="mb-8">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Структура движения</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-1">6 Направлений Труда</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {directions.map((dir, index) => (
              <div key={index} className="group relative aspect-[16/10] bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img 
                  src={dir.img} 
                  className="w-full h-full object-cover opacity-35 transition-transform duration-700 scale-101 group-hover:scale-103 group-hover:opacity-25" 
                  alt={dir.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20">
                  <span className="text-[9px] font-bold text-rso-blue uppercase tracking-wider mb-1 block">
                    Направление {dir.code}
                  </span>
                  <h3 className="text-base md:text-lg font-black uppercase tracking-tight mb-1 text-white group-hover:text-rso-blue transition-colors">
                    {dir.title}
                  </h3>
                  <p className="text-[11px] opacity-75 font-medium leading-relaxed line-clamp-2 max-w-sm">
                    {dir.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 5. ТРУДОВЫЕ ОБЪЕКТЫ (Мягкие Bento-списки) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 pb-20 lg:pb-28">
          <div className="mb-8">
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">География работы</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mt-1">Наши трудовые объекты</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {laborObjects.map((obj, i) => (
              <div 
                key={i} 
                className="p-5 md:p-6 bg-gray-50/70 border border-gray-100 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-white hover:border-rso-blue/20 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="md:col-span-4">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Проект</span>
                  <div className="text-base font-black uppercase text-black group-hover:text-rso-blue transition-colors mt-0.5">
                    {obj.name}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Локация</span>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">
                    {obj.location}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Производственная задача</span>
                  <div className="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">
                    {obj.task}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 6. НАШИ ЦЕННОСТИ (Мягкие карточки) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 pb-20 lg:pb-28">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-center text-black mb-12">
            Наши Кодексы и Ценности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val, idx) => (
              <div 
                key={idx} 
                className="group p-6 md:p-8 bg-gray-50/60 border border-gray-100 rounded-2xl hover:border-rso-blue/20 transition-all duration-300 hover:bg-white hover:shadow-sm"
              >
                <span className="text-[10px] font-bold text-rso-blue uppercase tracking-wider">
                  Ценность 0{idx + 1}
                </span>
                <h3 className="text-xl font-black uppercase mt-2 mb-3 text-black group-hover:text-rso-blue transition-colors">
                  {val.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 7. CTA СЕКЦИЯ (Призыв к действию) ================= */}
        <section className="w-full bg-rso-blue text-white py-16 lg:py-24 text-center px-6">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
            Твоя история начинается здесь
          </h2>
          <p className="text-sm opacity-80 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
            Присоединяйся к самому масштабному молодежному братству Севастополя. Подай заявку прямо сейчас и проведи незабываемый рабочий сезон.
          </p>
          <Link 
            // Изменил href на react-router-dom Link компонент для плавного перехода
            to="/register" 
            className="inline-block bg-white text-rso-blue font-bold uppercase text-xs tracking-wider px-10 py-4.5 rounded-xl hover:bg-black hover:text-white transition-colors shadow-lg shadow-black/5"
          >
            Вступить в отряд →
          </Link>
        </section>

      </main>

      {/* Мягкий футер */}
      <footer className="border-t border-gray-100 py-10 bg-white text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Севастопольское региональное отделение // МООО РСО 2026 // Труд Крут
        </p>
      </footer>
    </div>
  );
}