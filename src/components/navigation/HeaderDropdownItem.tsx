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
}

const HeaderDropdownItem: React.FC<HeaderDropdownItemProps> = ({
  icon: Icon,
  title,
  description,
  href,
  gradient,
  badge,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={href}
      className={`
        flex items-start space-x-4 p-4 rounded-xl 
        hover:bg-therapy-50/80 transition-all duration-200 ease-out
        group/item hover:shadow-sm hover:scale-[1.02] transform-gpu
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        w-11 h-11 rounded-xl flex items-center justify-center 
        transition-all duration-300 ease-out transform
        bg-gradient-to-r ${gradient}
        ${isHovered 
          ? 'shadow-lg scale-105 ring-2 ring-white/50' 
          : 'shadow-md hover:shadow-lg'
        }
      `}>
        <Icon className={`
          h-5 w-5 text-white transition-all duration-300
          ${isHovered ? 'scale-110' : ''}
        `} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-sm text-gray-900 group-hover/item:text-therapy-700 transition-colors">
            {title}
          </h4>
          {badge && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-therapy-100 text-therapy-700 border-therapy-200">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default HeaderDropdownItem;