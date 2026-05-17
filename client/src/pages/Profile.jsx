import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [nearestEvent, setNearestEvent] = useState(null);
  const [commanderData, setCommanderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState({ vkUrl: '', tgUrl: '' });

  const fileInputRef = useRef(null);
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
      fetchData();
    } catch (err) {
      alert("Ошибка при загрузке изображения.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLinks = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.patch('http://localhost:5000/api/auth/profile', links, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      alert("Ошибка сохранения.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleProcessApp = async (appId, status) => {
    if (!window.confirm("Подтвердите действие")) return;
    try {
      await axios.post('http://localhost:5000/api/commander/process-application', { appId, status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert("Ошибка обработки"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-sm font-medium text-gray-400 animate-pulse">
      Загрузка личного кабинета...
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Анкета бойца' },
    { id: 'events', label: 'Мероприятия' },
    { id: 'achievements', label: 'Достижения' },
  ];
  if (userData?.role === 'COMMANDER') tabs.push({ id: 'commander', label: 'Управление отрядом', badge: commanderData?.applications?.length });

  const joinedEventsCount = events.filter(e => e.isJoined).length;

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      <Header />
      
      {/* pt-24 железно решает проблему наезда фиксированного хедера на контент на ПК */}
      <main className="max-w-[1500px] mx-auto px-6 pt-24 pb-24">
        
        {/* ПРИВЕТСТВИЕ В СТИЛЕ РЕФЕРЕНСА */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Привет, {userData?.firstName || 'боец'}!
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Добро пожаловать в твой цифровой дашборд СевРО РСО</p>
        </div>

        {/* ГЛАВНАЯ СТРУКТУРА BENTO-СЕТКИ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= ЛЕВАЯ КАРТОЧКА: ПРОФИЛЬ (4 КОЛОНКИ) ================= */}
          <aside className="lg:col-span-4 bg-gray-50/70 border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
            
            {/* Круглая мягкая аватарка */}
            <div className="flex flex-col items-center">
              <div 
                onClick={handleAvatarClick}
                className="w-40 h-40 rounded-full bg-white border border-gray-200 relative overflow-hidden cursor-pointer shadow-md group shrink-0"
              >
                {userData?.avatarUrl ? (
                  <img src={userData.avatarUrl} alt="Аватар" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rso-blue text-5xl font-black bg-blue-50/40 uppercase">
                    {userData?.firstName?.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <span className="text-white text-[11px] font-medium">Обновить фото</span>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            </div>

            {/* Текстовый блок информации */}
            <div className="space-y-4 text-center lg:text-left border-t border-gray-200/60 pt-6">
              <div>
                <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                  {userData?.lastName} {userData?.firstName}
                </h2>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Должность:</span>
                  <span className="inline-block text-[11px] font-bold text-white bg-rso-blue px-3 py-0.5 rounded-full uppercase tracking-wide w-fit mx-auto lg:mx-0">
                    {userData?.role}
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1 border-t border-gray-100 pt-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Мой отряд:</span>
                  <span className="text-sm font-bold text-black uppercase">
                    {userData?.brigade?.name || 'Направление не указано'}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= ПРАВАЯ ЧАСТЬ: МЕТРИКИ + СЕТКА ТАБОВ (8 КОЛОНОК) ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* МЯГКИЕ BENTO-ВИДЖЕТЫ АНАЛИТИКИ (КАК НА СКРИНШОТЕ) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/70 hover:border-rso-blue/30 transition-colors duration-300">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Выезды</span>
                <div className="text-3xl md:text-4xl font-black text-rso-blue mt-1">{joinedEventsCount}</div>
                <span className="text-xs font-medium text-gray-400 block mt-1">запланировано</span>
              </div>
              <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/70 hover:border-rso-blue/30 transition-colors duration-300">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Труд</span>
                <div className="text-3xl md:text-4xl font-black text-black mt-1">160</div>
                <span className="text-xs font-medium text-gray-400 block mt-1">часов отработано</span>
              </div>
              <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/70 hover:border-rso-blue/30 transition-colors duration-300">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Грамоты</span>
                <div className="text-3xl md:text-4xl font-black text-black mt-1">0</div>
                <span className="text-xs font-medium text-gray-400 block mt-1">знаков отличия</span>
              </div>
            </div>

            {/* МЯГКИЙ ТАБ-ПЕРЕКЛЮЧАТЕЛЬ */}
            <div className="flex border border-gray-100 rounded-xl overflow-x-auto scrollbar-none whitespace-nowrap bg-gray-50/60 p-1 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-lg flex-1 md:flex-initial ${
                    activeTab === tab.id 
                      ? 'bg-white text-rso-blue shadow-sm font-extrabold border border-gray-100' 
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{tab.label}</span>
                    {tab.badge > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans">{tab.badge}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* БОЛЬШАЯ КОНТЕНТНАЯ КАРТОЧКА BENTO */}
            <div className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white min-h-[350px] shadow-sm relative">
              
              {/* ================= ВКЛАДКА: АНКЕТА ПРОФИЛЯ ================= */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Электронная почта', value: userData?.email },
                      { label: 'Ролевой доступ', value: userData?.role },
                      { label: 'Закрепленный отряд', value: userData?.brigade?.name || 'Реестр пуст (Без отряда)' },
                      { label: 'Трудовой семестр', value: 'Активен (Крым, Севастополь)' },
                    ].map((item, i) => (
                      <div key={i} className="border-b border-gray-50 pb-4 space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</label>
                        <div className="text-sm md:text-base font-bold text-black uppercase">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {nearestEvent && (
                    <div className="border border-rso-blue/10 bg-gray-50/50 rounded-xl p-5 flex justify-between items-center group hover:border-rso-blue/30 transition-colors duration-300">
                      <div>
                        <span className="text-[10px] font-bold text-rso-blue uppercase tracking-wider block mb-0.5">Ближайший выезд</span>
                        <h4 className="text-base md:text-lg font-black uppercase text-black">{nearestEvent.title}</h4>
                      </div>
                      <div className="text-xs font-bold text-rso-blue bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
                        {new Date(nearestEvent.date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= ВКЛАДКА: МЕРОПРИЯТИЯ ================= */}
              {activeTab === 'events' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {events.map(event => (
                    <div key={event.id} className="border border-gray-100 rounded-xl flex flex-col sm:flex-row bg-white overflow-hidden hover:border-rso-blue/30 transition-colors duration-300 shadow-sm">
                      <div className="bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100 p-4 w-full sm:w-20 flex sm:flex-col items-center justify-between sm:justify-center shrink-0">
                        <span className="text-2xl font-black text-rso-blue leading-none">{new Date(event.date).getDate()}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(event.date).toLocaleString('ru', { month: 'short' }).toUpperCase()}</span>
                      </div>
                      
                      <div className="p-4 flex-1 min-w-0">
                        <h4 className="font-black uppercase text-black text-sm md:text-base leading-tight truncate">{event.title}</h4>
                        <span className="inline-block text-[9px] font-bold text-rso-blue bg-blue-50 px-2 py-0.5 rounded-full uppercase mt-1">
                          {event.type === 'REGIONAL' ? 'Региональное' : 'Локальное'}
                        </span>
                      </div>
                      
                      <div className="p-4 flex items-center justify-end bg-gray-50/10 border-t sm:border-t-0 sm:border-l border-gray-100 shrink-0">
                        {event.isJoined ? (
                          <button onClick={() => handleLeaveEvent(event.id)} className="w-full sm:w-auto text-[10px] font-bold border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider">Отмена</button>
                        ) : (
                          <button onClick={() => handleJoinEvent(event.id)} className="w-full sm:w-auto text-[10px] font-bold bg-rso-blue text-white px-4 py-2 rounded-lg hover:bg-black transition-all uppercase tracking-wider">Запись</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-12 text-xs font-bold uppercase tracking-wider opacity-30">Список выездов пуст</div>
                  )}
                </div>
              )}

              {/* ================= ВКЛАДКА: НАГРАДЫ ================= */}
              {activeTab === 'achievements' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl p-6">
                    <span className="text-rso-blue text-2xl block mb-2">✦</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Реестр наград пуст</h4>
                    <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                      Виртуальные грамоты за трудовые достижения начисляются сюда Региональным штабом СевРО.
                    </p>
                  </div>
                </div>
              )}

              {/* ================= ВКЛАДКА: УПРАВЛЕНИЕ ОТРЯДОМ ================= */}
              {activeTab === 'commander' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {commanderData ? (
                    <>
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block">Заявки в отряд</span>
                        <div className="space-y-2">
                          {commanderData.applications.map(app => (
                            <div key={app.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
                              <span className="font-black uppercase text-xs text-black">{app.user.firstName} {app.user.lastName}</span>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={() => handleProcessApp(app.id, 'APPROVED')} className="flex-1 sm:flex-initial bg-rso-blue text-white px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg hover:bg-black transition-colors">Принять</button>
                                <button onClick={() => handleProcessApp(app.id, 'REJECTED')} className="flex-1 sm:flex-initial border border-red-500 text-red-500 px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg hover:bg-red-500 hover:text-white transition-colors">Отказ</button>
                              </div>
                            </div>
                          ))}
                          {commanderData.applications.length === 0 && (
                            <div className="text-xs font-medium text-gray-400 uppercase py-2">Новых прошений о вступлении нет</div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block">Личный состав ЛСО</span>
                        <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 max-h-[250px] overflow-y-auto shadow-inner bg-white">
                          {commanderData.members.map((m, i) => (
                            <div key={m.id} className="p-3 flex justify-between items-center text-xs font-bold uppercase hover:bg-gray-50/50">
                              <span className="text-black">{i+1}. {m.firstName} {m.lastName}</span>
                              <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 border border-gray-100 rounded-md">{m.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-xs font-bold uppercase opacity-30">Информационный поток штаба недоступен</div>
                  )}
                </div>
              )}
            </div>

            {/* ================= СВЯЗИ И СОЦСЕТИ (БЕНТО-НИЗ) ================= */}
            <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
              {isEditing ? (
                <form onSubmit={handleSaveLinks} className="space-y-4 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block">Редактирование контактов</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Профиль ВКонтакте</label>
                      <input 
                        type="text" 
                        value={links.vkUrl} 
                        onChange={e => setLinks({...links, vkUrl: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-200 py-1.5 outline-none font-bold text-xs focus:border-rso-blue transition-colors uppercase" 
                        placeholder="vk.com/id"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Аккаунт Telegram</label>
                      <input 
                        type="text" 
                        value={links.tgUrl} 
                        onChange={e => setLinks({...links, tgUrl: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-200 py-1.5 outline-none font-bold text-xs focus:border-rso-blue transition-colors uppercase" 
                        placeholder="@username"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Отмена</button>
                    <button type="submit" className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-rso-blue text-white rounded-lg hover:bg-black transition-colors">Сохранить</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                  <div className="flex gap-12 w-full md:w-auto">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">ВКонтакте</label>
                      <div className="font-bold uppercase text-xs text-rso-blue mt-0.5 truncate max-w-[140px]">{links.vkUrl || 'Не привязан'}</div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Telegram</label>
                      <div className="font-bold uppercase text-xs text-rso-blue mt-0.5 truncate max-w-[140px]">{links.tgUrl || 'Не привязан'}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="w-full md:w-auto text-[10px] font-bold border border-gray-200 px-5 py-2.5 rounded-lg hover:border-rso-blue hover:text-rso-blue transition-all uppercase tracking-wider"
                  >
                    Редактировать
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}