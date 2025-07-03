import React from 'react';

console.log('[MinimalSafeHeader] Loading minimal header - React available:', !!React);

// Minimal header without any external dependencies or complex components
const MinimalSafeHeader = () => {
  console.log('[MinimalSafeHeader] Rendering minimal header');
  
  return (
    <header 
      style={{
        width: '100%',
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: '0',
        zIndex: '50'
      }}
    >
      {/* Logo Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          T
        </div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0'
        }}>
          TherapySync
        </h1>
      </div>

      {/* Right Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Language Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>🌐</span>
          <span>EN</span>
        </div>

        {/* Sign In Button */}
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={() => {
            try {
              window.location.href = '/auth';
            } catch (error) {
              console.log('Navigation not available');
            }
          }}
        >
          Sign In
        </button>
      </div>
    </header>
  );
};

export default MinimalSafeHeader;