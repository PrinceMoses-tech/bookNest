import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px -8px rgba(0,0,0,0.15)',
          },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            },
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            },
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </ThemeProvider>
  </StrictMode>,
);
