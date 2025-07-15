import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import GradientLogo from '@/components/ui/GradientLogo';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedUserMenu from './EnhancedUserMenu';
import CompactRegionalSelector from '@/components/regional/CompactRegionalSelector';
import MobileNavigation from './MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

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
                  therapyAiFeatures={[]}
                  platformFeatures={[]}
                  toolsDataFeatures={[]}
                  solutionsFeatures={[]}
                  resourcesFeatures={[]}
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

            {/* Center Section - Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/how-it-works" 
                className="text-sm font-medium text-gray-700 hover:text-therapy-700 transition-colors"
              >
                How it works
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm font-medium text-gray-700 hover:text-therapy-700 transition-colors"
              >
                Pricing
              </Link>
              <Link 
                to="/support" 
                className="text-sm font-medium text-gray-700 hover:text-therapy-700 transition-colors"
              >
                Support
              </Link>
            </nav>

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