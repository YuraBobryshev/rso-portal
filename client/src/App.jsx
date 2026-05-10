import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// Эти страницы мы сейчас создадим
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Squads from './pages/Squads';
import News from './pages/News'; // Импорт новой страницы
import About from './pages/About';
import Brigades from './pages/Brigades';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/squads" element={<Squads />} />
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<About />} />
        <Route path="/brigades" element={<Brigades />} />
      </Routes>
    </Router>
  );
}

export default App;