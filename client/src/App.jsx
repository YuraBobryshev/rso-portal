import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импорты страниц
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import Brigades from './pages/Brigades';
import BrigadeDetail from './pages/BrigadeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/brigades" element={<Brigades />} />
        <Route path="/brigades/:id" element={<BrigadeDetail />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        <Route path="/gallery" element={
          <div className="min-h-screen flex items-center justify-center font-black uppercase text-rso-blue">
            Галерея в разработке
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;