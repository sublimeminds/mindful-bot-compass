
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import DesktopHeader from '@/components/navigation/DesktopHeader';
import MobileHeader from '@/components/mobile/MobileHeader';
import LanguageSelector from '@/components/ui/LanguageSelector';

const Header = () => {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
      
      {/* Mobile Header */}
      <div className="block md:hidden">
        <MobileHeader />
      </div>
    </>
  );
};

export default Header;
