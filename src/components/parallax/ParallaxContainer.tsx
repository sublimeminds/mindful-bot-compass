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
    
    // Optimize scroll performance with enhanced CSS
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
        overflow-x: hidden;
      }
      
      body {
        overflow-x: hidden;
        scroll-behavior: smooth;
      }
      
      /* Enhanced scroll snapping */
      section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }
      
      /* Hardware acceleration for smooth animations */
      * {
        -webkit-transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
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
      
      /* Smooth scroll momentum for Apple-like feel */
      @media (prefers-reduced-motion: no-preference) {
        html {
          scroll-behavior: smooth;
        }
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