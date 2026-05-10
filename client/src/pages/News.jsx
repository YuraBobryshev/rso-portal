// src/pages/News.jsx
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
      const res = await axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    if (image) formData.append('image', image);
    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setNewPost({ title: '', content: '' }); setImage(null); setShowForm(false); fetchPosts();
    } catch (e) { alert("Ошибка"); }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-rso-blue font-sans">
      <Header />
      
      <main className="max-w-[1200px] mx-auto p-6 mt-10">
        <div className="flex justify-between items-center mb-16 border-b-4 border-rso-blue pb-8">
          <h1 className="text-6xl font-black uppercase tracking-tighter">Вестник</h1>
          {(user?.role === 'COMMANDER' || user?.role === 'REG_HQ') && (
            <button onClick={() => setShowForm(!showForm)} className="bg-rso-blue text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all">
              {showForm ? 'Закрыть' : 'Новая запись'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreatePost} className="mb-20 bg-white border border-rso-blue p-8 shadow-xl">
            <input placeholder="Заголовок новости" className="w-full text-2xl font-black uppercase outline-none border-b mb-6 py-2" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required />
            <textarea placeholder="Текст..." rows="5" className="w-full text-base outline-none mb-6 resize-none" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} required />
            <div className="flex justify-between items-center">
              <label className="cursor-pointer text-[10px] font-bold border border-rso-blue px-4 py-2 hover:bg-blue-50 uppercase">
                {image ? image.name : 'Добавить фото'}
                <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} />
              </label>
              <button type="submit" className="bg-rso-blue text-white px-10 py-3 text-[10px] font-black uppercase">Опубликовать</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-rso-blue/10 flex flex-col group hover:border-rso-blue transition-all">
              <div className="aspect-video overflow-hidden">
                {post.imageUrl ? <img src={post.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt=""/> : <div className="w-full h-full bg-blue-50 flex items-center justify-center opacity-20 font-black text-2xl">RSO</div>}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[8px] font-black uppercase opacity-40 mb-2">{new Date(post.createdAt).toLocaleDateString()}</span>
                <h2 className="text-xl font-black uppercase leading-tight mb-4 line-clamp-2">{post.title}</h2>
                <p className="text-xs text-gray-500 line-clamp-3 mb-6 leading-relaxed font-medium">{post.content}</p>
                <button onClick={() => setSelectedPost(post)} className="mt-auto text-[9px] font-black uppercase border-b-2 border-rso-blue self-start pb-0.5 hover:text-black hover:border-black transition-all">Подробнее →</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-rso-blue/20">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-rso-blue">
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 text-2xl font-light hover:rotate-90 transition-transform p-2 bg-white/80 rounded-full z-10">✕</button>
            {selectedPost.imageUrl && <img src={selectedPost.imageUrl} className="w-full h-[400px] object-cover" alt="" />}
            <div className="p-10">
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-8">{selectedPost.title}</h2>
              <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line font-medium">{selectedPost.content}</p>
              <div className="mt-12 pt-6 border-t flex items-center gap-4 opacity-50">
                <span className="text-[10px] font-black uppercase tracking-widest">Автор: {selectedPost.author.firstName}</span>
                <span className="text-[10px] font-mono">{new Date(selectedPost.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}