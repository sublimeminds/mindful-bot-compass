
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  MessageSquare, 
  TrendingUp, 
  Target, 
  Heart,
  Brain,
  Calendar,
  BarChart3,
  Settings,
  History,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

const UnifiedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();

  // Public navigation items
  const publicNavItems = [
    { to: '#features', icon: Heart, label: 'Features' },
    { to: '#pricing', icon: Target, label: 'Pricing' },
    { to: '/auth', icon: User, label: 'Sign In' }
  ];

  // Authenticated navigation items
  const mainNavItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      description: 'Overview & insights'
    },
    {
      label: 'Therapy',
      icon: MessageSquare,
      path: '/therapy',
      description: 'Start session',
      highlight: true
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      description: 'Progress insights'
    },
    {
      label: 'Goals',
      icon: Target,
      path: '/goals',
      description: 'Track progress'
    },
    {
      label: 'Mood',
      icon: Heart,
      path: '/mood-tracking',
      description: 'Track emotions'
    },
    {
      label: 'Sessions',
      icon: History,
      path: '/session-history',
      description: 'View history'
    },
    {
      label: 'Techniques',
      icon: Brain,
      path: '/techniques',
      description: 'Learn skills'
    },
    {
      label: 'Profile',
      icon: Settings,
      path: '/profile',
      description: 'Settings'
    }
  ];

  // Add admin navigation if user is admin
  if (isAdmin) {
    mainNavItems.push({
      label: 'Admin',
      icon: Shield,
      path: '/admin',
      description: 'Admin panel'
    });
  }

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

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      scrollToSection(path);
    } else {
      navigate(path);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-1">
        {publicNavItems.map(({ to, icon: Icon, label }) => {
          const isActive = to.startsWith('#') ? false : location.pathname === to;
          return (
            <Button
              key={to}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(to)}
              className={`flex items-center space-x-2 ${
                isActive 
                  ? 'bg-therapy-600 text-white' 
                  : 'hover:bg-therapy-50 text-foreground/80 hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 overflow-x-auto">
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || 
          (item.path === '/admin' && location.pathname.startsWith('/admin'));
        
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : item.highlight ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate(item.path)}
            className={`
              flex items-center space-x-2 whitespace-nowrap transition-all duration-200
              ${item.highlight && !isActive ? 'bg-therapy-50 text-therapy-700 hover:bg-therapy-100 border border-therapy-200' : ''}
              ${isActive ? 'bg-therapy-600 text-white shadow-sm' : ''}
              ${!isActive && !item.highlight ? 'hover:bg-muted/50 text-foreground/80 hover:text-foreground' : ''}
              ${item.path === '/admin' ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : ''}
            `}
            title={item.description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default UnifiedNavigation;
