
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizedLayout = ({ children, className }: MobileOptimizedLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50",
      "px-4 sm:px-6 lg:px-8", // Responsive padding
      "pb-safe-area-inset-bottom", // iOS safe area
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default MobileOptimizedLayout;
