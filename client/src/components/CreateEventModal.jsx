import React, { useState } from 'react';
import api from '../api/axiosConfig';
// Оставляем только один правильный импорт со всеми нужными компонентами:
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';

export default function CreateEventModal({ isOpen, onClose, onSuccess, userRole }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('LOCAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Состояние для хранения координат (по умолчанию Севастополь)
  const [coordinates, setCoordinates] = useState([44.6166, 33.5254]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      // В тело запроса добавлены lat и lng из состояния coordinates
      await api.post('/events', 
        { 
          title, 
          description, 
          date, 
          location, 
          lat: coordinates[0], 
          lng: coordinates[1],
          type: userRole === 'REG_HQ' ? type : 'LOCAL' 
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Очищаем форму при успехе
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setCoordinates([44.6166, 33.5254]); // Сброс координат
      onSuccess(); // Триггерим обновление родительского списка
      onClose();   // Закрываем модал
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании мероприятия');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-gray-100 rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6 scrollbar-hide">
        
        {/* Шапка модала */}
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">
            Новое мероприятие
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Заполнение кадрового и социального календаря Севастопольского РО.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 text-xs font-bold uppercase rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Название события</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Спевка, Окружной слет, Субботник..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Дата и время</label>
              <input 
                type="datetime-local" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Локация / Место (Текст)</label>
              <input 
                type="text" 
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="ул. Ленина, д. 4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium"
              />
            </div>
          </div>

          {/* НОВЫЙ БЛОК: Интерактивная Яндекс Карта с поисковиком */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
              Найдите и укажите точную точку на карте
            </label>
            <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-100 mb-2 relative">
              <YMaps query={{ apikey: '' }}>
                <Map 
                  defaultState={{ center: [44.6166, 33.5254], zoom: 11 }} 
                  className="w-full h-full"
                  onClick={(e) => {
                    const coords = e.get('coords');
                    setCoordinates(coords);
                  }}
                >
                  {/* ВОТ ОН - ВИДЖЕТ ПОИСКА */}
                  <SearchControl options={{ float: 'right' }} />
                  
                  {/* Красная метка, которая ставится по клику */}
                  <Placemark geometry={coordinates} options={{ preset: 'islands#redDotIcon' }} />
                </Map>
              </YMaps>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              1. Воспользуйтесь поиском на карте<br/>
              2. Кликните мышкой, чтобы поставить красную метку
            </p>
          </div>
          {/* КОНЕЦ НОВОГО БЛОКА */}

          {/* Выбор уровня события (Виден только Региональному штабу) */}
          {userRole === 'REG_HQ' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Уровень охвата</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-black uppercase tracking-wider"
              >
                <option value="LOCAL">Внутриотрядное мероприятие</option>
                <option value="REGIONAL">Общегородское (Региональное)</option>
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Описание / Программа</label>
            <textarea 
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробный регламент, форма одежды, что брать с собой..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium resize-none"
            />
          </div>

          {/* Кнопки управления */}
          <div className="flex gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 border border-gray-100 text-xs font-black uppercase tracking-wider text-gray-400 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-rso-blue text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-md shadow-blue-500/10 disabled:opacity-50"
            >
              {loading ? 'Публикация...' : 'Создать событие →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}