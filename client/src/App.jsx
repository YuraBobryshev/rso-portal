import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home'; // ИМПОРТИРУЕМ НАШУ НОВУЮ СТРАНИЦУ

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
        {/* Когда путь совпадает с "/", рендерим компонент <Home /> */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<div className="p-8">Страница входа</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;