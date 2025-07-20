
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContainerQuery, useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
  adaptiveLayout?: boolean;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  children,
  className,
  variant = 'default',
  adaptiveLayout = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSmall, isMedium, isLarge } = useContainerQuery(containerRef);
  const { breakpoint, isMobile } = useEnhancedScreenSize();

  const getCardClasses = () => {
    if (!adaptiveLayout) return '';

    const baseClasses = 'transition-all duration-300';
    
    // Container query based responsive classes
    if (isSmall) {
      return cn(baseClasses, 'p-2 text-sm');
    }
    
    if (isMedium) {
      return cn(baseClasses, 'p-4 text-base');
    }
    
    if (isLarge) {
      return cn(baseClasses, 'p-6 text-lg');
    }

    // Fallback to breakpoint-based classes
    return cn(
      baseClasses,
      {
        'p-2 text-fluid-sm': isMobile,
        'p-4 text-fluid-base': breakpoint === 'md' || breakpoint === 'lg',
        'p-6 text-fluid-lg': breakpoint === 'xl' || breakpoint === '2xl',
        'p-8 text-fluid-xl': breakpoint === '3xl' || breakpoint === '4xl'
      }
    );
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'shadow-sm border-therapy-200/50';
      case 'expanded':
        return 'shadow-lg border-therapy-300/50 hover:shadow-therapy-glow';
      default:
        return 'shadow-md border-therapy-200/50 hover:shadow-therapy-subtle';
    }
  };

  return (
    <Card 
      ref={containerRef}
      className={cn(
        'container-query',
        getCardClasses(),
        getVariantClasses(),
        className
      )}
    >
      {title && (
        <CardHeader className={cn(
          adaptiveLayout && isSmall ? 'pb-2' : 'pb-4'
        )}>
          <CardTitle className={cn(
            'text-fluid-lg font-semibold',
            adaptiveLayout && isSmall && 'text-fluid-base'
          )}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(
        adaptiveLayout && isSmall ? 'pt-0' : ''
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default ResponsiveCard;
