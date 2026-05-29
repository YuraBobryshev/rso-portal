import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import CreateEventModal from './CreateEventModal';

// --- ИКОНКИ (Замена дешевым эмодзи) ---
const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);

const IconGrid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const IconPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default function EventCalendar({ userRole }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Состояние для вида: 'list' или 'calendar'
  const [viewMode, setViewMode] = useState('list');
  // Состояние текущего месяца для календаря
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isCommandStaff = ['COMMANDER', 'COMMISSAR', 'MASTER', 'REG_HQ'].includes(userRole);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error("Ошибка загрузки мероприятий", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleJoin = async (id) => {
    setActionLoading(true);
    try {
      await api.post(`/events/${id}/join`);
      fetchEvents();
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent({ ...selectedEvent, isJoined: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка записи на мероприятие');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}/leave`);
      fetchEvents();
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent({ ...selectedEvent, isJoined: false });
      }
    } catch (err) {
      alert('Ошибка при отмене участия');
    } finally {
      setActionLoading(false);
    }
  };

  if (userRole === 'USER') return null;

  // --- ЛОГИКА КАЛЕНДАРЯ ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Корректировка, чтобы неделя начиналась с понедельника
  };

  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm relative">      
      {/* ХЕДЕР БЛОКА С ПЕРЕКЛЮЧАТЕЛЯМИ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">События и сборы</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Твой рабочий график</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Переключатель вида (Список / Календарь) */}
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-rso-blue' : 'text-gray-400 hover:text-gray-600'}`}
              title="Вид: Список"
            >
              <IconList />
            </button>
            <button 
              onClick={() => setViewMode('calendar')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-rso-blue' : 'text-gray-400 hover:text-gray-600'}`}
              title="Вид: Календарь"
            >
              <IconCalendar />
            </button>
          </div>

          {isCommandStaff && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-sm"
            >
              + Создать сбор
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse border border-dashed border-gray-200 rounded-2xl">
          Синхронизация графика...
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-dashed border-gray-200 rounded-2xl bg-slate-50">
          В расписании пока нет событий
        </div>
      ) : (
        <>
          {/* ВИД: СПИСОК (На всю ширину) */}
          {viewMode === 'list' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              {events.map((event) => {
                const isRegional = event.type === 'REGIONAL';
                const eventDate = new Date(event.date);
                
                return (
                  <div 
                    key={event.id} 
                    onClick={() => setSelectedEvent(event)}
                    className={`cursor-pointer w-full border rounded-2xl p-4 md:p-6 transition-all hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-8 group ${
                      isRegional ? 'bg-blue-50/20 border-blue-100 hover:border-blue-300' : 'bg-slate-50 border-gray-200 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-5 w-full">
                      
                      {/* Дата: крупный календарный листок */}
                      <div className="shrink-0 text-center bg-white border border-gray-100 rounded-xl p-3 w-20 shadow-sm group-hover:border-gray-200 transition-colors">
                        <div className="text-2xl font-black text-black leading-none mb-1">{eventDate.getDate()}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{eventDate.toLocaleString('ru-RU', { month: 'short' })}</div>
                      </div>

                      {/* Информация о событии */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                            isRegional ? 'bg-rso-blue text-white shadow-sm' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isRegional ? 'Региональное' : 'Локальное'}
                          </span>
                          {event.isJoined && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-green-600 uppercase tracking-wider bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-md">
                              <IconCheck /> Участвую
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg md:text-xl font-black uppercase text-black line-clamp-1 group-hover:text-rso-blue transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-gray-500">
                          <span className="flex items-center gap-1.5"><IconPin /> {event.location || 'Место не указано'}</span>
                          <span className="hidden sm:inline text-gray-300">•</span>
                          <span className="flex items-center gap-1.5"><IconClock /> {eventDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Кнопка действий (стрелка) */}
                    <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <button className="w-full md:w-auto text-[10px] font-black uppercase tracking-wider px-6 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors text-gray-600 shadow-sm">
                        Подробнее →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ВИД: КАЛЕНДАРЬ */}
          {viewMode === 'calendar' && (
            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 md:p-6 animate-in fade-in duration-300">
              
              {/* Навигация по месяцам */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-white bg-slate-50 shadow-sm text-gray-600 transition-all">&larr;</button>
                <span className="font-black uppercase text-sm md:text-base tracking-wider text-black">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button onClick={nextMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-white bg-slate-50 shadow-sm text-gray-600 transition-all">&rarr;</button>
              </div>

              {/* Сетка календаря */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black uppercase text-gray-400 py-2">{d}</div>
                ))}
                
                {Array(firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const currentCellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dayEvents = events.filter(e => isSameDay(new Date(e.date), currentCellDate));
                  
                  return (
                    <div key={day} className="border border-gray-200 bg-white p-1.5 md:p-2 h-20 md:h-28 rounded-xl flex flex-col hover:border-rso-blue/40 hover:shadow-sm transition-all overflow-hidden group">
                      <span className="text-[10px] font-black text-gray-400 mb-1.5 group-hover:text-rso-blue transition-colors">{day}</span>
                      <div className="flex flex-col gap-1 overflow-y-auto scrollbar-none">
                        {dayEvents.map(e => (
                          <div 
                            key={e.id} 
                            onClick={() => setSelectedEvent(e)} 
                            className={`text-[8px] md:text-[9px] font-bold uppercase truncate px-1.5 py-1 rounded cursor-pointer transition-transform hover:scale-[1.02] ${
                              e.type === 'REGIONAL' ? 'bg-rso-blue text-white shadow-sm' : 'bg-slate-100 text-gray-700 border border-gray-200'
                            }`}
                            title={e.title}
                          >
                            {e.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ МЕРОПРИЯТИЯ (С новыми иконками) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-gray-100">
            <button 
              onClick={() => setSelectedEvent(null)} 
              className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold p-2 bg-slate-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
            
            <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-md mb-4 shadow-sm ${
              selectedEvent.type === 'REGIONAL' ? 'bg-rso-blue text-white' : 'bg-slate-100 border border-gray-200 text-gray-600'
            }`}>
              {selectedEvent.type === 'REGIONAL' ? 'Глобальное событие штаба' : 'Внутренний сбор отряда'}
            </span>
            
            <h2 className="text-2xl font-black uppercase tracking-tight text-black leading-tight mb-4">
              {selectedEvent.title}
            </h2>
            
            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 mb-5 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <span className="text-gray-400"><IconClock /></span> 
                {new Date(selectedEvent.date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600 border-t border-gray-200 pt-3">
                <span className="text-gray-400"><IconPin /></span> 
                {selectedEvent.location || 'Локация уточняется'}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6 whitespace-pre-line">
              {selectedEvent.description}
            </p>

            <div className="pt-4 border-t border-gray-100">
              {selectedEvent.isJoined ? (
                <button 
                  onClick={() => handleLeave(selectedEvent.id)}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 shadow-sm border border-red-100"
                >
                  {actionLoading ? 'Обработка...' : 'Отказаться от участия'}
                </button>
              ) : (
                <button 
                  onClick={() => handleJoin(selectedEvent.id)}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-rso-blue text-white hover:bg-black transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Обработка...' : 'Присоединиться к событию'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <CreateEventModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchEvents} 
        userRole={userRole} 
      />
    </div>
  );
}