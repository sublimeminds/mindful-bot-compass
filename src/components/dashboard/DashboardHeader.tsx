
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  User,
  Menu,
  Search,
  Calendar,
  Crown
} from 'lucide-react';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedUserMenu from '@/components/navigation/EnhancedUserMenu';
import GradientLogo from '@/components/ui/GradientLogo';

const DashboardHeader = () => {
  const { user } = useAuth();
  const { quote } = useQuoteOfTheDay();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-lg shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left section with dashboard title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Menu className="h-5 w-5 text-therapy-600" />
            <span className="text-xl font-semibold text-gray-900">Dashboard</span>
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

          {/* User Menu */}
          <EnhancedUserMenu />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
