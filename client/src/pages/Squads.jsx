import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig'
import Header from '../components/Header';

export default function Squads() {
  const [brigades, setBrigades] = useState([]);

  useEffect(() => {
    axios.get('/api/brigades').then(res => setBrigades(res.data));
  }, []);

  const handleApply = async (brigadeId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/applications/apply', 
        { brigadeId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="font-title text-6xl uppercase mb-12 italic border-l-8 border-rso-blue pl-6">Наши отряды</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brigades.map(squad => (
            <div key={squad.id} className="border-4 border-black p-6 flex flex-col justify-between hover:-translate-y-2 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <h2 className="font-title text-3xl mb-4 uppercase leading-tight">{squad.name}</h2>
                <p className="font-body text-sm text-gray-600 mb-6 line-clamp-3">
                  {squad.description || "Бойцы этого отряда сейчас на рабочем объекте. Описание скоро появится."}
                </p>
              </div>
              <button 
                onClick={() => handleApply(squad.id)}
                className="w-full bg-rso-blue text-white py-3 font-title uppercase hover:bg-black transition-colors"
              >
                Подать заявку
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}