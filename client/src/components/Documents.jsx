import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Documents() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (docType) => {
    setDownloading(true);
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
      console.error(error);
      alert('Не удалось сгенерировать документ');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-10 shadow-sm">
      <h2 className="heading-2 mb-6">База знаний</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Карточка авто-документа */}
        <div className="border border-rso-gray dark:border-slate-700 rounded-2xl p-6 md:p-8 hover:border-[#0804FF] dark:hover:border-blue-400 transition-colors group flex flex-col justify-between bg-slate-50 dark:bg-slate-900 shadow-sm">
          <div>
            <div className="text-4xl mb-6">📝</div>
            <h3 className="heading-3 mb-2 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors">Заявление в отряд</h3>
            <p className="font-onest text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Официальный бланк вступления. Твои ФИО и название отряда будут заполнены автоматически на основе профиля.
            </p>
          </div>
          
          <button 
            onClick={() => handleDownload('statement')}
            disabled={downloading}
            className="btn-primary w-full mt-8 py-3.5"
          >
            {downloading ? 'Генерация...' : 'Скачать DOCX'}
          </button>
        </div>
      </div>
    </div>
  );
}