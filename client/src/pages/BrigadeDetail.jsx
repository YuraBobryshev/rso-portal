import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'
import Header from '../components/Header';

export default function BrigadeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brigade, setBrigade] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [appForm, setAppForm] = useState({ phone: '', aboutMe: '', skills: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBrigade = async () => {
      try {
        const res = await api.get(`/brigades/${id}`);       
        setBrigade(res.data);
      } catch (err) {
        console.error("Ошибка загрузки отряда");
        navigate('/brigades');
      } finally {
        setLoading(false);
      }
    };
    fetchBrigade();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault(); 
    if (!token) {
      setMessage({ text: 'Для подачи заявки необходимо авторизоваться в системе', type: 'error' });
      return;
    }
    
    setApplying(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post(`/applications/apply`, 
        { brigadeId: id, ...appForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message || 'Заявка успешно отправлена комсоставу!', type: 'success' });
      setAppForm({ phone: '', aboutMe: '', skills: '' }); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Ошибка при отправке заявки';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-32 text-center font-stolzl text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
      Синхронизация личного дела отряда...
    </div>
  );
  if (!brigade) return null;

  const mainColor = brigade.colorScheme || '#0804FF';

  return (
    <div className="min-h-screen transition-colors duration-300 pb-24">
      <Header />

      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24 space-y-6">
        
        {/* ================= КАРТОЧКА 1: БОЛЬШОЙ ГЕРОЙ ================= */}
        <div 
          className="w-full rounded-[2rem] p-6 sm:p-10 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-sm border border-rso-gray dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          {/* Декоративная линия цвета отряда */}
          <div className="absolute top-0 left-0 bottom-0 w-3" style={{ backgroundColor: mainColor }} />

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left z-10 w-full pl-2">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-rso-gray dark:border-slate-600 shadow-md overflow-hidden shrink-0 flex items-center justify-center p-1">
              {brigade.logoUrl ? (
                <img src={brigade.logoUrl} className="w-full h-full object-cover rounded-full" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-stolzl font-bold text-2xl text-gray-400 rounded-full">
                  {brigade.type}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-lg font-stolzl text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: mainColor }}>
                Линейный отряд // СевРО
              </span>
              <h1 className="heading-1">
                {brigade.name}
              </h1>
            </div>
          </div>

          <div className="hidden lg:block font-stolzl text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 px-4 py-2 rounded-xl shrink-0">
            ID: <span className="font-onest">{id.substring(0, 8)}</span>
          </div>
        </div>

        {/* ================= СЕТКА BENTO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ЛЕВАЯ СЕКЦИЯ */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-10 shadow-sm space-y-5">
              <h2 className="heading-2">
                Летопись и деятельность
              </h2>
              <p className="font-onest text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {brigade.description || "Информация об отряде подготавливается командным составом ЛСО к публикации."}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-10 shadow-sm space-y-6">
              <h2 className="heading-2">
                Личный состав (<span className="number-display">{brigade.users?.length || 0}</span> чел.)
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brigade.users && brigade.users.map(member => {
                  const isLeader = ['COMMANDER', 'COMMISSAR', 'MASTER'].includes(member.role);
                  return (
                    <div key={member.id} className="flex items-center gap-4 p-4 border border-rso-gray dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-600 shrink-0 flex items-center justify-center">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="font-actay text-sm text-gray-500 uppercase">
                            {member.firstName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-stolzl font-bold uppercase text-xs md:text-sm text-rso-black dark:text-white truncate mb-1">
                          {member.lastName} {member.firstName}
                        </div>
                        <span className={`font-stolzl text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg ${
                          isLeader ? 'text-white' : 'bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-600 text-gray-500'
                        }`} style={{ backgroundColor: isLeader ? mainColor : undefined }}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ПРАВАЯ СЕКЦИЯ */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
             
             <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-8 shadow-sm space-y-5">
                <span className="font-stolzl text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-rso-gray dark:border-slate-700 pb-3">
                  Паспортные метрики ЛСО
                </span>
                <div className="flex justify-between items-center font-stolzl text-xs font-bold uppercase">
                  <span className="text-gray-500 dark:text-gray-400">Направление:</span>
                  <span className="px-3 py-1 rounded-lg text-white" style={{ backgroundColor: mainColor }}>
                    {brigade.type}
                  </span>
                </div>
                <div className="flex justify-between items-center font-stolzl text-xs font-bold uppercase border-t border-rso-gray dark:border-slate-700 pt-4">
                  <span className="text-gray-500 dark:text-gray-400">Основан:</span>
                  <span className="number-display text-lg">
                    {new Date(brigade.createdAt).getFullYear()}
                  </span>
                </div>
             </div>

            <div className="bg-slate-50 dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
              <span className="font-stolzl text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-rso-gray dark:border-slate-700 pb-3">
                Анкета кандидата
              </span>

              {message.text && (
                <div className={`p-4 rounded-xl text-xs font-bold text-center font-onest transition-all ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="font-stolzl block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Контактный телефон</label>
                  <input 
                    type="tel" 
                    placeholder="+7 (999) 000-00-00" 
                    className="font-onest w-full bg-white dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#0804FF] transition-all"
                    value={appForm.phone} 
                    onChange={e => setAppForm({...appForm, phone: e.target.value})} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="font-stolzl block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Почему хочешь к нам?</label>
                  <textarea 
                    placeholder="Твоя мотивация..." 
                    rows="3" 
                    className="font-onest w-full bg-white dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#0804FF] transition-all resize-none"
                    value={appForm.aboutMe} 
                    onChange={e => setAppForm({...appForm, aboutMe: e.target.value})} 
                    required 
                  />
                </div>

                <div>
                  <label className="font-stolzl block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Что ты умеешь? (Навыки)</label>
                  <textarea 
                    placeholder="Играю на гитаре, монтирую видео, танцую..." 
                    rows="2" 
                    className="font-onest w-full bg-white dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#0804FF] transition-all resize-none"
                    value={appForm.skills} 
                    onChange={e => setAppForm({...appForm, skills: e.target.value})} 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={applying}
                  className="btn-primary w-full mt-4"
                  style={{ backgroundColor: mainColor }}
                >
                  {applying ? 'Рассмотрение...' : 'Отправить анкету'}
                </button>
              </form>
              
              <p className="font-onest text-[10px] text-center text-gray-500 px-2 leading-relaxed">
                Заполнение анкеты запускает автоматическую верификацию командным составом.
              </p>
            </div>
             
          </div>
        </div>
      </main>
    </div>
  );
}