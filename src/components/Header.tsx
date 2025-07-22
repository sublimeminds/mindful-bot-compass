
import React from 'react';
import HeaderErrorBoundary from '@/components/HeaderErrorBoundary';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const Header = () => {
  console.log('🔍 Header: Component rendering - ENTRY POINT');
  
  return (
    <HeaderErrorBoundary componentName="Header">
      <div className="w-full">
        <UnifiedNavigation />
      </div>
    </HeaderErrorBoundary>
  );
};

export default Header;
