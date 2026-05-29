import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { ThemeProvider } from './contexts/ThemeContext.jsx'; // <--- Наш импорт

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="434402129133-t580icfrhgespoptbj65kevs87808a3f.apps.googleusercontent.com">
      {/* ВОТ ОН! Оборачиваем App в провайдер темы */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);