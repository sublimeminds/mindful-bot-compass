import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveSectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileLayout?: 'stack' | 'grid' | 'compact';
}

const ResponsiveSectionWrapper: React.FC<ResponsiveSectionWrapperProps> = ({
  children,
  className,
  mobileLayout = 'stack'
}) => {
  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      // Enhanced mobile spacing and layout
      "space-y-6 sm:space-y-8 lg:space-y-12",
      // Mobile-specific layouts
      mobileLayout === 'stack' && "flex flex-col items-center",
      mobileLayout === 'grid' && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
      mobileLayout === 'compact' && "space-y-4 sm:space-y-6",
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveSectionWrapper;