import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Settings, Database, Star, BookOpen, ChevronDown, MessageSquare, Headphones, Shield, Globe, Users, Heart, Target, HelpCircle, Calculator, Phone, GraduationCap, Lightbulb } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import GradientLogo from '@/components/ui/GradientLogo';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedUserMenu from './EnhancedUserMenu';
import CompactRegionalSelector from '@/components/regional/CompactRegionalSelector';
import MobileNavigation from './MobileNavigation';
import HeaderDropdowns from './HeaderDropdowns';
import UnifiedSearch from '../search/UnifiedSearch';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
// Inline responsive logic to bypass Vite caching issues
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(window.innerWidth < 768);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < 768);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return { isTablet: false, isDesktop: false };
    const width = window.innerWidth;
    return {
      isTablet: width >= 768 && width < 1200,
      isDesktop: width >= 1200,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isTablet: width >= 768 && width < 1200,
        isDesktop: width >= 1200,
      });
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
};

const RegionalNavigationHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isTablet, isDesktop } = useScreenSize();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <SafeComponentWrapper name="RegionalNavigationHeader">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            
            {/* Left Section - Logo and Mobile Nav */}
            <div className="flex items-center space-x-4">
              <div className="md:hidden">
                <MobileNavigation
                  therapyAiFeatures={[
                    { title: 'AI Therapy Sessions', href: '/therapy', icon: Brain, description: 'Personalized AI therapy sessions' },
                    { title: 'Crisis Support', href: '/crisis', icon: Brain, description: '24/7 crisis intervention' }
                  ]}
                  platformFeatures={[
                    { title: 'Dashboard', href: '/dashboard', icon: Settings, description: 'Your therapy dashboard' },
                    { title: 'Analytics', href: '/analytics', icon: Settings, description: 'Mental health insights' }
                  ]}
                  toolsDataFeatures={[
                    { title: 'Mood Tracking', href: '/mood', icon: Database, description: 'Track your mood patterns' },
                    { title: 'Progress Reports', href: '/reports', icon: Database, description: 'View your progress' }
                  ]}
                  solutionsFeatures={[
                    { title: 'Quick Links', href: '/quick-links', icon: Star, description: 'Fast access to resources' },
                    { title: 'Pricing', href: '/pricing', icon: Star, description: 'View our pricing plans' }
                  ]}
                  resourcesFeatures={[
                    { title: 'Help Center', href: '/help', icon: BookOpen, description: 'Get help and support' },
                    { title: 'Documentation', href: '/docs', icon: BookOpen, description: 'API documentation' }
                  ]}
                />
              </div>
              
              <Link
                to="/" 
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <GradientLogo size="sm" />
                <span className="text-lg md:text-xl font-bold therapy-text-gradient">
                  TherapySync
                </span>
              </Link>
            </div>

            {/* Center Section - Navigation Dropdowns and Search */}
            <div className="flex items-center space-x-3 flex-1 justify-center">
              {/* Medium screens: Compact dropdowns */}
              {isTablet && (
                <div className="flex items-center space-x-1">
                  <HeaderDropdowns />
                </div>
              )}
              
              {/* Large screens: Full dropdowns with icons and descriptions */}
              {isDesktop && (
                <div className="flex items-center space-x-2">
                  {/* Therapy AI Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
                        <Brain className="h-4 w-4 mr-2" />
                        Therapy AI
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg">
                      <div className="p-4 space-y-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          AI Technology
                        </div>
                        <DropdownMenuItem asChild>
                          <Link to="/therapy" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <MessageSquare className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">AI Therapy Sessions</p>
                              <p className="text-xs text-gray-500">Personalized therapy with AI</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/voice-therapy" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Headphones className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Voice Technology</p>
                              <p className="text-xs text-gray-500">Natural voice conversations</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/crisis" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Shield className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Crisis Support</p>
                              <p className="text-xs text-gray-500">24/7 crisis intervention</p>
                            </div>
                            <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                              24/7
                            </Badge>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/cultural-ai" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Globe className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Cultural AI Features</p>
                              <p className="text-xs text-gray-500">Culturally sensitive support</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Features Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
                        <Settings className="h-4 w-4 mr-2" />
                        Features
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg">
                      <div className="p-4 space-y-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Core Features
                        </div>
                        <DropdownMenuItem asChild>
                          <Link to="/mood-tracking" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Heart className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Mood Tracking</p>
                              <p className="text-xs text-gray-500">Track your emotional journey</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Database className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Progress Analytics</p>
                              <p className="text-xs text-gray-500">Insights and trends</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/community" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Users className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Community</p>
                              <p className="text-xs text-gray-500">Connect with others</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/family-features" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Users className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Family Features</p>
                              <p className="text-xs text-gray-500">Family therapy support</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Solutions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-gray-700 hover:text-therapy-600 hover:bg-therapy-50">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Solutions
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg">
                      <div className="p-4 space-y-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Solutions
                        </div>
                        <DropdownMenuItem asChild>
                          <Link to="/individuals" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Target className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">For Individuals</p>
                              <p className="text-xs text-gray-500">Personal therapy plans</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/families" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Users className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">For Families</p>
                              <p className="text-xs text-gray-500">Family therapy support</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/providers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <Shield className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">For Providers</p>
                              <p className="text-xs text-gray-500">Professional tools</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/help" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors">
                            <HelpCircle className="h-5 w-5 text-therapy-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Help Center</p>
                              <p className="text-xs text-gray-500">Support and guides</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Pricing Link */}
                  <Link 
                    to="/pricing" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-therapy-50 hover:text-therapy-700 transition-all duration-200"
                  >
                    <Star className="h-4 w-4" />
                    <span>Pricing</span>
                  </Link>
                </div>
              )}
              
              {/* Search Bar - responsive sizing */}
              <div className={`${isTablet ? 'max-w-sm' : isDesktop ? 'max-w-md' : 'hidden'} flex-1`}>
                <UnifiedSearch 
                  placeholder={user ? "Search sessions, goals, community..." : "Search features, help, pricing..."} 
                  variant="header"
                />
              </div>
            </div>

            {/* Right Section - Regional Selector, Notifications, User Menu */}
            <div className="flex items-center space-x-3">
              
              {/* Regional Preferences Selector */}
              <CompactRegionalSelector />
              
              {user ? (
                <>
                  {/* Notifications */}
                  <EnhancedNotificationCenter />
                  
                  {/* User Menu */}
                  <EnhancedUserMenu />
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth')}
                    className="text-sm font-medium"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white text-sm font-medium px-4 py-2"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </SafeComponentWrapper>
  );
};

export default RegionalNavigationHeader;