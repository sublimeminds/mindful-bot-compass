import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ParallaxContainer({ children, className }: ParallaxContainerProps) {
  useEffect(() => {
    // Enhanced scroll behavior for Apple-style parallax
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
        overflow-x: hidden;
        height: 100%;
      }
      
      body {
        scroll-behavior: smooth;
        overflow-x: hidden;
        overscroll-behavior: none;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      
      /* Perfect scroll snapping */
      .parallax-container {
        scroll-snap-type: y mandatory;
        height: 100vh;
        overflow-y: scroll;
        overflow-x: hidden;
        scroll-behavior: smooth;
      }
      
      .parallax-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        height: 100vh !important;
        min-height: 100vh !important;
        max-height: 100vh !important;
        position: relative;
        overflow: hidden;
      }
      
      /* Hardware acceleration for all parallax elements */
      .parallax-element,
      .parallax-background,
      .parallax-content {
        will-change: transform;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Smooth momentum scrolling */
      @supports (-webkit-overflow-scrolling: touch) {
        .parallax-container {
          -webkit-overflow-scrolling: touch;
        }
      }
      
      /* Enhanced wheel scrolling for desktop */
      @media (hover: hover) and (pointer: fine) {
        .parallax-container {
          scroll-behavior: smooth;
        }
      }
      
      /* Mobile optimization */
      @media (max-width: 768px) {
        .parallax-container {
          scroll-snap-type: y proximity;
        }
        
        .parallax-section {
          scroll-snap-align: start;
          height: 100vh !important;
        }
      }
      
      /* Enhanced scrollbar styling */
      .parallax-container::-webkit-scrollbar {
        width: 6px;
      }
      
      .parallax-container::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .parallax-container::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        backdrop-filter: blur(8px);
      }
      
      .parallax-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      /* Handle reduced motion */
      @media (prefers-reduced-motion: reduce) {
        html, body, .parallax-container {
          scroll-behavior: auto;
          scroll-snap-type: none;
        }
        
        .parallax-section {
          scroll-snap-align: none;
          scroll-snap-stop: auto;
        }
        
        .parallax-element,
        .parallax-background,
        .parallax-content {
          will-change: auto;
          transform: none;
        }
      }
      
      /* Optimize text rendering */
      .parallax-section * {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={cn("parallax-container relative", className)}>
      {children}
    </div>
  );
}