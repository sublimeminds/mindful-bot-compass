
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import UserMenu from './UserMenu';
import UnifiedNavigation from './UnifiedNavigation';

const DesktopHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Logo />
        
        {/* Navigation */}
        <div className="hidden md:flex items-center flex-1 justify-center">
          <UnifiedNavigation />
        </div>
        
        {/* Right side - User menu or login */}
        <div className="flex items-center space-x-4">
          {user ? (
            <UserMenu user={user} logout={logout} />
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-600 hover:from-harmony-600 hover:via-balance-600 hover:to-flow-700 text-white font-semibold rounded-full px-8 py-3 shadow-lg hover:shadow-harmony/30 transition-all duration-300 hover:scale-105"
            >
              <User className="h-5 w-5 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
