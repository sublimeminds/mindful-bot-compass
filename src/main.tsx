
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Simple render - HTML-level proxy handles all lovable-tagger protection
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
