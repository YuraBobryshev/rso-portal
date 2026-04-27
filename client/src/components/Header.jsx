import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-white text-black py-4 px-8 flex justify-between items-center border-b border-rso-gray">
      {/* Логотип (пока текстом, потом заменим на картинку) */}
      <div className="font-title text-xl font-bold flex items-center gap-2">
        <span className="text-3xl">⚓</span> 
        РСО СЕВАСТОПОЛЬ
      </div>

      {/* Навигация (Ссылки) */}
      <nav className="hidden md:flex gap-6 font-heading text-sm uppercase tracking-wider">
        <Link to="/" className="hover:text-rso-blue transition-colors">Главная</Link>
        <Link to="/about" className="hover:text-rso-blue transition-colors">О нас</Link>
        <Link to="/gallery" className="hover:text-rso-blue transition-colors">Галерея</Link>
        <Link to="/news" className="hover:text-rso-blue transition-colors">Новости</Link>
        <Link to="/squads" className="hover:text-rso-blue transition-colors">Отряды</Link>
      </nav>

      {/* Кнопка Войти */}
      <div>
        <Link 
          to="/login" 
          className="border border-black rounded-full px-6 py-2 font-heading text-sm hover:bg-black hover:text-white transition-colors"
        >
          Войти
        </Link>
      </div>
    </header>
  );
}