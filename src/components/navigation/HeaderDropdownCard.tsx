
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeaderDropdownCardProps {
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'adaptive';
  title?: string;
  titleIcon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const HeaderDropdownCard: React.FC<HeaderDropdownCardProps> = ({
  width = 'adaptive',
  title,
  titleIcon: TitleIcon,
  children,
  className = '',
  compact = false
}) => {
  // Dynamic positioning based on width prop or className
  const getPositioning = () => {
    if (className?.includes('dropdown-left')) {
      return 'left-0 transform-none';
    }
    if (className?.includes('dropdown-right')) {
      return 'right-0 transform-none';
    }
    return 'left-1/2 transform -translate-x-1/2';
  };

  // Responsive width based on screen size and available space
  const getWidth = () => {
    if (compact) {
      return 'w-64 sm:w-72 md:w-80';
    }
    
    switch (width) {
      case 'sm':
        return 'w-64 sm:w-72';
      case 'md':
        return 'w-72 sm:w-80 md:w-84';
      case 'lg':
        return 'w-80 sm:w-96 md:w-[28rem]';
      case 'xl':
        return 'w-96 sm:w-[28rem] md:w-[32rem]';
      case 'adaptive':
      default:
        // Responsive width that adapts to screen size
        return `
          w-[280px] 
          xs:w-[300px] 
          sm:w-[320px] 
          md:w-[360px] 
          macbook:w-[380px] 
          lg:w-[400px] 
          xl:w-[420px] 
          2xl:w-[440px]
          max-w-[calc(100vw-2rem)]
        `.replace(/\s+/g, ' ').trim();
    }
  };

  return (
    <div className={`
      absolute top-full ${getPositioning()} ${getWidth()} 
      ${compact ? 'p-2 sm:p-3' : 'p-3 sm:p-4 lg:p-5'} 
      bg-card shadow-xl border border-border 
      rounded-lg sm:rounded-xl opacity-0 invisible 
      group-hover:opacity-100 group-hover:visible 
      transition-all duration-200 ease-out 
      translate-y-1 group-hover:translate-y-0 
      group-hover:scale-[1.01]
      z-50 ${className}
    `}>
      {children}
    </div>
  );
};

export default HeaderDropdownCard;
