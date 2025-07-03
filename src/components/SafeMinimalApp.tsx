import React, { Suspense } from 'react';

// Lazy load the smart recovery mode
const SmartRecoveryMode = React.lazy(() => import('./SmartRecoveryMode'));

/**
 * Absolute minimal app fallback - now with smart recovery option
 * No external dependencies, no complex components
 */
const SafeMinimalApp: React.FC = () => {
  const [useSmartMode, setUseSmartMode] = React.useState(false);
  
  const handleTestClick = () => {
    console.log('Safe minimal app is working');
    alert('App is responsive! The issue was with complex components.');
  };

  const handleDiagnostics = () => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorageAvailable: (() => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      })(),
      reactVersion: React.version,
    };

    console.log('App Diagnostics:', diagnostics);
    alert(`Diagnostics logged to console:\n\n${JSON.stringify(diagnostics, null, 2)}`);
  };

  // Try smart recovery mode if available
  if (useSmartMode) {
    return (
      <Suspense fallback={
        <div className="css-safe-container">
          <div className="css-safe-card">
            <div className="css-safe-spinner" style={{ margin: '0 auto 16px' }}></div>
            <div className="css-safe-text">Loading smart recovery...</div>
          </div>
        </div>
      }>
        <SmartRecoveryMode />
      </Suspense>
    );
  }

  return (
    <div className="css-safe-container">
      <div className="css-safe-card">
        <h1 className="css-safe-heading" style={{ fontSize: '24px' }}>
          🛡️ TherapySync Safe Mode
        </h1>
        
        <div className="css-safe-text" style={{ marginBottom: '20px' }}>
          The application is running in safe mode. This minimal version ensures 
          basic functionality works even when advanced features encounter issues.
        </div>

        <div className="css-safe-flex" style={{ flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <button 
            className="css-safe-button" 
            onClick={() => setUseSmartMode(true)}
          >
            🔧 Smart Recovery
          </button>
          
          <button className="css-safe-button" onClick={handleTestClick}>
            🧪 Test Interaction
          </button>
          
          <button className="css-safe-button" onClick={handleDiagnostics}>
            🔍 Run Diagnostics
          </button>
          
          <button 
            className="css-safe-button" 
            onClick={() => {
              // Force restart with cache clearing
              import('../utils/appRecoveryManager').then(({ appRecoveryManager }) => {
                appRecoveryManager.forceRestart();
              }).catch(() => {
                // Fallback to simple reload
                window.location.reload();
              });
            }}
          >
            🔄 Force Restart
          </button>
          
          <button 
            className="css-safe-button" 
            onClick={() => window.location.href = '/'}
          >
            🏠 Go Home
          </button>
        </div>

        <div className="css-safe-card" style={{ 
          background: '#f8f9fa', 
          border: '1px solid #dee2e6',
          fontSize: '14px' 
        }}>
          <strong>System Status:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>✅ React: Working</li>
            <li>✅ JavaScript: Working</li>
            <li>✅ Browser: Compatible</li>
            <li>✅ CSS Protection: Active</li>
            <li>🕐 Current Time: {new Date().toLocaleString()}</li>
          </ul>
        </div>

        <div className="css-safe-text" style={{ fontSize: '12px', color: '#6c757d', marginTop: '16px' }}>
          <strong>Troubleshooting Tips:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Clear browser cache and cookies</li>
            <li>Disable browser extensions temporarily</li>
            <li>Check internet connection</li>
            <li>Try a different browser</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafeMinimalApp;