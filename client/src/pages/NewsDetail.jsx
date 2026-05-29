import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';

export default function NewsDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const token = localStorage.getItem('token');

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !token) return;
    
    setIsSubmitting(true);
    try {
      await api.post(`/posts/${id}/comment`, { content: commentText });
      setCommentText('');
      fetchPost(); // Обновляем данные, чтобы увидеть новый коммент
    } catch (e) {
      alert("Не удалось отправить комментарий");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 pt-32 text-center text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
      Загрузка материалов...
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-slate-50 pt-32 text-center text-xs font-bold uppercase tracking-widest text-red-500">
      Статья не найдена
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-black font-sans antialiased pb-24">
      <Header />
      
      <main className="max-w-[900px] mx-auto px-4 md:px-6 pt-24">
        
        <Link to="/news" className="inline-block mb-6 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-black transition-colors">
          ← Назад в ленту
        </Link>

        {/* ГЛАВНАЯ КАРТОЧКА НОВОСТИ */}
        <article className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm mb-8">
          {post.imageUrl && (
            <div className="w-full aspect-video md:aspect-[21/9] bg-slate-100 relative">
              <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
            </div>
          )}
          
          <div className="p-6 md:p-10 md:px-14">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-wider text-gray-400">
              <span className="bg-slate-100 text-gray-600 px-3 py-1 rounded-lg shadow-sm">СевРО РСО</span>
              <span>{new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="prose prose-sm md:prose-base max-w-none text-gray-700 font-medium leading-relaxed whitespace-pre-line mb-10">
              {post.content}
            </div>

            <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {post.author?.avatarUrl ? (
                  <img src={post.author.avatarUrl} className="w-full h-full object-cover" alt="Автор" />
                ) : (
                  <span className="text-xs font-black text-gray-500 uppercase">{post.author?.firstName?.[0] || 'А'}</span>
                )}
              </div>
              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Автор материала</span>
                <span className="block text-sm font-bold text-black">{post.author?.lastName} {post.author?.firstName}</span>
              </div>
            </div>
          </div>
        </article>

        {/* СЕКЦИЯ КОММЕНТАРИЕВ */}
        <section className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-10 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight text-black mb-6">
            Обсуждение ({post.comments?.length || 0})
          </h3>

          {/* Форма отправки коммента */}
          {token ? (
            <form onSubmit={handlePostComment} className="mb-10 flex gap-3 items-start">
              <textarea 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Поделитесь своим мнением..."
                className="flex-1 bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-rso-blue transition-all resize-none min-h-[50px]"
                rows="2"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !commentText.trim()}
                className="bg-gray-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50 shrink-0"
              >
                Отправить
              </button>
            </form>
          ) : (
            <div className="mb-10 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center text-xs font-bold text-blue-800 uppercase tracking-wider">
              Авторизуйтесь, чтобы оставлять комментарии
            </div>
          )}

          {/* Список комментов */}
          <div className="space-y-6">
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 mt-1">
                    {comment.author?.avatarUrl ? (
                      <img src={comment.author.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-xs font-black text-gray-500 uppercase">{comment.author?.firstName?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 bg-slate-50 border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-black">{comment.author?.firstName} {comment.author?.lastName}</span>
                      <span className="text-[9px] font-bold text-gray-400 tracking-wider">
                        {new Date(comment.createdAt).toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Будьте первым, кто оставит комментарий</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}