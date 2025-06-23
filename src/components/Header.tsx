
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
  Volume2,
  UserCheck,
  Star,
  Monitor,
  Cpu,
  Menu
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import GradientLogo from '@/components/ui/GradientLogo';
import CleanLanguageSelector from '@/components/ui/CleanLanguageSelector';
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
      description: "Advanced AI-powered therapy platform with voice technology",
      icon: Brain,
    },
    {
      title: "AI Therapy Chat",
      href: "/therapy",
      description: "Real-time AI therapy conversations with emotional intelligence",
      icon: MessageCircle,
    },
    {
      title: "Voice Technology",
      href: "/voice-technology",
      description: "Experience our advanced voice synthesis and emotion detection",
      icon: Volume2,
    },
    {
      title: "Crisis Management",
      href: "/crisis-management",
      description: "24/7 AI-powered crisis detection and intervention",
      icon: Shield,
    },
  ];

  const therapistFeatures = [
    {
      title: "AI Therapist Profiles",
      href: "/therapists",
      description: "Meet our AI therapists with unique personalities and specializations",
      icon: Users,
    },
    {
      title: "Therapist Matching",
      href: "/therapist-matching",
      description: "AI-powered matching to find your perfect therapist",
      icon: UserCheck,
    },
    {
      title: "Individual Profiles",
      href: "/therapist-profiles",
      description: "Detailed profiles with voice samples and specializations",
      icon: User,
    },
  ];

  const resourcesFeatures = [
    {
      title: "Techniques Library",
      href: "/techniques",
      description: "Comprehensive collection of therapeutic techniques and exercises",
      icon: Sparkles,
    },
    {
      title: "Digital Notebook",
      href: "/notebook",
      description: "AI-enhanced journaling with insights and progress tracking",
      icon: PenTool,
    },
    {
      title: "Community Support",
      href: "/community",
      description: "Connect with supportive communities and peer groups",
      icon: Users,
    },
    {
      title: "Crisis Resources",
      href: "/crisis-resources",
      description: "Immediate access to crisis support and emergency resources",
      icon: Shield,
    },
    {
      title: "Help Center",
      href: "/help",
      description: "Comprehensive guides, tutorials, and support documentation",
      icon: HelpCircle,
    },
  ];

  const dashboardFeatures = [
    {
      title: "Main Dashboard",
      href: "/dashboard",
      description: "Your comprehensive wellness overview and progress tracking",
      icon: LayoutDashboard,
    },
    {
      title: "Session Analytics",
      href: "/session-analytics",
      description: "Detailed AI-powered analysis of your therapy progress",
      icon: BarChart3,
    },
    {
      title: "Goals Tracking",
      href: "/goals",
      description: "Set, monitor, and achieve your mental wellness goals",
      icon: Target,
    },
    {
      title: "Smart Scheduling",
      href: "/smart-scheduling",
      description: "AI-optimized session scheduling based on your patterns",
      icon: Calendar,
    },
    {
      title: "Enhanced Monitoring",
      href: "/enhanced-monitoring",
      description: "Advanced progress monitoring with predictive insights",
      icon: TrendingUp,
    },
  ];

  const platformFeatures = [
    {
      title: "Features Overview",
      href: "/features-overview",
      description: "Comprehensive overview of all TherapySync features and capabilities",
      icon: Star,
    },
    {
      title: "AI Technology Hub",
      href: "/ai-hub",
      description: "Deep dive into our AI technology and capabilities",
      icon: Cpu,
    },
    {
      title: "System Health",
      href: "/system-health",
      description: "Real-time system monitoring and platform status",
      icon: Monitor,
    },
    {
      title: "Compare Plans",
      href: "/compare-plans",
      description: "Detailed comparison of all subscription plans and features",
      icon: BarChart3,
    },
  ];

  const pricingFeatures = [
    {
      title: "Subscription Plans",
      href: "/plans",
      description: "Choose the perfect plan for your mental wellness journey",
      icon: Crown,
    },
    {
      title: "Compare Plans",
      href: "/compare-plans",
      description: "Side-by-side comparison of features and pricing",
      icon: BarChart3,
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
      title: "Platform",
      items: platformFeatures,
    },
    {
      title: "Resources",
      items: resourcesFeatures,
    },
    {
      title: "Pricing",
      items: pricingFeatures,
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
      items: dashboardFeatures,
    },
    {
      title: "Resources",
      items: resourcesFeatures,
    },
  ];

  const navigationItems = user ? authenticatedNavigation : publicNavigation;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-harmony-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <GradientLogo size="sm" />
            <span className="text-xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">
              TherapySync
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
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
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Clean Language Selector */}
            <div className="hidden md:flex">
              <CleanLanguageSelector />
            </div>
            
            {user ? (
              <>
                {/* TherapySync AI Button */}
                <Button
                  onClick={() => navigate('/therapysync-ai')}
                  className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600 text-white font-medium hidden md:flex"
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
                  TherapySync AI
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

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                  {navigationItems.map((item) => (
                    <div key={item.title}>
                      <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                      {item.items.slice(0, 3).map((subItem) => (
                        <DropdownMenuItem key={subItem.title} onClick={() => navigate(subItem.href)}>
                          <subItem.icon className="h-4 w-4 mr-2" />
                          {subItem.title}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
