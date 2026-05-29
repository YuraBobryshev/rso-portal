import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';

export default function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Для Lightbox

  const token = localStorage.getItem('token');

  const fetchAlbum = async () => {
    try {
      const res = await api.get(`/albums/${id}`);
      setAlbum(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length > 10) {
      alert("Максимум 10 фотографий за один раз!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('photos', file);
    });

    try {
      await api.post(`/albums/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAlbum(); // Обновляем альбом после загрузки
    } catch (e) {
      alert("Ошибка при загрузке фотографий");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 pt-32 text-center text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
      Загрузка фотографий...
    </div>
  );

  if (!album) return (
    <div className="min-h-screen bg-slate-50 pt-32 text-center text-xs font-bold uppercase tracking-widest text-red-500">
      Альбом не найден
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-black font-sans antialiased pb-24">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        <Link to="/gallery" className="inline-block mb-6 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-black transition-colors">
          ← Назад в архив
        </Link>

        {/* ШАПКА АЛЬБОМА */}
        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-10 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black mb-2">
              {album.title}
            </h1>
            {album.description && (
              <p className="text-sm text-gray-500 font-medium max-w-2xl">
                {album.description}
              </p>
            )}
            <span className="inline-block mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
              {new Date(album.createdAt).toLocaleDateString('ru-RU')} • Фотографий: {album.photos?.length || 0}
            </span>
          </div>

          {/* Загрузка фото (только для авторизованных) */}
          {token && (
            <label className={`cursor-pointer shrink-0 bg-rso-blue text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <span>{isUploading ? 'Загрузка в S3...' : '+ Добавить фото'}</span>
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* СЕТКА ФОТОГРАФИЙ (МАСОНРИ ИЛИ ГРИД) */}
        {album.photos?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {album.photos.map(photo => (
              <div 
                key={photo.id} 
                onClick={() => setSelectedImage(photo.url)}
                className="group relative aspect-square bg-slate-200 rounded-2xl overflow-hidden cursor-zoom-in border border-gray-200 shadow-sm"
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                {/* Инфо при наведении */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <span className="text-[8px] font-black uppercase text-white tracking-wider">
                    От: {photo.uploader?.firstName} {photo.uploader?.lastName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-xs font-bold uppercase tracking-wider text-gray-400 border border-dashed border-gray-200 rounded-3xl bg-white">
            В этом альбоме пока нет фотографий
          </div>
        )}
      </main>

      {/* LIGHTBOX: ПОЛНОЭКРАННЫЙ ПРОСМОТР */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Fullscreen" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>
      )}
    </div>
  );
}