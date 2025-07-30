import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ParallaxContainer({ children, className }: ParallaxContainerProps) {
  useEffect(() => {
    // Enable smooth scrolling with Apple-style momentum
    document.documentElement.style.scrollBehavior = 'smooth';
    document.documentElement.style.scrollSnapType = 'y mandatory';
    
    // Add hardware acceleration hints
    document.documentElement.style.willChange = 'scroll-position';
    
    // Optimize scroll performance
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
      }
      
      body {
        overflow-x: hidden;
      }
      
      /* Webkit scrollbar styling for desktop */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        backdrop-filter: blur(8px);
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.style.scrollSnapType = 'none';
      document.documentElement.style.willChange = 'auto';
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  );
}