
import React from 'react';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import TabletOptimizedLayout from '@/components/layout/TabletOptimizedLayout';
import UltraWideLayout from '@/components/layout/UltraWideLayout';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  variant?: 'dashboard' | 'page' | 'auth';
  showMobileNav?: boolean;
  adaptiveNavigation?: boolean;
  maxContentWidth?: 'full' | 'constrained' | 'ultra-wide';
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  variant = 'page',
  showMobileNav = true,
  adaptiveNavigation = true,
  maxContentWidth = 'constrained'
}) => {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    isUltraWide, 
    breakpoint,
    width 
  } = useEnhancedScreenSize();

  // Dashboard variant uses the bulletproof dashboard layout
  if (variant === 'dashboard') {
    return <BulletproofDashboardLayout>{children}</BulletproofDashboardLayout>;
  }

  // Ultra-wide screens (1600px+)
  if (isUltraWide) {
    return (
      <UltraWideLayout maxContentWidth={maxContentWidth}>
        {children}
      </UltraWideLayout>
    );
  }

  // Tablet screens (768px - 1024px)
  if (isTablet) {
    return (
      <TabletOptimizedLayout 
        showSidebar={adaptiveNavigation && variant !== 'auth'}
      >
        {children}
      </TabletOptimizedLayout>
    );
  }

  // Mobile screens (< 768px)
  if (isMobile) {
    return (
      <MobileOptimizedLayout 
        showBottomNav={showMobileNav && variant !== 'auth'}
        showHeader={variant !== 'auth'}
      >
        {children}
      </MobileOptimizedLayout>
    );
  }

  // Desktop fallback with enhanced breakpoint handling
  const getMaxWidth = () => {
    if (width <= 1440) return 'max-w-4xl'; // MacBook Air optimization
    if (breakpoint === 'lg') return 'max-w-5xl';
    if (breakpoint === 'xl') return 'max-w-6xl';
    if (breakpoint === '2xl') return 'max-w-7xl';
    return 'max-w-7xl';
  };

  const getPadding = () => {
    if (width <= 1440) return 'px-4 sm:px-6 lg:px-8'; // MacBook Air
    return 'px-4 sm:px-6 lg:px-8 xl:px-12';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <main className={`
        container mx-auto 
        ${getPadding()} py-4 sm:py-6 lg:py-8
        ${getMaxWidth()}
      `}>
        {children}
      </main>
    </div>
  );
};

export default ResponsiveLayout;
