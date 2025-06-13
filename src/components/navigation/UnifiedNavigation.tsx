
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Target, 
  BarChart3, 
  Heart, 
  BookOpen, 
  History,
  Crown,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const UnifiedNavigation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only call useSubscription if authenticated to avoid hook issues
  const subscriptionData = useSubscription();
  const isFreePlan = isAuthenticated ? subscriptionData.isFreePlan() : false;

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(sectionId);
    }
  };

  // Public navigation items
  const publicNavItems = [
    { id: '#features', label: 'Features', icon: Sparkles },
    { id: '#pricing', label: 'Pricing', icon: Crown },
    { id: '/help', label: 'Help', icon: HelpCircle }
  ];

  // Authenticated navigation items
  const authNavItems = [
    { id: '/therapy', label: 'Therapy', icon: MessageCircle },
    { id: '/mood-tracking', label: 'Mood', icon: Heart },
    { id: '/goals', label: 'Goals', icon: Target },
    { id: '/techniques', label: 'Techniques', icon: BookOpen },
    { id: '/session-history', label: 'History', icon: History },
    { id: '/analytics', label: 'Analytics', icon: BarChart3 },
    { id: '/help', label: 'Help', icon: HelpCircle }
  ];

  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  return (
    <div className="flex items-center space-x-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id.startsWith('#') 
          ? false // Handle scroll-based active state elsewhere
          : location.pathname === item.id;

        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-muted/50 ${
              isActive 
                ? 'text-therapy-600 bg-therapy-50' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Upgrade button for free users */}
      {isAuthenticated && isFreePlan && (
        <Button
          onClick={() => navigate('/plans')}
          size="sm"
          className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white font-semibold rounded-full px-4 py-2 shadow-lg hover:shadow-therapy-500/30 transition-all duration-300 hover:scale-105 ml-4"
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-none">
            Pro
          </Badge>
        </Button>
      )}
    </div>
  );
};

export default UnifiedNavigation;
