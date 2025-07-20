
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, Globe, MessageSquare, Users, Target, Calendar, BarChart3, Settings, HelpCircle, FileText, Shield } from 'lucide-react';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import CleanLanguageSelector from '@/components/ui/CleanLanguageSelector';

const RegionalNavigationHeader = () => {
  const { isMobile, isTablet, isDesktop } = useEnhancedScreenSize();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we should show compact dropdowns (medium screens like MacBook Air)
  const isCompactScreen = isTablet || (!isMobile && window.innerWidth <= 1440);

  const therapyItems = [
    {
      icon: MessageSquare,
      title: "AI Chat",
      description: isCompactScreen ? "Quick therapy chat" : "Start a conversation with your AI therapy companion",
      href: "/chat",
      gradient: "from-therapy-500 to-therapy-600"
    },
    {
      icon: Calendar,
      title: "Sessions",
      description: isCompactScreen ? "Scheduled therapy" : "Book and manage your therapy sessions",
      href: "/therapy-session",
      gradient: "from-calm-500 to-calm-600"
    },
    {
      icon: Target,
      title: "Goals",
      description: isCompactScreen ? "Track progress" : "Set and track your mental health goals",
      href: "/goals",
      gradient: "from-harmony-500 to-harmony-600"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: isCompactScreen ? "View insights" : "Analyze your mental health progress",
      href: "/analytics",
      gradient: "from-balance-500 to-balance-600"
    }
  ];

  const communityItems = [
    {
      icon: Users,
      title: "Community",
      description: isCompactScreen ? "Connect with others" : "Join our supportive mental health community",
      href: "/community",
      gradient: "from-flow-500 to-flow-600"
    },
    {
      icon: MessageSquare,
      title: "Forums",
      description: isCompactScreen ? "Discussion boards" : "Participate in mental health discussions",
      href: "/forums",
      gradient: "from-therapy-500 to-therapy-600"
    },
    {
      icon: Calendar,
      title: "Events",
      description: isCompactScreen ? "Group activities" : "Join group therapy and wellness events",
      href: "/events",
      gradient: "from-calm-500 to-calm-600"
    }
  ];

  const resourceItems = [
    {
      icon: FileText,
      title: "Articles",
      description: isCompactScreen ? "Educational content" : "Read mental health articles and guides",
      href: "/articles",
      gradient: "from-harmony-500 to-harmony-600"
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: isCompactScreen ? "Get support" : "Find answers to common questions",
      href: "/help",
      gradient: "from-balance-500 to-balance-600"
    },
    {
      icon: Shield,
      title: "Privacy",
      description: isCompactScreen ? "Data protection" : "Learn about our privacy and security measures",
      href: "/privacy",
      gradient: "from-flow-500 to-flow-600"
    }
  ];

  if (isMobile) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-gray-900">TherapySync</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <CleanLanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search therapy resources..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-therapy-500 focus:border-therapy-500"
                />
              </div>
              
              <div className="space-y-2">
                {therapyItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.gradient} flex items-center justify-center`}>
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <Link to="/auth/signin">
                    <Button variant="outline" size="sm" className="flex-1">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/signup">
                    <Button size="sm" className="flex-1">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-gray-900">TherapySync</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Therapy Services Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger
                icon={MessageSquare}
                label="Therapy"
              />
              <HeaderDropdownCard compact={isCompactScreen}>
                <div className="space-y-1">
                  {therapyItems.map((item) => (
                    <HeaderDropdownItem
                      key={item.href}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      href={item.href}
                      gradient={item.gradient}
                      compact={isCompactScreen}
                    />
                  ))}
                </div>
              </HeaderDropdownCard>
            </div>

            {/* Community Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger
                icon={Users}
                label="Community"
              />
              <HeaderDropdownCard compact={isCompactScreen}>
                <div className="space-y-1">
                  {communityItems.map((item) => (
                    <HeaderDropdownItem
                      key={item.href}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      href={item.href}
                      gradient={item.gradient}
                      compact={isCompactScreen}
                    />
                  ))}
                </div>
              </HeaderDropdownCard>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger
                icon={FileText}
                label="Resources"
              />
              <HeaderDropdownCard compact={isCompactScreen}>
                <div className="space-y-1">
                  {resourceItems.map((item) => (
                    <HeaderDropdownItem
                      key={item.href}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      href={item.href}
                      gradient={item.gradient}
                      compact={isCompactScreen}
                    />
                  ))}
                </div>
              </HeaderDropdownCard>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-therapy-500 focus:border-therapy-500"
                />
              </div>
            </div>

            {/* Language/Region/Currency Selector */}
            <CleanLanguageSelector />

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link to="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RegionalNavigationHeader;
