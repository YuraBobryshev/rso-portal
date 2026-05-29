import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

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
          const res = await api.get('/auth/me', {
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
      {/* ==================== 1. ВЕРСИЯ ДЛЯ ПК (DESKTOP) ==================== */}
      <header className="hidden md:block fixed top-0 left-0 right-0 h-20 bg-white z-[999] transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between relative">
          
          {/* Левая часть: Логотип */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <span className="font-black text-lg uppercase tracking-tighter text-black">
              СевРО <span className="text-rso-blue">РСО</span>
            </span>
          </Link>

          {/* Центральная часть: Меню (Смещено ближе к центру через gap и позиционирование) */}
          <nav className="flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className={`text-xs font-black uppercase tracking-widest transition-colors ${isActive('/') ? 'text-rso-blue' : 'text-gray-500 hover:text-black'}`}>
              Главная
            </Link>
            <Link to="/news" className={`text-xs font-black uppercase tracking-widest transition-colors ${isActive('/news') ? 'text-rso-blue' : 'text-gray-500 hover:text-black'}`}>
              новости
            </Link>
            <Link to="/brigades" className={`text-xs font-black uppercase tracking-widest transition-colors ${isActive('/brigades') ? 'text-rso-blue' : 'text-gray-500 hover:text-black'}`}>
              отряды
            </Link>
            <Link to="/gallery" className={`text-xs font-black uppercase tracking-widest transition-colors ${isActive('/gallery') ? 'text-rso-blue' : 'text-gray-500 hover:text-black'}`}>
              галлерея
            </Link>
            <Link to="/documents" className={`text-xs font-black uppercase tracking-widest transition-colors ${isActive('/documents') ? 'text-rso-blue' : 'text-gray-500 hover:text-black'}`}>
              документы
            </Link>
          </nav>

          {/* Правая часть: Профиль / Вход */}
          <div className="flex items-center gap-4 shrink-0 relative">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 focus:outline-none group"
                >
                  <div className="w-9 h-9 bg-slate-100 rounded-xl overflow-hidden border border-gray-100 group-hover:border-rso-blue transition-colors flex items-center justify-center">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-gray-500 uppercase">{user?.firstName?.[0]}</span>
                    )}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[1000]">
                    <Link to="/profile" className="block px-4 py-3 text-xs font-bold text-gray-700 hover:bg-slate-50 transition-colors uppercase tracking-wider">
                      Личный кабинет
                    </Link>
                    {user?.role === 'REG_HQ' && (
                      <Link to="/admin" className="block px-4 py-3 text-xs font-bold text-rso-blue hover:bg-blue-50/50 transition-colors uppercase tracking-wider">
                        Панель штаба
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors uppercase tracking-wider border-t border-gray-50">
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rso-blue transition-colors shadow-sm">
                Войти
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* ==================== 2. ОБНОВЛЕННАЯ МОВЕРСИЯ (MOBILE BOTTOM NAV) ==================== */}
      {/* bg-white, никаких верхних border и теней-обводок */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white z-[999] flex items-center justify-around px-2">
        
        {/* 1. Главная */}
        <Link to="/" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">Главная</span>
        </Link>

        {/* 2. новости */}
        <Link to="/news" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/news') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">новости</span>
        </Link>

        {/* 3. отряды */}
        <Link to="/brigades" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/brigades') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">отряды</span>
        </Link>

        {/* 4. галлерея */}
        <Link to="/gallery" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/gallery') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">галлерея</span>
        </Link>

        {/* 5. документы */}
        <Link to="/documents" className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors ${isActive('/documents') ? 'text-rso-blue' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-tight block">документы</span>
        </Link>

      </nav>
    </>
  );
}