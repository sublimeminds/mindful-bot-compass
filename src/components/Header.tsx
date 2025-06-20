
import React from 'react';
import { useSimpleApp } from "@/hooks/useSimpleApp";
import DesktopHeader from "@/components/navigation/DesktopHeader";
import MobileHeader from "@/components/mobile/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  // Safety check for React availability
  if (typeof React === 'undefined' || !React.useState) {
    console.warn('Header: React hooks not available');
    return null;
  }

  try {
    const { user } = useSimpleApp();
    const isMobile = useIsMobile();

    // Use mobile header for small screens
    if (isMobile) {
      return <MobileHeader />;
    }

    // Use desktop header for larger screens
    return <DesktopHeader />;
  } catch (error) {
    console.error('Header: Error rendering component:', error);
    return null;
  }
};

export default Header;
