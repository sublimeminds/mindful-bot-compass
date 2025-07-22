
import React from 'react';
import HeaderErrorBoundary from '@/components/HeaderErrorBoundary';
import SimpleHeader from '@/components/SimpleHeader';

const Header = () => {
  console.log('🔍 Header: Component rendering - ENTRY POINT');
  
  return (
    <HeaderErrorBoundary componentName="Header">
      <div className="w-full">
        <SimpleHeader />
      </div>
    </HeaderErrorBoundary>
  );
};

export default Header;
