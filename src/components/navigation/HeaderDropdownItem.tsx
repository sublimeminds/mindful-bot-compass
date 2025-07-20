
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderDropdownItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  gradient: string;
  badge?: string;
  className?: string;
  compact?: boolean;
}

const HeaderDropdownItem: React.FC<HeaderDropdownItemProps> = ({
  icon: Icon,
  title,
  description,
  href,
  gradient,
  badge,
  className = '',
  compact = false
}) => {
  // Get solid background color from gradient
  const getSolidBackground = (gradientClasses: string) => {
    if (gradientClasses.includes('from-blue')) return 'bg-blue-500';
    if (gradientClasses.includes('from-green')) return 'bg-green-500';
    if (gradientClasses.includes('from-purple')) return 'bg-purple-500';
    if (gradientClasses.includes('from-orange')) return 'bg-orange-500';
    if (gradientClasses.includes('from-red')) return 'bg-red-500';
    if (gradientClasses.includes('from-pink')) return 'bg-pink-500';
    if (gradientClasses.includes('from-indigo')) return 'bg-indigo-500';
    if (gradientClasses.includes('from-cyan')) return 'bg-cyan-500';
    if (gradientClasses.includes('from-teal')) return 'bg-teal-500';
    return 'bg-blue-500'; // fallback
  };

  return (
    <Link
      to={href}
      className={`
        flex items-center rounded-lg 
        hover:bg-gray-50 transition-all duration-150 ease-out
        ${compact ? 'space-x-3 p-2' : 'space-x-4 p-4'}
        ${className}
      `}
    >
      <div className={`
        rounded-full flex items-center justify-center 
        ${getSolidBackground(gradient)}
        ${compact ? 'w-10 h-10' : 'w-12 h-12'}
      `}>
        <Icon className={`
          text-white
          ${compact ? 'h-5 w-5' : 'h-6 w-6'}
        `} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={`
            font-semibold text-gray-900
            ${compact ? 'text-sm' : 'text-base'}
          `}>
            {title}
          </h4>
          {badge && (
            <Badge variant="secondary" className={`
              text-xs px-2 py-1 rounded-full
              ${badge === 'Core' ? 'bg-blue-100 text-blue-700' : ''}
              ${badge === 'Popular' ? 'bg-green-100 text-green-700' : ''}
              ${badge === 'New' ? 'bg-purple-100 text-purple-700' : ''}
              ${badge === 'Advanced' ? 'bg-orange-100 text-orange-700' : ''}
            `}>
              {badge}
            </Badge>
          )}
        </div>
        <p className={`
          text-gray-600 mt-0.5
          ${compact ? 'text-xs' : 'text-sm'}
        `}>
          {description}
        </p>
      </div>
    </Link>
  );
};

export default HeaderDropdownItem;
