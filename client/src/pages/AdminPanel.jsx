import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CreateEventModal from '../components/CreateEventModal';

const directionTypes = [
  { code: 'СПО', label: 'СПО // Педагогические отряды' },
  { code: 'ССО', label: 'ССО // Строительные отряды' },
  { code: 'СОП', label: 'СОП // Отряды проводников' },
  { code: 'СМО', label: 'СМО // Медицинские отряды' },
  { code: 'ССервО', label: 'ССервО // Сервисные отряды' }
];

const systemRoles = ['USER', 'CANDIDATE', 'BOETS', 'COMMANDER', 'COMMISSAR', 'MASTER', 'MEDIA', 'REG_HQ'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [users, setUsers] = useState([]);
  const [brigades, setBrigades] = useState([]);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false); 
  
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const [newBrigade, setNewBrigade] = useState({ name: '', description: '', type: 'СПО', colorScheme: '#0052FF' });
  const [logoFile, setLogoFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [expandedEventId, setExpandedEventId] = useState(null); 

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_URL = '/api'

  const fetchData = async () => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    try {
      const usersRes = await api.get(`${API_URL}/api/admin/users`, { headers });
      setUsers(usersRes.data);

      const brigadesRes = await api.get(`${API_URL}/api/brigades`, { headers });
      setBrigades(brigadesRes.data);
    } catch (err) {
      console.error("Ошибка доступа к админ-панели", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminEvents = async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    setEventsLoading(true);
    try {
      const res = await api.get(`${API_URL}/api/admin/events`, { headers });
      setEvents(res.data);
    } catch (err) {
      console.error("Ошибка загрузки мероприятий штаба", err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchRatingDashboard = async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    setDashboardLoading(true);
    try {
      const res = await api.get(`${API_URL}/api/admin/rating-stats`, { headers });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Ошибка загрузки рейтингов", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'events') fetchAdminEvents();
    if (activeTab === 'dashboard') fetchRatingDashboard();
  }, [activeTab]);

  const handleRoleChange = async (userId, newRole) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.patch(`${API_URL}/api/admin/update-role`, { userId, newRole }, { headers });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Не удалось обновить системную роль");
    }
  };

  const handleBrigadeChange = async (userId, brigadeId) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.patch(`${API_URL}/api/admin/update-user-brigade`, { userId, brigadeId }, { headers });
      const targetBrigade = brigades.find(b => b.id === brigadeId) || null;
      setUsers(users.map(u => u.id === userId ? { 
        ...u, 
        brigadeId: brigadeId === 'none' ? null : brigadeId, 
        brigade: targetBrigade 
      } : u));
    } catch (err) {
      alert("Не удалось перераспределить бойца");
    }
  };

  const handleCreateBrigade = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    const formData = new FormData();
    formData.append('name', newBrigade.name);
    formData.append('description', newBrigade.description);
    formData.append('type', newBrigade.type);
    formData.append('colorScheme', newBrigade.colorScheme);
    if (logoFile) formData.append('logo', logoFile);

    try {
      await api.post(`${API_URL}/api/admin/create-brigade`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setFormSuccess('Линейный отряд успешно сформирован и внесен в реестр!');
      setNewBrigade({ name: '', description: '', type: 'СПО', colorScheme: '#0052FF' });
      setLogoFile(null);
      fetchData(); 
    } catch (err) {
      setFormError(err.response?.data?.message || 'Ошибка создания отряда');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-sm font-medium text-gray-400 animate-pulse">
      Авторизация административного доступа...
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: '📊 Дашборд / Кубок' },
    { id: 'users', label: 'Реестр бойцов' },
    { id: 'brigades', label: 'Список отрядов' },
    { id: 'create', label: 'Сформировать отряд' },
    { id: 'events', label: 'Мероприятия' },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-24 pb-24">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Панель управления
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Главный административный узел Севастопольского регионального отделения РСО
          </p>
        </div>

        <div className="flex border border-gray-100 rounded-xl overflow-x-auto scrollbar-none whitespace-nowrap bg-gray-50/60 p-1 gap-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-lg flex-1 text-center ${
                activeTab === tab.id 
                  ? 'bg-white text-rso-blue shadow-sm font-extrabold border border-gray-100' 
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {tab.label}
              {tab.id === 'create' && ' +'}
            </button>
          ))}
        </div>

        <div className="border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 bg-white min-h-[450px] shadow-sm">
          
          {/* ================= ТАБ 0: ДАШБОРД АНАЛИТИКИ РЕЙТИНГА ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {dashboardLoading || !dashboardData ? (
                <div className="py-20 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">
                  Агрегация кадровых и рейтинговых данных...
                </div>
              ) : (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/30">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Реестр ЛСО</span>
                      <span className="text-2xl font-black text-black mt-1 block">
                        {dashboardData.stats.totalBrigades} <span className="text-xs text-gray-400 font-medium">отрядов</span>
                      </span>
                    </div>
                    <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/30">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Общая численность</span>
                      <span className="text-2xl font-black text-black mt-1 block">
                        {dashboardData.stats.totalUsers} <span className="text-xs text-gray-400 font-medium">чел.</span>
                      </span>
                    </div>
                    <div className="border border-gray-100 rounded-2xl p-5 bg-gray-950 text-white shadow-md relative overflow-hidden">
                      <div className="absolute right-4 bottom-1 text-5xl opacity-10">🏆</div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Текущий лидер СевРО</span>
                      <span className="text-base sm:text-lg font-black uppercase text-rso-blue mt-1 block truncate">
                        {dashboardData.stats.leader}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-rso-blue uppercase tracking-wider">
                      🏆 Положение отрядов в общем кубке (Leaderboard)
                    </h3>
                    <div className="border border-gray-100 rounded-xl overflow-hidden overflow-x-auto bg-white shadow-inner">
                      <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                          <tr className="bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <th className="p-4 w-16 text-center">Место</th>
                            <th className="p-4">Линейный отряд</th>
                            <th className="p-4 text-center">Направление</th>
                            <th className="p-4 text-center">Состав (ЛСО)</th>
                            <th className="p-4 text-center">Посещения штаба</th>
                            <th className="p-4 text-right pr-6">Сумма баллов</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-bold uppercase text-black">
                          {dashboardData.ranking.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50/40 bg-white transition-colors">
                              <td className="p-4 text-center">
                                <span className={`inline-block w-6 h-6 rounded-full leading-6 text-center text-[10px] font-black ${
                                  index === 0 ? 'bg-amber-100 text-amber-700' :
                                  index === 1 ? 'bg-slate-100 text-slate-700' :
                                  index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                                }`}>
                                  {index + 1}
                                </span>
                              </td>
                              <td className="p-4 font-black text-gray-900 flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full border border-gray-100 overflow-hidden bg-white shrink-0 flex items-center justify-center p-0.5">
                                  {item.logoUrl ? (
                                    <img src={item.logoUrl} className="w-full h-full object-cover rounded-full" alt="" />
                                  ) : (
                                    <span className="text-[8px] font-black opacity-30">{item.type}</span>
                                  )}
                                </div>
                                <span className="tracking-tight">{item.name}</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className="px-2 py-0.5 rounded text-[9px] font-black text-white" style={{ backgroundColor: item.colorScheme || '#0052FF' }}>
                                  {item.type}
                                </span>
                              </td>
                              <td className="p-4 text-center font-mono text-gray-500">{item.memberCount} чел.</td>
                              <td className="p-4 text-center font-mono text-gray-400">✓ {item.regionalAttendedCount} раз</td>
                              <td className="p-4 text-right pr-6 font-mono text-base font-black text-rso-blue">
                                {item.totalPoints} <span className="text-[10px] text-gray-400 font-medium uppercase font-sans">б.</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ================= ТАБ 1: РЕЕСТР БОЙЦОВ ================= */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">
                  Всего зарегистрировано: {users.length} чел.
                </span>
              </div>
              
              <div className="border border-gray-100 rounded-xl overflow-hidden overflow-x-auto shadow-inner bg-gray-50/10">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 w-16">Фото</th>
                      <th className="p-4">ФИО бойца</th>
                      <th className="p-4">Электронная почта</th>
                      <th className="p-4">Системная роль</th>
                      <th className="p-4">Линейный отряд (Распределение)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-bold uppercase">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 bg-white transition-colors">
                        <td className="p-4">
                          <div className="w-9 h-9 rounded-full border border-gray-100 overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-rso-blue bg-blue-50/50 text-[11px] font-black">
                                {u.firstName?.charAt(0)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-black font-extrabold">{u.lastName} {u.firstName}</td>
                        <td className="p-4 text-gray-500 lowercase font-medium">{u.email}</td>
                        <td className="p-4">
                          <select 
                            value={u.role} 
                            onChange={(e) => handleRoleChange(u.id, e.target.value)} 
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white border-none outline-none cursor-pointer shadow-sm transition-all ${
                              u.role === 'REG_HQ' ? 'bg-red-500' : 
                              u.role === 'COMMANDER' ? 'bg-rso-blue' : 
                              u.role === 'BOETS' ? 'bg-green-600' : 
                              u.role === 'CANDIDATE' ? 'bg-sky-500' : 'bg-gray-400'
                            }`}
                          >
                            {systemRoles.map(role => (
                              <option key={role} value={role} className="bg-white text-black font-bold uppercase text-xs">
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <select 
                            value={u.brigadeId || 'none'} 
                            onChange={(e) => handleBrigadeChange(u.id, e.target.value)} 
                            className="px-3 py-1.5 rounded-xl text-xs font-black bg-gray-50 border border-gray-100 text-black outline-none cursor-pointer hover:bg-white"
                          >
                            <option value="none" className="text-gray-400 font-bold italic">Вне отряда (Резерв)</option>
                            {brigades.map(b => (
                              <option key={b.id} value={b.id} className="text-black font-bold uppercase text-xs">
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= ТАБ 2: СПИСОК ОТРЯДОВ ================= */}
          {activeTab === 'brigades' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block mb-2">
                Активных команд в штабе: {brigades.length}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brigades.map(b => (
                  <div key={b.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50/30 flex items-center justify-between gap-4 shadow-sm hover:border-rso-blue/20 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                        {b.logoUrl ? (
                          <img src={b.logoUrl} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span className="text-[10px] font-black text-rso-blue opacity-30">{b.type}</span>
                        )}
                      </div>
                      <div className="truncate">
                        <h3 className="font-black text-sm text-black uppercase truncate leading-tight">{b.name}</h3>
                        <span className="inline-block mt-1 text-[9px] font-bold text-white bg-rso-blue px-2 py-0.2 rounded-md uppercase" style={{ backgroundColor: b.colorScheme || '#0052FF' }}>
                          {b.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 border-l border-gray-200 pl-4">
                      <div className="text-xl font-black text-black leading-none">{b._count?.users || 0}</div>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter block mt-0.5">бойцов</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= ТАБ 3: СФОРМИРОВАТЬ ОТРЯД ================= */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-200">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-black">Сформировать новый ЛСО</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Регистрация отряда в реестре Севастополя</p>
              </div>
              {formError && <div className="mb-4 bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-xs font-semibold text-center">{formError}</div>}
              {formSuccess && <div className="mb-4 bg-green-50 text-green-600 border border-green-100 rounded-xl p-3 text-xs font-semibold text-center">{formSuccess}</div>}
              
              <form onSubmit={handleCreateBrigade} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Название линейного отряда</label>
                  <input type="text" placeholder="Например: ССО «Гандвик»" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue focus:bg-white transition-all font-bold text-black uppercase" value={newBrigade.name} onChange={e => setNewBrigade({...newBrigade, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Вектор / Направление труда</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue focus:bg-white transition-all font-bold text-black uppercase appearance-none" value={newBrigade.type} onChange={e => setNewBrigade({...newBrigade, type: e.target.value})}>
                      {directionTypes.map(d => <option key={d.code} value={d.code}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Фирменный цвет отряда</label>
                    <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                      <input type="color" className="w-10 h-8 border-0 bg-transparent cursor-pointer rounded" value={newBrigade.colorScheme} onChange={e => setNewBrigade({...newBrigade, colorScheme: e.target.value})} />
                      <span className="text-xs font-mono font-bold uppercase text-gray-500">{newBrigade.colorScheme}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Историческая летопись / Краткое описание</label>
                  <textarea placeholder="Укажите год основания, традиции..." rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue focus:bg-white transition-all resize-none font-medium text-gray-700 leading-relaxed" value={newBrigade.description} onChange={e => setNewBrigade({...newBrigade, description: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Официальная эмблема</label>
                  <label className="cursor-pointer text-xs font-bold border border-gray-200 bg-gray-50/50 rounded-xl px-5 py-3 text-center text-gray-500 hover:text-rso-blue transition-all block truncate">
                    <span>{logoFile ? logoFile.name : '📎 Загрузить эмблему отряда'}</span>
                    <input type="file" className="hidden" onChange={e => setLogoFile(e.target.files[0])} accept="image/*" />
                  </label>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-rso-blue text-white font-bold uppercase text-xs tracking-wider py-4 rounded-xl hover:bg-black transition-colors shadow-md shadow-blue-500/10">
                    Внести команду в реестр СевРО
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= ТАБ 4: УПРАВЛЕНИЕ МЕРОПРИЯТИЯМИ ================= */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-50">
                <div>
                  <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Глобальный планировщик</span>
                  <h2 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">Календарь событий СевРО</h2>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-rso-blue text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-sm">
                  + Создать мероприятие
                </button>
              </div>
              
              {eventsLoading ? (
                <div className="py-16 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">Синхронизация списков посещаемости...</div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => {
                    const eventDate = new Date(event.date); 
                    const isRegional = event.type === 'REGIONAL'; 
                    const isExpanded = expandedEventId === event.id;
                    return (
                      <div key={event.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="space-y-1 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${isRegional ? 'bg-rso-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {isRegional ? 'Региональное' : 'Локальное'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold">🗓 {eventDate.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="text-[10px] text-gray-400 font-bold truncate max-w-[180px]">📍 {event.location || 'Не указана'}</span>
                            </div>
                            <h3 className="text-base font-black uppercase text-black">{event.title}</h3>
                            <p className="text-xs text-gray-400 font-medium line-clamp-1">{event.description}</p>
                          </div>
                          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-gray-50">
                            <div className="text-left lg:text-right">
                              <span className="text-[8px] font-bold uppercase text-gray-400 block">Участников</span>
                              <span className="text-base font-black text-black">{event.participants?.length || 0} <span className="text-[10px] text-gray-400 font-medium">чел.</span></span>
                            </div>
                            <button onClick={() => setExpandedEventId(isExpanded ? null : event.id)} className={`text-[9px] font-black uppercase tracking-wider px-4 py-2 rounded-xl border transition-all ${isExpanded ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}>
                              {isExpanded ? 'Скрыть ▲' : 'Список ▼'}
                            </button>
                          </div>
                        </div>
                        
                        {/* Вывезенный из каши полноценный блок участников */}
                        {isExpanded && event.participants && (
                          <div className="pt-3 border-t border-gray-50 animate-in fade-in duration-150">
                            <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-3 overflow-x-auto">
                              <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                  <tr className="border-b border-gray-200/50 text-[9px] font-black text-gray-400 uppercase tracking-wider">
                                    <th className="pb-2">ФИО бойца</th>
                                    <th className="pb-2">Линейный отряд</th>
                                    <th className="pb-2">Системный ID</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-[11px] font-bold uppercase text-gray-900">
                                  {event.participants.map((part) => (
                                    <tr key={part.id}>
                                      <td className="py-2.5 pr-4">{part.user?.lastName} {part.user?.firstName}</td>
                                      <td className="py-2.5 pr-4">
                                        {part.user?.brigade ? (
                                          <span className="px-2 py-0.5 rounded text-[9px] font-black text-white" style={{ backgroundColor: part.user.brigade.colorScheme || '#0052FF' }}>
                                            {part.user.brigade.name}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 italic text-[10px]">Вне отряда</span>
                                        )}
                                      </td>
                                      <td className="py-2.5 text-gray-400 font-mono text-[9px]">{part.user?.id}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : <div className="py-12 text-center text-xs font-bold uppercase opacity-30 tracking-wider border border-dashed border-gray-200 rounded-xl">В реестре еще нет ни одного запланированного мероприятия</div>}
            </div>
          )}

        </div>
      </main>

      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchAdminEvents} userRole="REG_HQ" />
    </div>
  );
}