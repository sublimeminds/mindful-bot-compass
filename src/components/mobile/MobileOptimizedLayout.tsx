
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import UnifiedMobileHeader from './UnifiedMobileHeader';
import EnhancedMobileMenu from './EnhancedMobileMenu';
import SmartBottomNavigation from './SmartBottomNavigation';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBottomNav?: boolean;
  showHeader?: boolean;
  adaptivePadding?: boolean;
}

const MobileOptimizedLayout = ({ 
  children, 
  className,
  showBottomNav = true,
  showHeader = true,
  adaptivePadding = true
}: MobileOptimizedLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { breakpoint, isXs, isSm } = useEnhancedScreenSize();

  const getPaddingClasses = () => {
    if (!adaptivePadding) return 'px-4 sm:px-6';
    
    return cn({
      'px-2': isXs,
      'px-4': isSm,
      'px-6': breakpoint === 'md'
    });
  };

  const getContentSpacing = () => {
    return cn({
      'space-y-2': isXs,
      'space-y-4': isSm,
      'space-y-6': breakpoint === 'md'
    });
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30",
      "flex flex-col",
      className
    )}>
      {/* Mobile Header */}
      {showHeader && (
        <UnifiedMobileHeader 
          onMenuToggle={() => setIsMobileMenuOpen(true)} 
          className={cn(
            'safe-area-pt',
            isXs && 'h-14',
            isSm && 'h-16'
          )}
        />
      )}
      
      {/* Enhanced Mobile Menu */}
      <EnhancedMobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-x-hidden",
        showBottomNav && "pb-20 safe-area-pb", // Account for bottom navigation
        getPaddingClasses(),
        showHeader ? "pt-fluid-sm" : "pt-fluid-md"
      )}>
        <div className={cn(
          "max-w-7xl mx-auto h-full",
          getContentSpacing()
        )}>
          {children}
        </div>
      </main>
      
      {/* Smart Bottom Navigation */}
      {showBottomNav && (
        <SmartBottomNavigation className={cn(
          'safe-area-pb',
          isXs && 'h-14',
          isSm && 'h-16'
        )} />
      )}
    </div>
  );
};

export default MobileOptimizedLayout;
