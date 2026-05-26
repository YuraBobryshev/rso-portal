import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import logoUrl from '../assets/logo.svg';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [brigadeMembers, setBrigadeMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Формы
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '' });
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setProfileForm({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || ''
      });

      if (res.data.brigade && res.data.brigade.id) {
        const brigadeRes = await api.get(`/brigades/${res.data.brigade.id}`);
        setBrigadeMembers(brigadeRes.data.users || []);
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
      const res = await api.post('/auth/upload-avatar', formData, {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 animate-pulse">Загрузка цифровой экосистемы...</div>
      </div>
    );
  }

  // --- ВЫЧИСЛЯЕМЫЕ ПЕРЕМЕННЫЕ ДЛЯ UI ---
  const isPassLengthValid = passwordForm.password.length >= 6;
  const isPassMatch = passwordForm.password.length > 0 && passwordForm.password === passwordForm.confirmPassword;
  
  const latestApp = user.applications && user.applications.length > 0 ? user.applications[0] : null;

  return (
    <div className="min-h-screen bg-gray-50/30 text-black font-sans pb-12 selection:bg-rso-blue selection:text-white">
      <header className="w-full max-w-[1500px] mx-auto h-16 px-6 flex justify-between items-center bg-transparent">
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <img src={logoUrl} alt="РСО" className="h-8 object-contain" />
        </Link>
        <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider transition-colors">
          Выйти из системы
        </button>
      </header>

      <main className="w-full max-w-[1500px] mx-auto px-6 mt-6">
        
        {message.text && (
          <div className={`mb-6 border rounded-xl p-4 text-xs font-semibold text-center transition-all shadow-xs ${
            message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {message.text}
          </div>
        )}

        <div className="w-full bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative group cursor-pointer">
              <img 
                src={user.avatarUrl || 'https://www.svgrepo.com/show/501227/user-profile.svg'} 
                alt="Аватар" 
                className="w-24 h-24 rounded-2xl object-cover border border-gray-100 bg-gray-50"
              />
              <label className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white uppercase font-bold tracking-wider cursor-pointer">
                Изменить
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{user.lastName} {user.firstName}</h2>
              <p className="text-sm text-gray-400 font-medium">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-gray-900 text-white rounded-md">
                  Роль: {user.role}
                </span>
                {user.brigade && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-rso-blue/10 text-rso-blue border border-rso-blue/20 rounded-md">
                    {user.brigade.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-center md:text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">В экосистеме с</span>
            <span className="text-sm font-black text-black block mt-0.5">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* ФИО */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Персональные данные</h3>
              <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Имя</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Фамилия</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white"
                    required
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full font-bold uppercase text-[10px] tracking-wider py-3.5 bg-gray-900 text-white rounded-xl transition-all hover:bg-black disabled:bg-gray-200"
                  >
                    Сохранить изменения
                  </button>
                </div>
              </form>
            </div>

            {/* ПАРОЛЬ С ВАЛИДАЦИЕЙ */}
            {!user.hasPassword && (
              <div className="bg-amber-50/40 border border-amber-100 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-800">Защита аккаунта</h3>
                  <p className="text-xs text-amber-600 mt-1">
                    Установите пароль, чтобы иметь возможность авторизоваться традиционным способом по Email.
                  </p>
                </div>
                <form onSubmit={handleSetPassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex justify-between">
                      Новый пароль
                      <span className={isPassLengthValid ? 'text-green-600' : 'text-amber-500/70'}>
                        {isPassLengthValid ? '✓ Надежный' : 'Мин. 6 символов'}
                      </span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                      className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                        passwordForm.password.length > 0 
                          ? (isPassLengthValid ? 'border-green-400 focus:border-green-500' : 'border-red-400 focus:border-red-500') 
                          : 'border-amber-200 focus:border-amber-500'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex justify-between">
                      Повторите пароль
                      {passwordForm.confirmPassword.length > 0 && (
                        <span className={isPassMatch ? 'text-green-600' : 'text-red-500'}>
                          {isPassMatch ? '✓ Совпадают' : 'Не совпадают'}
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                        passwordForm.confirmPassword.length > 0 
                          ? (isPassMatch ? 'border-green-400 focus:border-green-500' : 'border-red-400 focus:border-red-500') 
                          : 'border-amber-200 focus:border-amber-500'
                      }`}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={actionLoading || !isPassLengthValid || !isPassMatch}
                      className="w-full font-bold uppercase text-[10px] tracking-wider py-3.5 bg-amber-600 text-white rounded-xl transition-all hover:bg-amber-700 disabled:bg-amber-300 disabled:cursor-not-allowed"
                    >
                      Установить пароль
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* БЛОК ОТРЯДА / СТАТУС ЗАЯВКИ */}
            {user.role === 'USER' || !user.brigade ? (
              
              latestApp ? (
                // ЕСЛИ ЕСТЬ ЗАЯВКА
                <div className={`border rounded-3xl p-8 text-center relative overflow-hidden shadow-xs ${
                  latestApp.status === 'PENDING' ? 'bg-amber-50/50 border-amber-100' :
                  latestApp.status === 'REJECTED' ? 'bg-red-50/50 border-red-100' :
                  'bg-gray-50/50 border-gray-100'
                }`}>
                  <div className="relative z-10 max-w-md mx-auto">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2">
                      {latestApp.status === 'PENDING' ? 'Заявка на рассмотрении' :
                       latestApp.status === 'REJECTED' ? 'Заявка отклонена' :
                       'Статус заявки'}
                    </h3>
                    
                    {latestApp.status === 'PENDING' && (
                      <p className="text-xs text-amber-700 font-medium leading-relaxed">
                        Твоя анкета на вступление в отряд <strong>{latestApp.brigade?.name}</strong> находится на проверке у комсостава. Ожидай изменения статуса.
                      </p>
                    )}

                    {latestApp.status === 'REJECTED' && (
                      <>
                        <p className="text-xs text-red-600 font-medium leading-relaxed mb-4">
                          К сожалению, твоя заявка в отряд <strong>{latestApp.brigade?.name}</strong> была отклонена.
                          {latestApp.comment && <span className="block mt-2 italic">Причина: {latestApp.comment}</span>}
                        </p>
                        <Link 
                          to="/brigades" 
                          className="inline-block font-bold uppercase text-[10px] tracking-wider px-6 py-3.5 bg-gray-900 text-white rounded-xl transition-all hover:bg-black"
                        >
                          Выбрать другой отряд
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                // ЕСЛИ ЗАЯВОК НЕТ
                <div className="bg-rso-blue/5 border border-rso-blue/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-xs">
                  <div className="relative z-10 max-w-md mx-auto">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black">Вступи в ряды Студенческих Отрядов!</h3>
                    <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
                      Ты еще не привязан ни к одному линейному студенческому отряду. Стань частью лучшего движения страны!
                    </p>
                    <Link 
                      to="/brigades" 
                      className="inline-block mt-5 font-bold uppercase text-[10px] tracking-wider px-6 py-3.5 bg-rso-blue text-white rounded-xl transition-all hover:bg-blue-600 shadow-md shadow-blue-500/10"
                    >
                      Выбрать свой отряд
                    </Link>
                  </div>
                </div>
              )
              
            ) : (
              // ЕСЛИ УЖЕ В ОТРЯДЕ
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Состав моего отряда ({user.brigade.name})</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Всего: {brigadeMembers.length} бойцов</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
                  {brigadeMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <img 
                        src={member.avatarUrl || 'https://www.svgrepo.com/show/501227/user-profile.svg'} 
                        alt="" 
                        className="w-10 h-10 rounded-lg object-cover bg-gray-200"
                      />
                      <div className="truncate">
                        <span className="block text-xs font-black text-black truncate">{member.lastName} {member.firstName}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mt-0.5">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Связанные аккаунты</h3>
              
              <div className="space-y-3">
                {/* ВКОНТАКТЕ */}
                <div className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <img src="https://www.svgrepo.com/show/475689/vk-color.svg" alt="VK" className="h-5 w-5" />
                    <span className="text-xs font-bold text-gray-700">ВКонтакте ID</span>
                  </div>
                  {user.hasVk ? (
                    <span className="text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-md">Подключено</span>
                  ) : (
                    <a href="https://xn--b1af2ahcd.xn--p1ai/api/auth/vk" className="text-[9px] font-black uppercase tracking-wider text-[#0077FF] bg-[#0077FF]/10 border border-[#0077FF]/20 px-3 py-1.5 rounded-md hover:bg-[#0077FF]/20 transition-colors">
                      Привязать
                    </a>
                  )}
                </div>

                {/* GOOGLE */}
                <div className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                    <span className="text-xs font-bold text-gray-700">Google Account</span>
                  </div>
                  {user.hasGoogle ? (
                    <span className="text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-md">Подключено</span>
                  ) : (
                    <a href="https://xn--b1af2ahcd.xn--p1ai/api/auth/google" className="text-[9px] font-black uppercase tracking-wider text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors">
                      Привязать
                    </a>
                  )}
                </div>

                {/* ЯНДЕКС */}
                <div className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <img src="https://www.svgrepo.com/show/349575/yandex.svg" alt="Yandex" className="h-5 w-5" />
                    <span className="text-xs font-bold text-gray-700">Яндекс ID</span>
                  </div>
                  {user.hasYandex ? (
                    <span className="text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-md">Подключено</span>
                  ) : (
                    <a href="https://xn--b1af2ahcd.xn--p1ai/api/auth/yandex" className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors">
                      Привязать
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}