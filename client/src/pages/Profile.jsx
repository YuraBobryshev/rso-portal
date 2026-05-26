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
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', vkUrl: '', tgUrl: '' });
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });

  const navigate = useNavigate();

  // Загрузка профиля
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

      // Если боец состоит в отряде, подтягиваем сокомандников
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

  // Хендлер изменения аватарки
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

  // Хендлер обновления профиля (ФИО, соцсети)
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

  // Хендлер установки пароля
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      return setMessage({ text: 'Пароли не совпадают', type: 'error' });
    }

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

  return (
    <div className="min-h-screen bg-gray-50/30 text-black font-sans pb-12 selection:bg-rso-blue selection:text-white">
      {/* НАВИГАЦИЯ */}
      <header className="w-full max-w-[1500px] mx-auto h-16 px-6 flex justify-between items-center bg-transparent">
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <img src={logoUrl} alt="РСО" className="h-8 object-contain" />
        </Link>
        <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider transition-colors">
          Выйти из системы
        </button>
      </header>

      <main className="w-full max-w-[1500px] mx-auto px-6 mt-6">
        
        {/* УВЕДОМЛЕНИЯ СИСТЕМЫ */}
        {message.text && (
          <div className={`mb-6 border rounded-xl p-4 text-xs font-semibold text-center transition-all shadow-xs ${
            message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* ХЕДЕР ПРОФИЛЯ (ОСНОВНОЙ BENTO БЛОК) */}
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

        {/* ГЛАВНЫЙ СЕТОЧНЫЙ GRID (BENTO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* СТОЛБЕЦ 1 И 2: УПРАВЛЕНИЕ И ДАННЫЕ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* КАРТОЧКА РЕДАКТИРОВАНИЯ */}
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
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ссылка на ВКонтакте (профиль)</label>
                  <input
                    type="text"
                    value={profileForm.vkUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, vkUrl: e.target.value })}
                    placeholder="https://vk.com/id..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ссылка на Telegram</label>
                  <input
                    type="text"
                    value={profileForm.tgUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, tgUrl: e.target.value })}
                    placeholder="https://t.me/username"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white"
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

            {/* УМНАЯ СИСТЕМА УСТАНОВКИ ПАРОЛЯ */}
            {!user.hasPassword && (
              <div className="bg-amber-50/40 border border-amber-100 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-800">Защита аккаунта</h3>
                  <p className="text-xs text-amber-600 mt-1">
                    Вы вошли через социальную сеть. Установите пароль, чтобы иметь возможность авторизоваться традиционным способом по Email.
                  </p>
                </div>
                <form onSubmit={handleSetPassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Новый пароль</label>
                    <input
                      type="password"
                      value={passwordForm.password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                      placeholder="Минимум 6 символов"
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Повторите пароль</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Повторите ввод"
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full font-bold uppercase text-[10px] tracking-wider py-3.5 bg-amber-600 text-white rounded-xl transition-all hover:bg-amber-700"
                    >
                      Установить пароль
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* КОНТЕНТ ПО РОЛЯМ: ОТРЯДНЫЙ БЛОК */}
            {user.role === 'USER' || !user.brigade ? (
              /* КАРТОЧКА ДЛЯ ОБЫЧНОГО ЮЗЕРАБЕЗ ОТРЯДА */
              <div className="bg-rso-blue/5 border border-rso-blue/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-xs">
                <div className="relative z-10 max-w-md mx-auto">
                  <h3 className="text-xl font-black uppercase tracking-tight text-black">Вступи в ряды Студенческих Отрядов!</h3>
                  <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
                    Ты еще не привязан ни к одному линейному студенческому отряду. Стань частью лучшего движения страны, найди верных друзей и проведи свое лучшее трудовое лето!
                  </p>
                  <Link 
                    to="/brigades" 
                    className="inline-block mt-5 font-bold uppercase text-[10px] tracking-wider px-6 py-3.5 bg-rso-blue text-white rounded-xl transition-all hover:bg-blue-600 shadow-md shadow-blue-500/10"
                  >
                    Выбрать свой отряд
                  </Link>
                </div>
              </div>
            ) : (
              /* КАРТОЧКА СПИСКА ОТРЯДА ДЛЯ НАСТОЯЩИХ БОЙЦОВКОМАНДИРОВ */
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

          {/* СТОЛБЕЦ 3: СТАТУС ПРИВЯЗОК (СИД БАР) */}
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
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Не привязан</span>
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
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Не привязан</span>
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
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Не привязан</span>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Привязка аккаунтов выполняется автоматически при первом входе через соответствующий сервис. Разъединение аккаунтов временно недоступно из соображений безопасности.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}