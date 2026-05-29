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
      console.error("Ошибка при генерации", error);
      alert('Не удалось скачать документ. Обратитесь в штаб.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 pb-24">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        {/* ШАПКА */}
        <div className="mb-10 pb-4 border-b border-rso-gray dark:border-slate-800">
          <span className="font-stolzl text-[10px] sm:text-xs font-bold text-[#0804FF] dark:text-blue-400 uppercase tracking-wider block mb-1">
            Нормативная база
          </span>
          <h1 className="heading-1">
            Официальные документы
          </h1>
          <p className="font-onest text-sm text-gray-500 dark:text-gray-400 font-medium mt-3 max-w-xl">
            Здесь собраны все действующие положения, инструкции и бланки заявлений Севастопольского регионального отделения.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА (Основные положения) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="heading-2">Основные положения</h2>
            
            <div className="flex flex-col gap-4">
              {/* Положение о символике */}
              <div 
                onClick={() => handleDownload('symbolism')}
                className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-8 hover:shadow-md hover:border-[#0804FF]/40 dark:hover:border-blue-400/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5 md:gap-6 mb-4 sm:mb-0">
                  <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                  </div>
                  <div>
                    <h4 className="heading-3 mb-1 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors">Положение о символике</h4>
                    <p className="font-onest text-xs text-gray-500 dark:text-gray-400">Регламент использования логотипов, флагов и фирменного стиля РСО.</p>
                  </div>
                </div>
                <button className="btn-compact shrink-0 w-full sm:w-auto">
                  {downloading === 'symbolism' ? 'Загрузка...' : 'Скачать PDF'}
                </button>
              </div>

              {/* Положение о форменной одежде */}
              <div 
                onClick={() => handleDownload('uniform')}
                className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-8 hover:shadow-md hover:border-[#0804FF]/40 dark:hover:border-blue-400/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5 md:gap-6 mb-4 sm:mb-0">
                  <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                  </div>
                  <div>
                    <h4 className="heading-3 mb-1 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors">Положение о бойцовке</h4>
                    <p className="font-onest text-xs text-gray-500 dark:text-gray-400">Правила расположения нашивок, шевронов и значков на куртке.</p>
                  </div>
                </div>
                <button className="btn-compact shrink-0 w-full sm:w-auto">
                  {downloading === 'uniform' ? 'Загрузка...' : 'Скачать PDF'}
                </button>
              </div>
            </div>
          </div>

{/* ПРАВАЯ КОЛОНКА (Генерация бланков) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="heading-2">Бланки и шаблоны</h2>
            
            <div className="relative bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-lg hover:shadow-blue-900/5 flex flex-col items-start h-full group hover:border-[#0804FF]/40 dark:hover:border-blue-400/40 transition-all duration-300 overflow-hidden z-10">
              
              {/* Декоративный фоновый элемент в углу */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-500/5 rounded-bl-[4rem] -z-10 transition-transform duration-500 group-hover:scale-110"></div>

              {/* Новая современная SVG-иконка вместо эмодзи */}
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 text-[#0804FF] dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:-translate-y-1">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              
              <h3 className="heading-3 mb-3 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors">
                Заявление на вступление
              </h3>
              
              <p className="font-onest text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                Генератор официального бланка для вступления в студенческий отряд. Все твои данные будут автоматически подставлены в документ по ГОСТу.
              </p>
              
              <button 
                onClick={() => setIsStatementModalOpen(true)}
                className="btn-primary w-full text-center py-4 relative overflow-hidden"
              >
                Сгенерировать DOCX
              </button>
            </div>
          </div>

        </div>
      </main>

      <StatementModal 
        isOpen={isStatementModalOpen} 
        onClose={() => setIsStatementModalOpen(false)} 
      />
    </div>
  );
}