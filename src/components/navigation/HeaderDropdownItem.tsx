
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getItemIcon } from '@/utils/iconUtils';

interface HeaderDropdownItemProps {
  icon: LucideIcon | string | React.FC<{ className?: string; size?: number }>;
  title: string;
  description: string;
  href: string;
  gradient?: string;
  badge?: string;
  className?: string;
  compact?: boolean;
}

const HeaderDropdownItem: React.FC<HeaderDropdownItemProps> = ({
  icon: iconName,
  title,
  description,
  href,
  gradient = 'from-therapy-500 to-therapy-600',
  badge,
  className = '',
  compact = false
}) => {
  console.log(`🔍 HeaderDropdownItem rendering: ${title} with href: ${href} and gradient: ${gradient}`);
  console.log(`🔍 Icon input: ${typeof iconName === 'string' ? iconName : 'Component'}, type: ${typeof iconName}`);
  
  // Get the appropriate icon component
  const Icon = typeof iconName === 'string' ? getItemIcon(iconName) : iconName;
  console.log(`🔍 Icon resolved to:`, Icon);
  
  return (
    <Link
      to={href}
      className={`
        group/item flex items-start gap-3 rounded-xl 
        hover:bg-gray-50 transition-all duration-200 hover:shadow-md
        border border-transparent hover:border-gray-200
        ${compact ? 'p-2' : 'p-4'}
        ${className}
      `}
    >
      {/* Icon now self-contained with gradient */}
      <div className={`
        flex-shrink-0 group-hover/item:scale-105 transition-transform duration-200
      `}>
        <Icon size={compact ? 40 : (window.innerWidth >= 768 ? 72 : 56)} />
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
        <p className={`text-gray-600 leading-tight line-clamp-3 ${compact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      </div>
    </Link>
  );
};

export default HeaderDropdownItem;
