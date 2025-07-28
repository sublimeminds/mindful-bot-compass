
import React from 'react';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import { cn } from '@/lib/utils';

interface HeaderDropdownCardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const HeaderDropdownCard: React.FC<HeaderDropdownCardProps> = ({ 
  children, 
  className = '',
  compact = false 
}) => {
  const { width, breakpoint, isMobile, isTablet, isDesktop } = useEnhancedScreenSize();
  
  // Calculate responsive width based on viewport
  const getResponsiveWidth = () => {
    if (isMobile) return 'w-[95vw] max-w-[420px]';
    if (isTablet) return 'w-[85vw] max-w-[680px]';
    if (width <= 1024) return 'w-[80vw] max-w-[780px]';
    if (width <= 1280) return 'w-[75vw] max-w-[900px]';
    if (width <= 1440) return 'w-[70vw] max-w-[1000px]';
    return 'w-[65vw] max-w-[1200px]';
  };

  const getResponsivePadding = () => {
    if (compact) return 'p-3';
    if (isMobile || isTablet) return 'p-4';
    return 'p-6';
  };

  return (
    <div className={cn(
      "bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/60 z-50",
      "relative overflow-hidden",
      "max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300",
      getResponsiveWidth(),
      getResponsivePadding(),
      // Enhanced shadows and effects
      "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
      "border-t border-white/20",
      className
    )}>
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HeaderDropdownCard;
