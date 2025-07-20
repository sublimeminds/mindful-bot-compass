
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import UnifiedMobileHeader from './UnifiedMobileHeader';
import EnhancedMobileMenu from './EnhancedMobileMenu';
import SmartBottomNavigation from './SmartBottomNavigation';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBottomNav?: boolean;
  showHeader?: boolean;
}

const MobileOptimizedLayout = ({ 
  children, 
  className,
  showBottomNav = true,
  showHeader = true
}: MobileOptimizedLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30",
      className
    )}>
      {/* Mobile Header */}
      {showHeader && (
        <UnifiedMobileHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />
      )}
      
      {/* Enhanced Mobile Menu */}
      <EnhancedMobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-x-hidden",
        showBottomNav && "pb-20", // Account for bottom navigation
        "px-4 sm:px-6", // Responsive padding
        "pt-4" // Top padding
      )}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Smart Bottom Navigation */}
      {showBottomNav && <SmartBottomNavigation />}
    </div>
  );
};

export default MobileOptimizedLayout;
