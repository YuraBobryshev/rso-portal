import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';

// НОВАЯ ФУНКЦИЯ: Нативное сжатие изображений перед отправкой на сервер (без сторонних библиотек)
const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Высчитываем пропорции, если картинка больше maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем обратно в файл (JPEG с качеством 80%)
        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, 'image/jpeg', quality);
      };
    };
  });
};

export default function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);

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

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAlbum();
    if (token) fetchUser();
  }, [id, token]);

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length > 20) {
      alert("Максимум 20 фотографий за один раз!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    
    try {
      // Магия оптимизации: параллельно сжимаем все выбранные фотографии
      const compressedFiles = await Promise.all(
        Array.from(files).map(file => compressImage(file))
      );

      // Добавляем уже сжатые файлы в форму
      compressedFiles.forEach(file => {
        formData.append('photos', file);
      });

      await api.post(`/albums/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAlbum();
    } catch (e) {
      console.error(e);
      alert("Ошибка при обработке или загрузке фотографий");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Точно удалить фотографию?")) return;
    
    try {
      await api.delete(`/photos/${photoId}`);
      setAlbum(prevAlbum => ({
        ...prevAlbum,
        photos: prevAlbum.photos.filter(p => p.id !== photoId)
      }));
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении фотографии");
    }
  };

  const isCommandStaff = ['COMMANDER', 'COMMISSAR', 'MEDIA', 'REG_HQ'].includes(user?.role);

  if (loading) return (
    <div className="min-h-screen pt-32 text-center font-stolzl text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
      Загрузка фотографий...
    </div>
  );

  if (!album) return (
    <div className="min-h-screen pt-32 text-center font-stolzl text-xs font-bold uppercase tracking-widest text-red-500">
      Альбом не найден
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300 pb-24">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        <Link to="/gallery" className="font-stolzl inline-block mb-6 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-rso-black dark:hover:text-white transition-colors">
          ← Назад в архив
        </Link>

        {/* ШАПКА АЛЬБОМА */}
        <div className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-10 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="heading-1 mb-2">
              {album.title}
            </h1>
            {album.description && (
              <p className="font-onest text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
                {album.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-block font-stolzl text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 px-3 py-1.5 rounded-lg">
                <span className="number-display">{new Date(album.createdAt).toLocaleDateString('ru-RU')}</span>
              </span>
              <span className="inline-block font-stolzl text-[10px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 px-3 py-1.5 rounded-lg">
                Фотографий: <span className="number-display">{album.photos?.length || 0}</span>
              </span>
            </div>
          </div>

          {token && (
            <label className={`cursor-pointer shrink-0 btn-primary ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <span>{isUploading ? 'Сжатие и отправка...' : '+ Добавить фото'}</span>
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* СЕТКА ФОТОГРАФИЙ */}
        {album.photos?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {album.photos.map(photo => (
              <div 
                key={photo.id} 
                onClick={() => setSelectedImage(photo.url)}
                className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] overflow-hidden cursor-zoom-in border border-rso-gray dark:border-slate-700 shadow-sm"
              >
                {/* ДОБАВЛЕН атрибут loading="lazy" для плавной прогрузки при скролле */}
                <img 
                  src={photo.url} 
                  alt="" 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                
                {isCommandStaff && (
                  <button 
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                    className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                    title="Удалить фото"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none">
                  <span className="font-stolzl text-[8px] font-bold uppercase text-white tracking-wider">
                    От: {photo.uploader?.firstName} {photo.uploader?.lastName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center font-stolzl text-xs font-bold uppercase tracking-wider text-gray-400 border border-dashed border-rso-gray dark:border-slate-700 rounded-[2rem] bg-white dark:bg-slate-800">
            В этом альбоме пока нет фотографий
          </div>
        )}
      </main>

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