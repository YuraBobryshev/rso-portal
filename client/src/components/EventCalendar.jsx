import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import CreateEventModal from './CreateEventModal';

export default function EventCalendar({ userRole }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Права на создание есть у комсостава и штаба
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

  // Обычные юзеры (до вступления в отряд) не видят календарь
  if (userRole === 'USER') return null;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs mt-6 relative z-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">События и сборы</h3>
          <p className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Твой рабочий график</p>
        </div>
        
        {isCommandStaff && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-rso-blue text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-sm"
          >
            + Создать сбор
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-10 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">
          Синхронизация календаря...
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const isRegional = event.type === 'REGIONAL';
            return (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className={`cursor-pointer border rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-md ${
                  isRegional 
                    ? 'bg-blue-50/30 border-blue-100 hover:border-blue-300' 
                    : 'bg-gray-50/50 border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    isRegional ? 'bg-rso-blue text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isRegional ? 'Региональное' : 'Локальное'}
                  </span>
                  {event.isJoined && (
                    <span className="text-[14px]" title="Вы записаны">✅</span>
                  )}
                </div>
                <h4 className="text-sm font-black uppercase text-black mb-1 line-clamp-1">{event.title}</h4>
                <div className="text-[10px] font-bold text-gray-400 uppercase space-y-0.5">
                  <p>🗓 {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="truncate">📍 {event.location || 'Место не указано'}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest border border-dashed border-gray-200 rounded-2xl">
          В расписании пока нет событий
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ МЕРОПРИЯТИЯ */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/30 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectedEvent(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold p-2"
            >
              ✕
            </button>
            
            <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-4 ${
              selectedEvent.type === 'REGIONAL' ? 'bg-rso-blue text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {selectedEvent.type === 'REGIONAL' ? 'Глобальное событие штаба' : 'Внутренний сбор отряда'}
            </span>
            
            <h2 className="text-2xl font-black uppercase tracking-tight text-black leading-tight mb-2">
              {selectedEvent.title}
            </h2>
            
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase"><span className="text-gray-400 mr-2">Дата:</span> {new Date(selectedEvent.date).toLocaleString('ru-RU')}</p>
              <p className="text-xs font-bold text-gray-500 uppercase"><span className="text-gray-400 mr-2">Место:</span> {selectedEvent.location}</p>
            </div>
            
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6 whitespace-pre-line">
              {selectedEvent.description}
            </p>

            <div className="pt-4 border-t border-gray-50">
              {selectedEvent.isJoined ? (
                <button 
                  onClick={() => handleLeave(selectedEvent.id)}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Обработка...' : 'Отказаться от участия'}
                </button>
              ) : (
                <button 
                  onClick={() => handleJoin(selectedEvent.id)}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider bg-rso-blue text-white hover:bg-black transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Обработка...' : 'Пойти на мероприятие'}
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