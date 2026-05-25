import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import logoUrl from '../assets/logo.svg';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // === ЕДИНСТВЕННЫЙ ОБРАБОТЧИК ДЛЯ ВСЕХ СОЦСЕТЕЙ ===
  // Caddy вернет пользователя сюда с параметром ?token=... или ?error=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      localStorage.setItem('token', token);
      // Мягко очищаем параметры из адресной строки для красоты безопасности
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/profile');
    }

    if (error) {
      setServerError('Не удалось авторизоваться через социальную сеть. Попробуйте снова.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  // Классическая авторизация по почте/паролю
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 text-black font-sans flex flex-col selection:bg-rso-blue selection:text-white">
      
      {/* ХЕДЕР */}
      <header className="w-full max-w-[1500px] mx-auto h-16 px-6 flex justify-between items-center bg-transparent">
         <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
           <img src={logoUrl} alt="РСО" className="h-8 object-contain" />
         </Link>
         <Link to="/register" className="text-xs font-bold text-gray-400 hover:text-rso-blue transition-colors">
           Еще нет аккаунта? Создать
         </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-sm relative">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">Вход в систему</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Цифровая экосистема Студенческих Отрядов Севастополя</p>
          </div>

          {serverError && (
            <div className="mb-6 bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-xs font-semibold text-center">
              {serverError}
            </div>
          )}

          {/* ФОРМА КЛАССИЧЕСКОГО ВХОДА */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Электронная почта</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white text-black"
                placeholder="example@mail.ru"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Пароль</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white text-black"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full font-bold uppercase text-xs tracking-wider py-4.5 bg-gray-900 text-white rounded-xl transition-all shadow-md hover:bg-black disabled:bg-gray-200"
            >
              {loading ? 'Авторизация...' : 'Войти по почте'}
            </button>
          </form>

          {/* РАЗДЕЛИТЕЛЬ BENTO */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Или через сервисы</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* КНОПКИ СЕТЕВЫХ СЕРВИСОВ (Прямые ссылки на бэкенд через Caddy) */}
          <div className="space-y-3">
            
            {/* GOOGLE */}
            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/google" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 bg-white text-xs font-bold uppercase tracking-wider text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all shadow-xs"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="h-4 w-4" />
              <span>Войти через Google</span>
            </a>

            {/* ЯНДЕКС */}
            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/yandex" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 bg-white text-xs font-bold uppercase tracking-wider text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all shadow-xs"
            >
              <img src="https://www.svgrepo.com/show/349575/yandex.svg" alt="" className="h-4 w-4" />
              <span>Войти через Яндекс</span>
            </a>

            {/* ВКОНТАКТЕ */}
            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/vk" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 bg-[#0077FF] text-xs font-bold uppercase tracking-wider text-white py-3.5 rounded-xl hover:bg-[#0066DD] transition-all shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475689/vk-color.svg" alt="" className="h-4 w-4 filter brightness-0 invert" />
              <span>Войти через ВКонтакте</span>
            </a>

          </div>

        </div>
      </main>

      <footer className="py-6 bg-transparent text-center">
         <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Севастополь // 2026</span>
      </footer>
    </div>
  );
}