
import React from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const Header = () => {
  console.log('🔍 Header: Component rendering - SHOULD BE VISIBLE');
  
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 min-h-[64px] flex items-center">
      <UnifiedNavigation />
    </header>
  );
};

export default Header;
