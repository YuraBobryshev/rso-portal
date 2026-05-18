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
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 4, 1)); // Инициализируем маем 2026 года
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDayLabel, setSelectedDayLabel] = useState(null);

  // Контроль модального окна создания
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_URL = 'http://176.98.177.3:5000'; // Твой боевой IP сервера

  const fetchProfileData = async () => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      // 1. Берем профиль
      const userRes = await axios.get(`${API_URL}/api/auth/me`, { headers });
      setUser(userRes.data);
      setVkUrl(userRes.data.vkUrl || '');
      setTgUrl(userRes.data.tgUrl || '');

      // 2. Берем доступные мероприятия
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

  // Обновление соцсетей
  const handleSaveSocials = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`${API_URL}/api/auth/profile`, { vkUrl, tgUrl }, { headers });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Загрузка аватарки
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      const res = await axios.post(`${API_URL}/api/auth/upload-avatar`, formData, { headers });
      setUser({ ...user, avatarUrl: res.avatarUrl });
      fetchProfileData();
    } catch (err) {
      console.error("Ошибка загрузки фото", err);
    }
  };

  // 💡 АВТОМАТИЧЕСКИЙ РАСЧЕТ СТАТУСА МЕРОПРИЯТИЯ (Прошедшее / Идет сейчас / Будущее)
  const getEventStatus = (dateStr) => {
    const now = new Date();
    const eventStart = new Date(dateStr);
    // Допустим, средняя продолжительность любого события в РСО — 3 часа
    const eventEnd = new Date(eventStart.getTime() + 3 * 60 * 60 * 1000);

    if (now < eventStart) {
      return { label: 'Будущее', styles: 'bg-blue-50 text-blue-600 border-blue-100' };
    }
    if (now >= eventStart && now <= eventEnd) {
      return { label: 'Идет сейчас', styles: 'bg-green-50 text-green-600 border-green-100 animate-pulse font-black' };
    }
    return { label: 'Прошедшее', styles: 'bg-gray-100 text-gray-400 border-gray-200' };
  };

  // Проверка: является ли пользователь членом комсостава ЛСО
  const isCommandStaff = user && ['COMMANDER', 'COMMISSAR', 'MASTER'].includes(user.role);

  // =========================================================================
  // 📆 МАТЕМАТИКА КАЛЕНДАРНОЙ СЕТКИ (БЕЗ БИБЛИОТЕК)
  // =========================================================================
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Переводим американский формат дней (вс=0) на наш русский (пн=0)
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

      <main className="max-w-[1500px] mx-auto px-6 pt-24 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= ЛЕВАЯ КОЛОНКА: ПРОФИЛЬ И НАСТРОЙКИ ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Bento-Карточка Пользователя */}
          <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full border border-gray-100 bg-gray-50 overflow-hidden relative group shadow-inner mb-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-rso-blue bg-blue-50/50">
                  {user.firstName?.charAt(0)}
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                <span className="text-[10px] font-black uppercase text-white tracking-wider">Обновить</span>
                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
              </label>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 leading-tight">
              {user.lastName} <br /> {user.firstName}
            </h2>
            
            {/* Текстовые статусы ролей */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white ${
                user.role === 'REG_HQ' ? 'bg-red-500' : user.role === 'COMMANDER' ? 'bg-rso-blue' : 'bg-gray-400'
              }`}>
                {user.role}
              </span>
              {user.brigade?.name && (
                <span className="px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-900 text-white">
                  {user.brigade.name}
                </span>
              )}
            </div>

            <p className="text-[10px] text-gray-400 font-mono mt-4 uppercase">Регистрационный номер: {user.id.substring(0, 8)}</p>
          </div>

          {/* Социальный блок управления */}
          <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Цифровые контакты</h3>
            
            {saveSuccess && (
              <div className="p-2 bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold uppercase rounded-lg text-center">
                ✓ Контакты обновлены
              </div>
            )}

            <form onSubmit={handleSaveSocials} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-gray-400">Профиль ВКонтакте</label>
                <input 
                  type="text" 
                  value={vkUrl} 
                  onChange={e => setVkUrl(e.target.value)} 
                  placeholder="vk.com/username"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs text-black font-medium focus:outline-none focus:border-rso-blue focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-gray-400">Никнейм Telegram</label>
                <input 
                  type="text" 
                  value={tgUrl} 
                  onChange={e => setTgUrl(e.target.value)} 
                  placeholder="@username"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs text-black font-medium focus:outline-none focus:border-rso-blue focus:bg-white"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors">
                Сохранить изменения
              </button>
            </form>
          </div>

        </div>

        {/* ================= ПРАВАЯ КОЛОНКА: СИСТЕМА МЕРОПРИЯТИЙ BENTO ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="border border-gray-100 rounded-[2rem] p-6 md:p-8 bg-white shadow-sm space-y-6">
            
            {/* Меню управления табом мероприятий */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-50">
              <div className="space-y-0.5">
                <h2 className="text-xl font-black uppercase tracking-tight text-black">Твой календарь событий</h2>
                <p className="text-xs text-gray-400 font-medium">Отслеживание посещаемости и планирование выездов</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {/* Тумблер Список / Календарь */}
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-wider">
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-rso-blue shadow-xs font-black' : 'text-gray-400'}`}
                  >
                    Список
                  </button>
                  <button 
                    onClick={() => setViewMode('calendar')} 
                    className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-rso-blue shadow-xs font-black' : 'text-gray-400'}`}
                  >
                    Календарь
                  </button>
                </div>

                {/* Кнопка создания — видна ТОЛЬКО комсоставу */}
                {isCommandStaff && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-rso-blue text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-xs"
                  >
                    + Событие ЛСО
                  </button>
                )}
              </div>
            </div>

            {/* ДИНАМИЧЕСКИЙ РЕНДЕРИНГ РЕЖИМОВ */}
            {eventsLoading ? (
              <div className="py-20 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">
                Синхронизация ленты ивентов...
              </div>
            ) : viewMode === 'list' ? (
              
              /* ================= РЕЖИМ А: СПИСОК МЕРОПРИЯТИЙ ================= */
              <div className="space-y-4">
                {events.length > 0 ? (
                  events.map(event => {
                    const status = getEventStatus(event.date);
                    const isRegional = event.type === 'REGIONAL';

                    return (
                      <div key={event.id} className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white hover:border-gray-200 hover:shadow-xs transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-black uppercase tracking-wide px-2 py-0.2 border rounded ${status.styles}`}>
                              • {status.label}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.2 bg-gray-900 text-white rounded">
                              {isRegional ? 'ШТАБ' : 'ОТРЯД'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                              {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-tight text-black">{event.title}</h4>
                          <p className="text-xs text-gray-400 font-medium line-clamp-1">📍 {event.location || 'Место не указано'} — {event.description}</p>
                        </div>

                        {event.isJoined && (
                          <span className="px-3 py-1 bg-blue-500/10 text-rso-blue rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 border border-blue-500/10 self-end sm:self-center">
                            ✓ Ты записан
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs font-bold uppercase opacity-30 tracking-wider">Календарь пуст</div>
                )}
              </div>

            ) : (
              
              /* ================= РЕЖИМ Б: СТИЛЬНЫЙ BENTO КАЛЕНДАРЬ ================= */
              <div className="space-y-6 animate-fadeIn">
                {/* Контроллер месяцев */}
                <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <button onClick={() => changeMonth(-1)} className="text-xs font-black text-gray-400 hover:text-black">◀</button>
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    {calendarDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => changeMonth(1)} className="text-xs font-black text-gray-400 hover:text-black">▶</button>
                </div>

                {/* Сетка дней недели */}
                <div className="grid grid-cols-7 gap-2 text-center text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
                </div>

                {/* Сетка дней месяца */}
                <div className="grid grid-cols-7 gap-2">
                  {daysArray.map((day, idx) => {
                    if (!day) return <div key={idx} className="aspect-square bg-transparent" />;
                    
                    // Проверяем, есть ли мероприятия на этот день
                    const currentLoopDateStr = new Date(year, month, day).toDateString();
                    const hasEvents = events.some(e => new Date(e.date).toDateString() === currentLoopDateStr);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleDayClick(day)}
                        className={`aspect-square rounded-xl border text-xs font-bold flex flex-col items-center justify-center relative transition-all ${
                          hasEvents 
                            ? 'border-blue-200 bg-blue-50/40 text-rso-blue font-black hover:bg-rso-blue hover:text-white hover:border-rso-blue shadow-xs' 
                            : 'border-gray-50 bg-gray-50/30 text-gray-600 hover:bg-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvents && (
                          <span className="w-1 h-1 bg-rso-blue rounded-full absolute bottom-1.5 group-hover:bg-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Вывод ивентов выбранного дня под сеткой календаря */}
                {selectedDayLabel && (
                  <div className="pt-4 border-t border-gray-50 space-y-3 animate-fadeIn">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                      События на {selectedDayLabel}:
                    </span>
                    {selectedDateEvents.length > 0 ? (
                      selectedDateEvents.map(e => (
                        <div key={e.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                          <div>
                            <h5 className="text-xs font-black uppercase text-black">{e.title}</h5>
                            <span className="text-[10px] text-gray-400 font-medium">📍 {e.location || 'Штаб'}</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white text-gray-500 border border-gray-100">
                            {new Date(e.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">На этот день выездов или собраний не запланировано</p>
                    )}
                  </div>
                )}
              </div>

            )}

          </div>
        </div>

      </main>

      {/* Интегрируем наш гибкий Bento-модал для создания мероприятий */}
      <CreateEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProfileData} // При успехе обновим профиль и календарь
        userRole={user?.role} // Передаем роль текущего юзера
      />
    </div>
  );
}