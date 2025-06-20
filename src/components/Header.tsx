
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/navigation/Logo';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import UserMenu from '@/components/navigation/UserMenu';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          {/* Show unified navigation */}
          <div className="flex-1 mx-8 hidden lg:block">
            <UnifiedNavigation />
          </div>
          
          {/* Mobile navigation trigger for smaller screens */}
          <div className="lg:hidden flex-1 flex justify-center">
            <UnifiedNavigation />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
