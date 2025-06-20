
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced React validation and initialization
const validateReact = () => {
  // Check if React is available
  if (typeof React === 'undefined' || !React) {
    throw new Error('React is not available');
  }

  // Check React object structure
  if (typeof React !== 'object') {
    throw new Error('React is not properly structured');
  }

  // Check essential React methods
  if (!React.createElement) {
    throw new Error('React.createElement is not available');
  }

  // Check all required hooks including useContext
  const requiredHooks = ['useState', 'useEffect', 'useContext', 'useRef', 'useMemo', 'useCallback'];
  for (const hook of requiredHooks) {
    if (!React[hook]) {
      throw new Error(`React.${hook} is not available`);
    }
  }

  console.log('React validation passed successfully - all hooks available');
  return true;
};

// Validate React immediately
validateReact();

// Ensure React is globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).React = React;
  console.log('React attached to window for debugging');
}

console.log('Starting React application...');

// Initialize app with proper error handling and timing
const initializeApp = () => {
  try {
    // Re-validate React before initialization
    validateReact();
    
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
    
    // Fallback error display
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          padding: 20px; 
          text-align: center; 
          background-color: #fee2e2; 
          color: #991b1b;
          font-family: Arial, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        ">
          <h2>Application Error</h2>
          <p>Failed to initialize the application. Please refresh the page.</p>
          <p style="font-size: 14px; margin-top: 10px;">Error: ${error.message}</p>
          <button onclick="window.location.reload()" style="
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Reload Page</button>
        </div>
      `;
    }
  }
};

// Enhanced initialization timing - wait for both DOM and React
const startApp = () => {
  // Additional delay to ensure all React internals are ready
  setTimeout(() => {
    initializeApp();
  }, 150); // Increased delay to ensure router context is ready
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
