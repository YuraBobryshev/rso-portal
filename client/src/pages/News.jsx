import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
    if (token) fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/auth/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUser(res.data);
    } catch (e) { 
      console.error(e); 
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    if (image) formData.append('image', image);
    
    try {
      await axios.post('/api/posts', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setNewPost({ title: '', content: '' }); 
      setImage(null); 
      setShowForm(false); 
      fetchPosts();
    } catch (e) { 
      alert("Не удалось опубликовать новость"); 
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-rso-blue selection:text-white">
      {/* Единый Хедер */}
      <Header />
      
      {/* pt-24 намертво исключает наложение фиксированного меню */}
      <main className="max-w-[1500px] mx-auto px-6 pt-24 pb-24">
        
        {/* ШАПКА СТРАНИЦЫ И КНОПКА ДОБАВЛЕНИЯ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-4 border-b border-gray-50">
          <div>
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block mb-1">
              События и хроника
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black">
              Новости
            </h1>
          </div>
          
          {(user?.role === 'COMMANDER' || user?.role === 'REG_HQ') && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className={`px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm ${
                showForm 
                  ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                  : 'bg-rso-blue text-white hover:bg-black shadow-blue-500/10'
              }`}
            >
              {showForm ? 'Закрыть форму' : 'Создать новость'}
            </button>
          )}
        </div>

        {/* МЯГКАЯ BENTO ФОРМА СОЗДАНИЯ ЗАПИСИ */}
        {showForm && (
          <form 
            onSubmit={handleCreatePost} 
            className="mb-12 bg-gray-50/70 border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 animate-in fade-in duration-200"
          >
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Заголовок публикации</label>
              <input 
                placeholder="Введите название новости..." 
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue transition-all font-bold uppercase text-black" 
                value={newPost.title} 
                onChange={e => setNewPost({...newPost, title: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Текст новости</label>
              <textarea 
                placeholder="Напишите, что произошло в отряде..." 
                rows="5" 
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rso-blue transition-all resize-none text-gray-700 font-medium leading-relaxed" 
                value={newPost.content} 
                onChange={e => setNewPost({...newPost, content: e.target.value})} 
                required 
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
              <label className="cursor-pointer text-xs font-bold border border-gray-200 bg-white rounded-xl px-5 py-3 text-center text-gray-600 hover:border-rso-blue/30 hover:text-rso-blue transition-all shadow-sm truncate max-w-xs">
                <span>{image ? image.name : '📎 Прикрепить фото'}</span>
                <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} accept="image/*" />
              </label>
              <button type="submit" className="bg-rso-blue text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-md shadow-blue-500/5">
                Опубликовать в ленту
              </button>
            </div>
          </form>
        )}

        {/* НОВОСТНАЯ Bento-СЕТКА КАРТОЧЕК */}
        {loading ? (
          <div className="py-20 text-center text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">
            Синхронизация новостной ленты...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div 
                key={post.id} 
                className="bg-white border border-gray-100 rounded-2xl flex flex-col group hover:border-rso-blue/20 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm"
              >
                {/* Медиа-контейнер со скруглением */}
                <div className="aspect-[16/10] overflow-hidden bg-gray-50 border-b border-gray-50 relative">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" alt=""/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10 font-black text-xl text-rso-blue">СевРО</div>
                  )}
                </div>
                
                {/* Текстовая зона */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <h2 className="text-lg font-black uppercase tracking-tight text-black group-hover:text-rso-blue transition-colors duration-200 mb-2 line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-5 leading-relaxed font-medium">
                    {post.content}
                  </p>
                  <button 
                    onClick={() => setSelectedPost(post)} 
                    className="mt-auto text-[10px] font-bold text-rso-blue uppercase tracking-wider border-b border-rso-blue/30 self-start pb-0.5 hover:text-black hover:border-black transition-colors"
                  >
                    Читать далее →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="py-20 text-center text-xs font-bold uppercase tracking-wider opacity-30">
            Лента новостей пуста
          </div>
        )}
      </main>

      {/* ================= МЯГКОЕ МОДАЛЬНОЕ ОКНО BENTO ДЛЯ ПОЛНОГО ПРОСМОТРА ================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/20 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto relative rounded-2xl shadow-2xl border border-gray-100 flex flex-col">
            
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setSelectedPost(null)} 
              className="absolute top-4 right-4 text-sm font-bold text-gray-400 hover:text-black transition-colors p-2.5 bg-white/90 rounded-full z-10 shadow-sm border border-gray-100"
            >
              ✕
            </button>
            
            {selectedPost.imageUrl && (
              <div className="w-full h-[280px] md:h-[360px] shrink-0">
                <img src={selectedPost.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
            )}
            
            <div className="p-6 md:p-10 overflow-y-auto">
              <span className="text-[10px] font-bold text-rso-blue uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mb-3">
                Официальная публикация
              </span>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black leading-tight mb-6">
                {selectedPost.title}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-600 whitespace-pre-line font-medium">
                {selectedPost.content}
              </p>
              
              {/* Подвал новости */}
              <div className="mt-10 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Автор: {selectedPost.author?.firstName || 'Региональный Штаб'}</span>
                <span>{new Date(selectedPost.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}