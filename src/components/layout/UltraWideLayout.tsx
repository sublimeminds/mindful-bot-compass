
import React from 'react';
import { cn } from '@/lib/utils';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';

interface UltraWideLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxContentWidth?: 'full' | 'constrained' | 'ultra-wide';
}

const UltraWideLayout: React.FC<UltraWideLayoutProps> = ({
  children,
  className,
  maxContentWidth = 'constrained'
}) => {
  const { isUltraWide, is4Xl } = useEnhancedScreenSize();

  if (!isUltraWide) {
    return <>{children}</>;
  }

  const getMaxWidth = () => {
    switch (maxContentWidth) {
      case 'full':
        return 'max-w-none';
      case 'ultra-wide':
        return 'max-w-[2400px]';
      case 'constrained':
      default:
        return is4Xl ? 'max-w-7xl' : 'max-w-6xl';
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30",
      className
    )}>
      <div className={cn(
        "mx-auto px-fluid-2xl py-fluid-xl",
        getMaxWidth()
      )}>
        {/* Ultra-wide specific layout with multiple columns */}
        <div className="grid grid-cols-1 3xl:grid-cols-12 4xl:grid-cols-16 gap-fluid-lg">
          <div className="3xl:col-span-10 4xl:col-span-12 3xl:col-start-2 4xl:col-start-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraWideLayout;
