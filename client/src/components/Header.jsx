import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoUrl from '../assets/logo.svg';

export default function Header() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(!!localStorage.getItem('token'));
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setIsChecking(false); return; }
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        setUserData(res.data);
      } catch (err) {
        localStorage.removeItem('token');
      } finally { setIsChecking(false); }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white sticky top-0 z-50 w-full">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between w-full">
        
        {/* ЛОГОТИП */}
        <div className="w-1/4 flex justify-start flex-shrink-0">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logoUrl} alt="РСО Севастополь" className="h-8 object-contain" />
          </Link>
        </div>

        {/* НАВИГАЦИЯ */}
        <div className="hidden md:flex flex-1 justify-center overflow-hidden">
          <nav className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-rso-blue">
            <Link to="/" className="hover:opacity-50 transition-opacity">Главная</Link>
            <Link to="/about" className="hover:opacity-50 transition-opacity">О нас</Link>
            <Link to="/gallery" className="hover:opacity-50 transition-opacity">Галерея</Link>
            <Link to="/news" className="hover:opacity-50 transition-opacity">Новости</Link>
            <Link to="/squads" className="hover:opacity-50 transition-opacity">Отряды</Link>
          </nav>
        </div>

        {/* ПРОФИЛЬ */}
        <div className="w-1/4 flex justify-end relative flex-shrink-0" ref={menuRef}>
          {isChecking ? (
            <div className="w-10 h-10 rounded-full border-[1px] border-rso-blue bg-blue-50 animate-pulse"></div>
          ) : userData ? (
            <div className="relative flex items-center gap-3">
              <div className="hidden md:block text-right">
                <div className="text-[10px] font-bold uppercase text-rso-blue leading-none">{userData.firstName}</div>
                <div className="text-[8px] uppercase tracking-widest opacity-50 mt-1">{userData.role}</div>
              </div>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full border-[1px] border-rso-blue bg-white text-rso-blue flex items-center justify-center font-bold text-lg hover:bg-rso-blue hover:text-white transition-all focus:outline-none"
              >
                {userData.firstName.charAt(0).toUpperCase()}
              </button>

              {/* ВЫПАДАЮЩЕЕ МЕНЮ (Tech-Minimalism) */}
              {isMenuOpen && (
                <div className="absolute right-0 top-14 w-56 bg-white border-[1px] border-rso-blue shadow-sm flex flex-col font-sans uppercase text-xs z-[60] animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b-[1px] border-rso-blue bg-blue-50/50 relative overflow-hidden">
                    <span className="absolute -right-4 -bottom-4 text-rso-blue opacity-5 text-6xl font-black">✦</span>
                    <div className="text-[8px] font-bold tracking-widest text-rso-blue/50 mb-1">СИСТЕМА РСО</div>
                    <div className="text-rso-blue font-bold tracking-tight">{userData.email}</div>
                  </div>

                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-3 text-left text-rso-blue font-bold hover:bg-rso-blue hover:text-white transition-colors border-b-[1px] border-rso-blue flex justify-between group"
                  >
                    <span>Личный кабинет</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>

                  {userData.role === 'REG_HQ' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-3 text-left text-rso-blue font-bold hover:bg-rso-blue hover:text-white transition-colors border-b-[1px] border-rso-blue flex justify-between group"
                    >
                      <span>Админ-панель</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout} 
                    className="p-3 text-left text-red-500 font-bold hover:bg-red-50 transition-colors flex justify-between group"
                  >
                    <span>Выход из системы</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">✕</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-rso-blue hover:opacity-50 transition-opacity">
                Вход
              </Link>
              <Link to="/register" className="text-[10px] font-bold uppercase tracking-widest border-[1px] border-rso-blue px-3 py-1 text-rso-blue hover:bg-rso-blue hover:text-white transition-all">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}