import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/profile');
    }

    if (error) {
      setServerError('Не удалось авторизоваться через социальную сеть. Попробуйте снова.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

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
    <div className="min-h-screen bg-gray-50/30 dark:bg-slate-900 text-black dark:text-white font-sans flex flex-col selection:bg-rso-blue selection:text-white transition-colors duration-300">
      
      <Header />

      <main className="flex-1 flex items-start justify-center p-4 sm:p-6 pt-32 md:pt-40 pb-12">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-sm relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white">Вход в систему</h1>
            <p className="text-xs text-gray-400 dark:text-gray-400 font-medium mt-1">Цифровая экосистема Студенческих Отрядов Севастополя</p>
          </div>

          {serverError && (
            <div className="mb-6 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-xl p-3 text-xs font-semibold text-center transition-colors">
              {serverError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Электронная почта</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-rso-blue dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 text-black dark:text-white font-medium"
                placeholder="example@mail.ru"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Пароль</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-rso-blue dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 text-black dark:text-white font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full font-bold uppercase text-xs tracking-wider py-4 bg-rso-blue text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:bg-black dark:hover:bg-slate-700 hover:shadow-black/10 dark:hover:shadow-none disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:shadow-none disabled:text-gray-400 dark:disabled:text-slate-500"
              >
                {loading ? 'Авторизация...' : 'Войти по почте'}
              </button>
            </div>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Или через сервисы</span>
            <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
          </div>

          <div className="space-y-3">
            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/google" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-200 dark:hover:border-slate-600 transition-all shadow-sm"
            >
              <img src="https://cdn.simpleicons.org/google" alt="Google" className="h-4 w-4" />
              <span>Войти через Google</span>
            </a>

            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/yandex" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-200 dark:hover:border-slate-600 transition-all shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#FC3F1D" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.682 23.003h2.38V1.002h-3.66c-4.4 0-7.382 2.704-7.382 6.81 0 3.037 1.558 5.253 3.996 6.31-2.193 1.1-3.606 2.946-3.606 5.342 0 2.502 1.542 4.095 3.738 4.095h3.332v-3.414H10.15c-1.12 0-1.76-.704-1.76-1.874 0-1.34 1.026-2.175 2.625-2.175h2.668v6.906zm0-9.87h-1.635c-2.342 0-4.004-1.464-4.004-3.784 0-2.22 1.63-3.834 4.032-3.834h1.608v7.618z"/>
              </svg>
              <span>Войти через Яндекс</span>
            </a>

            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/vk" 
              className="w-full flex items-center justify-center gap-3 border border-transparent bg-[#0077FF] text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white py-3.5 rounded-xl hover:bg-[#0066DD] transition-all shadow-sm shadow-blue-500/20"
            >
              <img src="https://cdn.simpleicons.org/vk/FFFFFF" alt="VK" className="h-4 w-4" />
              <span>Войти через ВКонтакте</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-700 text-center text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Еще нет аккаунта?{' '}
            <Link to="/register" className="text-rso-blue dark:text-blue-400 hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-black dark:hover:border-white pb-0.5 ml-1">
              Создать профиль
            </Link>
          </div>

        </div>
      </main>

      <footer className="py-6 bg-transparent text-center mt-auto">
         <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Севастополь // 2026</span>
      </footer>
    </div>
  );
}