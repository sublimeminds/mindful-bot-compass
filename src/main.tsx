
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { reactChecker } from '@/utils/reactReadinessChecker'

// Enhanced app startup with centralized React validation
const startApp = () => {
  try {
    console.log('Starting React application...');
    
    // Use centralized React readiness checker
    const isReactReady = reactChecker.checkReactReadiness();
    
    if (!isReactReady) {
      throw new Error('React is not ready for initialization');
    }

    // Ensure DOM is ready
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('Rendering React app...');
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(App)
      )
    );
    
    console.log('React application started successfully');
    
  } catch (error) {
    console.error('Failed to initialize React app:', error);
    
    // Enhanced fallback error display
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          padding: 20px; 
          text-align: center; 
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); 
          color: #991b1b;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        ">
          <div style="
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
          ">
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">TherapySync Initialization Error</h2>
            <p style="margin: 0 0 15px 0; line-height: 1.5;">The application is having trouble starting. This usually resolves with a page refresh.</p>
            <p style="font-size: 14px; margin: 0 0 25px 0; color: #6b7280;">Error: ${error.message}</p>
            <button onclick="window.location.reload()" style="
              padding: 12px 24px;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 500;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              Reload Application
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Ensure React is globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  (window as any).reactChecker = reactChecker;
  console.log('React debugging tools attached to window');
}

console.log('Starting enhanced React application initialization...');

// Handle different DOM ready states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
