import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';
import EventCalendar from '../components/EventCalendar';

// Конфигурация цветов по направлениям ЛСО для динамического баннера
const directionColors = {
  'СПО': '#4DA6FF',    // Голубой плакат
  'ССО': '#0052FF',    // Синий плакат
  'СОП': '#FF4D39',    // Красный плакат
  'СМО': '#00E5FF',    // Бирюзовый плакат
  'ССервО': '#66BB8A', // Зеленый плакат
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [brigadeMembers, setBrigadeMembers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Строгие иконки для меню
const IconUser = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconSettings = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconCalendar = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconTrophy = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4z"></path><path d="M7 4H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h2M17 4h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5h-2"></path></svg>;
const IconInbox = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;
const IconUsers = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconBarChart = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconClipboard = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
  
  // Активный таб центрального блока
  const [activeTab, setActiveTab] = useState('profile');

  // Формы для настроек
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', vkUrl: '', tgUrl: '' });
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });

  const navigate = useNavigate();
  const currentToken = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setProfileForm({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        vkUrl: res.data.vkUrl || '',
        tgUrl: res.data.tgUrl || ''
      });

      if (res.data.brigade && res.data.brigade.id) {
        const brigadeRes = await api.get(`/brigades/${res.data.brigade.id}`);
        setBrigadeMembers(brigadeRes.data.users || []);
        
        if (['COMMANDER', 'REG_HQ'].includes(res.data.role)) {
          const dashboardRes = await api.get('/commander/dashboard');
          setApplications(dashboardRes.data.applications || []);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Не удалось загрузить данные профиля', type: 'error' });
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successMsg = urlParams.get('success');
    const errorMsg = urlParams.get('error');

    if (successMsg) {
      setMessage({ text: 'Аккаунт успешно привязан!', type: 'success' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (errorMsg) {
      let errText = "Неизвестная ошибка";
      if (errorMsg.includes('already_taken')) {
        errText = "Этот аккаунт соцсети уже привязан к другому профилю РСО.";
      } else if (errorMsg === 'link_failed') {
        errText = "Сессия устарела или токен поврежден. Попробуйте перезайти в систему.";
      } else {
        errText = errorMsg;
      }
      setMessage({ text: `Ошибка привязки: ${errText}`, type: 'error' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchProfile();
  }, [navigate]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setActionLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post('/api/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      setMessage({ text: 'Аватар успешно обновлен', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Ошибка при загрузке аватара', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.patch('/auth/profile', profileForm);
      setUser(prev => ({ ...prev, ...res.data.user }));
      setMessage({ text: 'Данные профиля успешно обновлены', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Ошибка обновления данных', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.password.length < 6) return setMessage({ text: 'Пароль слишком короткий', type: 'error' });
    if (passwordForm.password !== passwordForm.confirmPassword) return setMessage({ text: 'Пароли не совпадают', type: 'error' });

    setActionLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post('/auth/set-password', { password: passwordForm.password });
      setUser(prev => ({ ...prev, hasPassword: true }));
      setPasswordForm({ password: '', confirmPassword: '' });
      setMessage({ text: res.data.message, type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Ошибка при установке пароля', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDownloadExcel = async (url, defaultFileName) => {
    try {
      setActionLoading(true);
      setMessage({ text: 'Генерируем отчет...', type: 'success' });

      const res = await api.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const contentDisposition = res.headers['content-disposition'];
      let fileName = defaultFileName;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      setMessage({ text: 'Отчет успешно скачан!', type: 'success' });
    } catch (error) {
      console.error('Ошибка скачивания отчета:', error);
      setMessage({ text: 'Ошибка при выгрузке отчета. Проверьте права доступа.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const processApplication = async (appId, status) => {
    try {
      await api.post('/commander/process-application', { appId, status });
      setApplications(prev => prev.filter(app => app.id !== appId));
      setMessage({ text: 'Статус заявки обновлен!', type: 'success' });
      fetchProfile();
    } catch (err) {
      setMessage({ text: 'Ошибка при обработке заявки', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 animate-pulse">Загрузка цифровой экосистемы...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-6 text-center">Потеряна связь с ядром системы.</div>
        <button onClick={() => navigate('/login')} className="text-[10px] font-bold text-white uppercase tracking-wider bg-gray-900 px-8 py-4 rounded-xl hover:bg-black transition-all">Вернуться на страницу входа</button>
      </div>
    );
  }

  // Определение цвета баннера по типу отряда
  const bannerColor = user.brigade?.type ? (directionColors[user.brigade.type] || '#1F2937') : '#1F2937';
  const isPassLengthValid = passwordForm.password.length >= 6;
  const isPassMatch = passwordForm.password.length > 0 && passwordForm.password === passwordForm.confirmPassword;
  const latestApp = user.applications && user.applications.length > 0 ? user.applications[0] : null;

  // Улучшенная функция классов для левых табов (цвета и отступы)
  const getTabClass = (tabId) => {
    const baseClass = "w-full text-left flex items-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border duration-200";
    return activeTab === tabId
      ? `${baseClass} bg-white text-rso-blue border-rso-blue/30 shadow-sm font-extrabold`
      : `${baseClass} text-gray-500 border-transparent hover:text-black hover:bg-gray-100`;
  };

  // Общий стиль для всех Bento-карточек (исправление проблемы "слияния")
  const bentoCardClass = "bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm";

  return (
    // Заменили фон на bg-slate-50 для лучшего контраста белых карточек
    <div className="min-h-screen bg-slate-50 text-black font-sans pb-24 md:pb-12 selection:bg-rso-blue selection:text-white antialiased">
      <Header />

      <main className="w-full max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        {/* АЛЕРТЫ СИСТЕМЫ */}
        {message.text && (
          <div className={`mb-6 border rounded-xl p-4 text-xs font-semibold text-center transition-all shadow-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* ================= ВЕРХНИЙ БЛОК: ИСПРАВЛЕННЫЙ БАННЕР ================= */}
        {/* Убрали overflow-hidden отсюда, чтобы аватарка могла "свисать" */}
        <div className="relative w-full mb-20">
          
          {/* Цветной динамический баннер - overflow-hidden только здесь! */}
          <div 
            className="w-full h-48 md:h-56 rounded-[2rem] overflow-hidden flex items-center justify-center transition-all duration-500 relative shadow-sm"
            style={{ backgroundColor: bannerColor }}
          >
            {/* Абстрактный геометрический паттерн на фоне */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight text-center px-4 drop-shadow-md z-10">
              {user.lastName} {user.firstName}
            </h1>
          </div>

          {/* Интегрированная зона аватара (теперь не обрезается) */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 flex flex-col items-center">
            <div className="relative group w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-slate-50 shadow-md bg-white overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Аватар" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-4xl font-black uppercase">
                  {user.firstName[0]}
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-white uppercase font-black tracking-wider cursor-pointer text-center px-2">
                Сменить фото
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <span className="mt-2 bg-gray-900 text-white font-mono text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-sm border border-gray-800">
              {user.role}
            </span>
          </div>
        </div>

        {/* ================= ГЛОБАЛЬНАЯ АСИММЕТРИЧНАЯ Bento-СЕТКА ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. ЛЕВАЯ КОЛОНКА: СИСТЕМА УПРАВЛЕНИЯ ТАБАМИ (НАВИГАЦИЯ) */}
          <div className="lg:col-span-3 space-y-6">
            <div className={bentoCardClass + " !p-3 flex flex-col gap-1"}>
              <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}><IconUser /> Профиль</button>
<button onClick={() => setActiveTab('settings')} className={getTabClass('settings')}><IconSettings /> Настройки</button>
<button onClick={() => setActiveTab('events')} className={getTabClass('events')}><IconCalendar /> Мероприятия</button>
<button onClick={() => setActiveTab('achievements')} className={getTabClass('achievements')}><IconTrophy /> Достижения</button>

{/* ДИНАМИЧЕСКИЙ БЛОК ДЛЯ КОМСОСТАВА ОТРЯДА */}
{['COMMANDER', 'COMMISSAR', 'MASTER', 'REG_HQ'].includes(user.role) && (
  <>
    <div className="mt-4 mb-2 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest select-none">
      // Управление ЛСО
    </div>
    
    {['COMMANDER', 'REG_HQ'].includes(user.role) && (
      <>
        <button onClick={() => setActiveTab('commander_apps')} className={getTabClass('commander_apps')}>
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-3"><IconInbox /> Заявки в отряд</span>
            {applications.length > 0 && (
              <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md animate-pulse">{applications.length}</span>
            )}
          </div>
        </button>
        <button onClick={() => setActiveTab('commander_members')} className={getTabClass('commander_members')}><IconUsers /> Состав отряда</button>
      </>
    )}

    {['COMMISSAR', 'REG_HQ'].includes(user.role) && (
      <button onClick={() => setActiveTab('commissar_reports')} className={getTabClass('commissar_reports')}><IconBarChart /> Отчет по движу</button>
    )}

    {['MASTER', 'REG_HQ'].includes(user.role) && (
      <button onClick={() => setActiveTab('master_attendance')} className={getTabClass('master_attendance')}><IconClipboard /> Посещаемость</button>
    )}
  </>
)}
            </div>

            {/* Мягкий вспомогательный bento-блок статистики слева */}
            <div className={bentoCardClass + " space-y-4"}>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">// Сводные метрики</span>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 border border-gray-200 p-3 rounded-xl">
                  <span className="text-xl font-black text-black">100%</span>
                  <span className="block text-[8px] text-gray-500 uppercase font-bold mt-1">Труд Крут</span>
                </div>
                <div className="bg-slate-50 border border-gray-200 p-3 rounded-xl">
                  <span className="text-xl font-black text-rso-blue">2026</span>
                  <span className="block text-[8px] text-gray-500 uppercase font-bold mt-1">Текущий год</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ЦЕНТРАЛЬНАЯ КОЛОНКА: ДИНАМИЧЕСКИЙ ДАШБОРД (МЕНЯЕТСЯ ПО КЛИКУ) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* ТАБ: ПРОФИЛЬ */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className={bentoCardClass}>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Паспорт бойца</h3>
                  <div className="space-y-4 font-medium text-xs text-gray-600">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Электронная почта:</span>
                      <span className="text-black font-bold">{user.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Системный ID:</span>
                      <span className="text-gray-400 font-mono">{user.id.substring(0, 13)}...</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Зарегистрирован:</span>
                      <span className="text-black font-bold">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Линейный отряд:</span>
                      <span className="text-rso-blue font-black uppercase tracking-tight">{user.brigade?.name || 'Вне отряда'}</span>
                    </div>
                  </div>
                </div>

                {/* Обработка статуса заявок для обычных пользователей */}
                {(user.role === 'USER' || !user.brigade) && (
                  latestApp ? (
                    <div className={`border rounded-3xl p-6 text-center shadow-sm ${
                      latestApp.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                      latestApp.status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white'
                    }`}>
                      <h4 className="font-black uppercase text-sm mb-1">Статус вашей анкеты</h4>
                      <p className="text-xs font-medium">Вы подали заявку в отряд <strong>{latestApp.brigade?.name}</strong>. Статус: {latestApp.status}</p>
                      {latestApp.comment && <span className="block mt-2 italic text-[11px]">Причина: {latestApp.comment}</span>}
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-center shadow-sm">
                      <h4 className="font-black uppercase text-sm text-black mb-1">Вступи в ряды РСО</h4>
                      <p className="text-xs font-medium text-gray-500 mb-4">Ты еще не привязан ни к одному линейному студенческому отряду.</p>
                      <Link to="/brigades" className="inline-block text-[10px] font-black uppercase tracking-wider bg-rso-blue text-white px-5 py-3 rounded-xl hover:bg-black transition-colors shadow-sm">Выбрать свой отряд</Link>
                    </div>
                  )
                )}
              </div>
            )}

            {/* ТАБ: НАСТРОЙКИ */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className={bentoCardClass}>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Изменение учетных данных</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Имя</label>
                        <input type="text" value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-rso-blue focus:bg-white transition-all" required />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Фамилия</label>
                        <input type="text" value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-rso-blue focus:bg-white transition-all" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Ссылка VK</label>
                        <input type="text" value={profileForm.vkUrl} onChange={(e) => setProfileForm({ ...profileForm, vkUrl: e.target.value })} placeholder="vk.com/id..." className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-rso-blue focus:bg-white transition-all" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-wider mb-1.5">Ссылка TG</label>
                        <input type="text" value={profileForm.tgUrl} onChange={(e) => setProfileForm({ ...profileForm, tgUrl: e.target.value })} placeholder="t.me/username" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-rso-blue focus:bg-white transition-all" />
                      </div>
                    </div>
                    <button type="submit" disabled={actionLoading} className="w-full font-bold uppercase text-[10px] tracking-wider py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors shadow-sm">Сохранить профиль</button>
                  </form>
                </div>

                {!user.hasPassword && (
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-2">Установка пароля</h3>
                    <p className="text-[11px] text-amber-700 font-medium mb-4">Установите пароль для возможности классического входа по Email без сторонних сервисов.</p>
                    <form onSubmit={handleSetPassword} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="password" placeholder="Новый пароль" value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-amber-500 transition-all" required />
                        <input type="password" placeholder="Повторите пароль" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-amber-500 transition-all" required />
                      </div>
                      <button type="submit" disabled={actionLoading || !isPassLengthValid || !isPassMatch} className="w-full font-bold uppercase text-[10px] tracking-wider py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:bg-amber-300 shadow-sm transition-colors">Зафиксировать пароль</button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ТАБ: МЕРОПРИЯТИЯ ПОСЕЩЕННЫЕ (Перенесли календарь сюда!) */}
            {activeTab === 'events' && (
              <div className="animate-in fade-in duration-300">
                <EventCalendar userRole={user.role} />
              </div>
            )}

            {/* ТАБ: ДОСТИЖЕНИЯ / МЕДАЛИ */}
            {activeTab === 'achievements' && (
              <div className={bentoCardClass + " animate-in fade-in duration-300 space-y-6"}>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Цифровая доска почета</h3>
                  <p className="text-[11px] text-gray-500 font-medium">Ваши индивидуальные знаки отличия и наградные баллы в Кубок ЛСО</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center opacity-50 group hover:opacity-100 hover:border-rso-blue/40 hover:bg-white transition-all duration-300 shadow-sm">
                      <div className="text-3xl mb-1 filter grayscale group-hover:grayscale-0 transition-all">🏅</div>
                      <span className="text-[9px] font-black uppercase text-black tracking-tight mt-1">Слот награды</span>
                      <span className="text-[8px] text-gray-400 font-bold mt-0.5">В ожидании</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= РУКОВОДЯЩИЕ ТАБЫ КОМСОСТАВА ================= */}
{activeTab === 'commander_apps' && (
  <div className={bentoCardClass + " animate-in fade-in duration-300 space-y-4"}>
    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Входящие анкеты кандидатов ({applications.length})</h3>
    {applications.length > 0 ? (
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app.id} className="flex flex-col p-5 bg-slate-50 border border-gray-200 rounded-2xl shadow-sm gap-4">
            
            {/* Шапка заявки */}
            <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
              <div className="truncate">
                <span className="block font-black text-sm text-black uppercase truncate">{app.user.lastName} {app.user.firstName}</span>
                <span className="text-[10px] text-gray-500 font-bold block mt-0.5">{app.user.email} {app.phone ? `• ${app.phone}` : ''}</span>
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{new Date(app.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            
            {/* Тело анкеты */}
            <div className="space-y-3">
              {app.aboutMe && (
                <div>
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Мотивация</span>
                  <p className="text-xs text-gray-700 font-medium bg-white p-3 rounded-xl border border-gray-100">{app.aboutMe}</p>
                </div>
              )}
              {app.skills && (
                <div>
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Навыки</span>
                  <p className="text-xs text-gray-700 font-medium bg-white p-3 rounded-xl border border-gray-100">{app.skills}</p>
                </div>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => processApplication(app.id, 'APPROVED')} className="flex-1 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:bg-green-100">Принять в ЛСО</button>
              <button onClick={() => processApplication(app.id, 'REJECTED')} className="flex-1 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:bg-red-100">Отклонить</button>
            </div>
          </div>
        ))}
      </div>
    ) : <div className="text-center py-10 text-xs font-bold text-gray-400 uppercase border border-dashed border-gray-200 rounded-2xl">Нет активных заявок</div>}
  </div>
)}

            {activeTab === 'commander_members' && (
              <div className={bentoCardClass + " animate-in fade-in duration-300 space-y-4"}>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Действующий состав отряда</h3>
                  <button onClick={() => handleDownloadExcel('/commander/export-members', 'Sostav.xlsx')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm hover:bg-green-600 transition-colors">Выгрузить Excel</button>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
                  {brigadeMembers.map(m => (
                    <div key={m.id} className="p-3 bg-slate-50 border border-gray-200 rounded-xl flex items-center gap-3 shadow-sm hover:bg-white transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0 flex items-center justify-center font-black text-xs text-gray-600 uppercase">{m.firstName[0]}</div>
                      <div className="truncate"><span className="block text-xs font-bold text-black truncate">{m.lastName} {m.firstName}</span><span className="text-[8px] font-black uppercase tracking-wider text-rso-blue block mt-0.5">{m.role}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'commissar_reports' && (
              <div className={bentoCardClass + " animate-in fade-in duration-300 space-y-4 text-center"}>
                <div className="text-left"><h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Квартальная отчетность по мероприятиям</h3><p className="text-[11px] text-gray-500 font-medium mt-1">Автоматическая агрегация событий за последние 3 месяца с описанием деятельности бойцов</p></div>
                <div className="py-8 border border-dashed border-gray-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
                  <span className="text-4xl mb-3">📊</span>
                  <button onClick={() => handleDownloadExcel('/commissar/export-events', 'Events_Quarter.xlsx')} className="px-6 py-3 bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-rose-600 transition-colors shadow-sm">Сформировать отчет за квартал (Excel)</button>
                </div>
              </div>
            )}

            {activeTab === 'master_attendance' && (
              <div className={bentoCardClass + " animate-in fade-in duration-300 space-y-4 text-center"}>
                <div className="text-left"><h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Ведомость посещаемости отряда</h3><p className="text-[11px] text-gray-500 font-medium mt-1">Статистический срез активности личного состава на локальных и региональных ивентах</p></div>
                <div className="py-8 border border-dashed border-gray-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
                  <span className="text-4xl mb-3">📝</span>
                  <button onClick={() => handleDownloadExcel('/master/export-attendance', 'Attendance.xlsx')} className="px-6 py-3 bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-emerald-600 transition-colors shadow-sm">Выгрузить ведомость (Excel)</button>
                </div>
              </div>
            )}

          </div>

          {/* 3. ПРАВАЯ КОЛОНКА: СВЯЗИ И ИНТЕГРАЦИИ */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Карточка 1: ПОДКЛЮЧЕННЫЕ АККАУНТЫ */}
            <div className={bentoCardClass + " space-y-5"}>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-black text-center">Подключенные аккаунты</h3>
              
              <div className="space-y-4">
                {/* GOOGLE */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.simpleicons.org/google" alt="Google" className="h-4 w-4 object-contain" />
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Google</span>
                      {user.hasGoogle && <span className="text-[9px] text-green-600 font-bold block">Подключено</span>}
                    </div>
                  </div>
                  {user.hasGoogle ? (
                    <button onClick={() => api.patch('/api/admin/unlink-account', { userId: user.id, provider: 'google' }).then(() => fetchProfile())} className="px-3 py-1.5 border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-red-50 transition-colors">Отвязать</button>
                  ) : (
                    <a href={`https://xn--b1af2ahcd.xn--p1ai/api/auth/google?link_token=${currentToken}`} className="px-3 py-1.5 border border-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Подключить</a>
                  )}
                </div>

                {/* VKONTAKTE */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.simpleicons.org/vk/0077FF" alt="VK" className="h-4 w-4 object-contain" />
                    <div>
                      <span className="block text-xs font-bold text-gray-900">ВКонтакте</span>
                      {user.hasVk && <span className="text-[9px] text-green-600 font-bold block">Подключено</span>}
                    </div>
                  </div>
                  {user.hasVk ? (
                    <button onClick={() => api.patch('/api/admin/unlink-account', { userId: user.id, provider: 'vk' }).then(() => fetchProfile())} className="px-3 py-1.5 border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-red-50 transition-colors">Отвязать</button>
                  ) : (
                    <a href={`https://xn--b1af2ahcd.xn--p1ai/api/auth/vk?link_token=${currentToken}`} className="px-3 py-1.5 border border-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Подключить</a>
                  )}
                </div>

                {/* YANDEX */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#FC3F1D" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.682 23.003h2.38V1.002h-3.66c-4.4 0-7.382 2.704-7.382 6.81 0 3.037 1.558 5.253 3.996 6.31-2.193 1.1-3.606 2.946-3.606 5.342 0 2.502 1.542 4.095 3.738 4.095h3.332v-3.414H10.15c-1.12 0-1.76-.704-1.76-1.874 0-1.34 1.026-2.175 2.625-2.175h2.668v6.906zm0-9.87h-1.635c-2.342 0-4.004-1.464-4.004-3.784 0-2.22 1.63-3.834 4.032-3.834h1.608v7.618z"/>
                    </svg>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Яндекс ID</span>
                      {user.hasYandex && <span className="text-[9px] text-green-600 font-bold block">Подключено</span>}
                    </div>
                  </div>
                  {user.hasYandex ? (
                    <button onClick={() => api.patch('/api/admin/unlink-account', { userId: user.id, provider: 'yandex' }).then(() => fetchProfile())} className="px-3 py-1.5 border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-red-50 transition-colors">Отвязать</button>
                  ) : (
                    <a href={`https://xn--b1af2ahcd.xn--p1ai/api/auth/yandex?link_token=${currentToken}`} className="px-3 py-1.5 border border-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Подключить</a>
                  )}
                </div>
              </div>
            </div>

            {/* Карточка 2: МОЙ ОТРЯД С ЛОГОТИПОМ ПО ЦЕНТРУ */}
            {user.brigade && (
              <div className={bentoCardClass + " flex flex-col items-center justify-center text-center space-y-4"}>
                <span className="text-[10px] font-black uppercase tracking-wider text-black">Мой отряд</span>
                
                {/* Контейнер-ромб для эмблемы отряда */}
                <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-black rotate-45 overflow-hidden bg-white flex items-center justify-center p-2 shadow-sm group hover:rotate-[405deg] transition-transform duration-700">
                  <div className="-rotate-45 w-full h-full overflow-hidden flex items-center justify-center">
                    {user.brigade.logoUrl ? (
                      <img src={user.brigade.logoUrl} alt={user.brigade.name} className="w-full h-full object-cover scale-110" />
                    ) : (
                      <span className="text-xl font-black text-rso-blue">{user.brigade.type}</span>
                    )}
                  </div>
                </div>

                <span className="font-black text-xs uppercase tracking-tight text-gray-900 pt-2 block">
                  {user.brigade.name}
                </span>
              </div>
            )}

            {/* Системная кнопка безопасного выхода в самом низу */}
            <button onClick={handleLogout} className="w-full py-4 border border-red-200 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">
              Выйти из экосистемы
            </button>
          </div>

        </div>
      </main>

      <footer className="py-10 text-center mt-20 border-t border-gray-200">
        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Севастопольское региональное отделение // МООО РСО 2026</span>
      </footer>
    </div>
  );
}