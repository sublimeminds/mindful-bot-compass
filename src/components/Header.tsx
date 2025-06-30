import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Globe, Menu, X, ChevronDown, User, Settings, Crown, MessageSquare, Headphones, LifeBuoy, Users, BookOpen, Zap, DollarSign, BarChart3, Target, Calendar, TrendingUp, Heart as HeartIcon, BookOpen as BookOpenIcon, Lightbulb, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';
import GradientLogo from '@/components/ui/GradientLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const platformMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Brain, description: 'Your personalized dashboard' },
    { label: 'Features Overview', path: '/features-overview', icon: Zap, description: 'All platform capabilities' },
    { label: 'How It Works', path: '/how-it-works', icon: BookOpen, description: 'Learn how to get started' },
    { label: 'Pricing', path: '/pricing', icon: DollarSign, description: 'View our pricing plans' },
    { label: 'Analytics Dashboard', path: '/analytics', icon: BarChart3, description: 'Track your progress' },
    { label: 'Goal Tracking', path: '/goals', icon: Target, description: 'Set and achieve goals' },
    { label: 'Session History', path: '/sessions', icon: Calendar, description: 'View past sessions' },
    { label: 'Progress Reports', path: '/progress', icon: TrendingUp, description: 'Detailed progress analysis' },
    { label: 'Mood Tracker', path: '/mood-tracking', icon: HeartIcon, description: 'Track emotional wellness' },
    { label: 'Digital Notebook', path: '/notebook', icon: BookOpenIcon, description: 'AI-enhanced journaling' },
    { label: 'Integrations', path: '/integrations', icon: Zap, description: 'Connect your apps' }
  ];

  const aiTherapyMenuItems = [
    { label: 'Therapy Types Overview', path: '/therapy-types', icon: Brain, description: 'Explore all therapy options' },
    { label: 'TherapySync AI', path: '/therapy-chat', icon: MessageSquare, description: 'Start AI therapy session' },
    { label: 'Voice Technology', path: '/voice-technology', icon: Headphones, description: 'Advanced voice features' },
    { label: 'Cultural AI Features', path: '/cultural-ai-features', icon: Globe, description: 'Culturally aware support' },
    { label: 'LGBTQ+ Therapy', path: '/lgbtq-therapy', icon: HeartIcon, description: 'Inclusive therapy support' },
    { label: 'Couples Therapy', path: '/couples-therapy', icon: Users, description: 'Relationship counseling' },
    { label: 'ADHD Support', path: '/adhd-therapy', icon: Target, description: 'Focus and attention support' },
    { label: 'Autism Support', path: '/autism-therapy', icon: Users, description: 'Autism-friendly therapy' },
    { label: 'Crisis Support', path: '/crisis-support', icon: Shield, description: '24/7 emergency support' },
    { label: 'Therapy Techniques', path: '/techniques', icon: Lightbulb, description: 'Learn therapeutic skills' }
  ];

  const resourcesMenuItems = [
    { label: 'Help Center', path: '/help', icon: LifeBuoy, description: 'Get support and answers' },
    { label: 'Community', path: '/community', icon: Users, description: 'Connect with others' },
    { label: 'Crisis Resources', path: '/crisis-resources', icon: HeartIcon, description: '24/7 emergency support' },
  ];

  const accountMenuItems = user ? [
    { label: 'Profile', path: '/profile', icon: User, description: 'Manage your profile' },
    { label: 'Settings', path: '/settings', icon: Settings, description: 'Account preferences' },
    { label: 'Upgrade Plan', path: '/pricing', icon: Crown, description: 'Unlock premium features' },
  ] : [];

  const DropdownNavItem = ({ title, items, icon: Icon }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm font-medium transition-all duration-300 hover:text-therapy-600 text-slate-600 flex items-center gap-1 px-3 py-2 hover:bg-therapy-50/50 rounded-lg group">
          <Icon className="h-4 w-4 text-therapy-500 group-hover:text-therapy-600 transition-colors" />
          {title}
          <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-xl p-2 therapy-gradient-border z-50">
        <DropdownMenuLabel className="font-semibold text-therapy-700 px-3 py-2 text-sm">
          {title}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-therapy-200/50 my-2" />
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <DropdownMenuItem
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1 p-3 transition-all duration-200 group ${
                isActive(item.path) ? 'bg-therapy-50 text-therapy-600' : ''
              }`}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-8 h-8 rounded-lg therapy-gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ItemIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-800">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-therapy-100/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Beautiful Animated Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <GradientLogo size="sm" className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-bold therapy-text-gradient-animated">
              TherapySync
            </span>
          </div>

          {/* Desktop Dropdown Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <DropdownNavItem title="Platform" items={platformMenuItems} icon={Brain} />
            <DropdownNavItem title="AI Therapy" items={aiTherapyMenuItems} icon={MessageSquare} />
            <DropdownNavItem title="Resources" items={resourcesMenuItems} icon={LifeBuoy} />
            {user && <DropdownNavItem title="Account" items={accountMenuItems} icon={User} />}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden md:block">
              <EnhancedLanguageSelector />
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-therapy-300 text-therapy-700 hover:bg-therapy-50 transition-all duration-300"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="therapy-gradient-bg text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-therapy-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-therapy-100/50 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-2">
              {/* Platform Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-therapy-700 mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Platform
                </div>
                {platformMenuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        isActive(item.path)
                          ? 'bg-therapy-50 text-therapy-600 font-medium'
                          : 'text-slate-600 hover:bg-therapy-50 hover:text-therapy-600'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* AI Therapy Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-therapy-700 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Therapy
                </div>
                {aiTherapyMenuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        isActive(item.path)
                          ? 'bg-therapy-50 text-therapy-600 font-medium'
                          : 'text-slate-600 hover:bg-therapy-50 hover:text-therapy-600'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Resources Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-therapy-700 mb-3 flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4" />
                  Resources
                </div>
                {resourcesMenuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        isActive(item.path)
                          ? 'bg-therapy-50 text-therapy-600 font-medium'
                          : 'text-slate-600 hover:bg-therapy-50 hover:text-therapy-600'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              
              {/* Language Selector in Mobile */}
              <div className="py-2 px-3">
                <EnhancedLanguageSelector />
              </div>

              {/* Mobile Auth */}
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 px-3 border-t border-therapy-100/50 mt-4">
                  {accountMenuItems.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                          isActive(item.path)
                            ? 'bg-therapy-50 text-therapy-600 font-medium'
                            : 'text-slate-600 hover:bg-therapy-50 hover:text-therapy-600'
                        }`}
                      >
                        <ItemIcon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-600 hover:text-slate-800 justify-start"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 px-3 border-t border-therapy-100/50 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-600 hover:text-slate-800 justify-start"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="therapy-gradient-bg text-white justify-start border-0"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
