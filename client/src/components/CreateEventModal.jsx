import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function CreateEventModal({ isOpen, onClose, onSuccess, userRole }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('LOCAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Координаты по умолчанию (центр Севастополя)
  const [coordinates, setCoordinates] = useState([44.6166, 33.5254]);
  
  // === СОСТОЯНИЯ ДЛЯ УМНОГО ПОИСКА ===
  const [ymapsInstance, setYmapsInstance] = useState(null); // Инстанс API Яндекса
  const [mapInstance, setMapInstance] = useState(null);     // Инстанс самой карты (чтобы двигать её)
  const [suggestions, setSuggestions] = useState([]);       // Список подсказок адресов
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!isOpen) return null;

  // Функция обработки ввода текста (ищет адреса)
  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocation(value);

    // Ищем только если введено больше 2 символов и Яндекс загрузился
    if (!ymapsInstance || value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Ищем адрес (ограничиваем поиск контекстом Севастополя для точности)
    ymapsInstance.geocode('Севастополь, ' + value, { results: 5 })
      .then(res => {
        const found = [];
        res.geoObjects.each(geoObj => {
          found.push({
            address: geoObj.getAddressLine(),
            coords: geoObj.geometry.getCoordinates()
          });
        });
        setSuggestions(found);
        setShowSuggestions(true);
      })
      .catch(err => console.error("Ошибка геокодера:", err));
  };

  // Функция выбора адреса из выпадающего списка
  const handleSuggestionClick = (sug) => {
    setLocation(sug.address);
    setCoordinates(sug.coords);
    setShowSuggestions(false);
    
    // Плавно центрируем карту на выбранном адресе
    if (mapInstance) {
      mapInstance.setCenter(sug.coords, 16, { duration: 400 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await api.post('/events', 
        { 
          title, description, date, location, 
          lat: coordinates[0], 
          lng: coordinates[1],
          type: userRole === 'REG_HQ' ? type : 'LOCAL' 
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Сброс формы
      setTitle(''); setDescription(''); setDate(''); setLocation('');
      setCoordinates([44.6166, 33.5254]); 
      onSuccess(); 
      onClose();   
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании мероприятия');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-gray-100 rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6 scrollbar-hide">
        
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">Новое мероприятие</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Заполнение кадрового и социального календаря.</p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 border border-red-100 text-xs font-bold uppercase rounded-xl">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Название события</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Спевка, Окружной слет, Субботник..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Дата и время</label>
              <input 
                type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium"
              />
            </div>

            {/* УМНОЕ ПОЛЕ АДРЕСА */}
            <div className="space-y-1 relative">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Локация / Место (Текст)</label>
              <input 
                type="text" required value={location} onChange={handleLocationInput}
                placeholder="Начните вводить адрес..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium"
              />
              
              {/* ВЫПАДАЮЩИЙ СПИСОК АДРЕСОВ */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((sug, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => handleSuggestionClick(sug)}
                      className="px-4 py-3 text-xs font-bold text-gray-600 hover:bg-slate-50 cursor-pointer border-b border-gray-50 last:border-0 truncate"
                    >
                      📍 {sug.address.replace('Россия, Севастополь, ', '')}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ИНТЕРАКТИВНАЯ КАРТА */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
              Уточните точку на карте
            </label>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-100 mb-2 relative">
              {/* load: 'package.full' обязателен для работы геокодера без ошибок */}
              <YMaps query={{ apikey: 'e4fd4cca-44a9-4b22-a8b8-63ef14d99aa2', load: 'package.full' }}>
                <Map 
                  defaultState={{ center: [44.6166, 33.5254], zoom: 11 }} 
                  className="w-full h-full"
                  onLoad={(ymaps) => setYmapsInstance(ymaps)}
                  instanceRef={(ref) => setMapInstance(ref)}
                  onClick={(e) => {
                    // Обратное геокодирование: Кликнули на карту -> обновили поле текста
                    const coords = e.get('coords');
                    setCoordinates(coords);
                    if (ymapsInstance) {
                      ymapsInstance.geocode(coords).then(res => {
                        const firstGeoObj = res.geoObjects.get(0);
                        if (firstGeoObj) setLocation(firstGeoObj.getAddressLine());
                      });
                    }
                  }}
                >
                  <Placemark geometry={coordinates} options={{ preset: 'islands#redDotIcon' }} />
                </Map>
              </YMaps>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-relaxed">
              1. Введите адрес в поле выше, чтобы карта перелетела туда.<br/>
              2. Или кликните по карте — поле адреса заполнится само.
            </p>
          </div>

          {userRole === 'REG_HQ' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Уровень охвата</label>
              <select 
                value={type} onChange={(e) => setType(e.target.value)}
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
              rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробный регламент, форма одежды, что брать с собой..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-rso-blue focus:bg-white transition-all text-black font-medium resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-50">
            <button
              type="button" onClick={onClose} disabled={loading}
              className="flex-1 py-3 border border-gray-100 text-xs font-black uppercase tracking-wider text-gray-400 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit" disabled={loading}
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