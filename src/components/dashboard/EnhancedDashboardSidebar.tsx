
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Target, 
  Settings, 
  User, 
  CreditCard,
  HelpCircle,
  HeadphonesIcon,
  Heart,
  Users,
  Brain
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/navigation/UserMenu';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Personalization', href: '/ai-personalization', icon: Brain },
  { name: 'Therapy Chat', href: '/therapy-chat', icon: MessageCircle },
  { name: 'Therapy Plan', href: '/therapy-plan', icon: Calendar },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Mood Tracker', href: '/mood-tracker', icon: Heart },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Therapy Settings', href: '/therapy-settings', icon: Settings },
];

const secondaryNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Family Features', href: '/family-features', icon: Users },
];

const supportNavigation = [
  { name: 'Help Center', href: '/help', icon: HelpCircle },
  { name: 'Support', href: '/support', icon: HeadphonesIcon },
];

const EnhancedDashboardSidebar = () => {
  const { user } = useAuth();

  return (
    <Sidebar className="border-r border-therapy-100 bg-white/80 backdrop-blur-sm">
      <SidebarHeader className="border-b border-therapy-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TS</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold therapy-text-gradient">TherapySync</h2>
            <p className="text-xs text-gray-500">AI-Powered Wellness</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-therapy-600 font-medium">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-therapy-100 to-calm-100 text-therapy-700 font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-therapy-50 hover:text-therapy-600'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-therapy-600 font-medium">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-therapy-100 to-calm-100 text-therapy-700 font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-therapy-50 hover:text-therapy-600'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-therapy-600 font-medium">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-therapy-100 to-calm-100 text-therapy-700 font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-therapy-50 hover:text-therapy-600'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-therapy-100 p-4">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata?.name || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <UserMenu />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default EnhancedDashboardSidebar;
