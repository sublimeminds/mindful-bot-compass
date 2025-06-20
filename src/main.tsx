
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

  // Check all required hooks
  const requiredHooks = ['useState', 'useEffect', 'useContext', 'useRef', 'useMemo', 'useCallback'];
  for (const hook of requiredHooks) {
    if (!React[hook]) {
      throw new Error(`React.${hook} is not available`);
    }
  }

  console.log('React validation passed successfully');
  return true;
};

// Validate React immediately
validateReact();

// Ensure React is globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

console.log('Starting React application...');

// Initialize app with proper error handling
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = ReactDOM.createRoot(rootElement);
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
        ">
          <h2>Application Error</h2>
          <p>Failed to initialize the application. Please refresh the page.</p>
          <p style="font-size: 14px; margin-top: 10px;">Error: ${error.message}</p>
        </div>
      `;
    }
  }
};

// Use a small delay to ensure DOM is ready and React is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 100);
  });
} else {
  setTimeout(initializeApp, 100);
}
