import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Documents() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (docType) => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      // ВАЖНО: responseType: 'blob' нужен, чтобы axios правильно принял бинарный файл, а не текст
      const res = await api.get(`/documents/generate/${docType}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', 
      });

      // Хак для форсированного скачивания файла браузером
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Вытаскиваем красивое имя файла из заголовков бэкенда
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
      console.error("Ошибка скачивания:", error);
      alert('Не удалось сгенерировать документ');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
      <h2 className="text-xl font-black uppercase tracking-tight text-black mb-6">База знаний</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Карточка авто-документа */}
        <div className="border border-gray-100 rounded-2xl p-6 hover:border-rso-blue transition-colors group flex flex-col justify-between bg-slate-50">
          <div>
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-2">Заявление в отряд</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Официальный бланк вступления. Твои ФИО и название отряда будут заполнены автоматически.
            </p>
          </div>
          
          <button 
            onClick={() => handleDownload('statement')}
            disabled={downloading}
            className="mt-6 w-full py-4 bg-white border border-gray-200 text-rso-blue text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-rso-blue group-hover:text-white group-hover:border-rso-blue transition-all disabled:opacity-50"
          >
            {downloading ? 'Генерация...' : 'Скачать авто-шаблон ↓'}
          </button>
        </div>
      </div>
    </div>
  );
}