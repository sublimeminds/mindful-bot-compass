
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LovableTaggerInitializer } from './utils/lovable-tagger-init';

// Initialize lovable-tagger before any React rendering
LovableTaggerInitializer.ensureInitialized();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Ensure lovable-tagger is ready before rendering
LovableTaggerInitializer.initialize().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('Failed to initialize lovable-tagger, proceeding with fallback:', error);
  // Render anyway with fallback initialization
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
