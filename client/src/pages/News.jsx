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
        headers: { 'Content-Type': 'multipart/form-data' } 
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
    <div className="min-h-screen transition-colors duration-300 pb-24">
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 pt-24">
        
        {/* ШАПКА */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-4 border-b border-rso-gray dark:border-slate-800">
          <div>
            <span className="font-stolzl text-[10px] sm:text-xs font-bold text-[#0804FF] dark:text-blue-400 uppercase tracking-wider block mb-1">События и хроника</span>
            <h1 className="heading-1">Инфополе</h1>
          </div>
          
          {(user?.role === 'COMMANDER' || user?.role === 'REG_HQ') && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className={showForm ? "btn-secondary" : "btn-primary"}
            >
              {showForm ? '✕ Закрыть редактор' : '+ Написать статью'}
            </button>
          )}
        </div>

        {/* ФОРМА СОЗДАНИЯ */}
        {showForm && (
          <form onSubmit={handleCreatePost} className="mb-12 bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="font-stolzl block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Заголовок публикации</label>
              <input 
                placeholder="Введите громкий заголовок..." 
                className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all" 
                value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required 
              />
            </div>
            <div>
              <label className="font-stolzl block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Текст новости</label>
              <textarea 
                placeholder="Напишите, что произошло в движении..." rows="5" 
                className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-[#0804FF] transition-all resize-none" 
                value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} required 
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <label className="cursor-pointer font-stolzl text-[10px] font-bold uppercase tracking-wider border border-rso-gray dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-5 py-3 text-center text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm truncate max-w-xs">
                <span>{image ? image.name : '📎 Прикрепить обложку'}</span>
                <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} accept="image/*" />
              </label>
              <button type="submit" className="btn-primary py-3">
                Опубликовать в ленту
              </button>
            </div>
          </form>
        )}

        {/* СЕТКА НОВОСТЕЙ */}
        {loading ? (
          <div className="py-20 text-center font-stolzl text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse border border-dashed border-rso-gray dark:border-slate-700 rounded-[2rem]">
            Синхронизация ленты...
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] flex flex-col group hover:border-[#0804FF]/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm h-full">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900 relative border-b border-rso-gray dark:border-slate-900">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt=""/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-actay text-2xl text-gray-300 dark:text-gray-600 uppercase">СевРО РСО</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] shadow-sm">
                    <span className="number-display">{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <h2 className="heading-3 group-hover:text-[#0804FF] dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="font-onest text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed mt-auto">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-rso-gray dark:border-slate-700 pt-4 mt-auto">
                    <div className="flex items-center gap-2 font-stolzl text-[10px] font-bold text-gray-400">
                      <span className="text-sm">💬</span> <span className="number-display text-[12px]">{post.comments?.length || 0}</span>
                    </div>
                    <Link to={`/news/${post.id}`} className="font-stolzl text-[10px] font-bold text-[#0804FF] dark:text-blue-400 uppercase tracking-wider border-b border-[#0804FF]/30 hover:text-rso-black dark:hover:text-white hover:border-rso-black dark:hover:border-white transition-colors pb-0.5">
                      Читать статью →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center font-stolzl text-xs font-bold uppercase tracking-wider text-gray-400 border border-dashed border-rso-gray dark:border-slate-700 rounded-[2rem] bg-white dark:bg-slate-800">
            Инфополе пока пустует
          </div>
        )}
      </main>
    </div>
  );
}