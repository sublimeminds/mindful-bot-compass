
import React from 'react';
import ReactDOM from 'react-dom/client';
import MinimalApp from './components/MinimalApp';
import './index.css';

console.log('main.tsx: Starting React application with minimal approach...');

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('main.tsx: Creating React root with minimal dependencies...');
const root = ReactDOM.createRoot(rootElement);

console.log('main.tsx: Rendering MinimalApp component...');
root.render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);

console.log('main.tsx: Minimal React application initialized successfully');
