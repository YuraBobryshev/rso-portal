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
  const [user, setUser] = useState(null); // Стейт для текущего пользователя
  
  const token = localStorage.getItem('token');

  // Получаем профиль текущего пользователя
  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (e) { 
      console.error(e); 
    }
  };

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
    if (token) fetchUser(); // Если авторизован - запрашиваем профиль
  }, [id, token]);

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

  // НОВАЯ ФУНКЦИЯ УДАЛЕНИЯ КОММЕНТАРИЯ
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Удалить комментарий?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      // Убираем из UI без лишних запросов
      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      }));
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении комментария");
    }
  };

  // Проверка прав на удаление комментария (автор или комсостав/штаб)
  const canDeleteComment = (comment) => {
    if (!user) return false;
    const isCommandStaff = ['COMMANDER', 'COMMISSAR', 'MEDIA', 'REG_HQ'].includes(user.role);
    return isCommandStaff || user.id === comment.authorId;
  };

  if (loading) return (
    <div className="min-h-screen pt-32 text-center font-stolzl text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
      Загрузка статьи...
    </div>
  );

  if (!post) return (
    <div className="min-h-screen pt-32 text-center font-stolzl text-xs font-bold uppercase tracking-widest text-red-500">
      Новость не найдена
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300 pb-24">
      <Header />
      
      <main className="max-w-[800px] mx-auto px-4 md:px-6 pt-24">
        
        <Link to="/news" className="font-stolzl inline-block mb-8 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-rso-black dark:hover:text-white transition-colors">
          ← Вернуться в инфополе
        </Link>

        {/* СТАТЬЯ */}
        <article className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] overflow-hidden shadow-sm mb-12">
          {post.imageUrl && (
            <div className="w-full aspect-[21/9] bg-slate-100 dark:bg-slate-900 border-b border-rso-gray dark:border-slate-700">
              <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-rso-gray dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 border border-rso-gray dark:border-slate-600 flex items-center justify-center">
                {post.author?.avatarUrl ? (
                  <img src={post.author.avatarUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="font-actay text-lg text-gray-400 uppercase">{post.author?.firstName?.[0]}</span>
                )}
              </div>
              <div>
                <span className="font-stolzl block text-[10px] font-bold text-[#0804FF] dark:text-blue-400 uppercase tracking-wider mb-1">
                  Автор публикации
                </span>
                <span className="font-stolzl text-sm font-bold text-rso-black dark:text-white">
                  {post.author?.firstName} {post.author?.lastName}
                </span>
              </div>
              <div className="ml-auto text-right">
                <span className="number-display block text-xs text-gray-400 tracking-wider">
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>

            <h1 className="heading-1 mb-6 leading-tight">{post.title}</h1>
            <div className="font-onest text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>
        </article>

        {/* СЕКЦИЯ КОММЕНТАРИЕВ */}
        <section className="bg-white dark:bg-slate-800 border border-rso-gray dark:border-slate-700 rounded-[2rem] p-6 md:p-10 shadow-sm">
          <h3 className="heading-3 mb-8 flex items-center gap-3">
            Комментарии <span className="text-gray-400 font-normal text-lg">({post.comments?.length || 0})</span>
          </h3>

          {/* Форма для нового комментария */}
          {token ? (
            <form onSubmit={handlePostComment} className="mb-10">
              <textarea 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Что думаете об этом?..." 
                rows="3"
                className="font-onest w-full bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-2xl px-5 py-4 text-sm text-rso-black dark:text-white outline-none focus:border-[#0804FF] transition-all resize-none mb-4"
                required
              />
              <div className="text-right">
                <button type="submit" disabled={isSubmitting} className="btn-primary py-3 px-8">
                  {isSubmitting ? 'Отправка...' : 'Оставить комментарий'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-2xl text-center">
              <p className="font-stolzl text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Хотите оставить комментарий?</p>
              <Link to="/login" className="text-[#0804FF] dark:text-blue-400 font-bold hover:underline">Войдите в систему</Link>
            </div>
          )}

          {/* Список комментариев */}
          <div className="space-y-6">
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {comment.author?.avatarUrl ? (
                      <img src={comment.author.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="font-actay text-xs text-gray-500 uppercase">{comment.author?.firstName?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-rso-gray dark:border-slate-700 rounded-2xl p-4">
                    
                    {/* ОБНОВЛЕННАЯ ШАПКА КОММЕНТАРИЯ С КНОПКОЙ УДАЛЕНИЯ */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 border-b border-gray-100 dark:border-slate-800 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-stolzl text-xs font-bold text-rso-black dark:text-white">
                          {comment.author?.firstName} {comment.author?.lastName}
                        </span>
                        <span className="number-display text-[11px] text-gray-400 tracking-wider">
                          {new Date(comment.createdAt).toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Кнопка удаления (корзина) */}
                      {canDeleteComment(comment) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-400 hover:text-red-500 transition-colors p-1"
                          title="Удалить"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      )}
                    </div>
                    
                    <p className="font-onest text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mt-2">
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