import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeaderDropdownCardProps {
  width?: 'sm' | 'md' | 'lg';
  title?: string;
  titleIcon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const HeaderDropdownCard: React.FC<HeaderDropdownCardProps> = ({
  width = 'md',
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

  return (
    <div className={`
      absolute top-full ${getPositioning()} w-[680px] p-6 
      bg-white shadow-2xl border border-gray-200 
      rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible 
      transition-all duration-200 ease-out translate-y-2 group-hover:translate-y-0 group-hover:scale-[1.02]
      z-50 ${className}
    `}>
      {children}
    </div>
  );
};

export default HeaderDropdownCard;