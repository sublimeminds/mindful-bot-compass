import React from 'react';
import { NavLink } from 'react-router-dom';
import { Lock, Crown, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface LockedFeatureItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  requiredFeature: string;
  requiredTier: 'pro' | 'premium' | 'family' | 'enterprise';
  onUpgrade: () => void;
  isCollapsed?: boolean;
}

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'pro': return <Crown className="h-3 w-3" />;
    case 'premium': return <Crown className="h-3 w-3" />;
    case 'family': return <Users className="h-3 w-3" />;
    case 'enterprise': return <Zap className="h-3 w-3" />;
    default: return <Lock className="h-3 w-3" />;
  }
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'pro': return 'text-blue-600 bg-blue-100';
    case 'premium': return 'text-yellow-600 bg-yellow-100';
    case 'family': return 'text-green-600 bg-green-100';
    case 'enterprise': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const LockedFeatureItem: React.FC<LockedFeatureItemProps> = ({
  href,
  icon: Icon,
  children,
  requiredFeature,
  requiredTier,
  onUpgrade,
  isCollapsed = false
}) => {
  const { canAccessFeature } = useSubscriptionAccess();
  
  const hasAccess = canAccessFeature(requiredFeature);

  if (hasAccess) {
    return (
      <NavLink
        to={href}
        className={({ isActive }) =>
          `flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`
        }
      >
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span className="ml-2">{children}</span>}
      </NavLink>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/50 cursor-not-allowed opacity-60">
            <div className="flex items-center">
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">{children}</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center space-x-1">
                <Badge className={`text-xs px-1.5 py-0.5 ${getTierColor(requiredTier)}`}>
                  {getTierIcon(requiredTier)}
                  <span className="ml-1 capitalize">{requiredTier}</span>
                </Badge>
                <Lock className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">
              {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Feature
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade to {requiredTier} plan to access {children}
            </p>
            <Button 
              size="sm" 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
            >
              Upgrade Now
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LockedFeatureItem;