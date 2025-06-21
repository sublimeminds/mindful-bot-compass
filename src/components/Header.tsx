
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  User, 
  LogOut, 
  Settings,
  Brain,
  BookOpen,
  Users,
  BarChart3,
  Heart,
  HelpCircle,
  LayoutDashboard,
  Calendar,
  Target,
  PenTool,
  TrendingUp,
  Sparkles,
  Shield,
  Crown,
  Mic,
  Bell,
  FileText,
  Home,
  Languages,
  Globe,
  Accessibility,
  UserCheck,
  GraduationCap,
  Palette,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import GradientLogo from '@/components/ui/GradientLogo';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';
import EnhancedCurrencySelector from '@/components/ui/EnhancedCurrencySelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Header = () => {
  const { user, logout } = useSimpleApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const therapyFeatures = [
    {
      title: "TherapySync AI",
      href: "/therapysync-ai",
      description: "Advanced AI-powered therapy platform",
      icon: Brain,
    },
    {
      title: "AI Therapy Chat",
      href: "/therapy",
      description: "Real-time AI therapy conversations",
      icon: MessageCircle,
    },
    {
      title: "Mood Tracking",
      href: "/mood-tracking",
      description: "Monitor your emotional well-being",
      icon: Heart,
    },
    {
      title: "Session History",
      href: "/session-history",
      description: "Review past therapy sessions",
      icon: FileText,
    },
  ];

  const therapistFeatures = [
    {
      title: "AI Therapist Profiles",
      href: "/therapists",
      description: "Meet our AI therapists with unique personalities",
      icon: Users,
    },
    {
      title: "Voice Samples",
      href: "/voice-features",
      description: "Experience our ElevenLabs voice technology",
      icon: Mic,
    },
    {
      title: "Therapist Matching",
      href: "/therapist-matching",
      description: "Find the perfect AI therapist for your needs",
      icon: UserCheck,
    },
  ];

  const resourcesFeatures = [
    {
      title: "Techniques Library",
      href: "/techniques",
      description: "Guided therapeutic techniques and exercises",
      icon: Sparkles,
    },
    {
      title: "Digital Notebook",
      href: "/notebook",
      description: "Journal your thoughts and progress",
      icon: PenTool,
    },
    {
      title: "Community Support",
      href: "/community",
      description: "Connect with supportive communities",
      icon: Users,
    },
    {
      title: "Help Center",
      href: "/help",
      description: "Get answers and support",
      icon: HelpCircle,
    },
  ];

  const publicNavigation = [
    {
      title: "Therapy & AI",
      items: therapyFeatures,
    },
    {
      title: "Therapists",
      items: therapistFeatures,
    },
    {
      title: "Resources",
      items: resourcesFeatures,
    },
    {
      title: "Pricing",
      href: "/plans",
    },
    {
      title: "Compare Plans",
      href: "/compare-plans",
    },
  ];

  const authenticatedNavigation = [
    {
      title: "Therapy & AI",
      items: therapyFeatures,
    },
    {
      title: "Therapists",
      items: therapistFeatures,
    },
    {
      title: "Dashboard",
      items: [
        {
          title: "Main Dashboard",
          href: "/dashboard",
          description: "Your wellness overview",
          icon: LayoutDashboard,
        },
        {
          title: "Session Analytics",
          href: "/session-analytics",
          description: "Detailed analysis of your progress",
          icon: BarChart3,
        },
        {
          title: "Goals Tracking",
          href: "/goals",
          description: "Set and achieve wellness goals",
          icon: Target,
        },
        {
          title: "Smart Scheduling",
          href: "/smart-scheduling",
          description: "AI-powered session scheduling",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Resources",
      items: resourcesFeatures,
    },
  ];

  const navigationItems = user ? authenticatedNavigation : publicNavigation;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-harmony-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <GradientLogo size="sm" />
            <span className="text-xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">
              TherapySync
            </span>
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="h-10 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[500px] gap-3 p-6 md:w-[600px] md:grid-cols-2 lg:w-[700px] bg-white border border-gray-200 shadow-lg rounded-md z-50">
                          {item.items.map((subItem) => (
                            <NavigationMenuLink
                              key={subItem.title}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                              onClick={() => navigate(subItem.href)}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <subItem.icon className="h-4 w-4 text-harmony-600" />
                                <div className="text-sm font-medium leading-none">{subItem.title}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {subItem.description}
                              </p>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
                      onClick={() => navigate(item.href || '')}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Language & Currency Selectors */}
            <div className="hidden md:flex items-center space-x-2">
              <EnhancedLanguageSelector />
              <EnhancedCurrencySelector />
            </div>
            
            {user ? (
              <>
                {/* Quick Access to TherapySync AI */}
                <Button
                  onClick={() => navigate('/therapysync-ai')}
                  className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600 text-white font-medium"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  TherapySync AI
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-harmony-500 to-flow-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden lg:inline text-sm">
                        {user.email?.split('@')[0] || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                    <DropdownMenuLabel className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.email}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Premium Member
                      </Badge>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/therapysync-ai')}
                  variant="outline"
                  size="sm"
                  className="border-harmony-300 text-harmony-700 hover:bg-harmony-50"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Try AI
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  size="sm"
                  className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
