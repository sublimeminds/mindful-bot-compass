
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, TrendingUp, FileText, User, Calendar } from 'lucide-react';

interface SearchPopupProps {
  children: React.ReactNode;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const quickSearchSuggestions = [
    { icon: TrendingUp, title: 'Mood Tracking', description: 'Track your emotional patterns', href: '/mood-tracking' },
    { icon: FileText, title: 'AI Therapy', description: 'Start a therapy session', href: '/ai-therapy' },
    { icon: User, title: 'Profile Settings', description: 'Manage your account', href: '/profile' },
    { icon: Calendar, title: 'Schedule Session', description: 'Book your next appointment', href: '/calendar' },
  ];

  const recentSearches = [
    'anxiety techniques',
    'breathing exercises',
    'stress management',
    'sleep problems',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-left">Search TherapySync</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for therapy sessions, mood tracking, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-base"
                autoFocus
              />
            </div>
          </form>

          {!searchQuery && (
            <div className="space-y-6">
              {/* Quick suggestions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickSearchSuggestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        window.location.href = item.href;
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <item.icon className="h-5 w-5 text-therapy-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent searches */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch(new Event('submit') as any);
                      }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {searchQuery && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Press Enter to search for "{searchQuery}"</p>
              <Button onClick={handleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search for "{searchQuery}"
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPopup;
