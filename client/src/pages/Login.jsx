import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';
// ИМПОРТ ДЛЯ GOOGLE:
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Клиентская валидация полей
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      newErrors.email = 'Введите электронную почту';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Неверный формат почты (например, name@mail.ru)';
    }

    if (!password) {
      newErrors.password = 'Введите пароль';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль не может быть короче 6 символов';
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setErrors(validate());
  };

  // --- СТАНДАРТНЫЙ ЛОГИН ---
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setTouched({ email: true, password: true });
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Неверный логин или пароль');
    }
  };

  // --- GOOGLE ЛОГИН ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/auth/google', { code: tokenResponse.code });
        localStorage.setItem('token', res.data.token);
        navigate('/profile');
      } catch (err) {
        setServerError('Ошибка авторизации через Google');
      }
    },
    flow: 'auth-code', // Получаем код для сервера, а не прямой токен
  });

  // --- ЯНДЕКС ЛОГИН ---
  const yandexLogin = () => {
    // ВАЖНО: Вставь сюда свой Client ID от Яндекса
    const clientId = 'adb8160f0e97492b899ec3d783a364e7'; 
    // Используем Punycode для надежности перенаправления
    const redirectUri = encodeURIComponent('https://xn--b1af2ahcd.xn--p1ai/api/auth/yandex/callback'); 
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 text-black font-sans flex flex-col selection:bg-rso-blue selection:text-white">
      
      {/* Аккуратный Bento-хедер для страницы входа */}
      <header className="w-full max-w-[1500px] mx-auto h-16 px-6 flex justify-between items-center bg-transparent">
         <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
           <img src={logoUrl} alt="РСО Севастополь" className="h-8 object-contain" />
         </Link>
         
         <Link to="/" className="text-xs font-bold text-gray-400 hover:text-rso-blue transition-colors">
           На главную →
         </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {/* Карточка авторизации Bento */}
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-sm relative">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">Вход в систему</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Доступ к личному кабинету СевРО РСО</p>
          </div>

          {serverError && (
            <div className="mb-6 bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-xs font-semibold text-center">
              {serverError}
            </div>
          )}

          {/* КНОПКИ СОЦСЕТЕЙ */}
          <div className="flex flex-col gap-3 mb-6">
            <button 
              type="button"
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-sm font-bold text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
              Войти через Google
            </button>
            <button 
              type="button"
              onClick={yandexLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-sm font-bold text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img src="https://yastatic.net/s3/home/icons/yandex-red-logo-v2.svg" alt="Yandex" className="h-5 w-5" />
              Войти через Яндекс
            </button>
          </div>

          {/* РАЗДЕЛИТЕЛЬ */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-100"></div>
            <span className="px-3 text-xs text-gray-400 font-bold uppercase tracking-wider">или по почте</span>
            <div className="flex-1 border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Электронная почта
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) setErrors(validate());
                }}
                onBlur={() => handleBlur('email')}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                  touched.email && errors.email 
                    ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                    : 'border-gray-200 focus:border-rso-blue focus:bg-white'
                }`}
                placeholder="name@example.com"
              />
              {touched.email && errors.email && (
                <span className="text-[11px] text-red-500 font-medium mt-1 block pl-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Пароль доступа
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setErrors(validate());
                }}
                onBlur={() => handleBlur('password')}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                  touched.password && errors.password 
                    ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                    : 'border-gray-200 focus:border-rso-blue focus:bg-white'
                }`}
                placeholder="••••••••"
              />
              {touched.password && errors.password && (
                <span className="text-[11px] text-red-500 font-medium mt-1 block pl-1">
                  {errors.password}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-rso-blue text-white font-bold uppercase text-xs tracking-wider py-4 rounded-xl hover:bg-black transition-colors shadow-md shadow-blue-500/10 mt-2"
            >
              Войти в личный кабинет
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 font-medium mb-1.5">Ещё нет учетной записи?</p>
            <Link to="/register" className="text-xs font-bold text-rso-blue hover:text-black transition-colors">
              Подать заявку на вступление →
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 bg-transparent text-center">
         <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Севастополь // 2026</span>
      </footer>
    </div>
  );
}