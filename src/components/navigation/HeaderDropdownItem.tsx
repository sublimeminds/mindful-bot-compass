
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderDropdownItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  gradient?: string;
  badge?: string;
  className?: string;
  compact?: boolean;
}

const HeaderDropdownItem: React.FC<HeaderDropdownItemProps> = ({
  icon: Icon,
  title,
  description,
  href,
  gradient = 'from-therapy-500 to-therapy-600',
  badge,
  className = '',
  compact = false
}) => {
  console.log(`🔍 HeaderDropdownItem rendering: ${title} with gradient: ${gradient}`);
  
  return (
    <Link
      to={href}
      className={`
        group/item flex items-start gap-4 rounded-xl 
        hover:bg-gray-50 transition-all duration-200 hover:shadow-md
        border border-transparent hover:border-gray-200
        ${compact ? 'p-3' : 'p-4'}
        ${className}
      `}
    >
      <div className={`
        flex-shrink-0 rounded-lg bg-gradient-to-br ${gradient} 
        flex items-center justify-center shadow-lg
        group-hover/item:scale-105 transition-transform duration-200
        ${compact ? 'w-10 h-10' : 'w-12 h-12'}
      `}>
        <Icon className={`text-white ${compact ? 'h-5 w-5' : 'h-6 w-6'}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-semibold text-gray-900 group-hover/item:text-therapy-700 transition-colors ${compact ? 'text-sm' : ''}`}>
            {title}
          </h4>
          {badge && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {badge}
            </Badge>
          )}
        </div>
        <p className={`text-gray-600 leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      </div>
    </Link>
  );
};

export default HeaderDropdownItem;
