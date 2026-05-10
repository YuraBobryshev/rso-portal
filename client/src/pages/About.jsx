import React from 'react';
import Header from '../components/Header';

const stats = [
  { label: 'Лет истории', value: '10+' },
  { label: 'Активных бойцов', value: '1500+' },
  { label: 'Линейных отрядов', value: '45' },
  { label: 'Трудовых проектов', value: '100+' },
];

const values = [
  {
    title: "ЕДИНСТВО",
    desc: "Мы — не просто организация, мы — семья, где каждый важен и каждый услышан."
  },
  {
    title: "ТРУД",
    desc: "Создаем будущее своими руками, работая на благо Севастополя и всей страны."
  },
  {
    title: "ПАТРИОТИЗМ",
    desc: "Любовь к Родине для нас — это не слова, а конкретные дела и помощь людям."
  },
  {
    title: "РАЗВИТИЕ",
    desc: "Постоянный рост компетенций: от профессиональных навыков до лидерских качеств."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-rso-blue font-sans selection:bg-rso-blue selection:text-white">
      <Header />
      
      {/* HERO SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-24 md:py-40">
        <h1 className="text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.85] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Мы пишем <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rso-blue to-blue-400">историю</span> <br />
          труда.
        </h1>
        <p className="max-w-2xl text-xl md:text-2xl font-medium leading-relaxed opacity-80">
          Севастопольское региональное отделение «Российских Студенческих Отрядов» — это крупнейшее молодежное движение города-героя.
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="bg-rso-blue text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="border-l-[1px] border-white/20 pl-6">
              <div className="text-5xl font-black mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HISTORY SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 opacity-40">Наш путь</h2>
          <div className="space-y-8 text-lg font-medium leading-relaxed text-gray-700">
            <p>
              СевРО берет свое начало из глубоких традиций студенчества Севастополя. Мы возродили движение, которое объединило тысячи студентов под общими знаменами труда и романтики.
            </p>
            <p>
              Сегодня наши бойцы работают в лучших отелях Крыма, строят федеральные трассы, лечат людей и воспитывают детей в детских лагерях по всей стране.
            </p>
          </div>
        </div>
        <div className="relative aspect-square bg-gray-100 border border-rso-blue p-2">
           {/* Сюда можно будет вставить крутое историческое фото */}
           <div className="w-full h-full border border-rso-blue/20 flex items-center justify-center font-black text-6xl opacity-5">
             SEVRO
           </div>
           <div className="absolute -bottom-10 -left-10 bg-white border border-rso-blue p-8 hidden md:block">
              <p className="text-[10px] font-black uppercase leading-tight">Севастополь <br /> 2014 — 2026</p>
           </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-32 border-t border-rso-blue/10">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-20 text-center">Наши ценности</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {values.map((val, idx) => (
            <div key={idx} className="group p-10 border border-rso-blue/10 hover:border-rso-blue transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
              <span className="text-[10px] font-black opacity-20 group-hover:opacity-100 transition-opacity">0{idx + 1} /</span>
              <h3 className="text-3xl font-black uppercase mt-4 mb-6">{val.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-40 text-center">
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-12">Готов стать частью команды?</h2>
        <a 
          href="/register" 
          className="inline-block bg-rso-blue text-white px-12 py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-blue-500/20"
        >
          Вступить в отряд
        </a>
      </section>

      <footer className="py-10 border-t border-rso-blue/5 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">© 2026 СевРО РСО. Труд крут.</p>
      </footer>
    </div>
  );
}