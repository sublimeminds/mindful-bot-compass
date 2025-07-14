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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={href}
      className={`
        flex items-start rounded-xl 
        hover:bg-therapy-50/80 transition-all duration-200 ease-out
        group/item hover:shadow-sm hover:scale-[1.02] transform-gpu
        ${compact ? 'space-x-3 p-3' : 'space-x-4 p-4'}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        rounded-xl flex items-center justify-center 
        transition-all duration-300 ease-out transform
        bg-gradient-to-r ${gradient}
        ${compact ? 'w-9 h-9' : 'w-11 h-11'}
        ${isHovered 
          ? 'shadow-lg scale-105 ring-2 ring-white/50' 
          : 'shadow-md hover:shadow-lg'
        }
      `}>
        <Icon className={`
          text-white transition-all duration-300
          ${compact ? 'h-4 w-4' : 'h-5 w-5'}
          ${isHovered ? 'scale-110' : ''}
        `} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`
            font-semibold text-gray-900 group-hover/item:text-therapy-700 transition-colors
            ${compact ? 'text-xs' : 'text-sm'}
          `}>
            {title}
          </h4>
          {badge && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-therapy-100 text-therapy-700 border-therapy-200">
              {badge}
            </Badge>
          )}
        </div>
        <p className={`
          text-xs text-gray-600 leading-relaxed
          ${compact ? 'line-clamp-1' : ''}
        `}>
          {description}
        </p>
      </div>
    </Link>
  );
};

export default HeaderDropdownItem;