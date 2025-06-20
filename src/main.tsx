
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is properly initialized before mounting
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  // Validate React is available
  if (typeof React === 'undefined' || !React.useState) {
    throw new Error('React is not properly initialized');
  }

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Initialize app with error handling
try {
  initializeApp();
} catch (error) {
  console.error('Failed to initialize app:', error);
  
  // Fallback rendering
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #dc2626; margin-bottom: 20px;">Application Error</h1>
          <p style="color: #6b7280; margin-bottom: 20px;">Failed to initialize the application.</p>
          <button 
            onclick="window.location.reload()"
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
