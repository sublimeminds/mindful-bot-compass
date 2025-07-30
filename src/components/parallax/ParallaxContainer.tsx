import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ParallaxContainer({ children, className }: ParallaxContainerProps) {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add hardware acceleration hints
    document.documentElement.style.willChange = 'scroll-position';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.style.willChange = 'auto';
    };
  }, []);

  return (
    <div className={cn("relative", className)} style={{ scrollSnapType: 'y mandatory' }}>
      {children}
    </div>
  );
}