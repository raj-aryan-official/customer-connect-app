import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="top-center" />
      <App />
    </AuthProvider>
  </StrictMode>,
);
