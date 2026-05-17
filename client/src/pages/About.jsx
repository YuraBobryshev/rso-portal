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

// Массив со всеми 6 направлениями деятельности СевРО
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

// Массив ключевых трудовых объектов
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
      
      <main className="mt-10">
        
        {/* ================= 1. HERO СЕКЦИЯ (Единый масштаб заголовка) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-12 lg:py-20 border-b border-gray-100">
          <div className="max-w-5xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-rso-blue uppercase">
              <span>[ О СЕВРО РСО ]</span>
              <span className="w-8 h-[1px] bg-rso-blue"></span>
              <span>ГЛАВНЫЙ НАРАТИВ</span>
            </div>
            
            {/* Масштаб h1 строго равен главной странице (text-4xl -> text-8xl) */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Мы пишем <br />
              <span className="text-rso-blue">историю</span> <br />
              труда.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl leading-relaxed pt-4">
              Севастопольское региональное отделение МООО «Российские Студенческие Отряды» — это крупнейшее молодежное движение Города-Героя, объединяющее тысячи горящих сердец.
            </p>
          </div>
        </section>


        {/* ================= 2. СТРОГАЯ СЕТКА СТАТИСТИКИ ================= */}
        <section className="border-b border-gray-100 bg-gray-50/50">
          <div className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/60">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-8 lg:p-12 flex flex-col justify-center group hover:bg-white transition-colors duration-300">
                <div className="text-4xl md:text-6xl font-black text-rso-blue mb-2 transition-transform group-hover:translate-x-1 duration-300">
                  {stat.value}
                </div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 3. ИСТОРИЯ СОЗДАНИЯ (Интерактивный таймлайн) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-20 lg:py-28 border-b border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4">
              <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest">// НАШ ПУТЬ</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-rso-blue mt-2 leading-none">
                Летопись <br/>СевРО
              </h2>
            </div>
            
            <div className="lg:col-span-8 space-y-12">
              {[
                { year: "2014 год", title: "Фундамент и возрождение", desc: "После исторического воссоединения Севастополя с Россией, началось активное возрождение традиций студенческих отрядов. Были сформированы первые линейные отряды вожатых и строителей, готовые доказать, что севастопольская молодежь — это мощная трудовая сила." },
                { year: "2019 год", title: "Масштабирование и новые фронты", desc: "Движение выросло в 3 раза. К классическим строителям и вожатым добавились отряды проводников поездов дальнего следования и сервисные отряды. Севастопольские бойцы закрепились на ключевых трудовых проектах Южного федерального округа." },
                { year: "2026 год", title: "Цифровая эпоха и лидерство", desc: "Сегодня СевРО — это технологичное, современное движение. Мы внедрили ИТ-направления (Цифровые отряды), автоматизировали учет реестра и выгрузку отчетов комсостава. Наши бойцы работают на ключевых всероссийских стройках от Крыма до Дальнего Востока." }
              ].map((item, idx) => (
                <div key={idx} className="group border-l-2 border-gray-200 hover:border-rso-blue pl-6 space-y-2 transition-colors duration-500 relative">
                  {/* Декоративная живая точка на таймлайне */}
                  <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full absolute left-[-7px] top-1.5 group-hover:bg-rso-blue group-hover:border-rso-blue transition-colors duration-300"></div>
                  
                  <span className="text-xs font-mono font-black text-rso-blue opacity-60 uppercase tracking-widest block">
                    {item.year}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black uppercase text-black group-hover:text-rso-blue transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed max-w-3xl">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* ================= 4. НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ (Все 6 штук) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-20 border-b border-gray-100">
          <div className="mb-12">
            <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest">// СТРУКТУРА ДВИЖЕНИЯ</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-rso-blue mt-1 leading-none">
              6 Направлений Труда
            </h2>
          </div>

          {/* Компактная журнальная сетка, идентичная главной странице */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {directions.map((dir, index) => (
              <div key={index} className="group relative aspect-[16/10] bg-gray-950 overflow-hidden shadow-md border border-gray-100">
                <img 
                  src={dir.img} 
                  className="w-full h-full object-cover opacity-30 transition-transform duration-700 scale-101 group-hover:scale-105 group-hover:opacity-20" 
                  alt={dir.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20">
                  <span className="text-[10px] font-mono font-bold text-rso-blue uppercase tracking-widest mb-1 block">
                    {dir.code} // DIRECTION
                  </span>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1 text-white group-hover:text-rso-blue transition-colors">
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


        {/* ================= 5. ТРУДОВЫЕ ОБЪЕКТЫ (Интерактивная таблица) ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-20 border-b border-gray-100">
          <div className="mb-12">
            <span className="text-xs font-mono font-bold text-rso-blue uppercase tracking-widest">// ГЕОГРАФИЯ РАБОТЫ</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-rso-blue mt-1 leading-none">
              Наши трудовые объекты
            </h2>
          </div>

          <div className="border border-gray-200 divide-y divide-gray-200">
            {laborObjects.map((obj, i) => (
              <div key={i} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-blue-50/30 transition-colors duration-300 group">
                <div className="md:col-span-4">
                  <span className="text-xs font-mono text-gray-400 block mb-1">0{i+1} // НАЗВАНИЕ</span>
                  <div className="text-base md:text-lg font-black uppercase text-black group-hover:text-rso-blue transition-colors">
                    {obj.name}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <span className="text-xs font-mono text-gray-400 block mb-1">ЛОКАЦИЯ</span>
                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    {obj.location}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <span className="text-xs font-mono text-gray-400 block mb-1">ПРОИЗВОДСТВЕННАЯ ЗАДАЧА</span>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    {obj.task}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 6. НАШИ ЦЕННОСТИ ================= */}
        <section className="max-w-[1600px] mx-auto px-6 py-20 lg:py-28">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-rso-blue mb-16 text-center leading-none">
            Наши Кодексы и Ценности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="group p-8 md:p-10 border border-gray-100 hover:border-rso-blue transition-all duration-500 bg-white hover:shadow-2xl hover:shadow-blue-500/5">
                <span className="text-xs font-mono font-bold text-rso-blue opacity-30 group-hover:opacity-100 transition-opacity">
                  0{idx + 1} // CODE_VALUE
                </span>
                <h3 className="text-2xl font-black uppercase mt-4 mb-4 text-black group-hover:text-rso-blue transition-colors">
                  {val.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 7. CTA СЕКЦИЯ ================= */}
        <section className="w-full bg-rso-blue text-white py-20 lg:py-28 text-center px-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
            Твоя история начинается здесь
          </h2>
          <p className="text-sm md:text-base opacity-80 max-w-xl mx-auto mb-10 font-medium leading-relaxed">
            Присоединяйся к самому масштабному молодежному братству Севастополя. Подай заявку прямо сейчас и проведи незабываемый рабочий сезон.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-rso-blue font-black uppercase text-xs tracking-[0.2em] px-12 py-5 hover:bg-black hover:text-white transition-colors shadow-2xl"
          >
            Вступить в отряд →
          </Link>
        </section>

      </main>

      {/* Единый футер */}
      <footer className="border-t border-gray-100 py-10 bg-white text-center">
        <p className="text-[10px] font-mono font-bold uppercase opacity-30 tracking-[0.3em]">
          СЕВАСТОПОЛЬСКОЕ РЕГИОНАЛЬНОЕ ОТДЕЛЕНИЕ // МООО РСО 2026 // ТРУД КРУТ
        </p>
      </footer>
    </div>
  );
}