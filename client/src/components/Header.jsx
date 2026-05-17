import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
          const res = await axios.get('http://localhost:5000/api/auth/me', {
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
    
    // Закрываем выпадашку при каждой смене страницы
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
      {/* ================= ВЕРХНИЙ ХЕДЕР (ПК) ================= */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-rso-blue/10 z-[100] px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <img src={logoUrl} alt="РСО" className="h-8 md:h-10 object-contain transition-transform group-hover:scale-105" />
        </Link>

        {/* Навигация для ПК */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/news" className={`text-[10px] font-black uppercase tracking-widest hover:text-rso-blue transition-colors ${isActive('/news') ? 'text-rso-blue border-b-2 border-rso-blue' : 'text-black'}`}>Вестник</Link>
          <Link to="/brigades" className={`text-[10px] font-black uppercase tracking-widest hover:text-rso-blue transition-colors ${isActive('/brigades') ? 'text-rso-blue border-b-2 border-rso-blue' : 'text-black'}`}>Отряды</Link>
          <Link to="/about" className={`text-[10px] font-black uppercase tracking-widest hover:text-rso-blue transition-colors ${isActive('/about') ? 'text-rso-blue border-b-2 border-rso-blue' : 'text-black'}`}>О нас</Link>
          
          {isLoggedIn ? (
            /* КНОПКА-АВАТАРКА С ВЫПАДАЮЩИМ МЕНЮ ДЛЯ ПК */
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
              
              {/* Выпадающее системное меню */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-rso-blue/25 shadow-2xl py-2 z-[110] flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-1.5 border-b border-gray-100 pb-2 mb-1">
                    <div className="text-[9px] font-mono opacity-40 uppercase">Пользователь</div>
                    <div className="text-[11px] font-black uppercase text-black truncate">{user?.firstName} {user?.lastName}</div>
                  </div>

                  <Link 
                    to="/profile" 
                    className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-black hover:bg-blue-50 hover:text-rso-blue transition-colors"
                  >
                    Личный кабинет
                  </Link>
                  
                  {/* Проверка на права Регионального штаба */}
                  {(user?.role === 'REG_HQ' || user?.role === 'ADMIN') && (
                    <Link 
                      to="/admin" 
                      className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-rso-blue hover:bg-blue-50 transition-colors border-t border-gray-100 font-bold"
                    >
                      ★ Админ-панель
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    Выйти из системы
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest border-2 border-rso-blue px-4 py-2 hover:bg-rso-blue hover:text-white transition-all">Войти</Link>
          )}
        </nav>

        {/* Маленькая аватарка в верхнем правом углу для мобилок (опционально для вызова меню) */}
        <div className="md:hidden relative">
            {isLoggedIn && (
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="w-8 h-8 rounded-full border border-rso-blue/20 overflow-hidden flex items-center justify-center bg-gray-50 focus:outline-none"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-rso-blue font-black text-xs uppercase">{user?.firstName?.charAt(0) || 'U'}</span>
                )}
              </button>
            )}

            {showDropdown && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-rso-blue/25 shadow-xl py-2 z-[110] flex flex-col">
                <Link to="/profile" className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-black">Профиль</Link>
                {(user?.role === 'REG_HQ' || user?.role === 'ADMIN') && (
                  <Link to="/admin" className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-rso-blue border-t border-gray-100">Админка</Link>
                )}
                <button onClick={handleLogout} className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-red-500 border-t border-gray-100 w-full">Выйти</button>
              </div>
            )}
        </div>
      </header>

      {/* ================= НИЖНЯЯ ПАНЕЛЬ (Мобильная в стиле ВК) ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[100] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16">
          
          <Link to="/" className={`flex flex-col items-center gap-1 flex-1 ${isActive('/') ? 'text-rso-blue' : 'text-gray-400'}`}>
            <i className="fa-solid fa-house text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Главная</span>
          </Link>

          <Link to="/news" className={`flex flex-col items-center gap-1 flex-1 ${isActive('/news') ? 'text-rso-blue' : 'text-gray-400'}`}>
            <i className="fa-solid fa-newspaper text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Вестник</span>
          </Link>

          <Link to="/brigades" className={`flex flex-col items-center gap-1 flex-1 ${isActive('/brigades') ? 'text-rso-blue' : 'text-gray-400'}`}>
            <i className="fa-solid fa-users text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Отряды</span>
          </Link>

          <Link to="/about" className={`flex flex-col items-center gap-1 flex-1 ${isActive('/about') ? 'text-rso-blue' : 'text-gray-400'}`}>
            <i className="fa-solid fa-circle-info text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-tighter">О нас</span>
          </Link>

          {/* МОБИЛЬНЫЙ ПРОФИЛЬ: Если авторизован — выводим круглую мини-аватарку прямо в нижний бар! */}
          <Link to={isLoggedIn ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 flex-1 ${isActive('/profile') || isActive('/login') ? 'text-rso-blue' : 'text-gray-400'}`}>
            {isLoggedIn ? (
              <div className={`w-5 h-5 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100 ${isActive('/profile') ? 'border-rso-blue' : 'border-gray-300'}`}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-[8px] font-black uppercase text-rso-blue">{user?.firstName?.charAt(0) || 'U'}</span>
                )}
              </div>
            ) : (
              <i className="fa-solid fa-right-to-bracket text-lg"></i>
            )}
            <span className="text-[9px] font-bold uppercase tracking-tighter">{isLoggedIn ? 'Профиль' : 'Войти'}</span>
          </Link>

        </div>
      </nav>

      {/* Буферный отступ снизу */}
      <div className="md:hidden h-16"></div>
    </>
  );
}