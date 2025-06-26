
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
  Menu,
  ChevronDown
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

  const therapyItems = [
    { title: "TherapySync AI", href: "/therapysync-ai", icon: Brain },
    { title: "AI Therapy Chat", href: "/therapy", icon: MessageCircle },
    { title: "Voice Technology", href: "/voice-technology", icon: Volume2 },
    { title: "Crisis Management", href: "/crisis-management", icon: Shield },
  ];

  const resourcesItems = [
    { title: "Techniques Library", href: "/techniques", icon: Sparkles },
    { title: "Digital Notebook", href: "/notebook", icon: PenTool },
    { title: "Community Support", href: "/community", icon: Users },
    { title: "Desktop Downloads", href: "/downloads", icon: Monitor },
    { title: "Help Center", href: "/help", icon: HelpCircle },
  ];

  const dashboardItems = user ? [
    { title: "Main Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Session Analytics", href: "/session-analytics", icon: BarChart3 },
    { title: "Goals Tracking", href: "/goals", icon: Target },
    { title: "Smart Scheduling", href: "/smart-scheduling", icon: Calendar },
  ] : [];

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

          {/* Desktop Navigation - Hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Therapy Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-4 py-2 text-sm font-medium">
                  Therapy
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                {therapyItems.map((item) => (
                  <DropdownMenuItem key={item.title} onClick={() => navigate(item.href)}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dashboard Dropdown - Only show for authenticated users */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 px-4 py-2 text-sm font-medium">
                    Dashboard
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                  {dashboardItems.map((item) => (
                    <DropdownMenuItem key={item.title} onClick={() => navigate(item.href)}>
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-4 py-2 text-sm font-medium">
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                {resourcesItems.map((item) => (
                  <DropdownMenuItem key={item.title} onClick={() => navigate(item.href)}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pricing - Simple link for non-authenticated users */}
            {!user && (
              <Button variant="ghost" onClick={() => navigate('/plans')} className="h-10 px-4 py-2 text-sm font-medium">
                Pricing
              </Button>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Clean Language Selector - Hidden on small screens */}
            <div className="hidden lg:flex">
              <CleanLanguageSelector />
            </div>
            
            {user ? (
              <>
                {/* TherapySync AI Button - Hidden on very small screens */}
                <Button
                  onClick={() => navigate('/therapysync-ai')}
                  className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600 text-white font-medium hidden sm:flex"
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
                  className="border-harmony-300 text-harmony-700 hover:bg-harmony-50 hidden sm:flex"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  TherapySync AI
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
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

            {/* Mobile Menu Button - Only visible on small screens */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                  <DropdownMenuLabel>Therapy</DropdownMenuLabel>
                  {therapyItems.slice(0, 3).map((item) => (
                    <DropdownMenuItem key={item.title} onClick={() => navigate(item.href)}>
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  
                  {user && (
                    <>
                      <DropdownMenuLabel>Dashboard</DropdownMenuLabel>
                      {dashboardItems.slice(0, 3).map((item) => (
                        <DropdownMenuItem key={item.title} onClick={() => navigate(item.href)}>
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuLabel>Resources</DropdownMenuLabel>
                  {resourcesItems.slice(0, 3).map((item) => (
                    <DropdownMenuItem key={item.title} onClick={() => navigate(item.href)}>
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                  
                  {!user && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/plans')}>
                        <Crown className="h-4 w-4 mr-2" />
                        Pricing
                      </DropdownMenuItem>
                    </>
                  )}
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
