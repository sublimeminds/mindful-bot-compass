import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedSectionContainerProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  contentOptimized?: boolean;
}

/**
 * Optimized section container for GPU-powered scrolling
 * Ensures content is always visible during scroll transitions
 */
const OptimizedSectionContainer: React.FC<OptimizedSectionContainerProps> = ({
  children,
  className,
  fullHeight = false,
  contentOptimized = true
}) => {
  const containerClasses = cn(
    "relative overflow-hidden",
    fullHeight ? "min-h-screen" : "min-h-[80vh]",
    contentOptimized && "flex items-center justify-center py-8",
    className
  );

  return (
    <div className={containerClasses}>
      {contentOptimized ? (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default OptimizedSectionContainer;