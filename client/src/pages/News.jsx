import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
    if (token) fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchPosts = async () => {
    try {
      // ИСПРАВЛЕННЫЙ БАГ: путь теперь '/posts' без лишнего '/api'
      const res = await api.get('/posts');
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
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // Токен axiosConfig подставит сам
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
    <div className="min-h-screen bg-slate-50 text-black font-sans antialiased selection:bg-rso-blue selection:text-white pb-24">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        {/* ШАПКА */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold text-rso-blue uppercase tracking-wider block mb-1">События и хроника</span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">Инфополе</h1>
          </div>
          
          {(user?.role === 'COMMANDER' || user?.role === 'REG_HQ') && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm ${
                showForm 
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                  : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              {showForm ? '✕ Закрыть редактор' : '+ Написать статью'}
            </button>
          )}
        </div>

        {/* ФОРМА СОЗДАНИЯ */}
        {showForm && (
          <form onSubmit={handleCreatePost} className="mb-12 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Заголовок публикации</label>
              <input 
                placeholder="Введите громкий заголовок..." 
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:border-rso-blue transition-all" 
                value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Текст новости</label>
              <textarea 
                placeholder="Напишите, что произошло в движении..." rows="5" 
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-rso-blue transition-all resize-none" 
                value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} required 
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <label className="cursor-pointer text-[10px] font-black uppercase tracking-wider border border-gray-200 bg-white rounded-xl px-5 py-3.5 text-center text-gray-600 hover:bg-slate-50 transition-all shadow-sm truncate max-w-xs">
                <span>{image ? image.name : '📎 Прикрепить обложку'}</span>
                <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} accept="image/*" />
              </label>
              <button type="submit" className="bg-rso-blue text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm">
                Опубликовать в ленту
              </button>
            </div>
          </form>
        )}

        {/* СЕТКА НОВОСТЕЙ */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse border border-dashed border-gray-200 rounded-3xl">
            Синхронизация ленты...
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-[2rem] flex flex-col group hover:border-rso-blue/40 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm h-full">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt=""/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-2xl text-gray-300 uppercase">СевРО РСО</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-black shadow-sm">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <h2 className="text-xl font-black uppercase tracking-tight text-black group-hover:text-rso-blue transition-colors duration-200 mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-500 line-clamp-3 mb-6 leading-relaxed font-medium mt-auto">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                      <span className="text-sm">💬</span> {post.comments?.length || 0}
                    </div>
                    {/* ПЕРЕХОД НА SEO СТРАНИЦУ */}
                    <Link to={`/news/${post.id}`} className="text-[10px] font-black text-rso-blue uppercase tracking-wider border-b border-rso-blue/30 hover:text-black hover:border-black transition-colors pb-0.5">
                      Читать статью →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-xs font-bold uppercase tracking-wider text-gray-400 border border-dashed border-gray-200 rounded-3xl bg-white">
            Инфополе пока пустует
          </div>
        )}
      </main>
    </div>
  );
}