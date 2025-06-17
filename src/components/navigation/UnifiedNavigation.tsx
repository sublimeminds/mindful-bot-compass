
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
  HelpCircle,
  Users,
  Star,
  Info
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
      // If we're not on the home page, navigate there first
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: sectionId } });
        return;
      }
      
      // Remove the # and find the element
      const elementId = sectionId.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(sectionId);
    }
  };

  // Enhanced public navigation items
  const publicNavItems = [
    { id: '#how-it-works', label: 'How It Works', icon: Info, priority: 1 },
    { id: '#features', label: 'Features', icon: Sparkles, priority: 1 },
    { id: '#testimonials', label: 'Reviews', icon: Star, priority: 2 },
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

  // Handle scroll on page load if coming from navigation
  React.useEffect(() => {
    const state = location.state as { scrollTo?: string };
    if (state?.scrollTo && state.scrollTo.startsWith('#')) {
      setTimeout(() => {
        const elementId = state.scrollTo.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center w-full">
      {/* Responsive navigation container */}
      <div className="flex items-center space-x-1 lg:space-x-4 overflow-x-auto scrollbar-hide px-2 w-full max-w-5xl">
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
              className={`${getVisibilityClass()} items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-muted/50 whitespace-nowrap flex-shrink-0 min-w-0 ${
                isActive 
                  ? 'text-harmony-600 bg-harmony-50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Upgrade button for free users - responsive */}
        {isAuthenticated && isFreePlan && (
          <Button
            onClick={() => navigate('/plans')}
            size="sm"
            className="bg-gradient-to-r from-harmony-500 to-flow-600 hover:from-harmony-600 hover:to-flow-700 text-white px-4 py-2 text-sm whitespace-nowrap flex-shrink-0"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnifiedNavigation;
