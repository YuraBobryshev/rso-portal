import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Инициализация VK ID виджета
  useEffect(() => {
    const initVKID = () => {
      if (window.VKIDSDK) {
        const vkid = new window.VKIDSDK.Config({
          app: 54608474,
          redirectUrl: 'https://xn--b1af2ahcd.xn--p1ai/login',
          state: 'vk',
        });

        const oneTap = new window.VKIDSDK.OneTap();
        oneTap.render({ container: document.getElementById('vk_auth_widget'), scheme: 'bright_light' });
      }
    };
    initVKID();
  }, []);

  // Логика обработки возврата от соцсетей
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code) {
      const authWithSocial = async () => {
        try {
          let res;
          if (state === 'vk') {
            res = await api.post('/auth/vk', { code });
          } else {
            res = await api.post('/auth/yandex', { code });
          }
          localStorage.setItem('token', res.data.token);
          navigate('/profile');
        } catch (err) {
          setServerError(`Ошибка авторизации через ${state === 'vk' ? 'ВКонтакте' : 'Яндекс'}`);
          navigate('/login', { replace: true });
        }
      };
      authWithSocial();
    }
  }, [location.search, navigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = 'Введите электронную почту';
    else if (!emailRegex.test(email)) newErrors.email = 'Неверный формат почты';
    if (!password) newErrors.password = 'Введите пароль';
    else if (password.length < 6) newErrors.password = 'Пароль не может быть короче 6 символов';
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
    flow: 'auth-code',
  });

  const yandexLogin = () => {
    const clientId = 'adb8160f0e97492b899ec3d783a364e7';
    const redirectUri = encodeURIComponent('https://xn--b1af2ahcd.xn--p1ai/login'); 
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=yandex`;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 text-black font-sans flex flex-col">
      <header className="w-full max-w-[1500px] mx-auto h-16 px-6 flex justify-between items-center bg-transparent">
         <Link to="/" className="flex items-center hover:opacity-90"><img src={logoUrl} alt="РСО" className="h-8" /></Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-black uppercase text-center mb-8">Вход</h1>
          {serverError && <div className="mb-4 text-red-600 text-xs text-center">{serverError}</div>}
          
          <div className="flex flex-col gap-3 mb-6">
            <div id="vk_auth_widget" className="w-full"></div>
            <button onClick={() => googleLogin()} className="w-full border py-3 rounded-xl text-sm font-bold">Войти через Google</button>
            <button onClick={yandexLogin} className="w-full border py-3 rounded-xl text-sm font-bold">Войти через Яндекс</button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl p-3 text-sm" placeholder="Почта" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl p-3 text-sm" placeholder="Пароль" />
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">Войти</button>
          </form>
        </div>
      </main>
    </div>
  );
}