import React from 'react';

/**
 * Absolute minimal app fallback - uses only basic HTML/CSS
 * No external dependencies, no complex components
 */
const SafeMinimalApp: React.FC = () => {
  const handleTestClick = () => {
    console.log('Safe minimal app is working');
    alert('App is responsive! The issue was with complex components.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          color: '#1e293b',
          marginBottom: '20px',
          fontSize: '2rem'
        }}>
          🔧 TherapySync Recovery Mode
        </h1>
        
        <p style={{ 
          color: '#64748b',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          The main application encountered an error. This is a safe fallback mode 
          that proves React is working. The issue is likely with complex components 
          or service dependencies.
        </p>

        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={handleTestClick}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            Test Interaction
          </button>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry Main App
          </button>
        </div>

        <div style={{
          backgroundColor: '#f1f5f9',
          padding: '20px',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#475569'
        }}>
          <strong>Debug Info:</strong>
          <ul style={{ textAlign: 'left', marginTop: '10px' }}>
            <li>React: ✅ Working</li>
            <li>JavaScript: ✅ Working</li>
            <li>Browser: ✅ Compatible</li>
            <li>Time: {new Date().toLocaleString()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafeMinimalApp;