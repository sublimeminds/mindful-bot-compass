
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Brain,
  Heart,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Calendar,
  BookOpen,
  Target,
  TrendingUp,
  PenTool,
  Shield,
  Bell,
  User,
  CreditCard,
  Lock,
  Sparkles
} from 'lucide-react';

const DashboardSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const mainNavigation = [
    {
      title: 'Dashboard',
      items: [
        { title: 'Overview', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Quick Actions', url: '/dashboard#quick-actions', icon: Sparkles },
      ]
    },
    {
      title: 'Therapy',
      items: [
        { title: 'AI Sessions', url: '/therapysync-ai', icon: Brain },
        { title: 'Chat History', url: '/session-history', icon: MessageSquare },
        { title: 'Techniques', url: '/techniques', icon: Target },
        { title: 'Session Analytics', url: '/session-analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Wellness',
      items: [
        { title: 'Mood Tracking', url: '/mood-tracking', icon: Heart },
        { title: 'Goals', url: '/goals', icon: Target },
        { title: 'Digital Notebook', url: '/notebook', icon: PenTool },
        { title: 'Progress Reports', url: '/enhanced-monitoring', icon: TrendingUp },
      ]
    },
    {
      title: 'Community',
      items: [
        { title: 'Support Groups', url: '/community', icon: Users },
        { title: 'Discussions', url: '/community#discussions', icon: MessageSquare },
        { title: 'Events', url: '/community#events', icon: Calendar },
        { title: 'Resources', url: '/community#resources', icon: BookOpen },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { title: 'Overview', url: '/enhanced-monitoring', icon: BarChart3 },
        { title: 'Mood Analytics', url: '/analytics', icon: TrendingUp },
        { title: 'Session Insights', url: '/session-analytics', icon: Sparkles },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Profile', url: '/profile', icon: User },
        { title: 'Settings', url: '/settings', icon: Settings },
        { title: 'Subscription', url: '/plans', icon: CreditCard },
        { title: 'Security', url: '/settings#security', icon: Lock },
      ]
    }
  ];

  const quickLinks = [
    { title: 'Crisis Support', url: '/crisis-resources', icon: Shield },
    { title: 'Help Center', url: '/help', icon: BookOpen },
    { title: 'Smart Scheduling', url: '/smart-scheduling', icon: Calendar },
  ];

  if (!user) return null;

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      className={`border-r bg-background transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
      collapsible="icon"
    >
      <div className="flex h-full flex-col">
        {/* Header with trigger */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-therapy-900">Dashboard</span>
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>

        <SidebarContent className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          {mainNavigation.map((section) => {
            const hasActiveItem = section.items.some(item => isActive(item.url));
            
            return (
              <SidebarGroup
                key={section.title}
                className="px-2"
              >
                {!isCollapsed && (
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2">
                    {section.title}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => handleNavigation(item.url)}
                          className={`w-full justify-start transition-colors ${
                            isActive(item.url)
                              ? 'bg-therapy-100 text-therapy-900 font-medium border-r-2 border-therapy-500'
                              : 'hover:bg-therapy-50 text-gray-700 hover:text-therapy-900'
                          }`}
                        >
                          <item.icon className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                          {!isCollapsed && <span className="truncate">{item.title}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}

          {/* Quick Links */}
          <SidebarGroup className="mt-auto px-2 border-t pt-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2">
                Quick Links
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {quickLinks.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.url)}
                      className={`w-full justify-start transition-colors ${
                        isActive(item.url)
                          ? 'bg-therapy-100 text-therapy-900 font-medium'
                          : 'hover:bg-therapy-50 text-gray-700 hover:text-therapy-900'
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
