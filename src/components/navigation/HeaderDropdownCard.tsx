
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
  // Enhanced width system with better 2-column support
  const getWidth = () => {
    switch (width) {
      case 'sm':
        return 'w-80';
      case 'md':
        return 'w-96';
      case 'lg':
        return 'w-[32rem]';
      case 'xl':
        return 'w-[48rem]';
      case 'adaptive':
      default:
        return 'w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[48rem] max-w-[calc(100vw-2rem)]';
    }
  };

  return (
    <div className={`
      ${getWidth()} p-6 
      bg-white/98 backdrop-blur-lg shadow-2xl border border-gray-200 
      rounded-xl
      z-50 ${className}
    `}>
      {title && (
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          {TitleIcon && <TitleIcon className="h-5 w-5 text-therapy-600" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default HeaderDropdownCard;
