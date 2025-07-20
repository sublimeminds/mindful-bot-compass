
import React from 'react';
import { cn } from '@/lib/utils';

interface FluidSpacingProps {
  children: React.ReactNode;
  variant?: 'section' | 'container' | 'content' | 'hero';
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
        return 'py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8';
      case 'section':
        return 'py-8 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8';
      case 'container':
        return 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8';
      case 'content':
      default:
        return 'space-y-4 sm:space-y-6 lg:space-y-8';
    }
  };

  return (
    <div className={cn(getSpacingClasses(), className)}>
      {children}
    </div>
  );
};

export default FluidSpacing;
