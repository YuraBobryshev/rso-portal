import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ИконкаЗвезды = () => <span className="text-rso-blue text-xl select-none">✦</span>;

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [nearestEvent, setNearestEvent] = useState(null);
  const [commanderData, setCommanderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState({ vkUrl: '', tgUrl: '' });

  const fileInputRef = useRef(null); // Реф для скрытого инпута загрузки фото
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const userRes = await axios.get('http://localhost:5000/api/auth/me', { headers });
      const user = userRes.data;
      setUserData(user);
      setLinks({ vkUrl: user.vkUrl || '', tgUrl: user.tgUrl || '' });

      const eventsRes = await axios.get('http://localhost:5000/api/events', { headers });
      setEvents(eventsRes.data);

      const nearestRes = await axios.get('http://localhost:5000/api/events/my-nearest', { headers });
      setNearestEvent(nearestRes.data);

      if (user.role === 'COMMANDER') {
        try {
          const cmdRes = await axios.get('http://localhost:5000/api/commander/dashboard', { headers });
          setCommanderData(cmdRes.data);
        } catch (e) { setCommanderData(null); }
      }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [navigate]);

  // --- ЗАГРУЗКА АВАТАРА ---
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchData(); // Обновляем данные пользователя, чтобы увидеть новую ссылку на фото
    } catch (err) {
      alert("Ошибка при загрузке изображения.");
    } finally {
      setLoading(false);
    }
  };

  // --- ДЕЙСТВИЯ С МЕРОПРИЯТИЯМИ ---
  const handleJoinEvent = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert("Не удалось записаться"); }
  };

  const handleLeaveEvent = async (eventId) => {
    if (!window.confirm("Отменить участие?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}/leave`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert("Ошибка при отмене"); }
  };

  // --- ДЛЯ КОМАНДИРА ---
  const handleProcessApp = async (appId, status) => {
    if (!window.confirm("Подтвердите действие")) return;
    try {
      await axios.post('http://localhost:5000/api/commander/process-application', { appId, status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert("Ошибка обработки"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono text-rso-blue uppercase text-sm">
      <div className="animate-pulse">Обработка данных...</div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Профиль' },
    { id: 'events', label: 'События' },
    { id: 'achievements', label: 'Награды' },
  ];
  if (userData?.role === 'COMMANDER') tabs.push({ id: 'commander', label: 'Управление', badge: commanderData?.applications?.length });

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 selection:bg-rso-blue selection:text-white">
      <Header />
      
      <main className="max-w-[1200px] mx-auto p-6 mt-6">
        
        {/* ВЕРХНИЙ БЛОК */}
        <div className="border-[1px] border-rso-blue p-4 flex justify-between items-center mb-10 bg-blue-50/20">
          <div className="flex items-center gap-3">
            <ИконкаЗвезды />
            <span className="text-rso-blue font-bold uppercase tracking-widest text-sm">
              ЛИЧНАЯ КАРТОЧКА // {userData?.id.split('-')[0].toUpperCase()}
            </span>
          </div>
          <div className="hidden md:flex gap-4"><ИконкаЗвезды /><ИконкаЗвезды /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10">
          
          {/* САЙДБАР (Аватар + Навигация) */}
          <aside className="space-y-8">
            <div className="border-[1px] border-rso-blue p-6 flex flex-col items-center">
              
              {/* ЗАГРУЗКА ФОТО */}
              <div 
                onClick={handleAvatarClick}
                className="w-full aspect-square bg-blue-50 border-[1px] border-rso-blue mb-6 relative overflow-hidden group cursor-pointer"
              >
                {userData?.avatarUrl ? (
                  <img src={userData.avatarUrl} alt="Аватар" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-rso-blue text-9xl font-black opacity-10">
                    {userData?.firstName.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-rso-blue/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Сменить фото</span>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
              
              <div className="w-full text-center md:text-left">
                <h2 className="text-2xl font-black text-rso-blue uppercase leading-tight tracking-tighter">
                  {userData?.firstName} <br/> {userData?.lastName}
                </h2>
                <p className="text-[10px] text-rso-blue font-bold uppercase tracking-widest opacity-60 mt-2">
                  {userData?.role} // СЕВАСТОПОЛЬ
                </p>
              </div>
            </div>

            <nav className="border-[1px] border-rso-blue divide-y-[1px] divide-rso-blue">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-5 text-left uppercase text-xs font-bold transition-all flex justify-between items-center group
                  ${activeTab === tab.id ? 'bg-rso-blue text-white' : 'text-rso-blue hover:bg-blue-50'}`}
                >
                  <div className="flex items-center gap-2">
                    {tab.label}
                    {tab.badge > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 animate-pulse">+{tab.badge}</span>}
                  </div>
                  <span className="opacity-30 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ОСНОВНОЙ КОНТЕНТ */}
          <section className="border-[1px] border-rso-blue p-8 relative min-h-[500px]">
            <div className="absolute -top-3 left-6 bg-white px-3 text-rso-blue font-bold uppercase text-[10px]">
              {activeTab === 'profile' && 'Данные бойца'}
              {activeTab === 'events' && 'Мероприятия штаба'}
              {activeTab === 'commander' && 'Штаб отряда'}
            </div>

            {/* ПРОФИЛЬ */}
            {activeTab === 'profile' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Статус в системе', value: userData?.role },
                    { label: 'Подразделение', value: userData?.brigade?.name || 'Отряд не указан' },
                    { label: 'Электронная почта', value: userData?.email },
                    { label: 'Дата вступления', value: 'Май 2026' },
                  ].map((item, i) => (
                    <div key={i} className="border-l-[2px] border-rso-blue/10 pl-4">
                      <label className="block text-[9px] uppercase font-bold text-rso-blue/40 mb-1 tracking-widest">{item.label}</label>
                      <div className="text-lg font-black uppercase text-rso-blue">{item.value}</div>
                    </div>
                  ))}
                </div>
                {nearestEvent && (
                  <div className="border-[1px] border-rso-blue p-6 bg-blue-50/30 flex justify-between items-center group">
                    <div>
                      <p className="text-[9px] uppercase font-bold opacity-50 mb-1">Ближайший выезд</p>
                      <h4 className="text-2xl font-black uppercase text-rso-blue">{nearestEvent.title}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-bold">{new Date(nearestEvent.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* МЕРОПРИЯТИЯ */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                {events.map(event => (
                  <div key={event.id} className="border-[1px] border-rso-blue flex bg-white group overflow-hidden">
                    <div className="bg-blue-50 p-4 w-24 flex flex-col items-center justify-center border-r-[1px] border-rso-blue">
                      <span className="text-3xl font-black text-rso-blue">{new Date(event.date).getDate()}</span>
                      <span className="text-[9px] uppercase font-bold opacity-50">{new Date(event.date).toLocaleString('ru', { month: 'short' })}</span>
                    </div>
                    <div className="p-5 flex-1">
                      <h4 className="font-black uppercase text-rso-blue text-lg leading-tight">{event.title}</h4>
                      <p className="text-[10px] font-bold opacity-40 uppercase mt-1">{event.type === 'REGIONAL' ? 'Региональное' : 'Отрядное'}</p>
                    </div>
                    <div className="p-4 flex items-center border-l-[1px] border-rso-blue bg-gray-50/30">
                      {event.isJoined ? (
                        <button onClick={() => handleLeaveEvent(event.id)} className="text-[9px] font-bold border-[1px] border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">Отказаться</button>
                      ) : (
                        <button onClick={() => handleJoinEvent(event.id)} className="text-[9px] font-bold bg-rso-blue text-white px-4 py-2 hover:bg-black transition-all uppercase tracking-widest">Участвовать</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ПАНЕЛЬ КОМАНДИРА */}
            {activeTab === 'commander' && (
              <div className="space-y-10">
                {commanderData ? (
                  <>
                    <section>
                      <h3 className="text-xs font-black uppercase mb-4 border-b border-rso-blue/10 pb-2">Заявки кандидатов</h3>
                      <div className="space-y-3">
                        {commanderData.applications.map(app => (
                          <div key={app.id} className="border-[1px] border-rso-blue p-4 flex justify-between items-center bg-blue-50/20">
                            <span className="font-bold uppercase text-sm">{app.user.firstName} {app.user.lastName}</span>
                            <div className="flex gap-2">
                              <button onClick={() => handleProcessApp(app.id, 'APPROVED')} className="bg-rso-blue text-white px-4 py-1.5 text-[9px] font-bold uppercase">Принять</button>
                              <button onClick={() => handleProcessApp(app.id, 'REJECTED')} className="border border-red-500 text-red-500 px-4 py-1.5 text-[9px] font-bold uppercase">Отказ</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h3 className="text-xs font-black uppercase mb-4 border-b border-rso-blue/10 pb-2">Состав отряда</h3>
                      <div className="border-[1px] border-rso-blue divide-y divide-rso-blue">
                        {commanderData.members.map((m, i) => (
                          <div key={m.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                            <span className="text-[11px] font-bold uppercase">{i+1}. {m.firstName} {m.lastName}</span>
                            <span className="text-[9px] font-mono opacity-40">{m.role}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                ) : (
                  <div className="text-center py-20 opacity-30 text-xs font-bold uppercase tracking-widest">Данные штаба недоступны</div>
                )}
              </div>
            )}
          </section>
          
          {/* СОЦСЕТИ (Внизу) */}
          <div className="md:col-start-2 border-[1px] border-rso-blue p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex gap-10">
              <div>
                <label className="block text-[8px] font-bold uppercase opacity-40 mb-1">VK_PROFILE</label>
                <div className="font-black uppercase text-sm text-rso-blue">{links.vkUrl || '—'}</div>
              </div>
              <div>
                <label className="block text-[8px] font-bold uppercase opacity-40 mb-1">TELEGRAM</label>
                <div className="font-black uppercase text-sm text-rso-blue">{links.tgUrl || '—'}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="text-[9px] font-bold border border-rso-blue px-6 py-2 uppercase hover:bg-rso-blue hover:text-white transition-all"
            >
              [ Редактировать связи ]
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}