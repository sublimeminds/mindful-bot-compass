
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Settings,
  History,
  Brain,
  BarChart3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: TrendingUp,
      path: '/',
      description: 'Overview & quick actions'
    },
    {
      label: 'Start Session',
      icon: MessageSquare,
      path: '/chat',
      description: 'Begin therapy session',
      highlight: true
    },
    {
      label: 'Session History',
      icon: History,
      path: '/session-history',
      description: 'View past sessions'
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      description: 'Session insights'
    },
    {
      label: 'Goals',
      icon: Target,
      path: '/goals',
      description: 'Track your progress'
    },
    {
      label: 'Mood Tracking',
      icon: Calendar,
      path: '/mood-tracking',
      description: 'Log daily moods'
    },
    {
      label: 'Techniques',
      icon: Brain,
      path: '/techniques',
      description: 'Learn coping skills'
    },
    {
      label: 'Profile',
      icon: Settings,
      path: '/profile',
      description: 'Account settings'
    }
  ];

  return (
    <div className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 py-4 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : item.highlight ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center space-x-2 whitespace-nowrap
                  ${item.highlight && !isActive ? 'bg-therapy-50 text-therapy-700 hover:bg-therapy-100' : ''}
                  ${isActive ? 'bg-therapy-600 text-white' : ''}
                `}
                title={item.description}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigation;
