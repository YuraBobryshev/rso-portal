import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CreateEventModal from '../components/CreateEventModal';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  
  // Социальные сети
  const [vkUrl, setVkUrl] = useState('');
  const [tgUrl, setTgUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Календарь и отображение
  const [viewMode, setViewMode] = useState('list'); // 'list' или 'calendar'
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 4, 1)); // Май 2026
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDayLabel, setSelectedDayLabel] = useState(null);

  // Стейты модальных окон
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedEventForView, setSelectedEventForView] = useState(null); 

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_URL = 'http://176.98.177.3:5000'; // Твой боевой IP

  const fetchProfileData = async () => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      const userRes = await axios.get(`${API_URL}/api/auth/me`, { headers });
      setUser(userRes.data);
      setVkUrl(userRes.data.vkUrl || '');
      setTgUrl(userRes.data.tgUrl || '');

      setEventsLoading(true);
      const eventsRes = await axios.get(`${API_URL}/api/events`, { headers });
      setEvents(eventsRes.data);
    } catch (err) {
      console.error("Ошибка загрузки профиля", err);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [navigate]);

  const refreshEventsList = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const eventsRes = await axios.get(`${API_URL}/api/events`, { headers });
      setEvents(eventsRes.data);
      return eventsRes.data;
    } catch (err) { console.error(err); }
  };

  const handleJoinEvent = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_URL}/api/events/${id}/join`, {}, { headers });
      const updatedEvents = await refreshEventsList();
      
      const currentEvent = updatedEvents.find(e => e.id === id);
      if (selectedEventForView) setSelectedEventForView(currentEvent);
      
      if (selectedDayLabel && currentEvent) {
        const clickedDateStr = new Date(currentEvent.date).toDateString();
        const matches = updatedEvents.filter(e => new Date(e.date).toDateString() === clickedDateStr);
        setSelectedDateEvents(matches);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось записаться');
    }
  };

  const handleLeaveEvent = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/api/events/${id}/leave`, { headers });
      const updatedEvents = await refreshEventsList();

      const currentEvent = updatedEvents.find(e => e.id === id);
      if (selectedEventForView) setSelectedEventForView(currentEvent);

      if (selectedDayLabel && currentEvent) {
        const clickedDateStr = new Date(currentEvent.date).toDateString();
        const matches = updatedEvents.filter(e => new Date(e.date).toDateString() === clickedDateStr);
        setSelectedDateEvents(matches);
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveSocials = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`${API_URL}/api/auth/profile`, { vkUrl, tgUrl }, { headers });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { console.error(err); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
      await axios.post(`${API_URL}/api/auth/upload-avatar`, formData, { headers });
      fetchProfileData();
    } catch (err) { console.error(err); }
  };

  const getEventStatus = (dateStr) => {
    const now = new Date();
    const eventStart = new Date(dateStr);
    const eventEnd = new Date(eventStart.getTime() + 3 * 60 * 60 * 1000);

    if (now < eventStart) {
      return { label: 'Будущее', styles: 'bg-blue-50 text-blue-600 border-blue-100' };
    }
    if (now >= eventStart && now <= eventEnd) {
      return { label: 'Идет сейчас', styles: 'bg-green-50 text-green-600 border-green-100 font-black animate-pulse' };
    }
    return { label: 'Прошедшее', styles: 'bg-gray-100 text-gray-400 border-gray-200' };
  };

  const isCommandStaff = user && ['COMMANDER', 'COMMISSAR', 'MASTER', 'REG_HQ'].includes(user.role);

  // Математика календаря
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const blanksCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < blanksCount; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);

  const changeMonth = (offset) => {
    setCalendarDate(new Date(year, month + offset, 1));
    setSelectedDateEvents([]);
    setSelectedDayLabel(null);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const clickedDateStr = new Date(year, month, day).toDateString();
    const matches = events.filter(e => new Date(e.date).toDateString() === clickedDateStr);
    setSelectedDateEvents(matches);
    setSelectedDayLabel(`${day} ${calendarDate.toLocaleString('ru-RU', { month: 'long' })} 2026`);
  };

  if (loading || !user) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-sm font-medium text-gray-400 animate-pulse">
      Синхронизация учетной записи бойца...
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      <Header />

      {/* Изменено: отступы pt-20 для мобилок и pt-28 для десктопа, уменьшен gap */}
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-24 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* ================= ЛЕВАЯ КОЛОНКА ================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-gray-100 rounded-3xl p-5 sm:p-6 bg-white shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-100 bg-gray-50 overflow-hidden relative group shadow-inner mb-3 sm:mb-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-black text-rso-blue bg-blue-50/50">{user.firstName?.charAt(0)}</div>
              )}
              <label className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                <span className="text-[10px] font-black uppercase text-white tracking-wider">Обновить</span>
                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
              </label>
            </div>

            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900 leading-tight">{user.lastName} <br /> {user.firstName}</h2>
            
            <div className="mt-2.5 flex flex-wrap justify-center gap-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white ${user.role === 'REG_HQ' ? 'bg-red-500' : user.role === 'COMMANDER' ? 'bg-rso-blue' : 'bg-gray-400'}`}>{user.role}</span>
              {user.brigade?.name && <span className="px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-gray-900 text-white">{user.brigade.name}</span>}
            </div>
            <p className="text-[9px] text-gray-400 font-mono mt-3 uppercase tracking-wider">ID: {user.id.substring(0, 8)}</p>
          </div>

          <div className="border border-gray-100 rounded-3xl p-5 sm:p-6 bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Цифровые контакты</h3>
            {saveSuccess && <div className="p-2 bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold uppercase rounded-lg text-center">✓ Контакты обновлены</div>}
            <form onSubmit={handleSaveSocials} className="space-y-3">
              <div className="space-y-1"><label className="text-[9px] font-bold uppercase text-gray-400">Профиль ВКонтакте</label><input type="text" value={vkUrl} onChange={e => setVkUrl(e.target.value)} placeholder="vk.com/username" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs text-black font-medium focus:outline-none focus:border-rso-blue focus:bg-white" /></div>
              <div className="space-y-1"><label className="text-[9px] font-bold uppercase text-gray-400">Никнейм Telegram</label><input type="text" value={tgUrl} onChange={e => setTgUrl(e.target.value)} placeholder="@username" className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs text-black font-medium focus:outline-none focus:border-rso-blue focus:bg-white" /></div>
              <button type="submit" className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors">Сохранить изменения</button>
            </form>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="lg:col-span-8 space-y-6">
          {/* Изменено: закругление и падинги теперь гибкие для мобилок */}
          <div className="border border-gray-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 bg-white shadow-sm space-y-5">
            
            {/* Оптимизировано: элементы перестраиваются в стек на мобилке */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-50">
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">Твой календарь событий</h2>
                <p className="text-xs text-gray-400 font-medium">Отслеживание посещаемости и планирование выездов</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                  <button onClick={() => setViewMode('list')} className={`px-2.5 py-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-rso-blue shadow-xs' : 'text-gray-400'}`}>Список</button>
                  <button onClick={() => setViewMode('calendar')} className={`px-2.5 py-1.5 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-rso-blue shadow-xs' : 'text-gray-400'}`}>Календарь</button>
                </div>
                {isCommandStaff && <button onClick={() => setIsModalOpen(true)} className="px-3.5 py-2 bg-rso-blue text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-xs ml-auto md:ml-0">+ Событие ЛСО</button>}
              </div>
            </div>

            {/* РЕНДЕРИНГ РЕЖИМОВ */}
            {eventsLoading ? (
              <div className="py-16 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">Синхронизация ленты ивентов...</div>
            ) : viewMode === 'list' ? (
              
              /* РЕЖИМ А: СПИСОК */
              <div className="space-y-2.5">
                {events.length > 0 ? (
                  events.map(event => {
                    const status = getEventStatus(event.date);
                    const isRegional = event.type === 'REGIONAL';

                    return (
                      <div 
                        key={event.id} 
                        onClick={() => setSelectedEventForView(event)} 
                        className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-white hover:border-gray-200 hover:shadow-xs cursor-pointer transition-all duration-200"
                      >
                        <div className="space-y-1 min-w-0 w-full sm:w-auto">
                          <div className="flex items-center flex-wrap gap-1">
                            <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-wide px-1.5 py-0.2 border rounded ${status.styles}`}>• {status.label}</span>
                            <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-wide px-1.5 py-0.2 rounded text-white ${isRegional ? 'bg-rso-blue' : 'bg-gray-800'}`}>{isRegional ? 'ШТАБ' : 'ОТРЯД'}</span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">{new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-black truncate">{event.title}</h4>
                          <p className="text-[11px] sm:text-xs text-gray-400 font-medium truncate">📍 {event.location || 'Штаб'} — {event.description}</p>
                        </div>

                        <div className="shrink-0 self-end sm:self-center pt-1 sm:pt-0">
                          {event.isJoined ? (
                            <span className="px-2.5 py-1 bg-green-500/10 text-green-600 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-wider border border-green-500/10">Вы идёте ✓</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-400 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-wider border border-gray-200/50">Не записан</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs font-bold uppercase opacity-30 tracking-wider">Календарь пуст</div>
                )}
              </div>

            ) : (
              
              /* РЕЖИМ Б: МОБИЛЬНЫЙ КАЛЕНДАРЬ */
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                  <button onClick={() => changeMonth(-1)} className="text-xs font-black text-gray-400 hover:text-black px-2">◀</button>
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black">{calendarDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => changeMonth(1)} className="text-xs font-black text-gray-400 hover:text-black px-2">▶</button>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
                </div>

                {/* Дни стали более адаптивными по тексту, точки сместились для мелких экранов */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {daysArray.map((day, idx) => {
                    if (!day) return <div key={idx} className="aspect-square bg-transparent" />;
                    const currentLoopDateStr = new Date(year, month, day).toDateString();
                    const hasEvents = events.some(e => new Date(e.date).toDateString() === currentLoopDateStr);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleDayClick(day)}
                        className={`aspect-square rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-bold flex flex-col items-center justify-center relative transition-all ${
                          hasEvents ? 'border-blue-200 bg-blue-50/40 text-rso-blue font-black shadow-xs' : 'border-gray-50 bg-gray-50/30 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvents && <span className="w-1 h-1 bg-rso-blue rounded-full absolute bottom-1 sm:bottom-1.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* События под календарем */}
                {selectedDayLabel && (
                  <div className="pt-3 border-t border-gray-50 space-y-2 animate-fadeIn">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">События на {selectedDayLabel}:</span>
                    {selectedDateEvents.length > 0 ? (
                      selectedDateEvents.map(e => (
                        <div 
                          key={e.id} 
                          onClick={() => setSelectedEventForView(e)} 
                          className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center cursor-pointer hover:bg-white hover:border-gray-200 transition-all gap-3"
                        >
                          <div className="min-w-0">
                            <h5 className="text-[11px] sm:text-xs font-black uppercase text-black truncate">{e.title}</h5>
                            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium block truncate">📍 {e.location || 'Штаб'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {e.isJoined && <span className="text-[7px] sm:text-[8px] font-black uppercase bg-green-50 text-green-600 border border-green-100 px-1 py-0.2 rounded">Иду</span>}
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white text-gray-500 border border-gray-100">{new Date(e.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">На этот день мероприятий не запланировано</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =========================================================================
          🔥 МОБИЛЬНАЯ КАРТОЧКА МЕРОПРИЯТИЯ (ПАТЧ ПАДИНГОВ И ЗАКРУГЛЕНИЙ)
          ========================================================================= */}
      {selectedEventForView && (() => {
        const status = getEventStatus(selectedEventForView.date);
        const isRegional = selectedEventForView.type === 'REGIONAL';

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
            <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[2.5rem] w-full max-w-xl p-5 sm:p-6 md:p-8 shadow-2xl relative space-y-4 sm:space-y-6 max-h-[92vh] overflow-y-auto scrollbar-none">
              
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${status.styles}`}>• {status.label}</span>
                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${isRegional ? 'bg-rso-blue' : 'bg-gray-950'}`}>{isRegional ? 'Городское' : 'Внутриотрядное'}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-black leading-tight">{selectedEventForView.title}</h2>
                
                {/* Грид тайминга перестраивается в 1 колонку на мелких экранах */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100/70 text-[11px] sm:text-xs">
                  <div>
                    <span className="text-[8px] font-bold uppercase text-gray-400 block">Когда состоится</span>
                    <span className="font-black text-black">🗓 {new Date(selectedEventForView.date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold uppercase text-gray-400 block">Место сбора</span>
                    <span className="font-black text-black truncate block">📍 {selectedEventForView.location || 'Не указано'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] sm:text-[9px] font-black uppercase text-gray-400 tracking-wider">Программа и описание</label>
                <p className="text-[11px] sm:text-xs text-gray-700 font-medium leading-relaxed bg-gray-50/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                  {selectedEventForView.description || 'Организаторы не указали подробное описание для этого события.'}
                </p>
              </div>

              {/* Кнопки перестраиваются в вертикальный стек на смартфонах */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setSelectedEventForView(null)}
                  className="w-full sm:w-1/3 py-2.5 sm:py-3 border border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400 rounded-xl hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Закрыть
                </button>

                <div className="w-full sm:w-2/3 order-1 sm:order-2">
                  {selectedEventForView.isJoined ? (
                    <button
                      onClick={() => handleLeaveEvent(selectedEventForView.id)}
                      className="w-full py-2.5 sm:py-3 bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      Отменить запись ×
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinEvent(selectedEventForView.id)}
                      className="w-full py-2.5 sm:py-3 bg-rso-blue text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black transition-all shadow-md shadow-blue-500/10"
                    >
                      Я пойду →
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      <CreateEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProfileData}
        userRole={user?.role}
      />
    </div>
  );
}