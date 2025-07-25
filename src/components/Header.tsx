
import React from 'react';
import DesktopHeaderFull from '@/components/navigation/DesktopHeaderFull';
import TabletHeader from '@/components/navigation/TabletHeader';
import MobileHeader from '@/components/navigation/MobileHeader';

const Header = () => {
  console.log('🔍 Header: Rendering responsive header with database-driven navigation');
  
  return (
    <div className="relative z-40">
      <DesktopHeaderFull />
      <TabletHeader />
      <MobileHeader />
    </div>
  );
};

export default Header;
