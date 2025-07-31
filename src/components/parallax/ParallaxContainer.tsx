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
        scroll-padding-top: 0;
      }
      
      .parallax-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        min-height: 100vh !important;
        position: relative;
        overflow: hidden;
        isolation: isolate;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem 0;
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
      
      /* Enhanced mobile optimization */
      @media (max-width: 768px) {
        .parallax-container {
          scroll-snap-type: y proximity;
        }
        
        .parallax-section {
          scroll-snap-align: start;
          height: auto !important;
          min-height: 100vh !important;
          padding: clamp(1rem, 3vw, 2rem);
        }
        
        .parallax-section > * {
          max-width: 100% !important;
          overflow-wrap: break-word;
        }
      }
      
      /* Small mobile screens */
      @media (max-width: 480px) {
        .parallax-section {
          padding: 0.75rem;
          justify-content: flex-start;
          padding-top: 2rem;
        }
        
        .parallax-section h1,
        .parallax-section h2,
        .parallax-section h3 {
          font-size: clamp(1.5rem, 6vw, 3rem) !important;
          line-height: 1.2 !important;
        }
        
        .parallax-section p {
          font-size: clamp(0.875rem, 4vw, 1.125rem) !important;
          line-height: 1.5 !important;
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
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.1);
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