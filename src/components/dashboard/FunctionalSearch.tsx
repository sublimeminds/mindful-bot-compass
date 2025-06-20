
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'session' | 'goal' | 'mood' | 'article' | 'technique';
  title: string;
  description: string;
  url: string;
  date?: string;
  category?: string;
}

const FunctionalSearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const searchResults: SearchResult[] = [];

      // Search goals
      const { data: goals } = await supabase
        .from('goals')
        .select('id, title, description, category, created_at')
        .eq('user_id', user.id)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(3);

      if (goals) {
        goals.forEach(goal => {
          searchResults.push({
            id: goal.id,
            type: 'goal',
            title: goal.title,
            description: goal.description || 'No description',
            url: '/goals',
            date: goal.created_at,
            category: goal.category,
          });
        });
      }

      // Search mood entries
      const { data: moods } = await supabase
        .from('mood_entries')
        .select('id, notes, created_at, overall')
        .eq('user_id', user.id)
        .not('notes', 'is', null)
        .ilike('notes', `%${query}%`)
        .limit(3);

      if (moods) {
        moods.forEach(mood => {
          searchResults.push({
            id: mood.id,
            type: 'mood',
            title: `Mood Entry - ${mood.overall}/10`,
            description: mood.notes || 'No notes',
            url: '/mood-tracking',
            date: mood.created_at,
            category: 'mood',
          });
        });
      }

      // Search help articles (public content)
      const { data: articles } = await supabase
        .from('help_articles')
        .select('id, title, content, category')
        .eq('is_active', true)
        .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
        .limit(3);

      if (articles) {
        articles.forEach(article => {
          searchResults.push({
            id: article.id,
            type: 'article',
            title: article.title,
            description: article.content.substring(0, 100) + '...',
            url: `/help/articles/${article.id}`,
            category: article.category,
          });
        });
      }

      // Add quick navigation items if they match
      const quickNav = [
        { title: 'Dashboard', url: '/dashboard', description: 'Your main dashboard' },
        { title: 'Profile Settings', url: '/profile', description: 'Manage your profile' },
        { title: 'Settings', url: '/settings', description: 'App preferences' },
        { title: 'Mood Tracking', url: '/mood-tracking', description: 'Track your mood' },
        { title: 'Goals', url: '/goals', description: 'Manage your goals' },
        { title: 'Session History', url: '/session-history', description: 'View past sessions' },
        { title: 'Techniques', url: '/techniques', description: 'Therapy techniques' },
        { title: 'Analytics', url: '/analytics', description: 'View your progress' },
      ];

      quickNav.forEach(item => {
        if (item.title.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            id: `nav-${item.url}`,
            type: 'article',
            title: item.title,
            description: item.description,
            url: item.url,
            category: 'navigation',
          });
        }
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // Log search activity
    if (user) {
      supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'search',
          activity_data: { query, resultType: result.type, resultId: result.id },
          searchable_content: `search: ${query} clicked: ${result.title}`,
        });
    }

    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    setIsOpen(true);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'goal': return '🎯';
      case 'mood': return '😊';
      case 'session': return '💬';
      case 'article': return '📄';
      case 'technique': return '🧘';
      default: return '📄';
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'goal': return 'bg-blue-100 text-blue-800';
      case 'mood': return 'bg-yellow-100 text-yellow-800';
      case 'session': return 'bg-green-100 text-green-800';
      case 'article': return 'bg-purple-100 text-purple-800';
      case 'technique': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search goals, moods, articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {query.length <= 2 && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                  <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((recentQuery, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRecentSearchClick(recentQuery)}
                      className="w-full justify-start text-left"
                    >
                      <Clock className="h-3 w-3 mr-2" />
                      {recentQuery}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600 mx-auto"></div>
              </div>
            )}

            {query.length > 2 && !loading && results.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            )}

            {results.length > 0 && (
              <div className="divide-y">
                {results.map((result) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    onClick={() => handleResultClick(result)}
                    className="w-full p-4 h-auto justify-start text-left hover:bg-gray-50"
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium truncate">{result.title}</h4>
                          <Badge variant="secondary" className={getTypeColor(result.type)}>
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.description}
                        </p>
                        {result.date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FunctionalSearch;
