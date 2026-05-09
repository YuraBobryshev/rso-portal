import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [brigades, setBrigades] = useState([]);
  const [brigadeName, setBrigadeName] = useState('');
  const [loading, setLoading] = useState(true);

  const roles = ['USER', 'CANDIDATE', 'BOETS', 'COMMANDER', 'COMMISSAR', 'MASTER', 'MEDIA', 'REG_HQ'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [usersRes, brigadesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/brigades')
      ]);
      
      setUsers(usersRes.data);
      setBrigades(brigadesRes.data);
    } catch (err) {
      console.error("Ошибка загрузки данных", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/admin/update-role', 
        { userId, newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) { alert('Ошибка смены роли'); }
  };

  const updateBrigade = async (userId, brigadeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/admin/update-user-brigade', 
        { userId, brigadeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) { alert('Ошибка привязки к отряду'); }
  };

  const handleCreateBrigade = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/create-brigade', 
        { name: brigadeName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBrigadeName('');
      fetchData();
      alert('Отряд создан!');
    } catch (err) { alert('Ошибка создания отряда'); }
  };

  if (loading) return <div className="p-20 text-center font-title text-2xl">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-white font-body">
      <Header />
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="font-title text-5xl uppercase mb-10 border-b-8 border-black pb-4">
          Региональный штаб <span className="text-rso-blue text-2xl ml-4">Контроль системы</span>
        </h1>

        {/* Форма создания отряда */}
        <section className="mb-12 p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(8,4,255,1)]">
          <h2 className="font-title text-2xl mb-4 uppercase">Регистрация нового отряда</h2>
          <form onSubmit={handleCreateBrigade} className="flex gap-4">
            <input 
              type="text" 
              placeholder="Название (ССО, СПО, ССервО...)" 
              className="flex-1 border-2 border-black p-2 font-bold outline-none"
              value={brigadeName}
              onChange={(e) => setBrigadeName(e.target.value)}
              required
            />
            <button type="submit" className="bg-black text-white px-8 py-2 font-title uppercase hover:bg-rso-blue transition-colors">Создать</button>
          </form>
        </section>

        {/* Таблица пользователей */}
        <div className="border-4 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white uppercase font-heading text-xs">
              <tr>
                <th className="p-4 border-r border-gray-700">Боец</th>
                <th className="p-4 border-r border-gray-700">Email</th>
                <th className="p-4 border-r border-gray-700 text-center">Роль</th>
                <th className="p-4 text-center">Привязка к отряду</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b-2 border-black hover:bg-gray-50">
                  <td className="p-4 font-bold border-r-2 border-black">{user.firstName} {user.lastName}</td>
                  <td className="p-4 border-r-2 border-black text-sm">{user.email}</td>
                  <td className="p-4 border-r-2 border-black text-center">
                    <select 
                      className="border-2 border-black p-1 font-bold text-[10px] uppercase outline-none"
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                    >
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <select 
                      className="border-2 border-black p-1 font-bold text-[10px] uppercase outline-none w-full bg-yellow-50"
                      value={user.brigadeId || 'none'}
                      onChange={(e) => updateBrigade(user.id, e.target.value)}
                    >
                      <option value="none">-- БЕЗ ОТРЯДА --</option>
                      {brigades.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}