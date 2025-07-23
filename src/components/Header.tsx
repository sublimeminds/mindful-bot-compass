
import React from 'react';
import DesktopHeaderFull from '@/components/navigation/DesktopHeaderFull';
import MobileHeader from '@/components/navigation/MobileHeader';

const Header = () => {
  console.log('🔍 Header: Rendering responsive header with database-driven navigation');
  
  return (
    <>
      <DesktopHeaderFull />
      <MobileHeader />
    </>
  );
};

export default Header;
