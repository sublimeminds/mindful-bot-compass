import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import SearchService, { SearchResult } from '@/services/searchService';
import { useDebounce } from '@/hooks/useDebounce';
import * as Icons from 'lucide-react';

interface SearchBarProps {
  variant?: 'header' | 'full';
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  variant = 'header', 
  placeholder = "Search anything...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setSuggestions(SearchService.getSearchSuggestions(''));
    }
  }, [debouncedQuery]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const searchResults = variant === 'header' 
        ? await SearchService.quickSearch(searchQuery)
        : await SearchService.search(searchQuery);
      
      setResults(searchResults);
      setSuggestions(SearchService.getSearchSuggestions(searchQuery));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!query.trim()) {
      setSuggestions(SearchService.getSearchSuggestions(''));
    }
  };

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(query);
    setIsOpen(false);
    setQuery('');
    navigate(result.url);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    performSearch(search);
  };

  const addToRecentSearches = (search: string) => {
    if (!search.trim()) return;
    
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getResultIcon = (result: SearchResult) => {
    const IconComponent = (Icons as any)[result.icon || 'Search'];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Search className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      feature: 'text-primary',
      goal: 'text-green-600',
      content: 'text-blue-600',
      session: 'text-purple-600',
      mood: 'text-pink-600',
      therapist: 'text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`pl-10 pr-10 ${variant === 'header' ? 'h-9' : 'h-11'} bg-background border-border`}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearQuery}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-0 shadow-lg border border-border bg-background z-50 max-h-96 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center text-muted-foreground">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Searching...</span>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <div className="border-b border-border">
                <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/50">
                  Search Results
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 ${getTypeColor(result.type)}`}>
                        {getResultIcon(result)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground truncate">
                            {result.title}
                          </h4>
                          {result.category && (
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                              {result.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {result.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!isLoading && !query.trim() && recentSearches.length > 0 && (
              <div className="border-b border-border">
                <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/50">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{search}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div>
                <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/50">
                  {query.trim() ? 'Suggestions' : 'Popular Searches'}
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.trim() && results.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;