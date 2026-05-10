import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ИконкаЗвезды = () => <span className="text-rso-blue text-xl select-none">✦</span>;

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [brigades, setBrigades] = useState([]);
  const [adminEvents, setAdminEvents] = useState([]); // Все мероприятия для штаба
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); 
  const [newBrigadeName, setNewBrigadeName] = useState('');
  
  // Для мероприятий
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState('REGIONAL');
  
  // Для просмотра участников
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, brigadesRes, eventsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/brigades', { headers }),
        axios.get('http://localhost:5000/api/admin/events', { headers }) // Новый запрос
      ]);
      setUsers(usersRes.data);
      setBrigades(brigadesRes.data);
      setAdminEvents(eventsRes.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Доступ запрещен. Требуется уровень доступа регионального штаба.");
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchData();
  }, [navigate]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.patch('http://localhost:5000/api/admin/update-role', { userId, newRole }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert("Ошибка при изменении роли"); }
  };

  const handleUpdateBrigade = async (userId, brigadeId) => {
    try {
      await axios.patch('http://localhost:5000/api/admin/update-user-brigade', { userId, brigadeId }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert("Ошибка при смене отряда"); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот аккаунт? Действие необратимо.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(); 
    } catch (err) { alert(err.response?.data?.message || "Ошибка при удалении аккаунта"); }
  };

  const handleCreateBrigade = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/create-brigade', { name: newBrigadeName, description: "Создано из панели" }, { headers: { Authorization: `Bearer ${token}` } });
      setNewBrigadeName('');
      fetchData();
    } catch (err) { alert("Ошибка при создании отряда"); }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events', { title: newEventTitle, description: "Описание", date: newEventDate, type: newEventType }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Мероприятие опубликовано!");
      setNewEventTitle('');
      setNewEventDate('');
      fetchData(); // Перезапрашиваем события
    } catch (err) { alert("Ошибка при создании мероприятия"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono text-rso-blue uppercase tracking-widest text-sm">
      <div className="animate-pulse">Загрузка данных...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-rso-blue font-sans pb-20 selection:bg-rso-blue selection:text-white">
      <Header />
      
      {/* МОДАЛЬНОЕ ОКНО СО СПИСКОМ УЧАСТНИКОВ */}
      {selectedEventInfo && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white border-[1px] border-rso-blue shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b-[1px] border-rso-blue flex justify-between items-center bg-blue-50/50">
              <div>
                <h3 className="text-xl font-black uppercase">{selectedEventInfo.title}</h3>
                <p className="text-xs font-bold opacity-60 uppercase mt-1">Список участников ({selectedEventInfo.participants.length} чел.)</p>
              </div>
              <button onClick={() => setSelectedEventInfo(null)} className="text-2xl hover:text-red-500 transition-colors">×</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {selectedEventInfo.participants.length > 0 ? (
                <div className="divide-y-[1px] divide-rso-blue border-[1px] border-rso-blue">
                  {selectedEventInfo.participants.map((p, i) => (
                    <div key={p.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono opacity-40">{(i+1).toString().padStart(2,'0')}</span>
                        <span className="font-bold uppercase text-sm">{p.user.firstName} {p.user.lastName}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold border-[1px] border-rso-blue px-2 py-1">
                        {p.user.brigade ? p.user.brigade.name : 'Без отряда'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 opacity-50 uppercase font-bold text-sm">Никто еще не записался</div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1200px] mx-auto p-6 mt-6">
        <div className="border-[1px] border-rso-blue p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative bg-blue-50/30">
          <div className="absolute top-2 right-2 text-[10px] font-bold opacity-30 uppercase">Панель администратора</div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Центр управления</h1>
            <p className="text-xs font-bold opacity-70">Региональный штаб (Севастополь)</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2"><ИконкаЗвезды /> <ИконкаЗвезды /></div>
        </div>

        <div className="flex border-b-[1px] border-rso-blue mb-8 overflow-x-auto">
          <button onClick={() => setActiveTab('users')} className={`px-8 py-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-rso-blue text-white' : 'hover:bg-blue-50'}`}>Управление кадрами</button>
          <button onClick={() => setActiveTab('brigades')} className={`px-8 py-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${activeTab === 'brigades' ? 'bg-rso-blue text-white' : 'hover:bg-blue-50'}`}>Управление отрядами</button>
          <button onClick={() => setActiveTab('events')} className={`px-8 py-4 text-sm font-bold uppercase transition-colors whitespace-nowrap ${activeTab === 'events' ? 'bg-rso-blue text-white' : 'hover:bg-blue-50'}`}>Мероприятия</button>
        </div>

        {/* ... (Вкладки users и brigades остались без изменений) ... */}
        {activeTab === 'users' && (
          <div className="border-[1px] border-rso-blue overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className="bg-rso-blue text-white p-4 text-xs font-bold uppercase grid grid-cols-12 gap-4 items-center tracking-wider">
                <div className="col-span-3">Боец</div><div className="col-span-3">Отряд</div><div className="col-span-3">Уровень доступа</div><div className="col-span-3 text-right">Действия</div>
              </div>
              <div className="divide-y-[1px] divide-rso-blue">
                {users.map(user => (
                  <div key={user.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors text-sm font-bold">
                    <div className="col-span-3 truncate"><div className="uppercase text-rso-blue">{user.firstName} {user.lastName}</div><div className="text-[10px] opacity-50 font-normal truncate mt-1">ID: {user.id}</div></div>
                    <div className="col-span-3"><select value={user.brigadeId || 'none'} onChange={(e) => handleUpdateBrigade(user.id, e.target.value)} className="w-full bg-transparent border-[1px] border-rso-blue/30 px-3 py-2 outline-none text-xs uppercase font-bold focus:border-rso-blue transition-colors cursor-pointer"><option value="none">Без отряда</option>{brigades.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}</select></div>
                    <div className="col-span-3"><select value={user.role} onChange={(e) => handleUpdateRole(user.id, e.target.value)} className="w-full bg-transparent border-[1px] border-rso-blue/30 px-3 py-2 outline-none text-xs uppercase font-bold focus:border-rso-blue transition-colors cursor-pointer"><option value="USER">Новичок</option><option value="CANDIDATE">Кандидат</option><option value="BOETS">Боец</option><option value="MASTER">Мастер</option><option value="COMMISSAR">Комиссар</option><option value="COMMANDER">Командир</option><option value="REG_HQ">Штаб</option></select></div>
                    <div className="col-span-3 text-right"><button onClick={() => handleDeleteUser(user.id)} className="text-xs border-[1px] border-red-500 text-red-500 px-4 py-2 uppercase hover:bg-red-500 hover:text-white transition-all font-bold">Удалить</button></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brigades' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="border-[1px] border-rso-blue p-8 relative h-fit">
              <div className="absolute -top-3 left-6 bg-white px-3 text-rso-blue font-bold uppercase text-xs">Создание отряда</div>
              <form onSubmit={handleCreateBrigade} className="space-y-8 mt-4">
                <div className="group relative">
                  <label className="block text-xs uppercase font-bold opacity-70 mb-2">Название отряда</label>
                  <input type="text" value={newBrigadeName} onChange={e => setNewBrigadeName(e.target.value)} placeholder="Например: ССО «Атлант»" className="w-full bg-transparent border-b-[1px] border-rso-blue py-2 outline-none font-bold text-lg focus:border-b-2 transition-all" required />
                </div>
                <button type="submit" className="w-full bg-rso-blue text-white py-4 text-sm font-bold uppercase hover:bg-black transition-colors">Создать отряд</button>
              </form>
            </div>
            <div className="border-[1px] border-rso-blue flex flex-col h-[500px]">
               <div className="bg-rso-blue text-white p-4 text-xs font-bold uppercase text-center flex-shrink-0 tracking-wider">Активные отряды (Всего: {brigades.length})</div>
               <div className="divide-y-[1px] divide-rso-blue overflow-y-auto flex-1">
                 {brigades.map((brigade, idx) => (
                   <div key={brigade.id} className="p-5 hover:bg-blue-50 transition-colors flex justify-between items-center group">
                     <div className="flex items-center gap-4"><span className="text-xs font-mono opacity-40">{(idx + 1).toString().padStart(2, '0')}</span><span className="font-black uppercase text-lg">{brigade.name}</span></div>
                     <span className="text-[10px] border-[1px] border-rso-blue px-3 py-1 uppercase opacity-50 font-mono">ID: {brigade.id.slice(0,6)}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* НОВАЯ ВКЛАДКА: МЕРОПРИЯТИЯ ДЛЯ АДМИНА */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
            
            {/* Форма создания */}
            <div className="border-[1px] border-rso-blue p-8 relative h-fit">
              <div className="absolute -top-3 left-6 bg-white px-3 text-rso-blue font-bold uppercase text-xs">Публикация</div>
              <form onSubmit={handleCreateEvent} className="space-y-6 mt-4">
                <div>
                  <label className="block text-xs uppercase font-bold opacity-70 mb-2">Название мероприятия</label>
                  <input type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} className="w-full bg-transparent border-b-[1px] border-rso-blue py-2 outline-none font-bold text-lg focus:border-b-2 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold opacity-70 mb-2">Дата проведения</label>
                  <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full bg-transparent border-b-[1px] border-rso-blue py-2 outline-none font-bold text-sm focus:border-b-2 transition-all cursor-pointer" required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold opacity-70 mb-2">Уровень доступа</label>
                  <select value={newEventType} onChange={e => setNewEventType(e.target.value)} className="w-full bg-transparent border-b-[1px] border-rso-blue py-2 outline-none font-bold text-sm focus:border-b-2 transition-all cursor-pointer">
                    <option value="REGIONAL">Региональное (Видят все)</option>
                    <option value="BRIGADE">Отрядное (Только мой отряд)</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-rso-blue text-white py-4 mt-4 text-sm font-bold uppercase hover:bg-black transition-colors">Опубликовать</button>
              </form>
            </div>

            {/* Список всех мероприятий */}
            <div className="border-[1px] border-rso-blue flex flex-col h-[600px]">
              <div className="bg-rso-blue text-white p-4 text-xs font-bold uppercase tracking-wider grid grid-cols-12 gap-4">
                <div className="col-span-5">Событие</div>
                <div className="col-span-3 text-center">Дата</div>
                <div className="col-span-4 text-right">Участники</div>
              </div>
              <div className="divide-y-[1px] divide-rso-blue overflow-y-auto flex-1">
                {adminEvents.map(event => (
                  <div key={event.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-5">
                      <div className="font-bold uppercase text-sm">{event.title}</div>
                      <div className="text-[9px] uppercase font-bold opacity-50 mt-1">{event.type === 'REGIONAL' ? 'Региональное' : 'Отрядное'}</div>
                    </div>
                    <div className="col-span-3 text-center text-xs font-bold font-mono">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="col-span-4 text-right">
                      <button 
                        onClick={() => setSelectedEventInfo(event)}
                        className="text-[10px] border-[1px] border-rso-blue px-4 py-2 uppercase font-bold hover:bg-rso-blue hover:text-white transition-all"
                      >
                        Смотреть ({event.participants.length})
                      </button>
                    </div>
                  </div>
                ))}
                {adminEvents.length === 0 && (
                  <div className="text-center py-10 opacity-40 uppercase font-bold text-sm">База мероприятий пуста</div>
                )}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}