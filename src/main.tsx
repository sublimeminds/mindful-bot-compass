
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is available before proceeding
if (typeof React === 'undefined' || !React) {
  console.error('React is not available in main.tsx');
  throw new Error('React framework failed to load');
}

if (!ReactDOM || !ReactDOM.createRoot) {
  console.error('ReactDOM is not available in main.tsx');
  throw new Error('ReactDOM failed to load');
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create a safe error handler
const createErrorDisplay = (error: Error) => {
  rootElement.innerHTML = `
    <div style="
      padding: 20px; 
      text-align: center; 
      color: #dc2626; 
      background-color: #fee2e2; 
      border: 1px solid #fecaca; 
      border-radius: 6px; 
      margin: 20px;
      font-family: system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    ">
      <h2 style="margin-bottom: 16px;">Application Failed to Load</h2>
      <p style="margin-bottom: 12px;">Please refresh the page to try again.</p>
      <p style="font-size: 12px; color: #666; margin-top: 12px;">Error: ${error.message}</p>
    </div>
  `;
};

// Initialize the app with proper error handling
try {
  console.log('main.tsx: Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('main.tsx: Rendering App...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('main.tsx: App successfully rendered');
} catch (error) {
  console.error('main.tsx: Failed to render app:', error);
  createErrorDisplay(error as Error);
}
