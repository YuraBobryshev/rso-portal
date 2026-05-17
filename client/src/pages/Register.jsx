import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const navigate = useNavigate();

  // --- УМНАЯ ВАЛИДАЦИЯ ---
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      if (!formData.firstName.trim()) newErrors.firstName = 'Укажите имя';
      if (!formData.lastName.trim()) newErrors.lastName = 'Укажите фамилию';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = 'Неверный формат почты';
      
      if (formData.password.length < 6) newErrors.password = 'Минимум 6 знаков';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }

      setErrors(newErrors);
      setIsFormValid(Object.keys(newErrors).length === 0 && formData.password !== '');
    };
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  // --- ГЛАВНАЯ ФУНКЦИЯ ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      // 1. Сохраняем полученный токен в память браузера
      localStorage.setItem('token', res.data.token);

      // 2. Кидаем пользователя сразу в личный кабинет
      navigate('/profile');
      
    } catch (err) {
      setServerError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return 0;
    if (len < 6) return 33;
    if (len < 10) return 66;
    return 100;
  };

  return (
    <div className="min-h-screen bg-white text-rso-blue font-sans flex flex-col selection:bg-rso-blue selection:text-white">
      
      {/* ХЕДЕР */}
      <header className="p-6 flex justify-between items-center border-b-[1px] border-rso-blue bg-white sticky top-0 z-50">
         <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
           <img src={logoUrl} alt="РСО" className="h-8 object-contain" />
         </Link>
         <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-all">
           [ Есть аккаунт ]
         </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative bg-gray-50/20">
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#0804FF 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="w-full max-w-lg border-[1px] border-rso-blue bg-white p-10 relative z-10 shadow-2xl">
          <div className="absolute top-2 left-2 text-[8px] font-mono opacity-30 uppercase tracking-tighter italic">Auth_Module_v2</div>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Регистрация</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold">СевРО РСО // Система контроля</p>
          </div>

          {serverError && (
            <div className="mb-6 border-[1px] border-red-500 bg-red-50 p-3 text-red-500 text-[10px] font-bold uppercase text-center animate-pulse">
              Ошибка: {serverError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* ИМЯ / ФАМИЛИЯ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[9px] uppercase font-bold opacity-50 mb-1 tracking-widest">Имя</label>
                <input
                  name="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-transparent border-b-[1px] py-2 outline-none font-bold text-sm transition-all ${
                    touched.firstName && errors.firstName ? 'border-red-500' : 'border-rso-blue/30 focus:border-rso-blue'
                  }`}
                  placeholder="Иван"
                />
                {touched.firstName && errors.firstName && <span className="text-[8px] text-red-500 absolute -bottom-4 left-0 uppercase font-black">{errors.firstName}</span>}
              </div>
              <div className="relative">
                <label className="block text-[9px] uppercase font-bold opacity-50 mb-1 tracking-widest">Фамилия</label>
                <input
                  name="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-transparent border-b-[1px] py-2 outline-none font-bold text-sm transition-all ${
                    touched.lastName && errors.lastName ? 'border-red-500' : 'border-rso-blue/30 focus:border-rso-blue'
                  }`}
                  placeholder="Иванов"
                />
                {touched.lastName && errors.lastName && <span className="text-[8px] text-red-500 absolute -bottom-4 left-0 uppercase font-black">{errors.lastName}</span>}
              </div>
            </div>

            {/* EMAIL */}
            <div className="relative">
              <label className="block text-[9px] uppercase font-bold opacity-50 mb-1 tracking-widest">Электронная почта</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-transparent border-b-[1px] py-2 outline-none font-bold text-sm transition-all ${
                  touched.email && errors.email ? 'border-red-500' : 'border-rso-blue/30 focus:border-rso-blue'
                }`}
                placeholder="example@mail.ru"
              />
              {touched.email && errors.email && <span className="text-[8px] text-red-500 absolute -bottom-4 left-0 uppercase font-black">{errors.email}</span>}
            </div>

            {/* ПАРОЛЬ / ПОДТВЕРЖДЕНИЕ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[9px] uppercase font-bold opacity-50 mb-1 tracking-widest">Пароль</label>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-transparent border-b-[1px] py-2 outline-none font-bold text-sm transition-all ${
                    touched.password && errors.password ? 'border-red-500' : 'border-rso-blue/30 focus:border-rso-blue'
                  }`}
                  placeholder="••••••••"
                />
                {/* Индикатор */}
                <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gray-100">
                    <div 
                      className={`h-full transition-all duration-500 ${getPasswordStrength() < 66 ? 'bg-orange-400' : 'bg-green-500'}`}
                      style={{ width: `${getPasswordStrength()}%` }}
                    ></div>
                </div>
                {touched.password && errors.password && <span className="text-[8px] text-red-500 absolute -bottom-4 left-0 uppercase font-black">{errors.password}</span>}
              </div>
              <div className="relative">
                <label className="block text-[9px] uppercase font-bold opacity-50 mb-1 tracking-widest">Повтор</label>
                <input
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-transparent border-b-[1px] py-2 outline-none font-bold text-sm transition-all ${
                    touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-rso-blue/30 focus:border-rso-blue'
                  }`}
                  placeholder="••••••••"
                />
                {touched.confirmPassword && errors.confirmPassword && <span className="text-[8px] text-red-500 absolute -bottom-4 left-0 uppercase font-black">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* КНОПКА ОТПРАВКИ */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`w-full font-bold uppercase text-xs tracking-[0.3em] py-5 transition-all relative group overflow-hidden shadow-lg ${
                  isFormValid ? 'bg-rso-blue text-white hover:bg-black active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="relative z-10">{isFormValid ? 'Вступить в отряд' : 'Проверьте данные'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="p-6 border-t-[1px] border-rso-blue bg-white text-center">
         <span className="text-[9px] font-bold uppercase opacity-30 tracking-[0.4em]">Sevastopol // 2026</span>
      </footer>
    </div>
  );
}