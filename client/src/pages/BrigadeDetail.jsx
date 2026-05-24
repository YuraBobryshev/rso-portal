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

  const API_URL = '/api'
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBrigade = async () => {
      try {
        const res = await api.get(`${API_URL}/api/brigades/${id}`);       
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

  const handleApply = async () => {
    if (!token) {
      setMessage({ text: 'Для подачи заявки необходимо авторизоваться в системе', type: 'error' });
      return;
    }
    
    setApplying(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post(`${API_URL}/api/applications/apply`, 
        { brigadeId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message || 'Заявка успешно отправлена комсоставу!', type: 'success' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Ошибка при отправке заявки';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">
      Синхронизация личного дела отряда...
    </div>
  );
  if (!brigade) return null;

  const mainColor = brigade.colorScheme || '#0052FF';

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      <Header />

      {/* Основной контейнер с адаптивными отступами */}
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-24 pb-24 space-y-6">
        
        {/* ================= КАРТОЧКА 1: БОЛЬШОЙ BENTO-ГЛАВЕНСТВУЮЩИЙ ГЕРОЙ ================= */}
        <div 
          className="w-full rounded-[2rem] p-6 sm:p-10 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-sm border border-gray-100"
          style={{ backgroundColor: `${mainColor}08` }} // Нежный 8% фоновый оттенок фирменного цвета
        >
          {/* Декоративная линия цвета отряда слева */}
          <div className="absolute top-0 left-0 bottom-0 w-2.5" style={{ backgroundColor: mainColor }} />

          <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6 text-center md:text-left">
            {/* Круглая эмблема ЛСО */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-gray-100 shadow-md overflow-hidden shrink-0 flex items-center justify-center p-1">
              {brigade.logoUrl ? (
                <img src={brigade.logoUrl} className="w-full h-full object-cover rounded-full" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-xl text-rso-blue bg-blue-50/50 uppercase rounded-full">
                  {brigade.type}
                </div>
              )}
            </div>
            
            {/* Название и статусная плашка */}
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: mainColor }}>
                Линейный отряд // СевРО
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black leading-tight">
                {brigade.name}
              </h1>
            </div>
          </div>

          {/* Технический реестровый ID */}
          <div className="hidden lg:block font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
            ID: {id.substring(0, 8)}
          </div>
        </div>

        {/* ================= ГЛОБАЛЬНАЯ АСИММЕТРИЧНАЯ СЕТКА BENTO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ЛЕВАЯ СЕКЦИЯ: ИСТОРИЯ И УЧЕТНЫЙ СОСТАВ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Карточка 2: Летопись ЛСО */}
            <div className="border border-gray-100 rounded-[2rem] p-5 sm:p-8 bg-white shadow-sm space-y-4">
              <span className="text-[10px] font-black text-rso-blue uppercase tracking-wider block">
                ✦ Летопись и деятельность команды
              </span>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {brigade.description || "Информация об отряде подготавливается командным составом ЛСО к публикации."}
              </p>
            </div>

            {/* Карточка 3: Реестр действующего состава */}
            <div className="border border-gray-100 rounded-[2rem] p-5 sm:p-8 bg-white shadow-sm space-y-5">
              <span className="text-[10px] font-black text-rso-blue uppercase tracking-wider block">
                ✦ Личный состав отряда ({brigade.users?.length || 0} чел.)
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brigade.users && brigade.users.map(member => {
                  const isLeader = ['COMMANDER', 'COMMISSAR', 'MASTER'].includes(member.role);
                  return (
                    <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-50 rounded-xl bg-gray-50/30 hover:bg-white hover:border-gray-200 transition-all duration-200 group">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-black text-xs text-rso-blue bg-blue-50/40 uppercase">
                            {member.firstName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-bold uppercase text-xs sm:text-sm text-black group-hover:text-rso-blue transition-colors truncate">
                          {member.lastName} {member.firstName}
                        </div>
                        <span className={`inline-block mt-0.5 text-[8px] font-black uppercase tracking-wide px-1.5 py-0.2 rounded ${
                          isLeader ? 'text-white' : 'bg-gray-100 text-gray-400'
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

          {/* ПРАВАЯ СЕКЦИЯ: ИНФО-ПАНЕЛЬ И ДЕЙСТВИЕ */}
          <div className="lg:col-span-4 space-y-6 lg:h-fit lg:sticky lg:top-24">
             
             {/* Карточка 4: Фактура/Метрики */}
             <div className="border border-gray-100 rounded-[2rem] p-6 bg-white shadow-sm space-y-4">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block border-b border-gray-50 pb-2">
                  Паспортные метрики ЛСО
                </span>
                <div className="flex justify-between items-center text-xs font-bold uppercase">
                  <span className="text-gray-400 font-medium">Направление:</span>
                  <span className="px-2 py-0.5 rounded text-white font-black" style={{ backgroundColor: mainColor }}>
                    {brigade.type}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase border-t border-gray-50 pt-3">
                  <span className="text-gray-400 font-medium">Основан:</span>
                  <span className="text-black font-black">
                    {new Date(brigade.createdAt).getFullYear()} год
                  </span>
                </div>
             </div>

             {/* Карточка 5: Интерактивный узел подачи документов */}
             <div className="border border-gray-100 rounded-[2rem] p-6 bg-white shadow-sm space-y-4">
               {message.text && (
                 <div className={`p-3 rounded-xl text-[9px] font-black uppercase tracking-wider border text-center transition-all ${
                   message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                 }`}>
                   {message.type === 'success' ? '✓' : '⚠️'} {message.text}
                 </div>
               )}

               <button 
                 onClick={handleApply}
                 disabled={applying}
                 className="w-full py-4 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 hover:bg-black disabled:opacity-50 shadow-md shadow-blue-500/5"
                 style={{ backgroundColor: mainColor }}
               >
                 {applying ? 'Рассмотрение...' : 'Подать заявку в отряд →'}
               </button>
               
               <p className="text-[9px] text-center font-medium uppercase tracking-wider text-gray-400 px-4 leading-relaxed">
                 Подача документов запускает автоматическую верификацию вашей анкеты командным составом отряда.
               </p>
             </div>
             
          </div>

        </div>
      </main>
    </div>
  );
}