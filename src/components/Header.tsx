
import React from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const Header = () => {
  console.log('🔍 Header: Component rendering successfully');
  
  return (
    <div className="w-full">
      <UnifiedNavigation />
    </div>
  );
};

export default Header;
