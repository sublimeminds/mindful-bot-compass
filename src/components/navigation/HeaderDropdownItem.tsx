
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getItemIcon } from '@/utils/iconUtils';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { cn } from '@/lib/utils';

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

// Mapping of hrefs to subscription requirements
const SUBSCRIPTION_REQUIREMENTS: Record<string, 'premium' | 'professional'> = {
  '/adaptive-ai': 'professional',
  '/voice-therapy': 'premium',
  '/cultural-therapy': 'premium',
  '/group-sessions': 'premium',
  '/family-features': 'premium',
  '/community-features': 'premium',
  '/integrations': 'premium',
  '/api': 'professional',
  '/data-export': 'professional',
  '/custom-integrations': 'professional',
  '/wearables': 'premium',
  '/enterprise': 'professional'
};

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
  const { isPremium, isProfessional } = useSubscriptionAccess();
  
  console.log(`🔍 HeaderDropdownItem rendering: ${title} with href: ${href} and gradient: ${gradient}`);
  console.log(`🔍 Icon input: ${typeof iconName === 'string' ? iconName : 'Component'}, type: ${typeof iconName}`);
  
  // Get the appropriate icon component
  const Icon = typeof iconName === 'string' ? getItemIcon(iconName) : iconName;
  console.log(`🔍 Icon resolved to:`, Icon);
  
  // Determine subscription badge to show
  const requiredTier = SUBSCRIPTION_REQUIREMENTS[href];
  let subscriptionBadge = null;
  
  if (requiredTier === 'professional' && !isProfessional) {
    subscriptionBadge = 'Pro';
  } else if (requiredTier === 'premium' && !isPremium) {
    subscriptionBadge = 'Premium';
  }
  
  // Use subscription badge if no existing badge and subscription is required
  const displayBadge = badge || subscriptionBadge;
  
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
      {/* Icon with responsive sizing and gradient background */}
      <div className="flex-shrink-0 relative">
        <div className={cn(
          "rounded-xl p-2 transition-all duration-200",
          "bg-gradient-to-br from-gray-50 to-gray-100",
          "group-hover/item:from-therapy-50 group-hover/item:to-therapy-100",
          "border border-gray-200/50 group-hover/item:border-therapy-200/50",
          compact ? "p-1.5" : "p-2"
        )}>
          <Icon size={compact ? 24 : 32} className="text-therapy-600 group-hover/item:text-therapy-700 transition-colors" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-semibold text-gray-900 group-hover/item:text-therapy-700 transition-colors ${compact ? 'text-sm' : ''}`}>
            {title}
          </h4>
          {displayBadge && (
            <Badge 
              variant={
                displayBadge === 'Pro' || displayBadge === 'Professional' ? 'default' :
                displayBadge === 'Premium' ? 'secondary' :
                'outline'
              } 
              className={`text-xs px-2 py-0.5 ${
                displayBadge === 'Pro' || displayBadge === 'Professional' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0' :
                displayBadge === 'Premium' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0' :
                ''
              }`}
            >
              {displayBadge}
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
