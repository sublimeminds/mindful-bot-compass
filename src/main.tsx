
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UnbreakableLovProxy } from './utils/unbreakable-lov-proxy';

// CRITICAL: Ensure unbreakable window.lov proxy is ready BEFORE any React code
UnbreakableLovProxy.ensureUnbreakableLov();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Initialize with bulletproof protection
UnbreakableLovProxy.initialize().then(() => {
  console.log('🛡️ Unbreakable lov proxy ready, rendering app...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('Unbreakable lov proxy initialization failed, but rendering anyway:', error);
  // Always render - the proxy should make this safe
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
