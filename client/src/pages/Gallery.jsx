import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Состояния для создания альбома
  const [showForm, setShowForm] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAlbums();
    const token = localStorage.getItem('token');
    if (token) fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchAlbums = async () => {
    try {
      const res = await api.get('/albums');
      setAlbums(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', newAlbum.title);
    formData.append('description', newAlbum.description);
    if (coverFile) formData.append('cover', coverFile);

    try {
      await api.post('/albums', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewAlbum({ title: '', description: '' });
      setCoverFile(null);
      setShowForm(false);
      fetchAlbums();
    } catch (e) {
      alert("Не удалось создать альбом");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCommandStaff = ['COMMANDER', 'COMMISSAR', 'MEDIA', 'REG_HQ'].includes(user?.role);

  return (
    <div className="min-h-screen bg-slate-50 text-black font-sans antialiased pb-24">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        {/* ШАПКА */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block mb-1">Медиацентр</span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">Архив воспоминаний</h1>
          </div>
          
          {isCommandStaff && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm ${
                showForm 
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                  : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              {showForm ? '✕ Отмена' : '+ Создать альбом'}
            </button>
          )}
        </div>

        {/* ФОРМА СОЗДАНИЯ АЛЬБОМА */}
        {showForm && (
          <form onSubmit={handleCreateAlbum} className="mb-12 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Название альбома</label>
              <input 
                placeholder="Например: Целина 2026, Спевка на море..." 
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:border-rso-blue transition-all" 
                value={newAlbum.title} onChange={e => setNewAlbum({...newAlbum, title: e.target.value})} required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Описание (опционально)</label>
              <textarea 
                placeholder="Пару слов о событии..." rows="2" 
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-rso-blue transition-all resize-none" 
                value={newAlbum.description} onChange={e => setNewAlbum({...newAlbum, description: e.target.value})} 
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <label className="cursor-pointer text-[10px] font-black uppercase tracking-wider border border-gray-200 bg-white rounded-xl px-5 py-3.5 text-center text-gray-600 hover:bg-slate-50 transition-all shadow-sm truncate max-w-xs">
                <span>{coverFile ? coverFile.name : '📎 Обложка альбома'}</span>
                <input type="file" className="hidden" onChange={e => setCoverFile(e.target.files[0])} accept="image/*" />
              </label>
              <button type="submit" disabled={isSubmitting} className="bg-rso-blue text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                {isSubmitting ? 'Создание...' : 'Сохранить альбом'}
              </button>
            </div>
          </form>
        )}

        {/* СЕТКА АЛЬБОМОВ */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse border border-dashed border-gray-200 rounded-3xl bg-white">
            Загрузка архива...
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map(album => (
              <Link to={`/gallery/${album.id}`} key={album.id} className="bg-white border border-gray-200 rounded-[2rem] flex flex-col group hover:border-rso-blue/40 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm">
                <div className="aspect-square md:aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  {album.coverUrl ? (
                    <img src={album.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt=""/>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-slate-100/50">
                      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    {album._count?.photos || 0}
                  </div>
                </div>
                
                <div className="p-5 md:p-6 flex flex-col flex-1 border-t border-gray-50">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    {new Date(album.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <h2 className="text-lg font-black uppercase tracking-tight text-black group-hover:text-rso-blue transition-colors duration-200 line-clamp-2">
                    {album.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-xs font-bold uppercase tracking-wider text-gray-400 border border-dashed border-gray-200 rounded-3xl bg-white">
            Медиаархив пока пуст
          </div>
        )}
      </main>
    </div>
  );
}