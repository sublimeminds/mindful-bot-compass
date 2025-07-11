
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Search,
  Calendar,
  Menu
} from 'lucide-react';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import { useSidebar } from '@/components/ui/sidebar';

const DashboardHeader = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/chat') return 'Quick Chat';
    if (path === '/therapy-session') return 'Therapy Session';
    if (path.startsWith('/therapy')) return 'Therapy Chat';
    if (path === '/goals') return 'Goals';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    if (path === '/calendar') return 'Calendar';
    if (path === '/community') return 'Community';
    if (path === '/notifications') return 'Notifications';
    if (path === '/mood-tracking') return 'Mood Tracking';
    if (path === '/achievements') return 'Achievements';
    if (path.startsWith('/admin')) return 'Admin Panel';
    
    // Format path segments for unknown routes
    const segments = path.split('/').filter(Boolean);
    return segments.length > 0 
      ? segments[segments.length - 1].split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      : 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-lg shadow-sm supports-[backdrop-filter]:bg-white/60 ml-0">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left section with sidebar toggle and dashboard title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-gray-100 p-2"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-gray-900">{getPageTitle()}</span>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search sessions, insights, goals..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-therapy-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100 text-gray-600 font-medium px-4 py-2"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>

          {/* Notification Center */}
          <EnhancedNotificationCenter />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
