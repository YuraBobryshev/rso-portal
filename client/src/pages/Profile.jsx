import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ИконкаЗвезды = () => (
  <span className="text-rso-blue text-xl select-none">✦</span>
);

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [nearestEvent, setNearestEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState({ vkUrl: '', tgUrl: '' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const userRes = await axios.get('http://localhost:5000/api/auth/me', { headers });
      setUserData(userRes.data);
      setLinks({ 
        vkUrl: userRes.data.vkUrl || '', 
        tgUrl: userRes.data.tgUrl || '' 
      });

      const eventsRes = await axios.get('http://localhost:5000/api/events', { headers });
      setEvents(eventsRes.data);

      const nearestRes = await axios.get('http://localhost:5000/api/events/my-nearest', { headers });
      setNearestEvent(nearestRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [navigate]);

  const handleSaveLinks = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch('http://localhost:5000/api/auth/profile', links, { headers });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      alert("Ошибка при сохранении ссылок. Проверьте работу сервера.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono text-rso-blue uppercase tracking-widest">
      <div className="animate-pulse">Загрузка_Системы_v2.0...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 selection:bg-rso-blue selection:text-white">
      <Header />
      
      <main className="max-w-[1200px] mx-auto p-6 mt-6">
        
        {/* ВЕРХНЯЯ ПАНЕЛЬ */}
        <div className="border-[1px] border-rso-blue p-4 flex justify-between items-center mb-10 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <ИконкаЗвезды />
            <span className="text-rso-blue font-bold uppercase tracking-[0.3em] text-xs">
              ЛИЧНАЯ_КАРТОЧКА_БОЙЦА // {userData?.id.split('-')[0]}
            </span>
          </div>
          <div className="flex gap-4">
            <ИконкаЗвезды /> <ИконкаЗвезды /> <ИконкаЗвезды />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-rso-blue opacity-10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-10">
          
          {/* САЙДБАР */}
          <aside className="space-y-8">
            <div className="border-[1px] border-rso-blue p-6 flex flex-col items-center relative">
              <div className="absolute top-2 left-2 text-[8px] font-mono opacity-30">ССЫЛКА_ИЗД_001</div>
              
              <div className="w-full aspect-square bg-rso-blue/5 border-[1px] border-rso-blue mb-6 relative group overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-rso-blue text-9xl font-black opacity-10 select-none">
                  {userData?.firstName.charAt(0)}
                </div>
                <div className="absolute inset-4 border border-rso-blue/20"></div>
                {/* ИСПРАВЛЕННЫЙ СТАТУС */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm border-[1px] border-rso-blue p-1 text-[10px] text-rso-blue font-bold uppercase tracking-tighter text-center">
                  СТАТУС: {userData?.role}
                </div>
              </div>
              
              <div className="w-full text-center md:text-left">
                <h2 className="text-3xl font-bold text-rso-blue uppercase leading-[0.9] mb-4 tracking-tighter">
                  {userData?.firstName} <br/> {userData?.lastName}
                </h2>
                <div className="h-[1px] w-full bg-rso-blue/20 mb-4"></div>
                <p className="text-[10px] text-rso-blue font-bold uppercase tracking-widest opacity-60 italic">
                  Участник СевРО РСО с 2026 года
                </p>
              </div>
            </div>

            <nav className="border-[1px] border-rso-blue divide-y-[1px] divide-rso-blue">
              {[
                { id: 'profile', label: 'Обо мне // Инфо' },
                { id: 'events', label: 'События // Планы' },
                { id: 'achievements', label: 'Успехи // Стата' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full p-5 text-left uppercase text-xs font-bold transition-all flex justify-between items-center group
                  ${activeTab === item.id ? 'bg-rso-blue text-white' : 'text-rso-blue hover:bg-blue-50'}`}
                >
                  {item.label}
                  <span className={`text-xl transition-transform group-hover:translate-x-1 ${activeTab === item.id ? 'text-white' : 'text-rso-blue opacity-30'}`}>
                    →
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* КОНТЕНТ */}
          <section className="space-y-10">
            
            <div className="border-[1px] border-rso-blue p-10 relative min-h-[400px]">
              <div className="absolute -top-3 left-8 bg-white px-3 text-rso-blue font-bold uppercase text-[10px] tracking-[0.2em] z-10">
                ОСНОВНОЙ_РАЗДЕЛ
              </div>
              
              {activeTab === 'profile' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { label: 'Системный_ID', value: userData?.id.split('-')[0].toUpperCase() },
                      { label: 'Текущий_Отряд', value: userData?.brigade?.name || '---' },
                      { label: 'Уровень_Доступа', value: userData?.role },
                      { label: 'Электронная_Почта', value: userData?.email },
                    ].map((item, i) => (
                      <div key={i}>
                        <label className="block text-[9px] uppercase text-rso-blue font-bold mb-3 opacity-40 tracking-[0.1em]">
                          {item.label} ——————————
                        </label>
                        <div className="text-xl font-bold uppercase tracking-tight text-rso-blue">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {nearestEvent && (
                    <div className="mt-12 border-[1px] border-rso-blue p-8 flex justify-between items-center bg-blue-50/30 group hover:bg-rso-blue hover:text-white transition-all cursor-pointer">
                      <div>
                        <p className="text-[9px] uppercase font-bold mb-2 opacity-50">Следующее_Задание</p>
                        <h4 className="text-3xl font-bold uppercase tracking-tighter leading-none">{nearestEvent.title}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-mono font-bold">{new Date(nearestEvent.date).toLocaleDateString()}</p>
                        <span className="text-[10px] uppercase font-bold tracking-widest block mt-1">Подробнее ↗</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* СЕТКА КОНТАКТОВ */}
            <div>
              <div className="flex justify-between items-end mb-4 px-2">
                <h3 className="uppercase font-bold tracking-[0.2em] text-[10px] text-rso-blue/50">Внешние_Связи</h3>
                <button 
                  onClick={() => isEditing ? handleSaveLinks() : setIsEditing(true)}
                  className="text-[9px] font-bold uppercase border border-rso-blue px-4 py-1 hover:bg-rso-blue hover:text-white transition-all"
                >
                  {isEditing ? '[ СОХРАНИТЬ ]' : '[ РЕДАКТИРОВАТЬ_КАНАЛЫ ]'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-l border-rso-blue">
                
                <div className="md:col-span-5 border-r border-b border-rso-blue p-6 hover:bg-blue-50/50 transition-colors relative group">
                  <span className="absolute top-2 right-3 text-[8px] font-mono opacity-20 italic">канал_01</span>
                  <label className="block text-[8px] uppercase font-bold text-rso-blue/40 mb-3 tracking-widest">ВК / Соцсеть</label>
                  {isEditing ? (
                    <input 
                      value={links.vkUrl} 
                      onChange={e => setLinks({...links, vkUrl: e.target.value})}
                      placeholder="id_профиля"
                      className="w-full bg-transparent border-b border-rso-blue outline-none text-sm py-1 font-bold italic"
                    />
                  ) : (
                    <div className="text-lg font-bold uppercase flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      {links.vkUrl || 'НЕ_ПОДКЛЮЧЕНО'}
                    </div>
                  )}
                </div>

                <div className="md:col-span-4 border-r border-b border-rso-blue p-6 bg-rso-blue text-white group relative">
                  <span className="absolute top-2 right-3 text-[8px] font-mono opacity-30 italic">канал_02</span>
                  <label className="block text-[8px] uppercase font-bold text-white/40 mb-3 tracking-widest">ТГ / Мессенджер</label>
                  {isEditing ? (
                    <input 
                      value={links.tgUrl} 
                      onChange={e => setLinks({...links, tgUrl: e.target.value})}
                      placeholder="@никнейм"
                      className="w-full bg-transparent border-b border-white outline-none text-sm py-1 font-bold text-white placeholder:text-white/20"
                    />
                  ) : (
                    <div className="text-lg font-bold uppercase tracking-tight">
                      {links.tgUrl || 'ДАННЫЕ_ОТСУТСТВУЮТ'}
                    </div>
                  )}
                </div>

                {/* ИСПРАВЛЕННЫЙ ТРЕТИЙ БЛОК КОНТАКТОВ */}
                <div className="md:col-span-3 border-r border-b border-rso-blue p-6 flex flex-col justify-between items-end bg-blue-50/50">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 border-[1px] border-rso-blue rounded-full"></div>)}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-rso-blue uppercase tracking-widest mb-1">
                      АККАУНТ АКТИВЕН
                    </div>
                    <div className="text-[8px] font-mono opacity-50 uppercase tracking-tighter">
                      ПОСЛЕДНИЙ ВХОД: СЕГОДНЯ
                    </div>
                  </div>
                </div>

                <div className="md:col-span-12 border-r border-b border-rso-blue p-4 flex justify-between items-center bg-gray-50">
                  <div className="flex gap-8 items-center">
                    <div className="text-[9px] font-bold uppercase">
                      <span className="opacity-40 tracking-tighter">Почта_Системы:</span> {userData?.email}
                    </div>
                    <div className="text-[9px] font-bold uppercase hidden md:block">
                      <span className="opacity-40 tracking-tighter">Регион:</span> СЕВАСТОПОЛЬ_РФ
                    </div>
                  </div>
                  <ИконкаЗвезды />
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}