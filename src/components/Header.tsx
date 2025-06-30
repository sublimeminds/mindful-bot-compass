
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Globe, Menu, X, ChevronDown, User, Settings, Crown, MessageSquare, Headphones, LifeBuoy, Users, BookOpen, Zap, DollarSign, BarChart3, Target, Calendar, Notebook, Settings2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';
import Logo from '@/components/navigation/Logo';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeouts = useRef<{[key: string]: NodeJS.Timeout}>({});

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeouts.current[dropdown]) {
      clearTimeout(dropdownTimeouts.current[dropdown]);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = (dropdown: string) => {
    dropdownTimeouts.current[dropdown] = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      Object.values(dropdownTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const therapyDropdownItems = [
    { label: 'Therapy Types Overview', path: '/therapy-types', icon: Brain, description: 'Explore all therapy specializations' },
    { label: 'Couples Therapy', path: '/couples-therapy', icon: Heart, description: 'Relationship counseling support' },
    { label: 'ADHD Support', path: '/adhd-therapy', icon: Target, description: 'Focus and executive function help' },
    { label: 'LGBTQ+ Therapy', path: '/lgbtq-therapy', icon: Users, description: 'Inclusive and affirming support' },
    { label: 'Crisis Support', path: '/crisis-support', icon: LifeBuoy, description: '24/7 emergency assistance' },
    { label: 'Voice Technology', path: '/voice-technology', icon: Headphones, description: 'Natural voice conversations' },
    { label: 'Cultural AI Features', path: '/cultural-ai-features', icon: Globe, description: 'Culturally sensitive therapy' }
  ];

  const platformDropdownItems = [
    { label: 'New Features Showcase', path: '/features-showcase', icon: Zap, description: 'Latest platform capabilities' },
    { label: 'Features Overview', path: '/features-overview', icon: BookOpen, description: 'Complete feature breakdown' },
    { label: 'How It Works', path: '/how-it-works', icon: Settings, description: 'Platform walkthrough' },
    { label: 'Pricing', path: '/pricing', icon: DollarSign, description: 'Plans and pricing options' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* AI Therapy Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('therapy')}
              onMouseLeave={() => handleMouseLeave('therapy')}
            >
              <button className="flex items-center space-x-1 text-slate-700 hover:text-therapy-600 transition-colors duration-200 font-medium">
                <Brain className="h-4 w-4" />
                <span>{t('nav.aiTherapy', 'AI Therapy')}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {activeDropdown === 'therapy' && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200/50 py-4 z-50 backdrop-blur-sm">
                  {therapyDropdownItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-start space-x-3 px-4 py-3 hover:bg-therapy-50 transition-colors duration-200 group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 group-hover:text-therapy-700">{item.label}</div>
                        <div className="text-sm text-slate-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('platform')}
              onMouseLeave={() => handleMouseLeave('platform')}
            >
              <button className="flex items-center space-x-1 text-slate-700 hover:text-therapy-600 transition-colors duration-200 font-medium">
                <Settings className="h-4 w-4" />
                <span>{t('nav.platform', 'Platform')}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {activeDropdown === 'platform' && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200/50 py-4 z-50 backdrop-blur-sm">
                  {platformDropdownItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-start space-x-3 px-4 py-3 hover:bg-therapy-50 transition-colors duration-200 group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 group-hover:text-therapy-700">{item.label}</div>
                        <div className="text-sm text-slate-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link to="/help" className={`font-medium transition-colors duration-200 ${isActive('/help') ? 'text-therapy-600' : 'text-slate-700 hover:text-therapy-600'}`}>
              {t('nav.help', 'Help')}
            </Link>
          </div>

          {/* Right Side - Auth & Language */}
          <div className="hidden md:flex items-center space-x-4">
            <EnhancedLanguageSelector />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="text-slate-700 hover:text-therapy-600 hover:bg-therapy-50"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t('nav.dashboard', 'Dashboard')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-slate-700 hover:text-red-600 hover:bg-red-50"
                >
                  {t('nav.logout', 'Logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="text-slate-700 hover:text-therapy-600 hover:bg-therapy-50"
                >
                  {t('nav.signIn', 'Sign In')}
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {t('nav.getStarted', 'Get Started')}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200/50 py-4 space-y-4">
            <div className="space-y-2">
              <div className="font-semibold text-slate-700 px-4 py-2 border-b border-slate-100">
                {t('nav.aiTherapy', 'AI Therapy')}
              </div>
              {therapyDropdownItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-3 px-6 py-2 text-slate-600 hover:text-therapy-600 hover:bg-therapy-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-slate-700 px-4 py-2 border-b border-slate-100">
                {t('nav.platform', 'Platform')}
              </div>
              {platformDropdownItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-3 px-6 py-2 text-slate-600 hover:text-therapy-600 hover:bg-therapy-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="px-4 pt-4 border-t border-slate-200/50">
              <EnhancedLanguageSelector />
              
              {user ? (
                <div className="space-y-2 mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-700 hover:text-therapy-600 hover:bg-therapy-50"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('nav.dashboard', 'Dashboard')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-700 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {t('nav.logout', 'Logout')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-700 hover:text-therapy-600 hover:bg-therapy-50"
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {t('nav.signIn', 'Sign In')}
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white border-0"
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {t('nav.getStarted', 'Get Started')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
