import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Стучимся на наш бэкенд
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login'); // После успеха отправляем на вход
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="font-title text-4xl uppercase mb-8 border-b-4 border-black pb-2">Стать бойцом</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="ИМЯ"
              className="w-full border-2 border-black p-3 focus:bg-rso-blue focus:text-white outline-none placeholder:text-gray-400 uppercase font-bold"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="ФАМИЛИЯ"
              className="w-full border-2 border-black p-3 focus:bg-rso-blue focus:text-white outline-none placeholder:text-gray-400 uppercase font-bold"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          <input
            type="email"
            placeholder="EMAIL (ПОЧТА)"
            className="w-full border-2 border-black p-3 focus:bg-rso-blue focus:text-white outline-none placeholder:text-gray-400 uppercase font-bold"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="ПАРОЛЬ"
            className="w-full border-2 border-black p-3 focus:bg-rso-blue focus:text-white outline-none placeholder:text-gray-400 uppercase font-bold"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          {error && <p className="text-red-600 font-bold uppercase text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white p-4 font-title uppercase text-xl hover:bg-rso-blue transition-colors duration-300"
          >
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>
        </form>

        <p className="mt-6 text-sm uppercase font-bold">
          Уже в отряде? <Link to="/login" className="text-rso-blue underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}