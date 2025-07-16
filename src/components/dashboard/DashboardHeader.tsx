
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Calendar,
  Target,
  BarChart3,
  Users,
  MessageSquare,
  Brain,
  Heart
} from 'lucide-react';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';

// Inline responsive logic to bypass Vite caching issues
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isLaptop: false, isDesktop: false, width: 0 };
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isLaptop: width >= 1024 && width < 1280,
      isDesktop: width >= 1280,
      width
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isLaptop: width >= 1024 && width < 1280,
        isDesktop: width >= 1280,
        width
      });
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
};

const DashboardHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { isMobile, isTablet, isLaptop, isDesktop } = useScreenSize();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/chat') return 'Quick Chat';
    if (path === '/therapy-session') return 'Therapy Session';
    if (path.startsWith('/therapy')) return 'Therapy Chat';
    if (path === '/goals') return 'Goals';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    if (path === '/calendar') return 'Calendar';
    if (path === '/community') return 'Community';
    if (path === '/notifications') return 'Notifications';
    if (path === '/mood-tracking') return 'Mood Tracking';
    if (path === '/achievements') return 'Achievements';
    if (path === '/billing') return 'Billing & Payments';
    if (path.startsWith('/admin')) return 'Admin Panel';
    
    // Format path segments for unknown routes
    const segments = path.split('/').filter(Boolean);
    return segments.length > 0 
      ? segments[segments.length - 1].split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      : 'Dashboard';
  };

  // Quick navigation links for different screen sizes
  const getQuickLinks = () => {
    const baseLinks = [
      { href: '/goals', icon: Target, label: 'Goals', mobile: false },
      { href: '/analytics', icon: BarChart3, label: 'Analytics', mobile: false },
      { href: '/community', icon: Users, label: 'Community', mobile: false },
      { href: '/chat', icon: MessageSquare, label: 'Quick Chat', mobile: true },
    ];

    if (isMobile) return baseLinks.filter(link => link.mobile);
    if (isTablet) return baseLinks.slice(0, 2);
    if (isLaptop) return baseLinks.slice(0, 3);
    return baseLinks;
  };

  const quickLinks = getQuickLinks();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-lg shadow-sm supports-[backdrop-filter]:bg-white/60 ml-0">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left section with page title and quick links */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{getPageTitle()}</span>
          </div>
          
          {/* Quick Navigation Links - Progressive disclosure */}
          {quickLinks.length > 0 && (
            <nav className="hidden sm:flex items-center space-x-1 ml-6">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 ${
                    location.pathname === link.href 
                      ? 'bg-therapy-50 text-therapy-700 border border-therapy-200' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="hidden lg:block">{link.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search sessions, insights, goals..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-therapy-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Progressive Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Calendar - Always show on md+ */}
            <Link to="/calendar">
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-gray-100 text-gray-600 font-medium px-3 lg:px-4 py-2"
              >
                <Calendar className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:block">Schedule</span>
              </Button>
            </Link>
            
            {/* New Session - Show on laptop+ */}
            {isLaptop && (
              <Link to="/therapy-session">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-therapy-50 border-therapy-200 text-therapy-700 font-medium px-3 lg:px-4 py-2"
                >
                  <Brain className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:block">New Session</span>
                </Button>
              </Link>
            )}
            
            {/* Mood Check - Show on desktop */}
            {isDesktop && (
              <Link to="/mood-tracking">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-calm-50 text-calm-700 font-medium px-3 lg:px-4 py-2"
                >
                  <Heart className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:block">Mood Check</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Translation Tools */}
          <div className="hidden lg:block">
            <EnhancedLanguageSelector />
          </div>

          {/* Language Selector */}
          <EnhancedLanguageSelector />

          {/* Notification Center */}
          <EnhancedNotificationCenter />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
