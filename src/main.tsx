
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AvatarManagerProvider } from './components/avatar/OptimizedAvatarManager';

// Add defensive fix for lovable-tagger runtime error
try {
  // Ensure window object has required properties
  if (typeof window !== 'undefined') {
    // @ts-ignore - Defensive fix for lovable-tagger package error
    if (!window.lov) {
      // @ts-ignore
      window.lov = {};
    }
  }
} catch (error) {
  console.warn('Lovable tagger initialization warning:', error);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AvatarManagerProvider maxActiveAvatars={2}>
      <App />
    </AvatarManagerProvider>
  </React.StrictMode>
);
