
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkReactSafety } from './utils/reactSafetyChecker';

console.log('main.tsx: Starting React application initialization...');

// Comprehensive React validation before proceeding
const performReactValidation = () => {
  console.log('main.tsx: Performing React validation...');
  
  const reactSafety = checkReactSafety();
  
  if (!reactSafety.isReactSafe) {
    console.error('main.tsx: React validation failed:', reactSafety.error);
    throw new Error(`React validation failed: ${reactSafety.error}`);
  }
  
  console.log('main.tsx: React validation successful');
  return true;
};

const initializeApp = async () => {
  try {
    // Validate React is properly loaded
    performReactValidation();
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    console.log('main.tsx: Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('main.tsx: Rendering App component...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('main.tsx: React application initialized successfully');
    
  } catch (error) {
    console.error('main.tsx: Failed to initialize React application:', error);
    
    // Fallback initialization without StrictMode
    try {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(React.createElement(App));
        console.log('main.tsx: React application initialized in fallback mode');
      }
    } catch (fallbackError) {
      console.error('main.tsx: Fallback initialization also failed:', fallbackError);
      
      // Final fallback - show error message
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="padding: 20px; text-align: center; font-family: sans-serif; background-color: #fee2e2; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 500px;">
              <h1 style="color: #dc2626; margin-bottom: 20px;">⚠️ Critical Application Error</h1>
              <p style="color: #666; margin-bottom: 20px;">The React framework failed to initialize properly. This is usually caused by a module loading issue.</p>
              <p style="color: #666; margin-bottom: 20px; font-size: 14px;">Error: ${error.message}</p>
              <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Reload Application
              </button>
            </div>
          </div>
        `;
      }
    }
  }
};

// Initialize with a small delay to ensure all modules are loaded
setTimeout(initializeApp, 10);
