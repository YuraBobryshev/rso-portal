import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const directionTypes = [
  { code: 'СПО', label: 'СПО // Педагогические отряды' },
  { code: 'ССО', label: 'ССО // Строительные отряды' },
  { code: 'СОП', label: 'СОП // Отряды проводников' },
  { code: 'СМО', label: 'СМО // Медицинские отряды' },
  { code: 'ССервО', label: 'ССервО // Сервисные отряды' }
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [brigades, setBrigades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние для формы создания отряда
  const [newBrigade, setNewBrigade] = useState({ name: '', description: '', type: 'СПО', colorScheme: '#0052FF' });
  const [logoFile, setLogoFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    try {
      // Загрузка пользователей для админки
      const usersRes = await axios.get('http://176.98.177.3:5000/api/admin/users', { headers });
      setUsers(usersRes.data);

      // Загрузка отрядов
      const brigadesRes = await axios.get('http://176.98.177.3:5000/api/brigades', { headers });
      setBrigades(brigadesRes.data);
    } catch (err) {
      console.error("Ошибка доступа к админ-панели", err);
      // Если обычный боец пытается зайти — бэкенд вернет 403, кидаем в профиль
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

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
      await axios.post('http://176.98.177.3:5000/api/brigades', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormSuccess('Линейный отряд успешно сформирован и внесен в реестр!');
      setNewBrigade({ name: '', description: '', type: 'СПО', colorScheme: '#0052FF' });
      setLogoFile(null);
      fetchData(); // обновляем списки
    } catch (err) {
      setFormError(err.response?.data?.message || 'Ошибка при создании отряда');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-sm font-medium text-gray-400 animate-pulse">
      Авторизация административного доступа...
    </div>
  );

  const tabs = [
    { id: 'users', label: 'Реестр бойцов' },
    { id: 'brigades', label: 'Список отрядов' },
    { id: 'create', label: 'Сформировать отряд' },
    { id: 'events', label: 'Мероприятия' },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      <Header />
      
      {/* pt-24 гарантирует отсутствие наездов фиксированного хедера на контент */}
      <main className="max-w-[1500px] mx-auto px-6 pt-24 pb-24">
        
        {/* ЗАГОЛОВОК АДМИНКИ */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Панель управления
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Главный административный узел Севастопольского регионального отделения РСО
          </p>
        </div>

        {/* МЯГКИЙ ТАБ-НАВИГАТОР BENTO */}
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

        {/* БОЛЬШАЯ БЕНТО-КАРТОЧКА ВЫВОДА ДАННЫХ */}
        <div className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white min-h-[450px] shadow-sm">
          
          {/* ================= ВКЛАДКА 1: РЕЕСТР БОЙЦОВ (С АВАТАРКАМИ) ================= */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-rso-blue uppercase tracking-wider">Всего зарегистрировано: {users.length} чел.</span>
              </div>
              
              <div className="border border-gray-100 rounded-xl overflow-hidden overflow-x-auto shadow-inner bg-gray-50/10">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 w-16">Фото</th>
                      <th className="p-4">ФИО бойца</th>
                      <th className="p-4">Электронная почта</th>
                      <th className="p-4">Системная роль</th>
                      <th className="p-4">Линейный отряд</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-bold uppercase">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 bg-white transition-colors">
                        {/* Аватарка бойца */}
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
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] text-white ${u.role === 'REG_HQ' ? 'bg-red-500' : u.role === 'COMMANDER' ? 'bg-rso-blue' : 'bg-gray-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 font-black">{u.brigade?.name || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= ВКЛАДКА 2: СПИСОК ОТРЯДОВ (С ЛОГОТИПАМИ) ================= */}
          {activeTab === 'brigades' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block mb-2">Активных команд в штабе: {brigades.length}</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brigades.map(b => (
                  <div key={b.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50/30 flex items-center justify-between gap-4 shadow-sm hover:border-rso-blue/20 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Мягкая круглая эмблема отряда */}
                      <div className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                        {b.logoUrl ? (
                          <img src={b.logoUrl} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span className="text-[10px] font-black text-rso-blue opacity-30">{b.type}</span>
                        )}
                      </div>
                      
                      <div className="truncate">
                        <h3 className="font-black text-sm text-black uppercase truncate leading-tight">{b.name}</h3>
                        <span className="inline-block mt-1 text-[9px] font-bold text-white px-2 py-0.2 rounded-md uppercase" style={{ backgroundColor: b.colorScheme || '#0052FF' }}>
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

          {/* ================= ВКЛАДКА 3: ФОРМА СОЗДАНИЯ (ТОЛЬКО 5 НАПРАВЛЕНИЙ) ================= */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-200">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-black">Сформировать новый ЛСО</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Регистрация отряда в общегородском реестре Севастополя</p>
              </div>

              {formError && <div className="mb-4 bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-xs font-semibold text-center">{formError}</div>}
              {formSuccess && <div className="mb-4 bg-green-50 text-green-600 border border-green-100 rounded-xl p-3 text-xs font-semibold text-center">{formSuccess}</div>}

              <form onSubmit={handleCreateBrigade} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Название линейного отряда</label>
                  <input 
                    type="text"
                    placeholder="Например: ССО «Гандвик»"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue focus:bg-white transition-all font-bold text-black uppercase"
                    value={newBrigade.name}
                    onChange={e => setNewBrigade({...newBrigade, name: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Выпадающий список строго на 5 направлений */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Вектор / Направление труда</label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue focus:bg-white transition-all font-bold text-black uppercase appearance-none"
                      value={newBrigade.type}
                      onChange={e => setNewBrigade({...newBrigade, type: e.target.value})}
                    >
                      {directionTypes.map(d => (
                        <option key={d.code} value={d.code}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Фирменный цвет отряда</label>
                    <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                      <input 
                        type="color"
                        className="w-10 h-8 border-0 bg-transparent cursor-pointer rounded"
                        value={newBrigade.colorScheme}
                        onChange={e => setNewBrigade({...newBrigade, colorScheme: e.target.value})}
                      />
                      <span className="text-xs font-mono font-bold uppercase text-gray-500">{newBrigade.colorScheme}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Историческая летопись / Краткое описание</label>
                  <textarea 
                    placeholder="Укажите год основания, традиции, ключевые объекты работы команды..."
                    rows="4"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue focus:bg-white transition-all resize-none font-medium text-gray-700 leading-relaxed"
                    value={newBrigade.description}
                    onChange={e => setNewBrigade({...newBrigade, description: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Официальная эмблема (Логотип SVG / PNG)</label>
                  <label className="cursor-pointer text-xs font-bold border border-gray-200 bg-gray-50/50 rounded-xl px-5 py-3 text-center text-gray-500 hover:border-rso-blue/30 hover:text-rso-blue transition-all shadow-sm block truncate">
                    <span>{logoFile ? logoFile.name : '📎 Загрузить эмблему отряда'}</span>
                    <input type="file" className="hidden" onChange={e => setLogoFile(e.target.files[0])} accept="image/*" />
                  </label>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-rso-blue text-white font-bold uppercase text-xs tracking-wider py-4 rounded-xl hover:bg-black transition-colors shadow-md shadow-blue-500/10"
                  >
                    Внести команду в реестр СевРО
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= ВКЛАДКА 4: МЕРОПРИЯТИЯ (ПОКА НИЧЕГО НЕ ТРОГАЕМ) ================= */}
          {activeTab === 'events' && (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl p-6 animate-in fade-in duration-200">
              <span className="text-rso-blue text-2xl block mb-2">⚙️</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Модуль на реконструкции</h4>
              <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                Система проработки и детального планирования региональных выездов будет глубоко спроектирована на следующем этапе разработки.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}