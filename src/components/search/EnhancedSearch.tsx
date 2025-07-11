import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Command, 
  Clock, 
  Users, 
  FileText, 
  Target, 
  MessageSquare, 
  BarChart3,
  Calendar,
  Lightbulb,
  X,
  Mic,
  Filter
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'session' | 'goal' | 'insight' | 'page' | 'content' | 'post' | 'milestone';
  title: string;
  description: string;
  url?: string;
  date?: string;
  icon: React.ComponentType<{ className?: string }>;
  metadata?: Record<string, any>;
}

interface SearchFilters {
  type: string;
  dateRange: string;
  category: string;
}

const EnhancedSearch = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    dateRange: 'all',
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Dashboard pages for navigation search
  const dashboardPages = [
    { title: 'Dashboard', url: '/dashboard', description: 'Main dashboard overview', icon: BarChart3 },
    { title: 'Quick Chat', url: '/therapy', description: 'Start a quick therapy chat session', icon: MessageSquare },
    { title: 'Full Session', url: '/therapy-session', description: 'Begin a complete therapy session', icon: Users },
    { title: 'Integrations', url: '/integrations', description: 'Manage your app integrations', icon: Target },
    { title: 'Goals', url: '/goals', description: 'View and manage your therapy goals', icon: Target },
    { title: 'Progress', url: '/progress', description: 'Track your therapy progress', icon: BarChart3 },
    { title: 'Calendar', url: '/calendar', description: 'View your therapy sessions calendar', icon: Calendar },
    { title: 'Community', url: '/community', description: 'Connect with the therapy community', icon: Users },
    { title: 'Insights', url: '/insights', description: 'View your personalized insights', icon: Lightbulb },
    { title: 'Content Library', url: '/content', description: 'Browse therapy resources and content', icon: FileText },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim() || !user) return;
      
      setLoading(true);
      try {
        const searchResults = await performSearch(term, filters);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "There was an error performing your search. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 300),
    [user, filters]
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm, debouncedSearch]);

  const performSearch = async (term: string, searchFilters: SearchFilters): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];
    const lowerTerm = term.toLowerCase();

    // Search dashboard pages
    const pageResults = dashboardPages
      .filter(page => 
        page.title.toLowerCase().includes(lowerTerm) ||
        page.description.toLowerCase().includes(lowerTerm)
      )
      .map(page => ({
        id: `page-${page.url}`,
        type: 'page' as const,
        title: page.title,
        description: page.description,
        url: page.url,
        icon: page.icon,
      }));
    results.push(...pageResults);

    if (!user) return results;

    // Search therapy sessions
    if (searchFilters.type === 'all' || searchFilters.type === 'session') {
      try {
        const { data: sessions, error } = await supabase
          .from('therapy_sessions')
          .select('id, session_type, notes, start_time, end_time')
          .eq('user_id', user.id)
          .ilike('notes', `%${term}%`)
          .order('start_time', { ascending: false })
          .limit(10);

        if (!error && sessions) {
          const sessionResults = sessions.map(session => ({
            id: `session-${session.id}`,
            type: 'session' as const,
            title: `${session.session_type} Session`,
            description: session.notes || 'Therapy session',
            date: new Date(session.start_time).toLocaleDateString(),
            icon: MessageSquare,
            metadata: { duration: session.end_time ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000) : null }
          }));
          results.push(...sessionResults);
        }
      } catch (error) {
        console.error('Error searching sessions:', error);
      }
    }

    // Search goals
    if (searchFilters.type === 'all' || searchFilters.type === 'goal') {
      try {
        const { data: goals, error } = await supabase
          .from('goals')
          .select('id, title, description, status, target_date')
          .eq('user_id', user.id)
          .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && goals) {
          const goalResults = goals.map(goal => ({
            id: `goal-${goal.id}`,
            type: 'goal' as const,
            title: goal.title,
            description: goal.description || 'Personal goal',
            date: goal.target_date ? new Date(goal.target_date).toLocaleDateString() : undefined,
            icon: Target,
            metadata: { status: goal.status }
          }));
          results.push(...goalResults);
        }
      } catch (error) {
        console.error('Error searching goals:', error);
      }
    }

    // Search insights
    if (searchFilters.type === 'all' || searchFilters.type === 'insight') {
      try {
        const { data: insights, error } = await supabase
          .from('goal_insights')
          .select('id, title, description, insight_type, created_at')
          .eq('user_id', user.id)
          .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && insights) {
          const insightResults = insights.map(insight => ({
            id: `insight-${insight.id}`,
            type: 'insight' as const,
            title: insight.title,
            description: insight.description,
            date: new Date(insight.created_at).toLocaleDateString(),
            icon: Lightbulb,
            metadata: { type: insight.insight_type }
          }));
          results.push(...insightResults);
        }
      } catch (error) {
        console.error('Error searching insights:', error);
      }
    }

    // Search content library
    if (searchFilters.type === 'all' || searchFilters.type === 'content') {
      try {
        const { data: content, error } = await supabase
          .from('content_library')
          .select('id, title, description, content_type, category')
          .eq('is_published', true)
          .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && content) {
          const contentResults = content.map(item => ({
            id: `content-${item.id}`,
            type: 'content' as const,
            title: item.title,
            description: item.description || 'Therapy resource',
            icon: FileText,
            metadata: { type: item.content_type, category: item.category }
          }));
          results.push(...contentResults);
        }
      } catch (error) {
        console.error('Error searching content:', error);
      }
    }

    // Search community posts
    if (searchFilters.type === 'all' || searchFilters.type === 'post') {
      try {
        const { data: posts, error } = await supabase
          .from('community_posts')
          .select('id, title, content, category, created_at')
          .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && posts) {
          const postResults = posts.map(post => ({
            id: `post-${post.id}`,
            type: 'post' as const,
            title: post.title,
            description: post.content.substring(0, 100) + '...',
            date: new Date(post.created_at).toLocaleDateString(),
            icon: Users,
            metadata: { category: post.category }
          }));
          results.push(...postResults);
        }
      } catch (error) {
        console.error('Error searching posts:', error);
      }
    }

    return results;
  };

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));

    // Navigate or handle result
    if (result.url) {
      navigate(result.url);
      onClose();
    } else {
      // Handle other result types
      switch (result.type) {
        case 'session':
          navigate(`/therapy-session?session=${result.id.replace('session-', '')}`);
          break;
        case 'goal':
          navigate(`/goals?goal=${result.id.replace('goal-', '')}`);
          break;
        case 'insight':
          navigate(`/insights?insight=${result.id.replace('insight-', '')}`);
          break;
        case 'content':
          navigate(`/content?item=${result.id.replace('content-', '')}`);
          break;
        case 'post':
          navigate(`/community?post=${result.id.replace('post-', '')}`);
          break;
      }
      onClose();
    }
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice search error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice search not supported",
        description: "Your browser doesn't support voice search.",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session': return MessageSquare;
      case 'goal': return Target;
      case 'insight': return Lightbulb;
      case 'content': return FileText;
      case 'post': return Users;
      case 'milestone': return BarChart3;
      default: return FileText;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Enhanced Search</DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sessions, goals, insights, and more..."
              className="pl-10 pr-20 h-12 text-lg"
              autoFocus
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={startVoiceSearch}
                disabled={isListening}
                className="h-8 w-8 p-0"
              >
                <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 w-8 p-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>Use ↑↓ to navigate, ⏎ to select, ESC to close</span>
            <span className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span>+ K to search</span>
            </span>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-6 py-3 border-t bg-muted/30">
            <div className="flex gap-2 flex-wrap">
              {['all', 'session', 'goal', 'insight', 'content', 'post'].map((type) => (
                <Badge
                  key={type}
                  variant={filters.type === type ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => setFilters(prev => ({ ...prev, type }))}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-therapy-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          )}

          {!loading && searchTerm && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results found for "{searchTerm}"</p>
            </div>
          )}

          {!searchTerm && recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(search)}
                  className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {!searchTerm && recentSearches.length === 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground mb-3">Quick Navigation</div>
              {dashboardPages.slice(0, 6).map((page) => (
                <button
                  key={page.url}
                  onClick={() => handleResultClick({
                    id: `page-${page.url}`,
                    type: 'page',
                    title: page.title,
                    description: page.description,
                    url: page.url,
                    icon: page.icon,
                  })}
                  className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <page.icon className="h-4 w-4 text-therapy-600" />
                  <div>
                    <div className="font-medium">{page.title}</div>
                    <div className="text-sm text-muted-foreground">{page.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((result) => {
                const IconComponent = result.icon;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <IconComponent className="h-4 w-4 text-therapy-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{result.description}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {result.date && (
                        <span className="text-xs text-muted-foreground">{result.date}</span>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {result.type}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Debounce utility function
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default EnhancedSearch;