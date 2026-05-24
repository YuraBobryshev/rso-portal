import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Текущий код пытается заменить localhost, но не IP
axios.interceptors.request.use((config) => {
  // Добавь проверку на свой IP или просто перенаправляй все запросы к API
  if (config.url && config.url.includes('176.98.177.3')) {
    config.url = config.url.replace('http://176.98.177.3:5000', '');
  }
  return config;
});