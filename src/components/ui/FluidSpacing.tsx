
import React from 'react';
import { cn } from '@/lib/utils';

interface FluidSpacingProps {
  children: React.ReactNode;
  variant?: 'section' | 'container' | 'content' | 'hero' | 'compact';
  className?: string;
}

const FluidSpacing: React.FC<FluidSpacingProps> = ({
  children,
  variant = 'content',
  className
}) => {
  const getSpacingClasses = () => {
    switch (variant) {
      case 'hero':
        return 'py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 px-4 sm:px-6 lg:px-8';
      case 'section':
        return 'py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8';
      case 'container':
        return 'px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6';
      case 'compact':
        return 'py-2 sm:py-3 md:py-4 px-3 sm:px-4 lg:px-6';
      case 'content':
      default:
        return 'space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8';
    }
  };

  return (
    <div className={cn(getSpacingClasses(), className)}>
      {children}
    </div>
  );
};

export default FluidSpacing;
