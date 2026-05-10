import React, { useEffect, useState } from 'react';
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

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // 1. Загрузка профиля
      const userRes = await axios.get('http://localhost:5000/api/auth/me', { headers });
      const user = userRes.data;
      setUserData(user);
      setLinks({ vkUrl: user.vkUrl || '', tgUrl: user.tgUrl || '' });

      // 2. Загрузка мероприятий
      const eventsRes = await axios.get('http://localhost:5000/api/events', { headers });
      setEvents(eventsRes.data);

      const nearestRes = await axios.get('http://localhost:5000/api/events/my-nearest', { headers });
      setNearestEvent(nearestRes.data);

      // 3. Загрузка данных отряда (только для командира)
      if (user.role === 'COMMANDER') {
        try {
          const cmdRes = await axios.get('http://localhost:5000/api/commander/dashboard', { headers });
          setCommanderData(cmdRes.data);
        } catch (e) {
          console.log("Отряд еще не назначен штабом");
          setCommanderData(null); 
        }
      }

    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [navigate]);

  const handleSaveLinks = async () => {
    try {
      await axios.patch('http://localhost:5000/api/auth/profile', links, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setIsEditing(false);
      fetchData();
    } catch (err) { alert("Ошибка при сохранении."); }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/join`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchData(); 
    } catch (err) { alert("Не удалось записаться"); }
  };

  const handleLeaveEvent = async (eventId) => {
    if (!window.confirm("Вы уверены, что хотите отменить участие?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}/leave`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchData(); 
    } catch (err) { alert("Ошибка при отмене участия"); }
  };

  const handleProcessApplication = async (appId, status) => {
    const action = status === 'APPROVED' ? 'ПРИНЯТЬ' : 'ОТКЛОНИТЬ';
    if (!window.confirm(`Вы уверены, что хотите ${action} кандидата?`)) return;
    try {
      await axios.post('http://localhost:5000/api/commander/process-application', 
        { appId, status, comment: "Рассмотрено командиром" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) { alert("Ошибка при обработке заявки"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono text-rso-blue uppercase tracking-widest text-sm">
      <div className="animate-pulse">Загрузка данных...</div>
    </div>
  );

  // Динамические вкладки
  const tabs = [
    { id: 'profile', label: 'Обо мне' },
    { id: 'events', label: 'Мероприятия' },
    { id: 'achievements', label: 'Достижения' },
  ];
  
  if (userData?.role === 'COMMANDER') {
    tabs.push({ 
      id: 'commander', 
      label: 'Мой отряд', 
      badge: commanderData?.applications?.length > 0 ? commanderData.applications.length : null 
    });
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 selection:bg-rso-blue selection:text-white">
      <Header />
      
      <main className="max-w-[1200px] mx-auto p-6 mt-6">
        
        {/* Шапка кабинета */}
        <div className="border-[1px] border-rso-blue p-4 flex justify-between items-center mb-10 relative bg-blue-50/30">
          <div className="flex items-center gap-3">
            <ИконкаЗвезды />
            <span className="text-rso-blue font-bold uppercase tracking-widest text-sm">
              Личный кабинет // ID: {userData?.id.split('-')[0].toUpperCase()}
            </span>
          </div>
          <div className="flex gap-4"><ИконкаЗвезды /> <ИконкаЗвезды /> <ИконкаЗвезды /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-10">
          
          {/* Левая колонка */}
          <aside className="space-y-8">
            <div className="border-[1px] border-rso-blue p-6 flex flex-col items-center">
              <div className="w-full aspect-square bg-rso-blue/5 border-[1px] border-rso-blue mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center text-rso-blue text-9xl font-black opacity-10 select-none">
                  {userData?.firstName.charAt(0)}
                </div>
                <div className="absolute inset-4 border border-rso-blue/20"></div>
                <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm border-[1px] border-rso-blue p-2 text-xs text-rso-blue font-bold uppercase text-center">
                  {userData?.role}
                </div>
              </div>
              <div className="w-full text-center md:text-left">
                <h2 className="text-3xl font-black text-rso-blue uppercase leading-tight mb-2 tracking-tighter">
                  {userData?.firstName} <br/> {userData?.lastName}
                </h2>
                <p className="text-xs text-rso-blue font-bold uppercase tracking-widest opacity-70">
                  СевРО РСО // 2026
                </p>
              </div>
            </div>

            <nav className="border-[1px] border-rso-blue divide-y-[1px] divide-rso-blue">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full p-5 text-left uppercase text-sm font-bold transition-all flex justify-between items-center group relative
                  ${activeTab === item.id ? 'bg-rso-blue text-white' : 'text-rso-blue hover:bg-blue-50'}`}
                >
                  <div className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 ml-2 animate-pulse">
                        +{item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`transition-transform group-hover:translate-x-1 ${activeTab === item.id ? 'text-white' : 'opacity-30'}`}>→</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Правая колонка */}
          <section className="space-y-10">
            <div className="border-[1px] border-rso-blue p-10 relative min-h-[450px]">
              <div className="absolute -top-3 left-8 bg-white px-3 text-rso-blue font-bold uppercase text-xs z-10">
                {activeTab === 'profile' && 'Основная информация'}
                {activeTab === 'events' && 'Мероприятия'}
                {activeTab === 'commander' && 'Управление отрядом'}
                {activeTab === 'achievements' && 'Достижения'}
              </div>
              
              {/* ВКЛАДКА ПРОФИЛЯ */}
              {activeTab === 'profile' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { label: 'Системный номер', value: userData?.id.split('-')[0].toUpperCase() },
                      { label: 'Мой отряд', value: userData?.brigade?.name || 'Не назначен' },
                      { label: 'Уровень доступа', value: userData?.role },
                      { label: 'Электронная почта', value: userData?.email },
                    ].map((item, i) => (
                      <div key={i}>
                        <label className="block text-[10px] uppercase text-rso-blue font-bold mb-2 opacity-50 tracking-wider">{item.label}</label>
                        <div className="text-xl font-bold uppercase text-rso-blue">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  {nearestEvent && (
                    <div className="mt-12 border-[1px] border-rso-blue p-8 flex justify-between items-center bg-blue-50/30">
                      <div>
                        <p className="text-xs uppercase font-bold mb-2 opacity-70">На очереди</p>
                        <h4 className="text-3xl font-black uppercase tracking-tighter leading-none">{nearestEvent.title}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-mono font-bold">{new Date(nearestEvent.date).toLocaleDateString()}</p>
                        <span className="text-xs uppercase font-bold tracking-widest block mt-1">Детали →</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ВКЛАДКА МЕРОПРИЯТИЙ */}
              {activeTab === 'events' && (
                <div className="flex flex-col gap-6">
                  {events.length > 0 ? events.map(event => {
                    const eventDate = new Date(event.date);
                    return (
                      <div key={event.id} className="border-[1px] border-rso-blue flex flex-col md:flex-row bg-white">
                        <div className="bg-blue-50/50 p-4 md:w-32 border-b-[1px] md:border-b-0 md:border-r-[1px] border-rso-blue flex flex-col items-center justify-center">
                          <span className="text-xs uppercase font-bold opacity-60 tracking-widest">{eventDate.toLocaleString('ru', { month: 'short' })}</span>
                          <span className="text-4xl font-black text-rso-blue mt-1">{eventDate.getDate()}</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                          <span className="text-[9px] border-[1px] border-rso-blue px-2 py-0.5 uppercase font-bold text-rso-blue w-fit mb-2">
                            {event.type === 'REGIONAL' ? 'Региональное' : 'Отрядное'}
                          </span>
                          <h4 className="text-xl font-black uppercase tracking-tight">{event.title}</h4>
                        </div>
                        <div className="p-6 border-t-[1px] md:border-t-0 md:border-l-[1px] border-rso-blue flex items-center justify-center bg-gray-50/10">
                          {event.isJoined ? (
                            <button onClick={() => handleLeaveEvent(event.id)} className="text-[10px] border-[1px] border-red-500 text-red-500 px-6 py-3 uppercase font-bold hover:bg-red-500 hover:text-white transition-all tracking-widest">
                              Отказаться ✕
                            </button>
                          ) : (
                            <button onClick={() => handleJoinEvent(event.id)} className="text-xs bg-rso-blue text-white px-6 py-3 uppercase font-bold hover:bg-black transition-colors tracking-widest">
                              Принять участие
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }) : <div className="p-10 text-center text-xs uppercase font-bold opacity-40">Мероприятий пока нет</div>}
                </div>
              )}

              {/* ВКЛАДКА КОМАНДИРА */}
              {activeTab === 'commander' && (
                <div className="space-y-10">
                  {commanderData ? (
                    <>
                      <div>
                        <h3 className="text-sm font-bold uppercase mb-4 opacity-70 border-b border-rso-blue/20 pb-2">Новые заявки ({commanderData.applications.length})</h3>
                        <div className="grid gap-4">
                          {commanderData.applications.length > 0 ? commanderData.applications.map(app => (
                            <div key={app.id} className="border-[1px] border-rso-blue p-4 flex flex-col md:flex-row justify-between items-center bg-blue-50/30">
                              <div>
                                <div className="font-bold uppercase text-lg">{app.user.firstName} {app.user.lastName}</div>
                                <div className="text-xs opacity-50 font-mono">{app.user.email}</div>
                              </div>
                              <div className="flex gap-2 mt-4 md:mt-0">
                                <button onClick={() => handleProcessApplication(app.id, 'APPROVED')} className="px-6 py-2 bg-rso-blue text-white uppercase font-bold text-xs hover:bg-black transition-colors">Принять</button>
                                <button onClick={() => handleProcessApplication(app.id, 'REJECTED')} className="px-6 py-2 border border-red-500 text-red-500 uppercase font-bold text-xs hover:bg-red-500 hover:text-white transition-colors">Отказ</button>
                              </div>
                            </div>
                          )) : <div className="border border-dashed border-rso-blue p-8 text-center text-xs uppercase opacity-40 font-bold">Заявок нет</div>}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold uppercase mb-4 opacity-70 border-b border-rso-blue/20 pb-2">Участники отряда ({commanderData.members.length})</h3>
                        <div className="border-[1px] border-rso-blue divide-y divide-rso-blue max-h-[300px] overflow-y-auto">
                          {commanderData.members.map((member, idx) => (
                            <div key={member.id} className="p-4 flex justify-between items-center hover:bg-blue-50">
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-mono opacity-30">{(idx + 1).toString().padStart(2, '0')}</span>
                                <div className="font-bold uppercase text-sm">{member.firstName} {member.lastName}</div>
                              </div>
                              <span className="text-[10px] border border-rso-blue px-2 py-1 uppercase font-bold text-rso-blue">{member.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="border border-red-500 bg-red-50 p-10 text-center">
                      <h3 className="text-red-500 font-black uppercase text-xl mb-2">ОШИБКА ДАННЫХ</h3>
                      <p className="text-red-500/70 text-xs font-bold uppercase">За вами еще не закреплен отряд. <br/>Свяжитесь с региональным штабом.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* СЕТКА КОНТАКТОВ */}
            <div>
              <div className="flex justify-between items-end mb-4 px-2 text-xs font-bold uppercase text-rso-blue/70">
                <span>Способы связи</span>
                <button onClick={() => isEditing ? handleSaveLinks() : setIsEditing(true)} className="border border-rso-blue px-4 py-1 hover:bg-rso-blue hover:text-white transition-all">
                  {isEditing ? '[ Сохранить ]' : '[ Редактировать ]'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 border-t border-l border-rso-blue">
                <div className="md:col-span-5 border-r border-b border-rso-blue p-6 hover:bg-blue-50/50 transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-rso-blue/70 mb-3 tracking-widest">ВКонтакте</label>
                  {isEditing ? (
                    <input value={links.vkUrl} onChange={e => setLinks({...links, vkUrl: e.target.value})} className="w-full bg-transparent border-b border-rso-blue outline-none py-1 font-bold"/>
                  ) : <div className="text-lg font-bold uppercase">{links.vkUrl || 'Не указано'}</div>}
                </div>
                <div className="md:col-span-4 border-r border-b border-rso-blue p-6 bg-rso-blue text-white">
                  <label className="block text-[10px] uppercase font-bold text-white/70 mb-3 tracking-widest">Telegram</label>
                  {isEditing ? (
                    <input value={links.tgUrl} onChange={e => setLinks({...links, tgUrl: e.target.value})} className="w-full bg-transparent border-b border-white outline-none py-1 font-bold text-white"/>
                  ) : <div className="text-lg font-bold uppercase tracking-tight">{links.tgUrl || 'Не указано'}</div>}
                </div>
                <div className="md:col-span-3 border-r border-b border-rso-blue p-6 flex flex-col justify-between items-end bg-blue-50/50">
                  <div className="flex gap-1 mb-4">{[1,2,3,4].map(i => <div key={i} className="w-2 h-2 border border-rso-blue rounded-full"></div>)}</div>
                  <div className="text-right text-[10px] font-bold text-rso-blue uppercase">Активен // 2026</div>
                </div>
                <div className="md:col-span-12 border-r border-b border-rso-blue p-4 flex justify-between items-center bg-gray-50 text-[10px] font-bold uppercase">
                  <div className="flex gap-8"><span>{userData?.email}</span><span>Севастополь</span></div>
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