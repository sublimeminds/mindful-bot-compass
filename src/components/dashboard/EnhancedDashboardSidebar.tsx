
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';
import GradientLogo from '@/components/ui/GradientLogo';
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

// 6-Section Navigation Structure for Professional Multi-Therapist Platform
const coreTherapyNav: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Therapy Chat', href: '/chat', icon: MessageCircle },
  { name: 'Therapy Plan', href: '/therapy-plan', icon: Calendar },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
  { name: 'Progress Overview', href: '/progress-overview', icon: TrendingUp },
];

const progressAnalyticsNav: NavigationItem[] = [
  { name: 'Goals & Milestones', href: '/goals', icon: Target },
  { name: 'Mood Tracking', href: '/mood-tracking', icon: Heart },
  { name: 'Advanced Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports & Insights', href: '/reports', icon: BarChart3 },
];

const aiPersonalizationNav: NavigationItem[] = [
  { name: 'AI Hub', href: '/ai-personalization', icon: Brain },
  { name: 'Therapist Hub', href: '/therapist-hub', icon: Users },
  { name: 'Personalization', href: '/personalization-settings', icon: Settings },
];

const technicalNav: NavigationItem[] = [
  { name: 'Integrations', href: '/integrations', icon: Zap },
  { name: 'Therapy Settings', href: '/therapy-settings', icon: Settings },
  { name: 'Smart Triggers', href: '/smart-triggers', icon: Zap },
  { name: 'API & Webhooks', href: '/api-webhooks', icon: Server },
];

const accountBillingNav: NavigationItem[] = [
  { name: 'Profile Management', href: '/profile', icon: User },
  { name: 'Subscription & Billing', href: '/subscription', icon: CreditCard },
  { name: 'Family Features', href: '/family-features', icon: Users },
  { name: 'Security & Privacy', href: '/security', icon: Shield },
  { name: 'Notification Center', href: '/notifications', icon: Bell },
];

const communitySupportNav: NavigationItem[] = [
  { name: 'Community Hub', href: '/community', icon: Users },
  { name: 'Wellness Challenges', href: '/wellness-challenges', icon: Trophy },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
  { name: 'Compliance Dashboard', href: '/compliance', icon: Shield },
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

  const navigationSections = [
    { title: "Core Therapy", items: coreTherapyNav, icon: Brain },
    { title: "Progress & Analytics", items: progressAnalyticsNav, icon: BarChart3 },
    { title: "AI & Personalization", items: aiPersonalizationNav, icon: Sparkles },
    { title: "Technical", items: technicalNav, icon: Zap },
    { title: "Account & Billing", items: accountBillingNav, icon: User },
    { title: "Community & Support", items: communitySupportNav, icon: Users },
  ];

  // Auto-expand groups that contain the active route
  React.useEffect(() => {
    const findAndExpandActiveGroups = (sections: typeof navigationSections) => {
      sections.forEach(section => {
        section.items.forEach(item => {
          if (hasActiveChild(item) && item.children) {
            setExpandedGroups(prev => ({
              ...prev,
              [item.name]: true
            }));
          }
        });
      });
    };

    findAndExpandActiveGroups(navigationSections);
  }, [location.pathname]);

  return (
    <Sidebar className="border-r border-therapy-100 bg-white/80 backdrop-blur-sm w-72">
      <SidebarHeader className="border-b border-therapy-100 p-4">
        <div className="flex items-center space-x-3">
          <GradientLogo size="sm" />
          <div>
            <h2 className="text-lg font-semibold therapy-text-gradient">TherapySync</h2>
            <p className="text-xs text-therapy-600 font-medium italic">
              "{useQuoteOfTheDay().quote}"
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {navigationSections.map((section) => (
          <SidebarGroup key={section.title} className="mb-4">
            <SidebarGroupLabel className="flex items-center text-xs font-semibold text-therapy-600 uppercase tracking-wider mb-2">
              <section.icon className="w-4 h-4 mr-2" />
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => renderNavigationItem(item))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
