
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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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
              className="bg-gradient-to-r from-therapy-500 via-therapy-600 to-therapy-700 hover:from-therapy-600 hover:via-therapy-700 hover:to-therapy-800 text-white font-semibold rounded-full px-6 py-2 shadow-lg hover:shadow-therapy-500/30 transition-all duration-300 hover:scale-105"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
