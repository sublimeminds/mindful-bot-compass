
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
    <div className="flex items-center justify-center">
      {/* Responsive navigation container */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 overflow-x-auto max-w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id.startsWith('#') 
            ? false 
            : location.pathname === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-muted/50 whitespace-nowrap flex-shrink-0 ${
                isActive 
                  ? 'text-therapy-600 bg-therapy-50' 
                  : 'text-muted-foreground hover:text-foreground'
              } ${
                // Hide lower priority items on very small screens
                isAuthenticated && item.priority === 3 ? 'hidden sm:flex' : 
                isAuthenticated && item.priority === 2 ? 'hidden xs:flex' : 'flex'
              }`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}

        {/* Upgrade button for free users - responsive */}
        {isAuthenticated && isFreePlan && (
          <Button
            onClick={() => navigate('/plans')}
            size="sm"
            className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white font-semibold rounded-full px-2 sm:px-4 py-2 shadow-lg hover:shadow-therapy-500/30 transition-all duration-300 hover:scale-105 ml-2 sm:ml-4 flex-shrink-0"
          >
            <Crown className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Upgrade</span>
            <Badge variant="secondary" className="ml-1 sm:ml-2 bg-white/20 text-white border-none text-xs">
              Pro
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnifiedNavigation;
