
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <GradientLogo size="sm" />
            <span className="text-lg font-bold therapy-text-gradient">TherapySync</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0">
              Dashboard
            </Badge>
          </div>
        </div>

        {/* Center section - Search (optional) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search sessions, insights..."
              className="w-full pl-10 pr-4 py-2 bg-therapy-50/50 border border-therapy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-therapy-300 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-therapy-50 text-therapy-600"
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
