import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';

interface ParallaxSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  backgroundSpeed?: number;
  contentSpeed?: number;
  background?: React.ReactNode;
  fullHeight?: boolean;
  disabled?: boolean;
}

export default function ParallaxSection({
  children,
  id,
  className,
  backgroundSpeed = -0.3,
  contentSpeed = 0,
  background,
  fullHeight = true, // Changed default to true for scroll snapping
  disabled = false
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const { getTransform, isParallaxEnabled } = useParallaxScroll({ 
    speed: 1, 
    disabled 
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "parallax-section relative overflow-hidden",
        "min-h-screen w-full", 
        "flex flex-col justify-center items-center",
        className
      )}
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        minHeight: '100vh'
      }}
    >
      {/* Parallax Background */}
      {background && (
        <div 
          className="parallax-background absolute inset-0 will-change-transform"
          style={{
            transform: isParallaxEnabled && isInView ? getTransform(backgroundSpeed) : 'translate3d(0, 0, 0)',
            transition: isInView ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {background}
        </div>
      )}
      
      {/* Fallback background for mobile */}
      {background && !isParallaxEnabled && (
        <div className="absolute inset-0">
          {background}
        </div>
      )}

      {/* Content */}
      <div 
        className={cn(
          "parallax-content relative z-10 will-change-transform flex-1 flex items-center justify-center w-full h-full",
          isParallaxEnabled && contentSpeed !== 0 && "transform-gpu"
        )}
        style={{
          transform: isParallaxEnabled && isInView && contentSpeed !== 0 
            ? getTransform(contentSpeed) 
            : 'translate3d(0, 0, 0)',
          transition: isInView ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <div className={cn(
          "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          "flex flex-col justify-center min-h-full py-8",
          "transition-all duration-500 ease-out",
          isInView ? "opacity-100 translate-y-0" : "opacity-60 translate-y-4"
        )}>
          {children}
        </div>
      </div>
    </section>
  );
}