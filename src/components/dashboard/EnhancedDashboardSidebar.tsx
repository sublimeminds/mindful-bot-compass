import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useTherapyPlans } from '@/hooks/useTherapyPlans';
import TherapyPlanSwitcher from '@/components/therapy/TherapyPlanSwitcher';
import LockedFeatureItem from './LockedFeatureItem';
import SearchBar from './SearchBar';
import GradientLogo from '@/components/ui/GradientLogo';
import { Search } from 'lucide-react';
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
  Shield,
  Crown,
  Flame,
  LogOut,
  MoreHorizontal
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
  useSidebar
} from '@/components/ui/sidebar';
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

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: NavigationItem[];
  level?: number;
  badge?: string | number;
}

// Enhanced User Dropdown Component
const EnhancedUserDropdown = ({ 
  user, 
  userStats, 
  isLoading, 
  collapsed, 
  onLogout, 
  onNavigate 
}: {
  user: any;
  userStats: any;
  isLoading: boolean;
  collapsed: boolean;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase() + 
           (email.split('@')[0].charAt(1) || '').toUpperCase();
  };

  const displayMoodScore = userStats?.averageMood ? userStats.averageMood.toFixed(1) : 'N/A';

  if (collapsed) {
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
              onClick={() => onNavigate('/dashboard')}
              className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
            >
              <LayoutDashboard className="mr-3 h-4 w-4 text-therapy-600" />
              <span className="font-medium">Dashboard</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onNavigate('/profile')}
              className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
            >
              <User className="mr-3 h-4 w-4 text-therapy-600" />
              <span className="font-medium">Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onNavigate('/settings')}
              className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
            >
              <Settings className="mr-3 h-4 w-4 text-therapy-600" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onNavigate('/billing')}
              className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
            >
              <CreditCard className="mr-3 h-4 w-4 text-therapy-600" />
              <span className="font-medium">Billing & Plans</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onNavigate('/help')}
              className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
            >
              <HelpCircle className="mr-3 h-4 w-4 text-therapy-600" />
              <span className="font-medium">Help & Support</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem 
              onClick={onLogout}
              className="hover:bg-red-50 cursor-pointer rounded-lg p-3 text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between w-full cursor-pointer hover:bg-therapy-50/50 rounded-lg p-2 transition-colors">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-therapy-200 hover:ring-therapy-400 transition-all duration-200">
              <AvatarFallback className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white font-semibold">
                {getInitials(user.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0 bg-white/95 backdrop-blur-md border border-therapy-200 shadow-xl" 
        align="start" 
        forceMount
      >
        {/* Same content as collapsed version */}
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

        <div className="p-2">
          <DropdownMenuItem 
            onClick={() => onNavigate('/dashboard')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Dashboard</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onNavigate('/profile')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <User className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onNavigate('/settings')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <Settings className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onNavigate('/billing')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <CreditCard className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Billing & Plans</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onNavigate('/help')}
            className="hover:bg-therapy-50 cursor-pointer rounded-lg p-3"
          >
            <HelpCircle className="mr-3 h-4 w-4 text-therapy-600" />
            <span className="font-medium">Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem 
            onClick={onLogout}
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

// 6-Section Navigation Structure for Professional Multi-Therapist Platform
const coreTherapyNav: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Full Session', href: '/therapy-session', icon: Brain },
  { name: 'Quick Chat', href: '/therapy', icon: MessageCircle },
  { name: 'Therapy Plan', href: '/therapy-plan', icon: Calendar },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
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
  { name: 'Security & Privacy', href: '/privacy', icon: Shield },
  { name: 'Notification Center', href: '/notifications', icon: Bell },
];

const familyFeaturesNav: NavigationItem[] = [
  { name: 'Family Dashboard', href: '/family-dashboard', icon: Users },
  { name: 'Family Features', href: '/family-features', icon: Heart },
];

const communitySupportNav: NavigationItem[] = [
  { name: 'Community Hub', href: '/community', icon: Users },
  { name: 'Wellness Challenges', href: '/wellness-challenges', icon: Trophy },
  { name: 'Crisis Support', href: '/chat', icon: AlertTriangle },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
  { name: 'Compliance Dashboard', href: '/compliance', icon: Shield },
];

const EnhancedDashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { quote } = useQuoteOfTheDay();
  const { data: userStats, isLoading } = useUserStats();
  const { state } = useSidebar();
  const { canAccessFeature } = useSubscriptionAccess();
  const [showPlanCreator, setShowPlanCreator] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Core Therapy': true,
    'Progress & Analytics': true,
    'AI & Personalization': false,
    'Technical': false,
    'Account & Billing': false,
    'Community & Support': false,
  });

  const navigationSections = [
    { title: "Core Therapy", items: coreTherapyNav, icon: Brain },
    { title: "Progress & Analytics", items: progressAnalyticsNav, icon: BarChart3 },
    { title: "AI & Personalization", items: aiPersonalizationNav, icon: Sparkles },
    { title: "Family Features", items: familyFeaturesNav, icon: Users, locked: true, requiredFeature: 'family-dashboard' },
    { title: "Technical", items: technicalNav, icon: Zap },
    { title: "Account & Billing", items: accountBillingNav, icon: User },
    { title: "Community & Support", items: communitySupportNav, icon: Users },
  ];

  // Auto-expand groups that contain the active route
  React.useEffect(() => {
    const findAndExpandActiveGroups = (sections: typeof navigationSections) => {
      sections.forEach(section => {
        const hasActiveRoute = section.items.some(item => 
          location.pathname === item.href || location.pathname.startsWith(item.href + '/')
        );
        if (hasActiveRoute) {
          setExpandedGroups(prev => ({
            ...prev,
            [section.title]: true
          }));
        }
      });
    };

    findAndExpandActiveGroups(navigationSections);
  }, [location.pathname]);

  return (
    <Sidebar className="border-r border-gray-200/50 bg-white/95 backdrop-blur-lg shadow-lg" collapsible="icon">
      <SidebarHeader className="border-b border-gray-200/50 p-4 bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
        <div className="flex items-center space-x-3">
          <GradientLogo size={state === "collapsed" ? "sm" : "sm"} />
          {state !== "collapsed" && (
            <div className="flex-1">
              <h2 className="text-lg font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                TherapySync
              </h2>
              <p className="text-xs text-therapy-600/70 font-medium italic leading-tight">
                "{quote}"
              </p>
            </div>
          )}
        </div>
        
        {/* Search functionality */}
        {state !== "collapsed" && (
          <div className="mt-3">
            <SearchBar variant="header" placeholder="Search dashboard..." className="text-xs" />
          </div>
        )}

        {/* Therapy Plan Switcher */}
        {state !== "collapsed" && (
          <div className="mt-3 px-2">
            <TherapyPlanSwitcher onCreateNew={() => setShowPlanCreator(true)} />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {navigationSections.map((section) => (
          <SidebarGroup key={section.title} className="mb-2">
            <SidebarGroupLabel
              className="flex items-center justify-between text-xs font-semibold text-therapy-600 uppercase tracking-wider mb-1 cursor-pointer hover:text-therapy-700 transition-colors px-2"
              onClick={() => {
                if (state !== "collapsed") {
                  setExpandedGroups(prev => ({
                    ...prev,
                    [section.title]: !prev[section.title]
                  }));
                }
              }}
            >
              <div className="flex items-center">
                <section.icon className={`w-3 h-3 ${state !== "collapsed" ? 'mr-2' : ''}`} />
                {state !== "collapsed" && <span>{section.title}</span>}
              </div>
              {state !== "collapsed" && (
                <ChevronDown 
                  className={`w-3 h-3 transition-transform duration-200 ${
                    expandedGroups[section.title] ? 'rotate-180' : ''
                  }`}
                />
              )}
            </SidebarGroupLabel>

            {(state === "collapsed" || expandedGroups[section.title]) && (
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                    
                    // Check if this is a locked feature
                    const isLocked = section.locked && section.requiredFeature && !canAccessFeature(section.requiredFeature);
                    
                    if (isLocked) {
                      return (
                        <SidebarMenuItem key={item.name}>
                          <LockedFeatureItem
                            href={item.href}
                            icon={item.icon}
                            requiredFeature={section.requiredFeature}
                            requiredTier="family"
                            onUpgrade={() => navigate('/subscription')}
                            isCollapsed={state === "collapsed"}
                          >
                            {item.name}
                          </LockedFeatureItem>
                        </SidebarMenuItem>
                      );
                    }
                    
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.href}
                            className={`w-full justify-start text-gray-700 hover:text-therapy-600 hover:bg-therapy-50/50 transition-all duration-200 ${
                              isActive 
                                ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white shadow-md hover:text-white' 
                                : ''
                            } ${state === "collapsed" ? 'px-2' : 'px-3'}`}
                            title={state === "collapsed" ? item.name : undefined}
                          >
                            <item.icon className={`${state === "collapsed" ? 'w-5 h-5' : 'w-4 h-4 mr-3'} flex-shrink-0`} />
                            {state !== "collapsed" && <span className="font-medium">{item.name}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200/50 p-4 bg-gradient-to-t from-therapy-25/50 to-transparent">
        {user && (
          <EnhancedUserDropdown 
            user={user} 
            userStats={userStats} 
            isLoading={isLoading} 
            collapsed={state === "collapsed"}
            onLogout={async () => {
              try {
                await signOut();
                navigate('/');
              } catch (error) {
                console.error('Logout error:', error);
              }
            }}
            onNavigate={navigate}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default EnhancedDashboardSidebar;