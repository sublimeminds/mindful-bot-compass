
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
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Brain,
  Heart,
  Users,
  BarChart3,
  MessageSquare,
  Calendar,
  BookOpen,
  Target,
  TrendingUp,
  PenTool,
  Shield,
  Sparkles,
  Zap
} from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

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
      title: 'Overview',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
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
      title: 'Connect',
      items: [
        { title: 'WhatsApp', url: '/integrations', icon: MessageSquare },
        { title: 'Integrations', url: '/integrations', icon: Zap },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { title: 'Overview', url: '/enhanced-monitoring', icon: BarChart3 },
        { title: 'Mood Analytics', url: '/analytics', icon: TrendingUp },
        { title: 'Session Insights', url: '/session-analytics', icon: Sparkles },
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
    <Sidebar collapsible="icon" className="border-r">
      <div className="flex h-full flex-col">
        {/* Header with Logo */}
        <div className="flex items-center gap-2 p-4 border-b">
          <GradientLogo size={isCollapsed ? "sm" : "sm"} />
          {!isCollapsed && (
            <div 
              className="cursor-pointer flex items-center gap-2"
              onClick={() => handleNavigation('/dashboard')}
            >
              <span className="font-bold text-lg bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                TherapySync
              </span>
            </div>
          )}
        </div>

        <SidebarContent className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          {mainNavigation.map((section) => (
            <SidebarGroup key={section.title} className="px-2">
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
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <item.icon className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

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
                      tooltip={isCollapsed ? item.title : undefined}
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
