import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      // СОХРАНЯЕМ ТОКЕН (Наш паспорт)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(8,4,255,1)]">
        <h2 className="font-title text-4xl uppercase mb-8 border-b-4 border-black pb-2">Вход в портал</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="EMAIL"
            className="w-full border-2 border-black p-3 focus:bg-black focus:text-white outline-none placeholder:text-gray-400 uppercase font-bold"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="ПАРОЛЬ"
            className="w-full border-2 border-black p-3 focus:bg-black focus:text-white outline-none placeholder:text-gray-400 uppercase font-bold"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          {error && <p className="text-red-600 font-bold uppercase text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-rso-blue text-white p-4 font-title uppercase text-xl hover:bg-black transition-colors duration-300"
          >
            ВОЙТИ
          </button>
        </form>

        <p className="mt-6 text-sm uppercase font-bold">
          Нет аккаунта? <Link to="/register" className="text-rso-blue underline">Регистрация</Link>
        </p>
      </div>
    </div>
  );
}