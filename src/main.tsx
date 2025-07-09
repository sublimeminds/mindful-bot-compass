
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AvatarManagerProvider } from './components/avatar/OptimizedAvatarManager';
import { initializeLovableTagger } from './utils/lovableTaggerFix';
import { logLovableTaggerStatus } from './utils/debugLovableTagger';

// Initialize lovable-tagger fix as early as possible
const initSuccess = initializeLovableTagger();
console.log('Lovable-tagger initialization result:', initSuccess);

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => logLovableTaggerStatus(), 500);
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
