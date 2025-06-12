
import React from 'react';
import { DebugLogger } from '@/utils/debugLogger';

interface ReactErrorFallbackProps {
  error?: Error;
  onReload?: () => void;
}

// Pure component that doesn't use any hooks
const ReactErrorFallback: React.FC<ReactErrorFallbackProps> = ({ error, onReload }) => {
  const handleReload = () => {
    DebugLogger.info('ReactErrorFallback: User triggered page reload', {
      component: 'ReactErrorFallback'
    });
    
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  const handleClearCache = () => {
    DebugLogger.info('ReactErrorFallback: User triggered cache clear', {
      component: 'ReactErrorFallback'
    });
    
    // Clear various caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Clear localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reload after clearing
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#fee2e2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <span style={{ color: '#dc2626', fontSize: '24px' }}>⚠️</span>
        </div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          React Application Error
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '1.5rem'
        }}>
          A React initialization error occurred. This is usually caused by a temporary bundling issue.
        </p>
        
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#991b1b',
              fontFamily: 'monospace',
              margin: 0
            }}>
              {error.message}
            </p>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={handleReload}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#3b82f6';
            }}
          >
            Reload Application
          </button>
          
          <button
            onClick={handleClearCache}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#4b5563';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#6b7280';
            }}
          >
            Clear Cache & Reload
          </button>
        </div>
        
        <p style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          marginTop: '1rem'
        }}>
          If this error persists, please contact support or try accessing the application in an incognito window.
        </p>
      </div>
    </div>
  );
};

export default ReactErrorFallback;
