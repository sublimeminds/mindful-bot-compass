
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx: Starting React application initialization...');

// Validate React is available
if (!React || typeof React !== 'object') {
  console.error('React is not properly loaded');
  throw new Error('React is not available');
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('main.tsx: Creating React root...');

try {
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('main.tsx: Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('main.tsx: React application initialized successfully');
} catch (error) {
  console.error('Failed to initialize React application:', error);
  
  // Fallback render without StrictMode
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    console.log('main.tsx: React application initialized in fallback mode');
  } catch (fallbackError) {
    console.error('Fallback initialization also failed:', fallbackError);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h1>Application Error</h1>
        <p>Failed to initialize the application. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
