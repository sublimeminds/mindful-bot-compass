
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { 
  Menu, 
  Search, 
  Bell, 
  Calendar, 
  Brain, 
  Heart,
  X,
  User
} from 'lucide-react';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';

interface UnifiedMobileHeaderProps {
  onMenuToggle: () => void;
  className?: string;
}

const UnifiedMobileHeader: React.FC<UnifiedMobileHeaderProps> = ({ onMenuToggle, className }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/chat') return 'Therapy';
    if (path === '/mood') return 'Mood';
    if (path === '/goals') return 'Goals';
    if (path === '/profile') return 'Profile';
    if (path === '/calendar') return 'Calendar';
    if (path === '/community') return 'Community';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    return 'TherapySync';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  if (showSearch) {
    return (
      <header className={`md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 ${className || ''}`}>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(false)}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
          <Input
            type="search"
            placeholder="Search sessions, insights, goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="sm" className="shrink-0">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </header>
    );
  }

  return (
    <header className={`md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 ${className || ''}`}>
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-therapy-800 truncate">
            {getPageTitle()}
          </h1>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Quick Actions */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/calendar')}
          >
            <Calendar className="h-5 w-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/mood')}
          >
            <Heart className="h-5 w-5" />
          </Button>

          {/* Language Selector */}
          <div className="hidden sm:block">
            <EnhancedLanguageSelector />
          </div>

          {/* Notifications */}
          <EnhancedNotificationCenter />

          {/* Profile */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UnifiedMobileHeader;
