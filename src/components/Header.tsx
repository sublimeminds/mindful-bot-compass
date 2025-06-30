
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Globe, Menu, X, ChevronDown, User, Settings, Crown, MessageSquare, Headphones, LifeBuoy, Users, BookOpen, Zap } from 'lucide-react';
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
  ];

  const aiTherapyMenuItems = [
    { label: 'TherapySync AI', path: '/therapy-chat', icon: Brain, description: 'Start AI therapy session' },
    { label: 'Voice Technology', path: '/voice-technology', icon: Headphones, description: 'Advanced voice features' },
    { label: 'Cultural AI Features', path: '/cultural-ai-features', icon: Globe, description: 'Culturally aware support' },
  ];

  const resourcesMenuItems = [
    { label: 'Help Center', path: '/help', icon: LifeBuoy, description: 'Get support and answers' },
    { label: 'Community', path: '/community', icon: Users, description: 'Connect with others' },
    { label: 'Crisis Resources', path: '/crisis-resources', icon: Heart, description: '24/7 emergency support' },
  ];

  const accountMenuItems = user ? [
    { label: 'Profile', path: '/profile', icon: User, description: 'Manage your profile' },
    { label: 'Settings', path: '/settings', icon: Settings, description: 'Account preferences' },
    { label: 'Upgrade Plan', path: '/plans', icon: Crown, description: 'Unlock premium features' },
  ] : [];

  const DropdownNavItem = ({ title, items, icon: Icon }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-sm font-medium transition-colors hover:text-therapy-600 text-slate-600 flex items-center gap-1 px-3 py-2"
        >
          <Icon className="h-4 w-4" />
          {title}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm border border-therapy-100 shadow-xl">
        <DropdownMenuLabel className="font-semibold text-therapy-700">{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <DropdownMenuItem
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer hover:bg-therapy-50 focus:bg-therapy-50 ${
                isActive(item.path) ? 'bg-therapy-50 text-therapy-600' : ''
              }`}
            >
              <div className="flex items-start gap-3 w-full">
                <ItemIcon className="h-4 w-4 mt-0.5 text-therapy-500" />
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.description}</div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-therapy-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Beautiful Animated Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <GradientLogo size="sm" />
            <span className="text-2xl font-bold brand-text-gradient-strong">
              TherapySync
            </span>
          </div>

          {/* Desktop Dropdown Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <DropdownNavItem title="Platform" items={platformMenuItems} icon={Brain} />
            <DropdownNavItem title="AI Therapy" items={aiTherapyMenuItems} icon={MessageSquare} />
            <DropdownNavItem title="Resources" items={resourcesMenuItems} icon={LifeBuoy} />
            {user && <DropdownNavItem title="Account" items={accountMenuItems} icon={User} />}
            
            {/* Direct Pricing Link */}
            <Button
              variant="ghost"
              onClick={() => navigate('/pricing')}
              className={`text-sm font-medium transition-colors hover:text-therapy-600 ${
                isActive('/pricing') 
                  ? 'text-therapy-600 border-b-2 border-therapy-600 pb-1' 
                  : 'text-slate-600'
              }`}
            >
              Pricing
            </Button>
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
                  className="border-therapy-300 text-therapy-700 hover:bg-therapy-50"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-slate-800"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="text-slate-600 hover:text-slate-800"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="brand-button-gradient-strong text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-therapy-100">
            <nav className="flex flex-col space-y-3">
              {/* Platform Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-therapy-700 mb-2">Platform</div>
                {platformMenuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center gap-3 ${
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
                <div className="text-sm font-semibold text-therapy-700 mb-2">AI Therapy</div>
                {aiTherapyMenuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center gap-3 ${
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
                <div className="text-sm font-semibold text-therapy-700 mb-2">Resources</div>
                {resourcesMenuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center gap-3 ${
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

              {/* Pricing */}
              <button
                onClick={() => {
                  navigate('/pricing');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-6 rounded-lg transition-colors ${
                  isActive('/pricing')
                    ? 'bg-therapy-50 text-therapy-600 font-medium'
                    : 'text-slate-600 hover:bg-therapy-50 hover:text-therapy-600'
                }`}
              >
                Pricing
              </button>
              
              {/* Language Selector in Mobile */}
              <div className="py-2 px-3">
                <EnhancedLanguageSelector />
              </div>

              {/* Mobile Auth */}
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 px-3">
                  {accountMenuItems.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center gap-3 ${
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
                <div className="flex flex-col space-y-2 pt-2 px-3">
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
                    className="brand-button-gradient-strong text-white justify-start"
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
