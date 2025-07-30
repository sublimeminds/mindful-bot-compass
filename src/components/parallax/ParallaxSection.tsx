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
        "relative overflow-hidden scroll-snap-start",
        fullHeight ? "h-screen" : "min-h-screen",
        "flex flex-col justify-center", // Center content vertically
        className
      )}
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always'
      }}
    >
      {/* Parallax Background */}
      {background && isParallaxEnabled && (
        <div 
          className="absolute inset-0 will-change-transform"
          style={{
            transform: isInView ? getTransform(backgroundSpeed) : 'translate3d(0, 0, 0)',
            transition: isInView ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {background}
        </div>
      )}

      {/* Content */}
      <div 
        className={cn(
          "relative z-10 will-change-transform flex-1 flex items-center justify-center",
          isParallaxEnabled && contentSpeed !== 0 && "transform-gpu"
        )}
        style={{
          transform: isParallaxEnabled && isInView && contentSpeed !== 0 
            ? getTransform(contentSpeed) 
            : 'translate3d(0, 0, 0)',
          transition: isInView ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <div className={cn(
          "w-full transition-all duration-700 ease-out",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {children}
        </div>
      </div>
    </section>
  );
}