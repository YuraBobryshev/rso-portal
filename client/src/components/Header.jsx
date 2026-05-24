import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'
import logoUrl from '../assets/logo.svg';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (e) {
          console.error("Ошибка получения данных пользователя в хедере", e);
        }
      };
      fetchUser();
    } else {
      setUser(null);
    }
    
    setShowDropdown(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ================= ВЕРХНИЙ ХЕДЕР (ПК + МОБИЛЬНЫЙ ТОП С АВАТАРКОЙ) ================= */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-rso-blue/10 z-[999] px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <img src={logoUrl} alt="РСО" className="h-8 md:h-10 object-contain transition-transform group-hover:scale-105" />
        </Link>

        {/* Навигация для ПК (автоматически скрывается на смартфонах) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/news" className={`text-[10px] font-black uppercase tracking-widest hover:text-rso-blue transition-colors ${isActive('/news') ? 'text-rso-blue border-b-2 border-rso-blue' : 'text-black'}`}>Вестник</Link>
          <Link to="/brigades" className={`text-[10px] font-black uppercase tracking-widest hover:text-rso-blue transition-colors ${isActive('/brigades') ? 'text-rso-blue border-b-2 border-rso-blue' : 'text-black'}`}>Отряды</Link>
          <Link to="/about" className={`text-[10px] font-black uppercase tracking-widest hover:text-rso-blue transition-colors ${isActive('/about') ? 'text-rso-blue border-b-2 border-rso-blue' : 'text-black'}`}>О нас</Link>
          
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="w-10 h-10 rounded-full border border-rso-blue/20 overflow-hidden flex items-center justify-center bg-blue-50/50 hover:border-rso-blue transition-colors focus:outline-none"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-rso-blue font-black text-sm uppercase">{user?.firstName?.charAt(0) || 'U'}</span>
                )}
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-rso-blue/25 shadow-2xl py-2 z-[110] flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-1.5 border-b border-gray-100 pb-2 mb-1">
                    <div className="text-[9px] font-mono opacity-40 uppercase">Пользователь</div>
                    <div className="text-[11px] font-black uppercase text-black truncate">{user?.firstName} {user?.lastName}</div>
                  </div>

                  <Link to="/profile" className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-black hover:bg-blue-50 hover:text-rso-blue transition-colors">
                    Личный кабинет
                  </Link>
                  
                  {(user?.role === 'REG_HQ' || user?.role === 'ADMIN') && (
                    <Link to="/admin" className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-rso-blue hover:bg-blue-50 transition-colors border-t border-gray-100 font-bold">
                      ★ Admin панель
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                    Выйти из системы
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest border-2 border-rso-blue px-4 py-2 hover:bg-rso-blue hover:text-white transition-all">Войти</Link>
          )}
        </nav>

        {/* Мобильная кнопка профиля в верхнем правом углу */}
        <div className="md:hidden relative">
            {isLoggedIn ? (
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="w-9 h-9 rounded-full border border-rso-blue/30 overflow-hidden flex items-center justify-center bg-rso-blue text-white focus:outline-none shadow-md"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-xs uppercase">{user?.firstName?.charAt(0) || 'U'}</span>
                )}
              </button>
            ) : (
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest border border-rso-blue px-3 py-1.5 bg-white text-rso-blue font-bold">
                Войти
              </Link>
            )}

            {showDropdown && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-rso-blue/25 shadow-xl py-2 z-[110] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-1 border-b border-gray-100 pb-2 mb-1">
                  <div className="text-[10px] font-black uppercase text-black truncate">{user?.firstName} {user?.lastName}</div>
                </div>
                <Link to="/profile" className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-black">Профиль</Link>
                {(user?.role === 'REG_HQ' || user?.role === 'ADMIN') && (
                  <Link to="/admin" className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-rso-blue border-t border-gray-100">Админка</Link>
                )}
                <button onClick={handleLogout} className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-red-500 border-t border-gray-100 w-full">Выйти</button>
              </div>
            )}
        </div>
      </header>

      {/* ================= НИЖНЯЯ ПАНЕЛЬ (ЖЕЛЕЗНО ФИКСИРОВАННЫЙ FLEX // СТИЛЬ ВК) ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full h-16 bg-white border-t border-gray-200 z-[999] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex items-center justify-around">
        
        {/* 1. Главная */}
        <Link to="/" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">Главная</span>
        </Link>

        {/* 2. Вестник */}
        <Link to="/news" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/news') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">Вестник</span>
        </Link>

        {/* 3. Отряды */}
        <Link to="/brigades" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/brigades') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">Отряды</span>
        </Link>

        {/* 4. О нас */}
        <Link to="/about" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/about') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">O нас</span>
        </Link>

      </nav>

      {/* Буферный отступ снизу для мобилок */}
      <div className="md:hidden h-16 w-full"></div>
    </>
  );
}