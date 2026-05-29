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
      const res = await api.post('/documents/generate/statement', formData, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const disposition = res.headers['content-disposition'];
      let fileName = 'Заявление_на_вступление.docx';
      if (disposition && disposition.indexOf('filename*=UTF-8') !== -1) {
        fileName = decodeURIComponent(disposition.split("filename*=UTF-8''")[1]);
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      onClose(); // Закрываем модалку при успехе
    } catch (error) {
      console.error(error);
      alert('Ошибка при генерации документа. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 w-full max-w-3xl rounded-[2rem] p-6 md:p-10 relative my-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-rso-black dark:hover:text-white transition-colors"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>

        <h2 className="heading-2 mb-2">Генерация заявления</h2>
        <p className="font-onest text-sm text-gray-500 dark:text-gray-400 mb-8">
          Заполните паспортные данные для автоматического формирования официального бланка в формате DOCX.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Дата рождения</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
            </div>
            <div>
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Гражданство</label>
              <input type="text" name="citizenship" placeholder="РФ" value={formData.citizenship} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
            </div>
            <div className="md:col-span-2">
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Место учебы (Полностью)</label>
              <input type="text" name="studyPlace" placeholder="СевГУ, Институт информационных технологий..." value={formData.studyPlace} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
            </div>
            <div className="md:col-span-2">
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Адрес регистрации</label>
              <input type="text" name="address" placeholder="г. Севастополь, ул. Университетская, д. 33" value={formData.address} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
            </div>
            <div>
              <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Телефон</label>
              <input type="tel" name="phone" placeholder="+7 (999) 000-00-00" value={formData.phone} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
            </div>
          </div>

          <div className="border-t border-rso-gray dark:border-slate-700 pt-6 mt-6">
            <h3 className="font-stolzl text-xs font-bold text-[#0804FF] dark:text-blue-400 uppercase tracking-wider mb-4">Паспортные данные</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Серия</label>
                <input type="text" name="passportSeries" placeholder="1234" value={formData.passportSeries} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
              </div>
              <div className="sm:col-span-2">
                <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Номер</label>
                <input type="text" name="passportNumber" placeholder="567890" value={formData.passportNumber} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
              </div>
              <div>
                <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Код подр.</label>
                <input type="text" name="passportCode" placeholder="123-456" value={formData.passportCode} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
              </div>
              <div className="sm:col-span-2">
                <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Дата выдачи</label>
                <input type="date" name="passportIssueDate" value={formData.passportIssueDate} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
              </div>
              <div className="sm:col-span-3">
                <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Кем выдан</label>
                <input type="text" name="passportIssuedBy" placeholder="УМВД России..." value={formData.passportIssuedBy} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">СНИЛС</label>
                <input type="text" name="snils" placeholder="123-456-789 00" value={formData.snils} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
              </div>
              <div>
                <label className="font-stolzl block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">ИНН</label>
                <input type="text" name="inn" placeholder="123456789012" value={formData.inn} onChange={handleChange} className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" required />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-rso-gray dark:border-slate-700">
            <button type="button" onClick={onClose} disabled={loading} className="btn-secondary w-full sm:flex-1">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="btn-primary w-full sm:flex-[2]">
              {loading ? 'Генерация...' : 'Скачать заявление'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}