
import React from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const Header = () => {
  console.log('🔍 Header: Component rendering - SHOULD BE VISIBLE AT TOP');
  
  return (
    <header 
      style={{ 
        width: '100%', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e5e7eb',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ width: '100%' }}>
        <UnifiedNavigation />
      </div>
    </header>
  );
};

export default Header;
