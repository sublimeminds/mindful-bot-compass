
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import DatabaseHeaderDropdowns from './DatabaseHeaderDropdowns';
import Logo from '@/components/navigation/Logo';
import UserMenu from './UserMenu';
import SearchPopup from '@/components/search/SearchPopup';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import CompactRegionalSelector from '@/components/ui/CompactRegionalSelector';
import { Search } from 'lucide-react';

const DesktopHeaderFull = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="hidden lg:block bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Database-driven Navigation */}
          <div className="flex items-center space-x-8">
            <Logo />
            <DatabaseHeaderDropdowns />
          </div>

          {/* Regional Preferences - Compact All-in-One Selector */}
          <div className="flex items-center">
            <CompactRegionalSelector />
          </div>

          {/* Right side - User Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <SearchPopup>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </SearchPopup>
                <EnhancedNotificationCenter />
                <UserMenu />
                <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <SearchPopup>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </SearchPopup>
                <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-therapy-600 hover:bg-therapy-700 text-white" size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeaderFull;
