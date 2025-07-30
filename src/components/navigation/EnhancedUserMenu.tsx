
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Crown,
  Target,
  TrendingUp,
  Calendar,
  CreditCard,
  HelpCircle,
  Flame
} from 'lucide-react';

const EnhancedUserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data: userStats, isLoading } = useUserStats();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase() + 
           (email.split('@')[0].charAt(1) || '').toUpperCase();
  };

  // Calculate mood score out of 10 for display
  const displayMoodScore = userStats?.averageMood ? userStats.averageMood.toFixed(1) : 'N/A';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0 hover:scale-105 transition-transform duration-200"
        >
          <Avatar className="h-10 w-10 ring-2 ring-therapy-200 hover:ring-therapy-400 transition-all duration-200">
            <AvatarFallback className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white font-semibold">
              {getInitials(user.email || 'U')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0 bg-white border border-therapy-200 shadow-xl" 
        align="end" 
        forceMount
      >
        {/* User Header */}
        <div className="p-4 bg-gradient-to-r from-therapy-50 to-calm-50 border-b border-therapy-100">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white font-bold text-lg">
                {getInitials(user.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {user.email?.split('@')[0] || 'User'}
                </h4>
                <Badge className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Free
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 bg-gradient-to-r from-therapy-25 to-calm-25 border-b border-therapy-100">
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600 mx-auto mb-2"></div>
              Loading stats...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Target className="h-4 w-4 text-therapy-600" />
                  <span className="text-lg font-bold text-therapy-700">{userStats?.totalSessions || 0}</span>
                </div>
                <p className="text-xs text-gray-600">Sessions</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-lg font-bold text-orange-600">{userStats?.currentStreak || 0}</span>
                </div>
                <p className="text-xs text-gray-600">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-lg font-bold text-green-600">{displayMoodScore}</span>
                </div>
                <p className="text-xs text-gray-600">Avg Mood</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600">
                    {userStats?.lastSessionDate ? 'Recent' : 'None'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Last Session</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-2">
          <DropdownMenuItem 
            onClick={() => navigate('/dashboard')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Dashboard</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate('/profile')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <User className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate('/settings')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <Settings className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate('/billing')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <CreditCard className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Billing & Plans</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate('/help')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <HelpCircle className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="hover:bg-red-50 cursor-pointer rounded-lg p-3 text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedUserMenu;
