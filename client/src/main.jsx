import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ДОБАВИЛИ ИМПОРТ
import { ThemeProvider } from './contexts/ThemeContext.jsx' // <--- Импорт

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ОБЕРНУЛИ APP В ПРОВАЙДЕР С ТВОИМ CLIENT_ID */}
    <GoogleOAuthProvider clientId="434402129133-t580icfrhgespoptbj65kevs87808a3f.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);