import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { HelmetProvider } from 'react-helmet-async'; // <-- ДОБАВЛЕНО

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider> {/* <-- ДОБАВЛЕНО */}
      <GoogleOAuthProvider clientId="434402129133-t580icfrhgespoptbj65kevs87808a3f.apps.googleusercontent.com">
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);