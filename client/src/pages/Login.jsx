import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header'; // <-- Подключаем наш глобальный хедер

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
    <div className="min-h-screen bg-gray-50/30 text-black font-sans flex flex-col selection:bg-rso-blue selection:text-white">
      
      {/* ИСПОЛЬЗУЕМ ГЛОБАЛЬНЫЙ ХЕДЕР */}
      <Header />

      {/* Добавили pt-24 для защиты от наезда хедера и p-4 для мобилки */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-24 pb-12">
        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">Вход в систему</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Цифровая экосистема Студенческих Отрядов Севастополя</p>
          </div>

          {serverError && (
            <div className="mb-6 bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-xs font-semibold text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Электронная почта</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white text-black font-medium"
                placeholder="example@mail.ru"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Пароль</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-rso-blue focus:bg-white text-black font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Яркая акцентная кнопка */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full font-bold uppercase text-xs tracking-wider py-4 bg-rso-blue text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:bg-black hover:shadow-black/10 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
              >
                {loading ? 'Авторизация...' : 'Войти по почте'}
              </button>
            </div>
          </form>

          {/* РАЗДЕЛИТЕЛЬ BENTO */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Или через сервисы</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* НАДЕЖНЫЕ ИКОНКИ С SIMPLEICONS */}
          <div className="space-y-3">
            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/google" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 bg-white text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all shadow-xs"
            >
              <img src="https://cdn.simpleicons.org/google" alt="Google" className="h-4 w-4" />
              <span>Войти через Google</span>
            </a>

            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/yandex" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 bg-white text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all shadow-xs"
            >
              <img src="https://cdn.simpleicons.org/yandex/FC3F1D" alt="Yandex" className="h-4 w-4" />
              <span>Войти через Яндекс</span>
            </a>

            <a 
              href="https://xn--b1af2ahcd.xn--p1ai/api/auth/vk" 
              className="w-full flex items-center justify-center gap-3 border border-gray-100 bg-[#0077FF] text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white py-3.5 rounded-xl hover:bg-[#0066DD] transition-all shadow-sm shadow-blue-500/20"
            >
              <img src="https://cdn.simpleicons.org/vk/FFFFFF" alt="VK" className="h-4 w-4" />
              <span>Войти через ВКонтакте</span>
            </a>
          </div>

          {/* ССЫЛКА НА РЕГИСТРАЦИЮ ВНИЗУ КАРТОЧКИ */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            Еще нет аккаунта?{' '}
            <Link to="/register" className="text-rso-blue hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5 ml-1">
              Создать профиль
            </Link>
          </div>

        </div>
      </main>

      <footer className="py-6 bg-transparent text-center mt-auto">
         <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Севастополь // 2026</span>
      </footer>
    </div>
  );
}