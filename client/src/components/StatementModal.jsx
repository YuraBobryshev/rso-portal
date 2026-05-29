import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function StatementModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    birthDate: '',
    studyPlace: '',
    address: '',
    phone: '',
    citizenship: 'РФ',
    passportSeries: '',
    passportNumber: '',
    passportCode: '',
    passportIssueDate: '',
    passportIssuedBy: '',
    inn: '',
    snils: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // ВАЖНО: Делаем POST запрос и передаем formData в тело
      const res = await api.post('/documents/generate/statement', formData, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const disposition = res.headers['content-disposition'];
      let fileName = 'Заявление.docx';
      if (disposition && disposition.indexOf('filename*=UTF-8') !== -1) {
        fileName = decodeURIComponent(disposition.split("filename*=UTF-8''")[1]);
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      onClose(); // Закрываем модалку после успеха
    } catch (error) {
      console.error(error);
      alert('Ошибка при генерации документа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-gray-100 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative scrollbar-hide">
        
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">Анкета для заявления</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Эти данные не сохраняются на сервере и нужны только для генерации файла.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* БЛОК 1: Общая информация */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-gray-100">
            <h3 className="text-[10px] font-black uppercase text-rso-blue tracking-wider">Общая информация</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Дата рождения</label>
                <input type="text" name="birthDate" placeholder="ДД.ММ.ГГГГ" value={formData.birthDate} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Контактный телефон</label>
                <input type="text" name="phone" placeholder="+7 (999) 000-00-00" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Место учебы/работы</label>
              <input type="text" name="studyPlace" placeholder="СевГУ, ИРИБ, 3 курс..." value={formData.studyPlace} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Адрес регистрации</label>
              <input type="text" name="address" placeholder="г. Севастополь, ул. Университетская..." value={formData.address} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
            </div>
          </div>

          {/* БЛОК 2: Паспорт */}
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-gray-100">
            <h3 className="text-[10px] font-black uppercase text-rso-blue tracking-wider">Паспортные данные</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Серия</label>
                <input type="text" name="passportSeries" placeholder="12 34" value={formData.passportSeries} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Номер</label>
                <input type="text" name="passportNumber" placeholder="567890" value={formData.passportNumber} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Код подр.</label>
                <input type="text" name="passportCode" placeholder="123-456" value={formData.passportCode} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Кем выдан</label>
              <input type="text" name="passportIssuedBy" placeholder="УМВД России по г. Севастополю..." value={formData.passportIssuedBy} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Дата выдачи</label>
                <input type="text" name="passportIssueDate" placeholder="ДД.ММ.ГГГГ" value={formData.passportIssueDate} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Гражданство</label>
                <input type="text" name="citizenship" value={formData.citizenship} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
              </div>
            </div>
          </div>

          {/* БЛОК 3: ИНН и СНИЛС */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">СНИЛС</label>
              <input type="text" name="snils" placeholder="123-456-789 00" value={formData.snils} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">ИНН</label>
              <input type="text" name="inn" placeholder="123456789012" value={formData.inn} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-rso-blue transition-all" required />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-50">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-4 border border-gray-200 text-[10px] font-black uppercase tracking-wider text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 bg-rso-blue text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-md disabled:opacity-50">
              {loading ? 'Генерация...' : 'Скачать заполненный документ ↓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}