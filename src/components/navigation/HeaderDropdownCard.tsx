
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeaderDropdownCardProps {
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'adaptive';
  title?: string;
  titleIcon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const HeaderDropdownCard: React.FC<HeaderDropdownCardProps> = ({
  width = 'adaptive',
  title,
  titleIcon: TitleIcon,
  children,
  className = ''
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

  // Adaptive width based on screen size and content
  const getWidth = () => {
    switch (width) {
      case 'sm':
        return 'w-80';
      case 'md':
        return 'w-96';
      case 'lg':
        return 'w-[32rem]';
      case 'xl':
        return 'w-[40rem]';
      case 'adaptive':
      default:
        return 'w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] max-w-[calc(100vw-2rem)]';
    }
  };

  return (
    <div className={`
      absolute top-full ${getPositioning()} ${getWidth()} p-4 sm:p-6 
      bg-card shadow-2xl border border-border 
      rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible 
      transition-all duration-200 ease-out translate-y-2 group-hover:translate-y-0 group-hover:scale-[1.02]
      z-50 ${className}
    `}>
      {children}
    </div>
  );
};

export default HeaderDropdownCard;
