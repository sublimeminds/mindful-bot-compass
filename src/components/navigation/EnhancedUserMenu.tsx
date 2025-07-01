
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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

  if (!user) {
    return null;
  }

  // Mock user stats - in real app, fetch from user profile/analytics
  const userStats = {
    sessionsCompleted: 24,
    currentStreak: 7,
    moodScore: 8.2,
    subscriptionPlan: 'Pro',
    nextSession: 'Today, 3:00 PM'
  };

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

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return 'from-harmony-500 to-balance-500';
      case 'premium':
        return 'from-therapy-500 to-calm-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

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
        className="w-80 p-0 bg-white/95 backdrop-blur-md border border-therapy-200 shadow-xl" 
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
                <Badge className={`bg-gradient-to-r ${getPlanColor(userStats.subscriptionPlan)} text-white border-0 text-xs`}>
                  <Crown className="h-3 w-3 mr-1" />
                  {userStats.subscriptionPlan}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 bg-gradient-to-r from-therapy-25 to-calm-25 border-b border-therapy-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Target className="h-4 w-4 text-therapy-600" />
                <span className="text-lg font-bold text-therapy-700">{userStats.sessionsCompleted}</span>
              </div>
              <p className="text-xs text-gray-600">Sessions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-600">{userStats.currentStreak}</span>
              </div>
              <p className="text-xs text-gray-600">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-lg font-bold text-green-600">{userStats.moodScore}</span>
              </div>
              <p className="text-xs text-gray-600">Mood Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-600">Next</span>
              </div>
              <p className="text-xs text-gray-600">3:00 PM</p>
            </div>
          </div>
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
