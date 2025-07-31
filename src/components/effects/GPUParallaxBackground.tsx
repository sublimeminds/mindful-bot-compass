import React, { useRef, useEffect } from 'react';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';
import { cn } from '@/lib/utils';

interface GPUParallaxBackgroundProps {
  children?: React.ReactNode;
  theme?: 'therapy' | 'calm' | 'harmony' | 'balance' | 'flow';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

export const GPUParallaxBackground: React.FC<GPUParallaxBackgroundProps> = ({
  children,
  theme = 'therapy',
  intensity = 'medium',
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { getLayeredTransform, isParallaxEnabled } = useParallaxScroll({ speed: 0.3 });

  const themeColors = {
    therapy: {
      primary: 'from-therapy-500/20',
      secondary: 'from-therapy-300/10',
      accent: 'from-therapy-600/15'
    },
    calm: {
      primary: 'from-calm-500/20',
      secondary: 'from-calm-300/10',
      accent: 'from-calm-600/15'
    },
    harmony: {
      primary: 'from-harmony-500/20',
      secondary: 'from-harmony-300/10',
      accent: 'from-harmony-600/15'
    },
    balance: {
      primary: 'from-balance-500/20',
      secondary: 'from-balance-300/10',
      accent: 'from-balance-600/15'
    },
    flow: {
      primary: 'from-flow-500/20',
      secondary: 'from-flow-300/10',
      accent: 'from-flow-600/15'
    }
  };

  const intensityMultiplier = {
    subtle: 0.5,
    medium: 1,
    strong: 1.5
  };

  const multiplier = intensityMultiplier[intensity];
  const colors = themeColors[theme];

  useEffect(() => {
    // Force GPU layer creation
    if (containerRef.current) {
      containerRef.current.style.willChange = 'transform';
      containerRef.current.style.backfaceVisibility = 'hidden';
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {/* Layer 1: Background base */}
      <div 
        className="absolute inset-0 bg-white"
        style={{
          transform: isParallaxEnabled ? getLayeredTransform(0.1 * multiplier) : 'none',
          willChange: 'transform'
        }}
      />

      {/* Layer 2: Primary floating shapes */}
      <div 
        className={cn(
          "absolute top-20 left-10 w-96 h-96 bg-gradient-to-br to-transparent rounded-full blur-3xl",
          colors.primary
        )}
        style={{
          transform: isParallaxEnabled ? getLayeredTransform(0.2 * multiplier) : 'none',
          willChange: 'transform',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Layer 3: Secondary shapes */}
      <div 
        className={cn(
          "absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-tl to-transparent rounded-full blur-3xl",
          colors.secondary
        )}
        style={{
          transform: isParallaxEnabled ? getLayeredTransform(0.15 * multiplier) : 'none',
          willChange: 'transform',
          animation: 'pulse 6s ease-in-out infinite reverse'
        }}
      />

      {/* Layer 4: Accent particles */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-br to-transparent rounded-full blur-2xl",
          colors.accent
        )}
        style={{
          transform: isParallaxEnabled 
            ? `${getLayeredTransform(0.25 * multiplier)} translate(-50%, -50%)` 
            : 'translate(-50%, -50%)',
          willChange: 'transform',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />

      {/* Layer 5: Micro particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-16 h-16 bg-gradient-to-br to-transparent rounded-full blur-xl opacity-30",
            colors.primary
          )}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            transform: isParallaxEnabled 
              ? getLayeredTransform((0.1 + i * 0.05) * multiplier) 
              : 'none',
            willChange: 'transform',
            animation: `pulse ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}

      {children}
    </div>
  );
};