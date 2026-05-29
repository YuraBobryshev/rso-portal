import React, { useState, useEffect } from 'react';
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
  const [ymapsInstance, setYmapsInstance] = useState(null); 
  const [mapInstance, setMapInstance] = useState(null);     
  const [suggestions, setSuggestions] = useState([]);       
  const [showSuggestions, setShowSuggestions] = useState(false);

  // === ЭФФЕКТ DEBOUNCE ДЛЯ УМНОГО ПОИСКА ===
  useEffect(() => {
    if (!ymapsInstance || location.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      ymapsInstance.suggest('Севастополь, ' + location)
        .then(res => {
          setSuggestions(res);
          setShowSuggestions(true);
        })
        .catch(err => console.error("Ошибка suggest API:", err));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [location, ymapsInstance]);

  if (!isOpen) return null;

  const handleLocationInput = (e) => {
    setLocation(e.target.value);
  };

  const handleSuggestionClick = (sug) => {
    const fullAddress = sug.value;
    setLocation(fullAddress);
    setShowSuggestions(false);
    
    if (ymapsInstance) {
      ymapsInstance.geocode(fullAddress).then(res => {
        const firstGeoObj = res.geoObjects.get(0);
        if (firstGeoObj) {
          const coords = firstGeoObj.geometry.getCoordinates();
          setCoordinates(coords);
          if (mapInstance) {
            mapInstance.setCenter(coords, 16, { duration: 400 });
          }
        }
      });
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
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] w-full max-w-2xl p-6 md:p-10 relative my-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-[#000000] dark:hover:text-white transition-colors"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>

        <div className="mb-8">
          <h2 className="heading-2 mb-1">Новое мероприятие</h2>
          <p className="font-onest text-sm text-gray-500 dark:text-gray-400">Формирование кадрового и социального календаря.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 font-onest text-xs font-bold rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-1.5">
            <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название события</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Спевка, Окружной слет, Субботник..."
              className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-[#000000] dark:text-white outline-none focus:border-[#0804FF] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата и время</label>
              <input 
                type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)}
                className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-[#000000] dark:text-white outline-none focus:border-[#0804FF] transition-all"
              />
            </div>

            {/* УМНОЕ ПОЛЕ АДРЕСА */}
            <div className="space-y-1.5 relative">
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Локация / Место (Текст)</label>
              <input 
                type="text" required value={location} onChange={handleLocationInput}
                placeholder="Начните вводить адрес..."
                className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-[#000000] dark:text-white outline-none focus:border-[#0804FF] transition-all"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((sug, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => handleSuggestionClick(sug)}
                      className="px-4 py-3 font-onest text-xs font-bold text-[#000000] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-rso-gray dark:border-slate-700 last:border-0 truncate"
                    >
                      📍 {sug.value.replace('Россия, Севастополь, ', '')}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ИНТЕРАКТИВНАЯ КАРТА */}
          <div className="space-y-1.5">
            <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Уточните точку на карте
            </label>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-rso-gray dark:border-slate-600 mb-2 relative">
              <YMaps query={{ apikey: 'e4fd4cca-44a9-4b22-a8b8-63ef14d99aa2', load: 'package.full' }}>
                <Map 
                  defaultState={{ center: [44.6166, 33.5254], zoom: 11 }} 
                  className="w-full h-full"
                  onLoad={(ymaps) => setYmapsInstance(ymaps)}
                  instanceRef={(ref) => setMapInstance(ref)}
                  onClick={(e) => {
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
            <p className="font-onest text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
              1. Введите адрес в поле выше, чтобы карта перелетела туда.<br/>
              2. Или кликните по карте — поле адреса заполнится само.
            </p>
          </div>

          {userRole === 'REG_HQ' && (
            <div className="space-y-1.5">
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Уровень охвата</label>
              <select 
                value={type} onChange={(e) => setType(e.target.value)}
                className="font-stolzl w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-xs font-bold text-[#000000] dark:text-white uppercase tracking-wider outline-none focus:border-[#0804FF] transition-all"
              >
                <option value="LOCAL">Внутриотрядное мероприятие</option>
                <option value="REGIONAL">Общегородское (Региональное)</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Описание / Программа</label>
            <textarea 
              rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробный регламент, форма одежды, что брать с собой..."
              className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-[#000000] dark:text-white outline-none focus:border-[#0804FF] transition-all resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-rso-gray dark:border-slate-700">
            <button
              type="button" onClick={onClose} disabled={loading}
              className="btn-secondary w-full sm:flex-1 py-3"
            >
              Отмена
            </button>
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full sm:flex-[2] py-3"
            >
              {loading ? 'Публикация...' : 'Создать событие →'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}