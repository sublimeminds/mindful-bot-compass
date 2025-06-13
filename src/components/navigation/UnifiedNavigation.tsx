
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
    { id: '#features', label: 'Features', icon: Sparkles, priority: 1 },
    { id: '#pricing', label: 'Pricing', icon: Crown, priority: 1 },
    { id: '/help', label: 'Help', icon: HelpCircle, priority: 2 }
  ];

  // Authenticated navigation items - more compact for smaller screens
  const authNavItems = [
    { id: '/therapy', label: 'Therapy', icon: MessageCircle, priority: 1 },
    { id: '/mood-tracking', label: 'Mood', icon: Heart, priority: 1 },
    { id: '/goals', label: 'Goals', icon: Target, priority: 2 },
    { id: '/techniques', label: 'Techniques', icon: BookOpen, priority: 2 },
    { id: '/session-history', label: 'History', icon: History, priority: 3 },
    { id: '/analytics', label: 'Analytics', icon: BarChart3, priority: 3 },
    { id: '/help', label: 'Help', icon: HelpCircle, priority: 2 }
  ];

  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  return (
    <div className="flex items-center justify-center w-full">
      {/* Responsive navigation container */}
      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 overflow-x-auto scrollbar-hide px-2 w-full max-w-4xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id.startsWith('#') 
            ? false 
            : location.pathname === item.id;

          // Responsive visibility based on priority
          const getVisibilityClass = () => {
            if (!isAuthenticated) return 'flex'; // Show all public nav items
            
            switch (item.priority) {
              case 1: return 'flex'; // Always visible
              case 2: return 'hidden sm:flex'; // Hidden on mobile
              case 3: return 'hidden lg:flex'; // Hidden on mobile and tablet
              default: return 'flex';
            }
          };

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`${getVisibilityClass()} items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-muted/50 whitespace-nowrap flex-shrink-0 min-w-0 ${
                isActive 
                  ? 'text-therapy-600 bg-therapy-50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline text-xs sm:text-sm truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Upgrade button for free users - responsive */}
        {isAuthenticated && isFreePlan && (
          <Button
            onClick={() => navigate('/plans')}
            size="sm"
            className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Upgrade</span>
            <span className="sm:hidden">+</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnifiedNavigation;
