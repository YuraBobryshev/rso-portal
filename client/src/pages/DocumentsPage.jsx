import React, { useState } from 'react';
import api from '../api/axiosConfig';
import Header from '../components/Header';
import StatementModal from '../components/StatementModal';

export default function DocumentsPage() {
  const [downloading, setDownloading] = useState(null); 
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false); 

  const handleDownload = async (docType) => {
    setDownloading(docType);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/documents/generate/${docType}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const disposition = res.headers['content-disposition'];
      let fileName = 'Документ.docx';
      if (disposition && disposition.indexOf('filename*=UTF-8') !== -1) {
        fileName = decodeURIComponent(disposition.split("filename*=UTF-8''")[1]);
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при генерации документа:", error);
      alert('Не удалось сгенерировать документ. Убедитесь, что вы авторизованы.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-black font-sans antialiased pb-24 relative">
      <Header />
      
      {/* ИСПРАВЛЕНИЕ: Изменил pt-12 на pt-32 (128px), чтобы контент точно ушел под Header */}
      <main className="max-w-6xl mx-auto px-4 pt-32 space-y-12">
        
        {/* Заголовок страницы */}
        <div className="border-b border-gray-200 pb-8">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            База знаний и Документы
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-3 max-w-2xl leading-relaxed">
            Автоматическая генерация личных заявлений, официальные бланки Севастопольского регионального отделения и нормативно-правовая база РСО.
          </p>
        </div>

        {/* СЕКЦИЯ 1: Автоматические документы */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-rso-blue rounded-full"></div>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Умные авто-шаблоны
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Карточка: Заявление в отряд */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:border-rso-blue/30 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-5">
                {/* СТРОГАЯ ИКОНКА: ДОКУМЕНТ */}
                <div className="w-14 h-14 bg-blue-50/50 text-rso-blue rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-black">
                    Заявление на вступление в ЛСО
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
                    Официальный бланк для вступления в организацию. Ваши ФИО, паспортные данные и название отряда будут интегрированы в документ автоматически.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsStatementModalOpen(true)}
                className="mt-8 w-full py-4 border border-gray-200 bg-white text-rso-blue text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-rso-blue group-hover:text-white group-hover:border-rso-blue transition-all"
              >
                Заполнить анкету и скачать ↓
              </button>
            </div>

            {/* Карточка: Согласие на ОПД */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:border-rso-blue/30 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-5">
                {/* СТРОГАЯ ИКОНКА: ЩИТ БЕЗОПАСНОСТИ */}
                <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-black">
                    Согласие на обработку ПД
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
                    Обязательное приложение к основному пакету документов кандидата. Требуется для внесения в единый реестр МООО «РСО».
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleDownload('consent')}
                disabled={downloading !== null}
                className="mt-8 w-full py-4 border border-gray-200 bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-800 transition-all disabled:opacity-50"
              >
                {downloading === 'consent' ? 'Сборка файла...' : 'Скачать бланк ↓'}
              </button>
            </div>

          </div>
        </section>

        {/* СЕКЦИЯ 2: Официальные положения */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Нормативно-правовая база
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              
              <a 
                href="https://всо-рсо.рф/upload/iblock/ustav.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-5 md:p-8 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-5 md:gap-6">
                  {/* СТРОГАЯ ИКОНКА: КНИГА (УСТАВ) */}
                  <div className="text-gray-400 group-hover:text-rso-blue transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-black group-hover:text-rso-blue transition-colors">Устав МООО «РСО»</h4>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">Главный регламентирующий документ движения. Редакция от 2024 года.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-rso-blue transition-colors hidden sm:block">PDF →</span>
              </a>

              <a 
                href="#" 
                className="flex items-center justify-between p-5 md:p-8 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-5 md:gap-6">
                  {/* СТРОГАЯ ИКОНКА: БЕЙДЖ/НАШИВКА (ФОРМА) */}
                  <div className="text-gray-400 group-hover:text-rso-blue transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-black group-hover:text-rso-blue transition-colors">Положение о форменной одежде</h4>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">Правила расположения значков, нашивок, шевронов и ношения бойцовки.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-rso-blue transition-colors hidden sm:block">PDF →</span>
              </a>

            </div>
          </div>
        </section>
      </main>

      <StatementModal 
        isOpen={isStatementModalOpen} 
        onClose={() => setIsStatementModalOpen(false)} 
      />
    </div>
  );
}