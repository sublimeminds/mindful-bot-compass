import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeaderDropdownCardProps {
  width?: 'sm' | 'md' | 'lg';
  title: string;
  titleIcon: LucideIcon;
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
  const widthClasses = {
    sm: 'w-[400px]',
    md: 'w-[480px]', 
    lg: 'w-[520px]'
  };

  return (
    <div className={`
      absolute top-full left-0 ${widthClasses[width]} p-6 
      bg-white/98 backdrop-blur-lg shadow-xl border border-gray-100/50 
      rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible 
      transition-all duration-300 ease-out transform translate-y-1 group-hover:translate-y-0
      z-50 ${className}
    `}>
      <div className="flex items-center mb-5">
        <TitleIcon className="h-5 w-5 mr-3 text-therapy-500" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default HeaderDropdownCard;