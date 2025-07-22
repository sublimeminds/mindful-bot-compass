
import React from 'react';
import HeaderErrorBoundary from '@/components/HeaderErrorBoundary';
import SimpleHeader from '@/components/SimpleHeader';
// import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const Header = () => {
  console.log('🔍 Header: Component rendering - ENTRY POINT');
  
  return (
    <HeaderErrorBoundary componentName="Header">
      <div className="w-full">
        <SimpleHeader />
        {/* Temporarily using SimpleHeader instead of UnifiedNavigation */}
        {/* <UnifiedNavigation /> */}
      </div>
    </HeaderErrorBoundary>
  );
};

export default Header;
