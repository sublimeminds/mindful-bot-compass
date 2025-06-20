
import React from 'react';
import DesktopHeader from "@/components/navigation/DesktopHeader";
import MobileHeader from "@/components/mobile/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  // Comprehensive safety check for React availability
  if (typeof React === 'undefined' || React === null || !React.useState) {
    console.warn('Header: React hooks not available');
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold">TherapySync</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  try {
    // Import hook dynamically to avoid issues if context is not available
    const isMobile = useIsMobile();

    // Use mobile header for small screens
    if (isMobile) {
      return <MobileHeader />;
    }

    // Use desktop header for larger screens
    return <DesktopHeader />;
  } catch (error) {
    console.error('Header: Error rendering component:', error);
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold">TherapySync</span>
            </div>
          </div>
        </div>
      </header>
    );
  }
};

export default Header;
