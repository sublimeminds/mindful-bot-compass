
import React from 'react';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/navigation/Logo';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import UserMenu from '@/components/navigation/UserMenu';
import SafeComponent from '@/components/SafeComponent';

const DesktopHeader = () => {
  const { user } = useSafeAuth();
  const navigate = useNavigate();

  return (
    <SafeComponent 
      componentName="DesktopHeader"
      fallback={
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-center">
              <span className="text-muted-foreground">Loading...</span>
            </div>
          </div>
        </header>
      }
    >
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            
            <div className="flex-1 mx-8">
              <UnifiedNavigation />
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </SafeComponent>
  );
};

export default DesktopHeader;
