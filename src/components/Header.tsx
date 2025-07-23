
import React from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const Header = () => {
  console.log('🔍 Header: Component rendering - SHOULD BE VISIBLE AT TOP');
  
  return (
    <header 
      className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" 
      style={{ minHeight: '64px', display: 'flex', alignItems: 'center' }}
    >
      <div className="w-full">
        <UnifiedNavigation />
      </div>
    </header>
  );
};

export default Header;
