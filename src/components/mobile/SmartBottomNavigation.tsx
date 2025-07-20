
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MessageSquare, 
  Heart, 
  Target, 
  User,
  Plus,
  BarChart3
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  color?: string;
}

const SmartBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      id: 'chat',
      label: 'Therapy',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/chat',
      badge: 2,
      color: 'therapy'
    },
    {
      id: 'new-session',
      label: 'Session',
      icon: <Plus className="h-6 w-6" />,
      path: '/therapy-session',
      color: 'primary'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/analytics'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      path: '/profile'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  const getButtonClasses = (item: NavItem) => {
    const isActiveItem = isActive(item.path);
    const isMainAction = item.id === 'new-session';
    
    if (isMainAction) {
      return `flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-all duration-200 relative
        ${isActiveItem 
          ? 'text-white bg-therapy-600 rounded-full shadow-lg scale-110' 
          : 'text-therapy-600 bg-therapy-100 rounded-full shadow-md hover:bg-therapy-200 hover:scale-105'
        }`;
    }
    
    return `flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-all duration-200 relative
      ${isActiveItem
        ? 'text-therapy-600 bg-therapy-50 rounded-lg'
        : 'text-gray-500 hover:text-therapy-600 hover:bg-therapy-25 rounded-lg'
      }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40 safe-area-pb">
      <div className="grid grid-cols-5 h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={getButtonClasses(item)}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-4 w-4 p-0 flex items-center justify-center rounded-full"
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </div>
            <span className={`text-xs font-medium ${item.id === 'new-session' ? 'text-[10px]' : ''}`}>
              {item.label}
            </span>
            
            {/* Active indicator */}
            {isActive(item.path) && item.id !== 'new-session' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-therapy-600 rounded-b-full" />
            )}
          </button>
        ))}
      </div>
      
      {/* iOS Safe Area */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  );
};

export default SmartBottomNavigation;
