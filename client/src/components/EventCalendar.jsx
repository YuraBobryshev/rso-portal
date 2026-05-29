import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import CreateEventModal from './CreateEventModal';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

// --- ИКОНКИ ---
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
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm relative transition-colors duration-300">      
      {/* ХЕДЕР БЛОКА С ПЕРЕКЛЮЧАТЕЛЯМИ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">События и сборы</h3>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mt-1">Твой рабочий график</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Переключатель вида (Список / Календарь) */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shrink-0 transition-colors duration-300">
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-rso-blue dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Вид: Список"
            >
              <IconList />
            </button>
            <button 
              onClick={() => setViewMode('calendar')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-800 shadow-sm text-rso-blue dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Вид: Календарь"
            >
              <IconCalendar />
            </button>
          </div>

          {isCommandStaff && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black dark:hover:bg-slate-600 transition-colors shadow-sm"
            >
              + Создать сбор
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest animate-pulse border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
          Синхронизация графика...
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
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
                      isRegional ? 'bg-blue-50/20 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40' : 'bg-slate-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-5 w-full">
                      
                      {/* Дата: крупный календарный листок */}
                      <div className="shrink-0 text-center bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-3 w-20 shadow-sm group-hover:border-gray-200 dark:group-hover:border-slate-600 transition-colors">
                        <div className="text-2xl font-black text-black dark:text-white leading-none mb-1">{eventDate.getDate()}</div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{eventDate.toLocaleString('ru-RU', { month: 'short' })}</div>
                      </div>

                      {/* Информация о событии */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                            isRegional ? 'bg-rso-blue text-white shadow-sm dark:bg-blue-600' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            {isRegional ? 'Региональное' : 'Локальное'}
                          </span>
                          {event.isJoined && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-2.5 py-0.5 rounded-md">
                              <IconCheck /> Участвую
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg md:text-xl font-black uppercase text-black dark:text-white line-clamp-1 group-hover:text-rso-blue dark:group-hover:text-blue-400 transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1.5"><IconPin /> {event.location || 'Место не указано'}</span>
                          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                          <span className="flex items-center gap-1.5"><IconClock /> {eventDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Кнопка действий (стрелка) */}
                    <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <button className="w-full md:w-auto text-[10px] font-black uppercase tracking-wider px-6 py-3.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300 shadow-sm">
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
            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 animate-in fade-in duration-300 transition-colors">
              
              {/* Навигация по месяцам */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm text-gray-600 dark:text-gray-400 transition-all">&larr;</button>
                <span className="font-black uppercase text-sm md:text-base tracking-wider text-black dark:text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button onClick={nextMonth} className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm text-gray-600 dark:text-gray-400 transition-all">&rarr;</button>
              </div>

              {/* Сетка календаря */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 py-2">{d}</div>
                ))}
                
                {Array(firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const currentCellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dayEvents = events.filter(e => isSameDay(new Date(e.date), currentCellDate));
                  
                  return (
                    <div key={day} className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 md:p-2 h-20 md:h-28 rounded-xl flex flex-col hover:border-rso-blue/40 dark:hover:border-blue-400/40 hover:shadow-sm transition-all overflow-hidden group">
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1.5 group-hover:text-rso-blue dark:group-hover:text-blue-400 transition-colors">{day}</span>
                      <div className="flex flex-col gap-1 overflow-y-auto scrollbar-none">
                        {dayEvents.map(e => (
                          <div 
                            key={e.id} 
                            onClick={() => setSelectedEvent(e)} 
                            className={`text-[8px] md:text-[9px] font-bold uppercase truncate px-1.5 py-1 rounded cursor-pointer transition-transform hover:scale-[1.02] ${
                              e.type === 'REGIONAL' ? 'bg-rso-blue dark:bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600'
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

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ МЕРОПРИЯТИЯ */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 dark:bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-gray-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto scrollbar-hide transition-colors">
            <button 
              onClick={() => setSelectedEvent(null)} 
              className="absolute top-5 right-5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white font-bold p-2 bg-slate-50 dark:bg-slate-700 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              ✕
            </button>
            
            <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-md mb-4 shadow-sm ${
              selectedEvent.type === 'REGIONAL' ? 'bg-rso-blue dark:bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300'
            }`}>
              {selectedEvent.type === 'REGIONAL' ? 'Глобальное событие штаба' : 'Внутренний сбор отряда'}
            </span>
            
            <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white leading-tight mb-4">
              {selectedEvent.title}
            </h2>
            
            {/* ИНФОРМАЦИОННЫЙ БЛОК */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-5 space-y-3 transition-colors">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
                <span className="text-gray-400 dark:text-gray-500"><IconClock /></span> 
                {new Date(selectedEvent.date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-slate-700 pt-3">
                <span className="text-gray-400 dark:text-gray-500"><IconPin /></span> 
                {selectedEvent.location || 'Локация уточняется'}
              </div>
              
              {/* КАРТА */}
              {selectedEvent.lat && selectedEvent.lng && (
                <div className="mt-4 w-full h-40 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner">
                  <YMaps>
                    <Map 
                      defaultState={{ center: [selectedEvent.lat, selectedEvent.lng], zoom: 15 }} 
                      className="w-full h-full"
                    >
                      <Placemark 
                        geometry={[selectedEvent.lat, selectedEvent.lng]} 
                        options={{ preset: 'islands#blueIcon' }}
                      />
                    </Map>
                  </YMaps>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6 whitespace-pre-line">
              {selectedEvent.description}
            </p>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
              {selectedEvent.isJoined ? (
                <button 
                  onClick={() => handleLeave(selectedEvent.id)}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50 shadow-sm border border-red-100 dark:border-red-500/20"
                >
                  {actionLoading ? 'Обработка...' : 'Отказаться от участия'}
                </button>
              ) : (
                <button 
                  onClick={() => handleJoin(selectedEvent.id)}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-rso-blue text-white hover:bg-black dark:hover:bg-slate-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
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