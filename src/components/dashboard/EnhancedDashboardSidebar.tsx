
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BarChart3, 
  Calendar, 
  Target, 
  Notebook, 
  Users, 
  Settings, 
  User, 
  Headphones,
  Zap,
  Crown,
  Lock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const EnhancedDashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Mock subscription check - in real app, get from user profile
  const userPlan = user?.subscription_plan || 'free';
  const isPremium = userPlan === 'premium' || userPlan === 'pro';
  const isPro = userPlan === 'pro';

  const sidebarItems = [
    {
      icon: Brain,
      label: 'AI Therapy',
      path: '/therapy-chat',
      tier: 'free'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics',
      tier: 'free'
    },
    {
      icon: Calendar,
      label: 'Sessions',
      path: '/sessions',
      tier: 'free'
    },
    {
      icon: Target,
      label: 'Goals',
      path: '/goals',
      tier: 'free'
    },
    {
      icon: Headphones,
      label: 'Audio Library',
      path: '/audio-library',
      tier: 'premium',
      isPremium: true
    },
    {
      icon: Notebook,
      label: 'Digital Notebook',
      path: '/notebook',
      tier: 'premium',
      isPremium: true
    },
    {
      icon: Users,
      label: 'Community',
      path: '/community',
      tier: 'free'
    },
    {
      icon: Zap,
      label: 'Integrations',
      path: '/integrations',
      tier: 'pro',
      isPro: true
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      tier: 'free'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      tier: 'free'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const canAccess = (item: any) => {
    if (!item.isPremium && !item.isPro) return true;
    if (item.isPremium && isPremium) return true;
    if (item.isPro && isPro) return true;
    return false;
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Badge variant="outline" className="ml-2 text-xs bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0">Premium</Badge>;
      case 'pro':
        return <Badge variant="outline" className="ml-2 text-xs bg-gradient-to-r from-harmony-500 to-balance-500 text-white border-0">Pro</Badge>;
      default:
        return null;
    }
  };

  const handleItemClick = (item: any) => {
    if (canAccess(item)) {
      navigate(item.path);
    } else {
      navigate('/pricing');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 therapy-gradient-bg rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">TherapySync</h2>
            <p className="text-xs text-slate-500">Mental Health Platform</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item, index) => {
            const IconComponent = item.icon;
            const hasAccess = canAccess(item);
            
            return (
              <Button
                key={index}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive(item.path) 
                    ? 'therapy-gradient-bg text-white shadow-lg' 
                    : hasAccess 
                      ? 'text-slate-600 hover:text-therapy-600 hover:bg-therapy-50' 
                      : 'text-slate-400 hover:bg-slate-50'
                }`}
                onClick={() => handleItemClick(item)}
              >
                <IconComponent className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {!hasAccess && <Lock className="h-3 w-3 ml-2" />}
                {hasAccess && item.tier !== 'free' && getTierBadge(item.tier)}
              </Button>
            );
          })}
        </nav>

        {/* Upgrade Section */}
        {!isPro && (
          <div className="mt-8 p-4 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4" />
              <span className="font-semibold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-therapy-100 mb-3">
              Unlock premium audio content, advanced integrations, and more features.
            </p>
            <Button 
              size="sm" 
              className="w-full bg-white text-therapy-600 hover:bg-therapy-50 text-xs"
              onClick={() => navigate('/pricing')}
            >
              View Plans
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboardSidebar;
