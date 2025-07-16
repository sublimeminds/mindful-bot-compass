import React, { useState, useEffect } from 'react';
import { Search, X, History, Hash, User, MessageSquare, Calendar, Target, TrendingUp, FileText, BookOpen, Heart, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'feature' | 'content' | 'session' | 'goal' | 'community' | 'help';
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  authenticated?: boolean;
}

interface UnifiedSearchProps {
  placeholder?: string;
  className?: string;
  variant?: 'header' | 'dashboard' | 'overlay';
  onResultClick?: () => void;
}

const UnifiedSearch: React.FC<UnifiedSearchProps> = ({ 
  placeholder = "Search...", 
  className = "", 
  variant = "header",
  onResultClick 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // All possible search results
  const searchData: SearchResult[] = [
    // Public content (always available)
    { id: '1', title: 'Getting Started', description: 'Learn how to use TherapySync', type: 'page', url: '/getting-started', icon: BookOpen },
    { id: '2', title: 'AI Therapy Sessions', description: 'Personalized AI therapy sessions', type: 'feature', url: '/therapy', icon: MessageSquare },
    { id: '3', title: 'Crisis Support', description: '24/7 crisis intervention', type: 'feature', url: '/crisis', icon: Heart },
    { id: '4', title: 'Pricing Plans', description: 'View our pricing options', type: 'page', url: '/pricing', icon: FileText },
    { id: '5', title: 'Voice Technology', description: 'Natural voice conversations', type: 'feature', url: '/features#voice', icon: MessageSquare },
    { id: '6', title: 'Cultural Sensitivity', description: 'Culturally appropriate support', type: 'feature', url: '/features#cultural', icon: User },
    { id: '7', title: 'Family Plans', description: 'Family mental health support', type: 'feature', url: '/features#family', icon: User },
    { id: '8', title: 'Help Center', description: 'Get help and support', type: 'help', url: '/help', icon: HelpCircle },
    { id: '9', title: 'Privacy Policy', description: 'Our privacy practices', type: 'page', url: '/privacy', icon: FileText },
    { id: '10', title: 'Terms of Service', description: 'Terms and conditions', type: 'page', url: '/terms', icon: FileText },
    
    // Authenticated content (only for logged in users)
    { id: '11', title: 'Dashboard', description: 'Your therapy dashboard', type: 'page', url: '/dashboard', icon: TrendingUp, authenticated: true },
    { id: '12', title: 'Mood Tracking', description: 'Track your mood patterns', type: 'feature', url: '/mood-tracking', icon: Heart, authenticated: true },
    { id: '13', title: 'Progress Analytics', description: 'View your progress insights', type: 'feature', url: '/analytics', icon: TrendingUp, authenticated: true },
    { id: '14', title: 'Goals & Objectives', description: 'Set and track your goals', type: 'goal', url: '/goals', icon: Target, authenticated: true },
    { id: '15', title: 'Community Posts', description: 'Community discussions', type: 'community', url: '/community', icon: MessageSquare, authenticated: true },
    { id: '16', title: 'Session History', description: 'Your therapy session history', type: 'session', url: '/sessions', icon: Calendar, authenticated: true },
    { id: '17', title: 'Therapy Chat', description: 'Start a new therapy session', type: 'session', url: '/therapy-session', icon: MessageSquare, authenticated: true },
    { id: '18', title: 'Quick Chat', description: 'Quick AI support', type: 'session', url: '/chat', icon: MessageSquare, authenticated: true },
    { id: '19', title: 'Achievement Badges', description: 'View your achievements', type: 'content', url: '/achievements', icon: Target, authenticated: true },
    { id: '20', title: 'Billing & Payments', description: 'Manage your subscription', type: 'page', url: '/billing', icon: FileText, authenticated: true },
  ];

  // Filter results based on authentication status and search query
  const getFilteredResults = (searchQuery: string) => {
    if (!searchQuery.trim()) return [];
    
    const filtered = searchData.filter(item => {
      // Check if user should see this result
      if (item.authenticated && !user) return false;
      
      // Check if query matches
      const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDescription = item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = item.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTitle || matchesDescription || matchesType;
    });
    
    return filtered.slice(0, 8); // Limit to 8 results
  };

  // Handle search input change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        setResults(getFilteredResults(query));
      } else {
        setResults([]);
      }
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [query, user]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setIsOpen(false);
    
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [result.title, ...prev.filter(s => s !== result.title)];
      return updated.slice(0, 5);
    });
    
    onResultClick?.();
  };

  // Handle search focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle search blur
  const handleBlur = () => {
    // Delay to allow click on results
    setTimeout(() => setIsOpen(false), 200);
  };

  // Get search input styles based on variant
  const getInputStyles = () => {
    switch (variant) {
      case 'dashboard':
        return "w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-therapy-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-500";
      case 'overlay':
        return "w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-therapy-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 text-lg";
      default:
        return "w-full pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-therapy-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-500";
    }
  };

  // Get search icon styles
  const getIconStyles = () => {
    switch (variant) {
      case 'overlay':
        return "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5";
      default:
        return "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className={getIconStyles()} />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={getInputStyles()}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                Search Results
              </div>
              {results.map((result) => {
                const IconComponent = result.icon;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-therapy-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        {result.badge && (
                          <Badge variant="outline" className="text-xs">
                            {result.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {result.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="p-6 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or browse our help center</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                Popular {user ? 'Features' : 'Pages'}
              </div>
              {(user ? searchData.filter(item => item.authenticated) : searchData.filter(item => !item.authenticated)).slice(0, 5).map((result) => {
                const IconComponent = result.icon;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors text-left"
                  >
                    <IconComponent className="h-4 w-4 text-therapy-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedSearch;