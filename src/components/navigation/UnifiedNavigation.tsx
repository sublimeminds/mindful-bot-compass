
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/components/MinimalAppProvider';
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
  Info,
  Shield
} from 'lucide-react';

const UnifiedNavigation = () => {
  // Ensure React and hooks are fully available before using router hooks
  const isReactReady = React && 
    typeof React === 'object' && 
    React.useState && 
    React.useEffect &&
    React.useContext &&
    React.createElement;

  // Early return if React isn't ready to prevent hook calls
  if (!isReactReady) {
    console.warn('UnifiedNavigation: React not ready, skipping render');
    return (
      <div className="flex items-center justify-center w-full">
        <span className="text-muted-foreground text-sm">Loading navigation...</span>
      </div>
    );
  }

  // Now safe to use hooks
  const { user } = useApp();
  const isAuthenticated = !!user;
  const location = useLocation();
  const navigate = useNavigate();

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

  // Authenticated navigation items - now includes Crisis Management
  const authNavItems = [
    { id: '/dashboard', label: 'Dashboard', icon: BarChart3, priority: 1 },
    { id: '/crisis-management', label: 'Crisis', icon: Shield, priority: 1 },
    { id: '/community', label: 'Community', icon: Users, priority: 1 },
    { id: '/notebook', label: 'Journal', icon: BookOpen, priority: 2 },
    { id: '/smart-scheduling', label: 'Schedule', icon: Target, priority: 2 },
    { id: '/help', label: 'Help', icon: HelpCircle, priority: 3 }
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
        {isAuthenticated && (
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
