// src/components/Header.jsx
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

  const navItems = [
    { label: 'ГЛАВНАЯ', path: '/' },
    { label: 'О НАС', path: '/about' },
    { label: 'ГАЛЕРЕЯ', path: '/gallery' },
    { label: 'НОВОСТИ', path: '/news' },
    { label: 'ОТРЯДЫ', path: '/brigades' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) { console.error("Ошибка авторизации"); }
    };
    fetchUser();
  }, [token]);

  return (
    <header className="border-b-[1px] border-rso-blue bg-white sticky top-0 z-[100] font-sans">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <img src={logoUrl} alt="РСО" className="h-8 object-contain" />
        </Link>

        <nav className="hidden lg:flex gap-10 items-center">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className="text-[10px] font-black text-rso-blue hover:text-black transition-colors tracking-[0.2em]">{item.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 group outline-none">
                <div className="text-right hidden md:block">
                  <div className="text-[9px] font-black uppercase text-rso-blue leading-none">{user.firstName}</div>
                  <div className="text-[7px] font-bold opacity-40 uppercase tracking-widest mt-1">{user.role}</div>
                </div>
                <div className="w-10 h-10 border-[1px] border-rso-blue rounded-full overflow-hidden bg-blue-50">
                  {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-rso-blue font-black text-sm">{user.firstName.charAt(0)}</span>}
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border-[1px] border-rso-blue shadow-xl p-2 animate-in fade-in slide-in-from-top-2">
                  {user.role === 'REG_HQ' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block w-full px-3 py-2 text-[10px] font-black uppercase bg-red-50 text-red-600 mb-2 border-l-2 border-red-500">
                      [ Администрирование ]
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-[10px] font-bold uppercase hover:bg-blue-50 text-rso-blue">Профиль</Link>
                  <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="block w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-gray-100 text-gray-400">Выйти</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-[10px] font-black border-[1px] border-rso-blue px-6 py-2.5 hover:bg-rso-blue hover:text-white transition-all uppercase tracking-widest">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
}