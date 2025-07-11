
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Brain,
  Zap,
  Bell,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BarChart3,
  Lightbulb,
  Server,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  Trophy,
  Shield
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

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: NavigationItem[];
  level?: number;
  badge?: string | number;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'AI Personalization', 
    icon: Brain,
    children: [
      {
        name: 'AI Dashboard',
        icon: Brain,
        children: [
          { name: 'AI Insights', href: '/ai-personalization/dashboard/insights', icon: Sparkles, level: 3 },
          { name: 'Patterns', href: '/ai-personalization/dashboard/patterns', icon: BarChart3, level: 3 },
          { name: 'Recommendations', href: '/ai-personalization/dashboard/recommendations', icon: Lightbulb, level: 3 },
          { name: 'Predictions', href: '/ai-personalization/dashboard/predictions', icon: TrendingUp, level: 3 },
        ],
        level: 2
      },
      { name: 'Smart Recommendations', href: '/ai-personalization/recommendations', icon: Lightbulb, level: 2 },
      { name: 'Contextual AI', href: '/ai-personalization/contextual', icon: Zap, level: 2 },
      { name: 'AI Settings', href: '/ai-personalization/settings', icon: Settings, level: 2 },
    ]
  },
  { name: 'Therapy Chat', href: '/therapy-chat', icon: MessageCircle },
  { name: 'AI Therapists', href: '/therapist-discovery', icon: Brain },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
  { name: 'Therapy Plan', href: '/therapy-plan', icon: Calendar },
  { name: 'Progress Overview', href: '/progress-overview', icon: TrendingUp },
  { 
    name: 'Sessions', 
    icon: Calendar,
    children: [
      { name: 'All Sessions', href: '/sessions/all', icon: Calendar, level: 2 },
      {
        name: 'Session Analytics',
        icon: BarChart3,
        children: [
          { name: 'Performance Metrics', href: '/sessions/analytics/performance', icon: TrendingUp, level: 3 },
          { name: 'Mood Analysis', href: '/sessions/analytics/mood', icon: Heart, level: 3 },
          { name: 'Technique Effectiveness', href: '/sessions/analytics/techniques', icon: Target, level: 3 },
          { name: 'Time Analysis', href: '/sessions/analytics/time', icon: Clock, level: 3 },
        ],
        level: 2
      },
      { name: 'Session History', href: '/sessions/history', icon: Clock, level: 2 },
    ]
  },
  { 
    name: 'Goals', 
    icon: Target,
    children: [
      { name: 'Active Goals', href: '/goals/active', icon: Target, level: 2 },
      { name: 'Goal Templates', href: '/goals/templates', icon: LayoutDashboard, level: 2 },
      {
        name: 'Progress Tracking',
        icon: TrendingUp,
        children: [
          { name: 'Weekly View', href: '/goals/progress/weekly', icon: Calendar, level: 3 },
          { name: 'Monthly Analysis', href: '/goals/progress/monthly', icon: BarChart3, level: 3 },
          { name: 'Milestone Tracker', href: '/goals/progress/milestones', icon: Target, level: 3 },
          { name: 'Habit Formation', href: '/goals/progress/habits', icon: CheckCircle, level: 3 },
        ],
        level: 2
      },
      { name: 'Achievements', href: '/goals/achievements', icon: Target, level: 2 },
    ]
  },
  { 
    name: 'Mood Tracker', 
    icon: Heart,
    children: [
      { name: 'Daily Tracker', href: '/mood-tracker/daily', icon: Heart, level: 2 },
      {
        name: 'Mood Patterns',
        icon: BarChart3,
        children: [
          { name: 'Weekly Patterns', href: '/mood-tracker/patterns/weekly', icon: Calendar, level: 3 },
          { name: 'Trigger Analysis', href: '/mood-tracker/patterns/triggers', icon: AlertTriangle, level: 3 },
          { name: 'Correlation Insights', href: '/mood-tracker/patterns/correlations', icon: TrendingUp, level: 3 },
          { name: 'Emotional Journey', href: '/mood-tracker/patterns/journey', icon: Heart, level: 3 },
        ],
        level: 2
      },
      { name: 'Insights', href: '/mood-tracker/insights', icon: Lightbulb, level: 2 },
      { name: 'History', href: '/mood-tracker/history', icon: Clock, level: 2 },
    ]
  },
  { 
    name: 'Advanced Analytics', 
    icon: BarChart3,
    children: [
      {
        name: 'Performance Monitor',
        icon: Server,
        children: [
          { name: 'System Health', href: '/advanced-analytics/performance/health', icon: Server, level: 3 },
          { name: 'Real-time Metrics', href: '/advanced-analytics/performance/metrics', icon: Activity, level: 3 },
          { name: 'Alerts & Monitoring', href: '/advanced-analytics/performance/alerts', icon: AlertTriangle, level: 3 },
          { name: 'Performance History', href: '/advanced-analytics/performance/history', icon: Clock, level: 3 },
        ],
        level: 2
      },
      { name: 'User Behavior', href: '/advanced-analytics/behavior', icon: Users, level: 2 },
      { name: 'Business Intelligence', href: '/advanced-analytics/business', icon: TrendingUp, level: 2 },
    ]
  },
  { 
    name: 'Integrations', 
    icon: Zap,
    children: [
      {
        name: 'Platform Integrations',
        icon: MessageCircle,
        children: [
          { name: 'Messaging Platforms', href: '/integrations/platforms/messaging', icon: MessageCircle, level: 3 },
          { name: 'Productivity Tools', href: '/integrations/platforms/productivity', icon: Zap, level: 3 },
          { name: 'Health Integrations', href: '/integrations/platforms/health', icon: Heart, level: 3 },
          { name: 'Analytics & Reporting', href: '/integrations/platforms/analytics', icon: BarChart3, level: 3 },
        ],
        level: 2
      },
      { name: 'Notification Settings', href: '/integrations/notifications', icon: Bell, level: 2 },
      { name: 'Usage Analytics', href: '/integrations/analytics', icon: BarChart3, level: 2 },
    ]
  },
  { name: 'Notifications', href: '/notification-center', icon: Bell },
  { name: 'Smart Triggers', href: '/smart-triggers', icon: Zap },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Gamification', href: '/gamification-dashboard', icon: Trophy },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Therapy Settings', href: '/therapy-settings', icon: Settings },
];

const secondaryNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Notification Settings', href: '/notification-settings', icon: Bell },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Family Features', href: '/family-features', icon: Users },
];

const supportNavigation = [
  { name: 'Help Center', href: '/help', icon: HelpCircle },
  { name: 'Support', href: '/support', icon: HeadphonesIcon },
];

const EnhancedDashboardSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const isRouteActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const hasActiveChild = (item: NavigationItem): boolean => {
    if (item.href && isRouteActive(item.href)) return true;
    if (item.children) {
      return item.children.some(child => hasActiveChild(child));
    }
    return false;
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 1) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups[item.name];
    const isActive = item.href ? isRouteActive(item.href) : false;
    const hasActiveDescendant = hasActiveChild(item);

    const paddingClass = level === 1 ? 'pl-3' : level === 2 ? 'pl-6' : 'pl-9';
    const iconSize = level === 1 ? 'w-5 h-5' : 'w-4 h-4';
    const textSize = level === 1 ? 'text-sm' : 'text-xs';

    if (hasChildren) {
      return (
        <div key={item.name}>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleGroup(item.name)}
              className={`flex items-center justify-between ${paddingClass} py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                hasActiveDescendant
                  ? 'bg-gradient-to-r from-therapy-100 to-calm-100 text-therapy-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-therapy-50 hover:text-therapy-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={iconSize} />
                <span className={`${textSize} font-medium`}>{item.name}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="w-4 h-4 transition-transform duration-200" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild>
            <NavLink 
              to={item.href!}
              className={`flex items-center space-x-3 ${paddingClass} py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-therapy-100 to-calm-100 text-therapy-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-therapy-50 hover:text-therapy-600'
              }`}
            >
              <item.icon className={iconSize} />
              <span className={`${textSize} ${isActive ? 'font-medium' : ''}`}>{item.name}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
  };

  // Auto-expand groups that contain the active route
  React.useEffect(() => {
    const findAndExpandActiveGroups = (items: NavigationItem[], parentName?: string) => {
      items.forEach(item => {
        if (hasActiveChild(item) && item.children) {
          setExpandedGroups(prev => ({
            ...prev,
            [item.name]: true
          }));
        }
        if (item.children) {
          findAndExpandActiveGroups(item.children, item.name);
        }
      });
    };

    findAndExpandActiveGroups(navigation);
  }, [location.pathname]);

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
              {navigation.map(item => renderNavigationItem(item))}
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
