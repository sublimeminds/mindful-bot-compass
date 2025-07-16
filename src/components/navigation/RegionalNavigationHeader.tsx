import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Settings, Database, Star, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GradientLogo from '@/components/ui/GradientLogo';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedUserMenu from './EnhancedUserMenu';
import CompactRegionalSelector from '@/components/regional/CompactRegionalSelector';
import MobileNavigation from './MobileNavigation';
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

const RegionalNavigationHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

            {/* Spacer for center alignment */}
            <div className="flex-1"></div>

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