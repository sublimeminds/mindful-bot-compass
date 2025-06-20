
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

// Add a small delay to ensure all modules are fully loaded
setTimeout(() => {
  try {
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('App successfully rendered');
  } catch (error) {
    console.error('Failed to render app:', error);
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
      ">
        <h2>Application Failed to Load</h2>
        <p>Please refresh the page to try again.</p>
        <p style="font-size: 12px; color: #666;">Error: ${error.message}</p>
      </div>
    `;
  }
}, 50);
