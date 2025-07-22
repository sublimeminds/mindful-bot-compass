
import React from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

// Main Header component with full navigation
const Header = () => {
  console.log('🔍 Header: Component rendering');
  
  return (
    <div className="w-full">
      <UnifiedNavigation />
    </div>
  );
};

export default Header;
