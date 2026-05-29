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
    <div className="min-h-screen pt-32 text-center font-stolzl text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
      Загрузка материалов...
    </div>
  );

  if (!post) return (
    <div className="min-h-screen pt-32 text-center font-stolzl text-xs font-bold uppercase tracking-widest text-red-500">
      Статья не найдена
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300 pb-24">
      <Header />
      
      <main className="max-w-[900px] mx-auto px-4 md:px-6 pt-24">
        
        <Link to="/news" className="font-stolzl inline-block mb-6 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-rso-black dark:hover:text-white transition-colors">
          ← Назад в ленту
        </Link>

        {/* ГЛАВНАЯ КАРТОЧКА НОВОСТИ */}
        <article className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] overflow-hidden shadow-sm mb-8">
          {post.imageUrl && (
            <div className="w-full aspect-video md:aspect-[21/9] bg-slate-100 dark:bg-slate-900 relative">
              <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
            </div>
          )}
          
          <div className="p-6 md:p-10 md:px-14">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="font-stolzl text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg shadow-sm">СевРО РСО</span>
              <span className="number-display text-sm">{new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            
            <h1 className="heading-1 mb-8">
              {post.title}
            </h1>
            
            <div className="font-onest text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-10">
              {post.content}
            </div>

            <div className="flex items-center gap-4 border-t border-rso-gray dark:border-slate-700 pt-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {post.author?.avatarUrl ? (
                  <img src={post.author.avatarUrl} className="w-full h-full object-cover" alt="Автор" />
                ) : (
                  <span className="font-actay text-xs text-gray-500 dark:text-gray-400 uppercase">{post.author?.firstName?.[0] || 'А'}</span>
                )}
              </div>
              <div>
                <span className="font-stolzl block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Автор материала</span>
                <span className="font-stolzl block text-sm font-bold text-rso-black dark:text-white">{post.author?.lastName} {post.author?.firstName}</span>
              </div>
            </div>
          </div>
        </article>

        {/* СЕКЦИЯ КОММЕНТАРИЕВ */}
        <section className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-10 shadow-sm">
          <h3 className="heading-2 mb-6">
            Обсуждение (<span className="number-display text-[clamp(1.3rem,3.5vw,2.5rem)]">{post.comments?.length || 0}</span>)
          </h3>

          {/* Форма отправки коммента */}
          {token ? (
            <form onSubmit={handlePostComment} className="mb-10 flex flex-col sm:flex-row gap-3 items-start">
              <textarea 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Поделитесь своим мнением..."
                className="font-onest w-full sm:flex-1 bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-[#0804FF] transition-all resize-none min-h-[50px]"
                rows="2"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !commentText.trim()}
                className="btn-primary py-3 px-6 shrink-0 w-full sm:w-auto"
              >
                Отправить
              </button>
            </form>
          ) : (
            <div className="mb-10 p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-2xl text-center font-stolzl text-xs font-bold text-[#0804FF] dark:text-blue-400 uppercase tracking-wider">
              Авторизуйтесь, чтобы оставлять комментарии
            </div>
          )}

          {/* Список комментов */}
          <div className="space-y-6">
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 mt-1">
                    {comment.author?.avatarUrl ? (
                      <img src={comment.author.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="font-actay text-xs text-gray-500 uppercase">{comment.author?.firstName?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-2xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                      <span className="font-stolzl text-xs font-bold text-rso-black dark:text-white">{comment.author?.firstName} {comment.author?.lastName}</span>
                      <span className="number-display text-[12px] tracking-wider">
                        {new Date(comment.createdAt).toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-onest text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center font-stolzl text-xs font-bold text-gray-400 uppercase tracking-wider py-4">Будьте первым, кто оставит комментарий</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}