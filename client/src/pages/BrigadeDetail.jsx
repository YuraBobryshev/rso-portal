import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

export default function BrigadeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brigade, setBrigade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrigade = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/brigades/${id}`);
        setBrigade(res.data);
      } catch (err) {
        console.error("Ошибка загрузки отряда");
        navigate('/brigades');
      } finally {
        setLoading(false);
      }
    };
    fetchBrigade();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase opacity-20">Загрузка дела...</div>;
  if (!brigade) return null;

  const mainColor = brigade.colorScheme || '#0804FF';

  return (
    <div className="min-h-screen bg-white text-rso-blue font-sans">
      <Header />

      {/* HERO SECTION С ЦВЕТОМ ОТРЯДА */}
      <div 
        className="w-full h-[300px] md:h-[450px] relative flex items-end p-6 md:p-12 overflow-hidden transition-all duration-700"
        style={{ backgroundColor: mainColor }}
      >
        {/* Декоративный элемент на фоне */}
        <div className="absolute top-0 right-0 text-[20vw] font-black text-white/10 select-none leading-none translate-x-1/4 -translate-y-1/4">
          {brigade.type}
        </div>

        <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white border-4 border-white shadow-2xl overflow-hidden shrink-0">
            {brigade.logoUrl ? (
              <img src={brigade.logoUrl} className="w-full h-full object-contain p-2" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-4xl opacity-10">{brigade.type}</div>
            )}
          </div>
          
          <div className="text-center md:text-left text-white">
            <span className="inline-block px-4 py-1 border border-white/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Линейный студенческий отряд
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2">
              {brigade.name}
            </h1>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20 mt-10">
        
        {/* КОЛОНКА 1: ОПИСАНИЕ И СОСТАВ */}
        <div className="space-y-16">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 opacity-30">История и деятельность</h3>
            <p className="text-xl leading-relaxed text-gray-800 font-medium whitespace-pre-line">
              {brigade.description}
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 opacity-30">Личный состав ({brigade.users.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brigade.users.map(member => (
                <div key={member.id} className="flex items-center gap-4 p-4 border border-rso-blue/5 hover:border-rso-blue/20 transition-all group">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-rso-blue/10">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-rso-blue opacity-20">{member.firstName[0]}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-black uppercase text-sm group-hover:text-black transition-colors">{member.firstName} {member.lastName}</div>
                    <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1" style={{ color: member.role === 'COMMANDER' ? mainColor : 'inherit' }}>
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* КОЛОНКА 2: ИНФО-БЛОКИ */}
        <div className="space-y-8">
           <div className="p-8 border-2 border-rso-blue relative">
              <div className="absolute -top-3 left-6 bg-white px-3 text-[10px] font-black uppercase tracking-widest">Статус</div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold uppercase text-xs">Направление:</span>
                <span className="font-black uppercase text-sm" style={{ color: mainColor }}>{brigade.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase text-xs">Дата основания:</span>
                <span className="font-black uppercase text-sm">{new Date(brigade.createdAt).getFullYear()} год</span>
              </div>
           </div>

           <button 
             className="w-full py-6 font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-black shadow-xl"
             style={{ backgroundColor: mainColor, boxShadow: `0 20px 40px ${mainColor}33` }}
           >
             Подать заявку в отряд
           </button>
           
           <p className="text-[9px] text-center font-bold uppercase opacity-30 px-10 leading-loose">
             Нажимая кнопку, ты подтверждаешь готовность к труду, обороне и веселому лету.
           </p>
        </div>

      </main>
    </div>
  );
}