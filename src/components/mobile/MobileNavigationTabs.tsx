
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  User,
  Heart
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const MobileNavigationTabs = () => {
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
      path: '/chat'
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: <Heart className="h-5 w-5" />,
      path: '/mood'
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: <Target className="h-5 w-5" />,
      path: '/goals'
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-colors relative ${
              isActive(item.path)
                ? 'text-therapy-600 bg-therapy-50'
                : 'text-gray-500 hover:text-therapy-600'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
            
            {isActive(item.path) && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-therapy-600 rounded-b-full" />
            )}
          </button>
        ))}
      </div>
      
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  );
};

export default MobileNavigationTabs;
