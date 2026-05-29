import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импорты страниц
import Home from './pages/Home';
import News from './pages/News';
import Brigades from './pages/Brigades';
import BrigadeDetail from './pages/BrigadeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import NewsDetail from './pages/NewsDetail';
import Gallery from './pages/Gallery';
import AlbumDetail from './pages/AlbumDetail';
import DocumentsPage from './pages/DocumentsPage'; // Импортируем страницу

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/brigades" element={<Brigades />} />
        <Route path="/brigades/:id" element={<BrigadeDetail />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:id" element={<AlbumDetail />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;