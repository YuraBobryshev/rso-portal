import React, { useState } from 'react';
import api from '../api/axiosConfig';
import Header from '../components/Header';
import StatementModal from '../components/StatementModal';

export default function DocumentsPage() {
  const [downloading, setDownloading] = useState(null); // Храним ID скачиваемого файла (для тех файлов, где модалка не нужна)
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false); // Состояние для модалки заявления

  // Эта функция остается для других документов (например, "Согласие на ОПД"), которым не нужна модалка
  const handleDownload = async (docType) => {
    setDownloading(docType);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/documents/generate/${docType}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Важно для работы с бинарными файлами
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
      
      <main className="max-w-6xl mx-auto px-4 pt-12 space-y-12">
        {/* Заголовок страницы */}
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            База знаний и Документы
          </h1>
          <p className="text-xs md:text-sm text-gray-400 font-medium mt-2 max-w-xl">
            Автоматическая генерация личных заявлений, официальные бланки Севастопольского регионального отделения и нормативная база РСО.
          </p>
        </div>

        {/* СЕКЦИЯ 1: Автоматические документы (Интеграция с бэкендом) */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
            ⚡ Умные авто-шаблоны (Заполняются сами)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Карточка: Заявление в отряд (ОТКРЫВАЕТ МОДАЛКУ) */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:border-rso-blue/20 transition-all group flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-rso-blue rounded-2xl flex items-center justify-center text-xl font-bold">
                  📝
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-black">
                    Заявление на вступление в ЛСО
                  </h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                    Официальный бланк для вступления в организацию. Твои ФИО, паспортные данные (если заполнены) и название отряда впишутся в документ автоматически.
                  </p>
                </div>
              </div>
              
              <button 
                // ИЗМЕНЕНИЕ 1: Теперь кнопка открывает модалку, а не скачивает файл напрямую
                onClick={() => setIsStatementModalOpen(true)}
                className="mt-8 w-full py-4 bg-gray-50 text-rso-blue text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-rso-blue group-hover:text-white transition-all"
              >
                Заполнить анкету и скачать ↓
              </button>
            </div>

            {/* Карточка: Согласие на ОПД (РАБОТАЕТ БЕЗ МОДАЛКИ) */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:border-rso-blue/20 transition-all group flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-xl font-bold">
                  🔒
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-black">
                    Согласие на обработку персональных данных
                  </h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                    Обязательное приложение к основному пакету документов кандидата. Генерируется на основе заполненного профиля в единой системе.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleDownload('consent')}
                disabled={downloading !== null}
                className="mt-8 w-full py-4 bg-gray-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all disabled:opacity-50"
              >
                {downloading === 'consent' ? 'Сборка файла...' : 'Скачать бланк ↓'}
              </button>
            </div>

          </div>
        </section>

        {/* СЕКЦИЯ 2: Официальные положения (Статические важные файлы) */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
            📚 Нормативно-правовая база РСО
          </h2>
          <div className="bg-white border border-gray-100 rounded-[2rem] p-2 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-50">
              
              <a 
                href="https://всо-рсо.рф/upload/iblock/ustav.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <h4 className="text-xs md:text-sm font-black uppercase tracking-tight text-black">Устав МООО «РСО»</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Главный регламентирующий документ движения. Редакция от 2024 года.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-300 group-hover:text-rso-blue transition-colors">Открыть PDF →</span>
              </a>

              <a 
                href="#" 
                className="flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">👕</span>
                  <div>
                    <h4 className="text-xs md:text-sm font-black uppercase tracking-tight text-black">Положение о форменной одежде (Бойцовке)</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Правила расположения значков, нашивок, шевронов и кирпичей.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-300 group-hover:text-rso-blue transition-colors">Открыть PDF →</span>
              </a>

            </div>
          </div>
        </section>
      </main>

      {/* ИЗМЕНЕНИЕ 2: Встроенный вызов компонента модального окна */}
      <StatementModal 
        isOpen={isStatementModalOpen} 
        onClose={() => setIsStatementModalOpen(false)} 
      />
    </div>
  );
}