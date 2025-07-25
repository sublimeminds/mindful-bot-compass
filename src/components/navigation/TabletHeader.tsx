import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import CompactDatabaseDropdowns from './CompactDatabaseDropdowns';
import Logo from '@/components/navigation/Logo';
import UserMenu from './UserMenu';
import SearchPopup from '@/components/search/SearchPopup';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import CompactRegionalSelector from '@/components/regional/CompactRegionalSelector';
import { Search, Menu } from 'lucide-react';

const TabletHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="hidden md:block xl:hidden bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Enhanced Navigation - All Categories */}
          <div className="flex-1 flex justify-center px-6">
            <CompactDatabaseDropdowns />
          </div>

          {/* Right side - Regional & User Actions */}
          <div className="flex items-center space-x-3">
            <CompactRegionalSelector />
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

export default TabletHeader;