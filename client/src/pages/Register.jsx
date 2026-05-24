import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'
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

  // Полноценная валидация полей в реальном времени
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Укажите ваше имя';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Укажите вашу фамилию';
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        newErrors.email = 'Укажите электронную почту';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Неверный формат почты';
      }
      
      if (!formData.password) {
        newErrors.password = 'Придумайте пароль';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен быть от 6 символов';
      }
      
      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }

      setErrors(newErrors);
      setIsFormValid(
        Object.keys(newErrors).length === 0 && 
        formData.firstName !== '' && 
        formData.password !== ''
      );
    };
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const res = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      localStorage.setItem('token', res.data.token);
      navigate('/profile');
      
    } catch (err) {
      setServerError(err.response?.data?.message || 'Ошибка регистрации. Данный Email может быть занят.');
    }
  };

  // Мягкий индикатор надежности пароля
  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { width: '0%', color: 'bg-gray-100' };
    if (len < 6) return { width: '33%', color: 'bg-orange-400' };
    if (len < 10) return { width: '66%', color: 'bg-blue-400' };
    return { width: '100%', color: 'bg-green-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50/30 text-black font-sans flex flex-col selection:bg-rso-blue selection:text-white">
      
      {/* ХЕДЕР */}
      <header className="w-full max-w-[1500px] mx-auto h-16 px-6 flex justify-between items-center bg-transparent">
         <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
           <img src={logoUrl} alt="РСО" className="h-8 object-contain" />
         </Link>
         <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-rso-blue transition-colors">
           Уже есть аккаунт? Войти
         </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {/* Карточка регистрации Bento */}
        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-sm relative">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">Регистрация</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Вступление в ряды Студенческих Отрядов Севастополя</p>
          </div>

          {serverError && (
            <div className="mb-6 bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-xs font-semibold text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* ИМЯ И ФАМИЛИЯ В ОДИН РЯД */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Имя</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                    touched.firstName && errors.firstName 
                      ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                      : 'border-gray-200 focus:border-rso-blue focus:bg-white'
                  }`}
                  placeholder="Иван"
                />
                {touched.firstName && errors.firstName && <span className="text-[11px] text-red-500 font-medium mt-1 block pl-1">{errors.firstName}</span>}
              </div>
              
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Фамилия</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                    touched.lastName && errors.lastName 
                      ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                      : 'border-gray-200 focus:border-rso-blue focus:bg-white'
                  }`}
                  placeholder="Иванов"
                />
                {touched.lastName && errors.lastName && <span className="text-[11px] text-red-500 font-medium mt-1 block pl-1">{errors.lastName}</span>}
              </div>
            </div>

            {/* EMAIL */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Электронная почта</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                  touched.email && errors.email 
                    ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                    : 'border-gray-200 focus:border-rso-blue focus:bg-white'
                }`}
                placeholder="example@mail.ru"
              />
              {touched.email && errors.email && <span className="text-[11px] text-red-500 font-medium mt-1 block pl-1">{errors.email}</span>}
            </div>

            {/* ПАРОЛЬ И ПОВТОР */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Пароль</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                    touched.password && errors.password 
                      ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                      : 'border-gray-200 focus:border-rso-blue focus:bg-white'
                  }`}
                  placeholder="••••••••"
                />
                {/* Плавный интегрированный индикатор надежности */}
                <div className="w-full h-[3px] bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getPasswordStrength().color}`}
                      style={{ width: getPasswordStrength().width }}
                    ></div>
                </div>
                {touched.password && errors.password && <span className="text-[11px] text-red-500 font-medium mt-1 block pl-1">{errors.password}</span>}
              </div>
              
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Повторите пароль</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                    touched.confirmPassword && errors.confirmPassword 
                      ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
                      : 'border-gray-200 focus:border-rso-blue focus:bg-white'
                  }`}
                  placeholder="••••••••"
                />
                {touched.confirmPassword && errors.confirmPassword && <span className="text-[11px] text-red-500 font-medium mt-1 block pl-1">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* КНОПКА ОТПРАВКИ */}
            <div className="pt-3">
              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`w-full font-bold uppercase text-xs tracking-wider py-4.5 rounded-xl transition-all shadow-md ${
                  isFormValid 
                    ? 'bg-rso-blue text-white hover:bg-black shadow-blue-500/10 cursor-pointer' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {isFormValid ? 'Создать аккаунт и вступить' : 'Заполните обязательные поля'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 bg-transparent text-center">
         <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Севастополь // 2026</span>
      </footer>
    </div>
  );
}