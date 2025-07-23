
import React from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const Header = () => {
  console.log('🔍 Header: Component rendering - SHOULD BE VISIBLE AT TOP');
  
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <UnifiedNavigation />
    </header>
  );
};

export default Header;
