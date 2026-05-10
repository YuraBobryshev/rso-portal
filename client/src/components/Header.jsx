import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Ошибка авторизации");
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="border-b-[1px] border-rso-blue bg-white sticky top-0 z-[100]">
      {/* Контейнер-ограничитель, чтобы элементы не разъезжались */}
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* ЛОГОТИП */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src={logoUrl} alt="РСО" className="h-8 object-contain" />
        </Link>

        {/* НАВИГАЦИЯ (Центр) */}
        <nav className="hidden lg:flex gap-10 items-center">
          {['ГЛАВНАЯ', 'О НАС', 'ГАЛЕРЕЯ', 'НОВОСТИ', 'ОТРЯДЫ'].map((item) => (
            <Link 
              key={item} 
              to={item === 'ГЛАВНАЯ' ? '/' : `/${item.toLowerCase()}`}
              className="text-[10px] font-black text-rso-blue hover:text-black transition-colors tracking-[0.2em]"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* ПРОФИЛЬ / ВХОД (Право) */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 group outline-none"
              >
                <div className="text-right hidden md:block">
                  <div className="text-[9px] font-black uppercase text-rso-blue leading-none">{user.firstName}</div>
                  <div className="text-[7px] font-bold opacity-40 uppercase tracking-widest mt-1">{user.role}</div>
                </div>
                
                <div className="w-10 h-10 border-[1px] border-rso-blue rounded-full overflow-hidden flex items-center justify-center bg-blue-50 transition-all group-hover:shadow-[0_0_15px_rgba(8,4,255,0.2)]">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-rso-blue font-black text-sm">{user.firstName.charAt(0)}</span>
                  )}
                </div>
              </button>

              {/* ВЫПАДАЮЩЕЕ ОКНО */}
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border-[1px] border-rso-blue shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b-[1px] border-rso-blue/10">
                    <p className="text-[8px] font-bold opacity-40 uppercase mb-1">Авторизован как</p>
                    <p className="text-[10px] font-black uppercase truncate text-rso-blue">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-blue-50 text-rso-blue"
                    >
                      Личный кабинет
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-red-50 text-red-500"
                    >
                      Выйти из системы
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-[10px] font-black border-[1px] border-rso-blue px-6 py-2.5 hover:bg-rso-blue hover:text-white transition-all uppercase tracking-widest">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}