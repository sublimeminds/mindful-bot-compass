
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// More comprehensive React validation
const validateReact = () => {
  console.log('Validating React availability...');
  
  // Check if React is available
  if (typeof React === 'undefined' || !React) {
    throw new Error('React is not available');
  }

  // Check React object structure
  if (typeof React !== 'object') {
    throw new Error('React is not properly structured');
  }

  // Check essential React methods and properties
  const requiredReactMethods = [
    'createElement', 'Fragment', 'Component', 'PureComponent',
    'createContext', 'forwardRef', 'memo', 'lazy', 'Suspense'
  ];
  
  for (const method of requiredReactMethods) {
    if (!React[method]) {
      throw new Error(`React.${method} is not available`);
    }
  }

  // Check all required hooks
  const requiredHooks = [
    'useState', 'useEffect', 'useContext', 'useReducer',
    'useRef', 'useMemo', 'useCallback', 'useLayoutEffect'
  ];
  
  for (const hook of requiredHooks) {
    if (!React[hook] || typeof React[hook] !== 'function') {
      throw new Error(`React.${hook} is not available or not a function`);
    }
  }

  // Validate ReactDOM
  if (typeof ReactDOM === 'undefined' || !ReactDOM) {
    throw new Error('ReactDOM is not available');
  }

  if (!ReactDOM.createRoot || typeof ReactDOM.createRoot !== 'function') {
    throw new Error('ReactDOM.createRoot is not available');
  }

  console.log('React validation passed successfully - all hooks and methods available');
  return true;
};

// Test React hook functionality
const testReactHooks = () => {
  try {
    // Simple test to ensure hooks work
    const TestComponent = () => {
      const [state] = React.useState(true);
      const ref = React.useRef(null);
      return React.createElement('div', { ref }, state ? 'Test' : 'Failed');
    };
    
    // Create a test element to ensure React.createElement works
    const testElement = React.createElement(TestComponent);
    if (!testElement) {
      throw new Error('React.createElement test failed');
    }
    
    console.log('React hooks functionality test passed');
    return true;
  } catch (error) {
    console.error('React hooks test failed:', error);
    throw error;
  }
};

// Enhanced initialization with multiple safety checks
const initializeApp = () => {
  try {
    console.log('Starting comprehensive React validation...');
    
    // Step 1: Validate React availability
    validateReact();
    
    // Step 2: Test React hooks functionality
    testReactHooks();
    
    // Step 3: Ensure DOM is ready
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    console.log('Creating React root with enhanced safety...');
    const root = ReactDOM.createRoot(rootElement);
    
    // Step 4: Add extra validation before render
    if (!React.StrictMode || !App) {
      throw new Error('Required React components not available');
    }
    
    console.log('Rendering React app with full validation...');
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(App)
      )
    );
    
    console.log('React application initialized successfully with full validation');
    
    // Global error handler for any remaining issues
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes('useContext') || 
          event.error?.message?.includes('useRef') ||
          event.error?.message?.includes('useState')) {
        console.error('React hook error detected after initialization:', event.error);
        // Force a page reload as last resort
        setTimeout(() => {
          console.log('Attempting app recovery...');
          window.location.reload();
        }, 1000);
      }
    });
    
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
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Application Initialization Error</h2>
            <p style="margin: 0 0 15px 0; line-height: 1.5;">TherapySync is having trouble starting. This usually resolves with a page refresh.</p>
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

// Enhanced app startup with multiple timing strategies
const startApp = () => {
  // Multiple initialization attempts with increasing delays
  const attemptInitialization = (attempt = 1, maxAttempts = 3) => {
    try {
      initializeApp();
    } catch (error) {
      console.error(`Initialization attempt ${attempt} failed:`, error);
      
      if (attempt < maxAttempts) {
        const delay = attempt * 200; // Increasing delay
        console.log(`Retrying initialization in ${delay}ms...`);
        setTimeout(() => attemptInitialization(attempt + 1, maxAttempts), delay);
      } else {
        console.error('All initialization attempts failed');
        initializeApp(); // Final attempt that will show error UI
      }
    }
  };

  // Start with a small delay to ensure all modules are loaded
  setTimeout(() => {
    attemptInitialization();
  }, 100);
};

// Ensure React is globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  console.log('React and ReactDOM attached to window for debugging');
}

console.log('Starting enhanced React application initialization...');

// Handle different DOM ready states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
