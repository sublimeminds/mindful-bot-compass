
import React from 'react';
import { useScreenSize } from '@/hooks/use-mobile';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  variant?: 'dashboard' | 'page' | 'auth';
  showMobileNav?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  variant = 'page',
  showMobileNav = true 
}) => {
  const { isMobile } = useScreenSize();

  // Dashboard variant uses the bulletproof dashboard layout
  if (variant === 'dashboard') {
    return <BulletproofDashboardLayout>{children}</BulletproofDashboardLayout>;
  }

  // Mobile layout for other variants
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

  // Desktop fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default ResponsiveLayout;
