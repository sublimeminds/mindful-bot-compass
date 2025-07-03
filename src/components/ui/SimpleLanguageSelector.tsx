import React from 'react';

console.log('[SimpleLanguageSelector] Loading component - React available:', !!React);

// Minimal language selector without hooks or external dependencies
const SimpleLanguageSelector = () => {
  console.log('[SimpleLanguageSelector] Rendering component');
  
  // Simple static display without any hooks or state
  return (
    <div 
      className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '8px 12px',
        fontSize: '14px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}
    >
      <span style={{ fontSize: '16px' }}>🌐</span>
      <span style={{ fontWeight: '500' }}>EN</span>
    </div>
  );
};

export default SimpleLanguageSelector;