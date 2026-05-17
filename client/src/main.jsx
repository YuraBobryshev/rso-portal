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

axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes('http://localhost:5000')) {
    config.url = config.url.replace(
      'http://localhost:5000', 
      `http://${window.location.hostname}:5000`
    );
  }
  return config;
});