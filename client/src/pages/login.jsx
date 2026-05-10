import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logoUrl from '../assets/logo.svg'; // Добавили импорт логотипа

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка подключения к серверу');
    }
  };

  return (
    <div className="min-h-screen bg-white text-rso-blue font-sans flex flex-col selection:bg-rso-blue selection:text-white">
      
      {/* Мини-хедер для страницы входа */}
      <header className="p-6 flex justify-between items-center border-b-[1px] border-rso-blue">
         {/* Логотип вместо текста */}
         <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
           <img src={logoUrl} alt="РСО Севастополь" className="h-8 object-contain" />
         </Link>
         
         <Link to="/" className="text-[10px] font-bold uppercase hover:opacity-50 transition-opacity">
           [ Вернуться_на_главную ]
         </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Декоративная фоновая сетка */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0804FF 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>

        {/* Карточка авторизации */}
        <div className="w-full max-w-md border-[1px] border-rso-blue bg-white p-10 relative z-10 shadow-2xl shadow-blue-900/10">
          <div className="absolute top-2 left-2 text-[8px] font-mono opacity-30 uppercase">SECURE_LOGIN_v1.0</div>
          
          <div className="text-center mb-10 mt-4">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Авторизация</h1>
            <div className="h-[1px] w-16 bg-rso-blue mx-auto mb-2"></div>
            <p className="text-[9px] uppercase tracking-widest opacity-50 font-bold">Доступ в закрытую систему</p>
          </div>

          {error && (
            <div className="mb-6 border-[1px] border-red-500 bg-red-50 p-3 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
              ОШИБКА: {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="group relative">
              <label className="block text-[9px] uppercase font-bold opacity-50 mb-2 tracking-widest">
                01 _ Электронная почта
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-[1px] border-rso-blue py-2 outline-none font-medium text-lg focus:border-b-2 transition-all"
                placeholder="system@email.com"
                required
              />
            </div>

            <div className="group relative">
              <label className="block text-[9px] uppercase font-bold opacity-50 mb-2 tracking-widest">
                02 _ Пароль доступа
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-[1px] border-rso-blue py-2 outline-none font-medium text-lg tracking-widest focus:border-b-2 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full bg-rso-blue text-white font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-black transition-colors relative overflow-hidden group">
              <span className="relative z-10">[ ВОЙТИ_В_СИСТЕМУ ]</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>
          </form>

          <div className="mt-8 text-center border-t-[1px] border-rso-blue/20 pt-6">
            <p className="text-[10px] uppercase font-bold opacity-50 mb-2">Нет_учетной_записи?</p>
            <Link to="/register" className="text-xs font-bold uppercase tracking-widest hover:border-b-[1px] border-rso-blue pb-1 transition-all">
              Подать_заявку_на_вступление →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}