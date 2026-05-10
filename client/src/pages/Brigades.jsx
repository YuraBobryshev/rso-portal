import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const types = ['ВСЕ', 'ССО', 'СПО', 'ССервО', 'СОП', 'ССхО', 'СМО'];

export default function Brigades() {
  const [brigades, setBrigades] = useState([]);
  const [filter, setFilter] = useState('ВСЕ');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrigades = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/brigades');
        setBrigades(res.data);
      } catch (e) {
        console.error("Ошибка загрузки отрядов");
      } finally {
        setLoading(false);
      }
    };
    fetchBrigades();
  }, []);

  const filteredBrigades = filter === 'ВСЕ' 
    ? brigades 
    : brigades.filter(b => b.type === filter);

  return (
    <div className="min-h-screen bg-white text-rso-blue font-sans selection:bg-rso-blue selection:text-white">
      <Header />
      
      <main className="max-w-[1400px] mx-auto p-6 mt-16">
        <div className="mb-20">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-none mb-8 animate-in fade-in slide-in-from-left-4">Отряды</h1>
          <div className="flex flex-wrap gap-3">
            {types.map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border border-rso-blue transition-all duration-300 ${filter === t ? 'bg-rso-blue text-white shadow-lg shadow-blue-500/20' : 'text-rso-blue hover:bg-blue-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center font-black uppercase opacity-20 tracking-widest animate-pulse">Синхронизация реестра...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16">
            {filteredBrigades.map(brigade => (
              <Link 
                to={`/brigades/${brigade.id}`} 
                key={brigade.id} 
                className="group relative border border-rso-blue/10 p-8 hover:border-rso-blue transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 bg-white overflow-hidden"
              >
                {/* Фоновый акцент цвета отряда (тонкая полоса сверху) */}
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-50" 
                  style={{ backgroundColor: brigade.colorScheme || '#0804FF' }}
                />

                <div className="flex justify-between items-start mb-8">
                  {/* АВАТАРКА ОТРЯДА */}
                 {/* АВАТАРКА ОТРЯДА (ТЕПЕРЬ КРУГЛАЯ) */}
                    <div className="w-24 h-24 rounded-full border-2 border-rso-blue/10 overflow-hidden p-1.5 flex items-center justify-center bg-white group-hover:border-rso-blue transition-all duration-500 shadow-inner">
                    {brigade.logoUrl ? (
                        <img 
                        src={brigade.logoUrl} 
                        alt={brigade.name} 
                        className="w-full h-full rounded-full object-contain" 
                        />
                    ) : (
                        <div className="text-[10px] font-black opacity-20 text-center leading-none uppercase">
                        {brigade.type}<br/>РСО
                        </div>
                    )}
                    </div>
                  
                  <div className="text-right">
                    <span className="block text-[10px] font-black bg-rso-blue text-white px-3 py-1 uppercase mb-2">
                      {brigade.type}
                    </span>
                    <span className="block text-[10px] font-bold opacity-30 tracking-widest uppercase">
                      Бойцов: {brigade._count?.users || 0}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black uppercase leading-tight mb-4 group-hover:text-black transition-colors">
                  {brigade.name}
                </h2>
                
                <p className="text-sm text-gray-500 line-clamp-3 font-medium leading-relaxed mb-8 h-[60px]">
                  {brigade.description}
                </p>
                
                <div 
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  style={{ color: brigade.colorScheme || '#0804FF' }}
                >
                  Личное дело отряда <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}