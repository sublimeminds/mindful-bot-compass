
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple and reliable app startup
const startApp = () => {
  try {
    console.log('Starting React application...');
    
    // Ensure DOM is ready
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('Rendering React app...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('React application started successfully');
    
  } catch (error) {
    console.error('Failed to initialize React app:', error);
    
    // Simple fallback error display
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          padding: 20px; 
          text-align: center; 
          background: #fee2e2; 
          color: #991b1b;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        ">
          <h2>TherapySync Loading Error</h2>
          <p>Please refresh the page to try again.</p>
          <button onclick="window.location.reload()" style="
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
          ">
            Reload Application
          </button>
        </div>
      `;
    }
  }
};

console.log('Starting React application initialization...');

// Handle different DOM ready states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
