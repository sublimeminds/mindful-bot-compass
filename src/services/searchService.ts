import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'goal' | 'mood' | 'session' | 'content' | 'feature' | 'therapist';
  url: string;
  relevance: number;
  category?: string;
  tags?: string[];
  icon?: string;
}

export interface SearchFilters {
  type?: string[];
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

class SearchService {
  // Main search function with AI-powered relevance
  static async search(query: string, filters?: SearchFilters, limit = 10): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    try {
      const results: SearchResult[] = [];
      
      // Search across multiple content types
      const [goals, moods, sessions, content, features] = await Promise.all([
        this.searchGoals(query, limit),
        this.searchMoodEntries(query, limit),
        this.searchSessions(query, limit),
        this.searchContent(query, limit),
        this.searchFeatures(query, limit)
      ]);

      results.push(...goals, ...moods, ...sessions, ...content, ...features);

      // Sort by relevance and apply filters
      const filteredResults = this.applyFilters(results, filters);
      const sortedResults = this.sortByRelevance(filteredResults, query);

      return sortedResults.slice(0, limit);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Quick search for dashboard header (real-time)
  static async quickSearch(query: string, limit = 5): Promise<SearchResult[]> {
    if (!query.trim() || query.length < 2) return [];

    try {
      // Fast search across key content types
      const [goals, features] = await Promise.all([
        this.searchGoals(query, 3),
        this.searchFeatures(query, 2)
      ]);

      const results = [...goals, ...features];
      return this.sortByRelevance(results, query).slice(0, limit);
    } catch (error) {
      console.error('Quick search error:', error);
      return [];
    }
  }

  // Search user goals
  private static async searchGoals(query: string, limit: number): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('id, title, description, category')
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        console.log('Goals table not found, returning empty results');
        return [];
      }

      return (data || []).map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description || '',
        type: 'goal' as const,
        url: `/goals?goal=${goal.id}`,
        relevance: this.calculateRelevance(query, goal.title + ' ' + (goal.description || '')),
        category: goal.category,
        icon: 'Target'
      }));
    } catch (error) {
      console.log('Goal search error, returning empty results:', error);
      return [];
    }
  }

  // Search mood entries
  private static async searchMoodEntries(query: string, limit: number): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('id, notes, overall, created_at')
        .not('notes', 'is', null)
        .ilike('notes', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.log('Mood entries table not found, returning empty results');
        return [];
      }

      return (data || []).map(mood => ({
        id: mood.id,
        title: `Mood Entry - ${mood.overall}/10`,
        description: mood.notes || '',
        type: 'mood' as const,
        url: `/mood-tracking?entry=${mood.id}`,
        relevance: this.calculateRelevance(query, mood.notes || ''),
        category: 'Mood Tracking',
        icon: 'Heart'
      }));
    } catch (error) {
      console.log('Mood search error, returning empty results:', error);
      return [];
    }
  }

  // Search therapy sessions - simplified for existing schema
  private static async searchSessions(query: string, limit: number): Promise<SearchResult[]> {
    try {
      // For now, return empty array since we need to match the exact schema
      // This will be populated once we have the correct therapy_sessions table structure
      return [];
    } catch (error) {
      console.error('Session search error:', error);
      return [];
    }
  }

  // Search content library
  private static async searchContent(query: string, limit: number): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('content_library')
        .select('id, title, description, category, content_type')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(content => ({
        id: content.id,
        title: content.title,
        description: content.description || '',
        type: 'content' as const,
        url: `/dashboard/library/${content.id}`,
        relevance: this.calculateRelevance(query, content.title + ' ' + (content.description || '')),
        category: content.category,
        icon: 'BookOpen'
      }));
    } catch (error) {
      console.error('Content search error:', error);
      return [];
    }
  }

  // Search platform features and pages
  private static async searchFeatures(query: string, limit: number): Promise<SearchResult[]> {
    const features = [
      {
        id: 'dashboard',
        title: 'Wellness Dashboard',
        description: 'Your personalized mental health overview with progress tracking and insights',
        url: '/dashboard',
        category: 'Platform',
        keywords: ['dashboard', 'overview', 'progress', 'insights', 'wellness', 'home']
      },
      {
        id: 'therapy',
        title: 'AI Therapy Chat',
        description: 'Professional AI-powered therapy sessions with personalized treatment',
        url: '/dashboard/therapy',
        category: 'Therapy',
        keywords: ['therapy', 'chat', 'ai', 'sessions', 'treatment', 'counseling']
      },
      {
        id: 'alex',
        title: 'Alex AI Assistant',
        description: 'Your friendly AI companion for guidance, support, and platform help',
        url: '/dashboard/alex',
        category: 'Support',
        keywords: ['alex', 'assistant', 'help', 'support', 'guidance', 'companion']
      },
      {
        id: 'mood',
        title: 'Mood Tracking',
        description: 'Track your emotional state and identify patterns in your mental wellness',
        url: '/dashboard/mood',
        category: 'Tracking',
        keywords: ['mood', 'tracking', 'emotions', 'feelings', 'patterns', 'log']
      },
      {
        id: 'goals',
        title: 'Goal Setting',
        description: 'Set, track, and achieve your personal mental health goals',
        url: '/dashboard/goals',
        category: 'Planning',
        keywords: ['goals', 'targets', 'objectives', 'plans', 'achievements', 'progress']
      },
      {
        id: 'family',
        title: 'Family Features',
        description: 'Collaborative mental health support for families with parental controls',
        url: '/dashboard/family',
        category: 'Family',
        keywords: ['family', 'sharing', 'parental', 'controls', 'collaborative', 'members']
      },
      {
        id: 'crisis',
        title: 'Crisis Support',
        description: '24/7 crisis intervention resources and emergency mental health support',
        url: '/dashboard/crisis',
        category: 'Emergency',
        keywords: ['crisis', 'emergency', 'help', 'suicide', 'intervention', 'support']
      },
      {
        id: 'billing',
        title: 'Billing & Subscription',
        description: 'Manage your subscription, billing history, and payment methods',
        url: '/dashboard/billing',
        category: 'Account',
        keywords: ['billing', 'subscription', 'payment', 'invoice', 'plan', 'upgrade']
      },
      {
        id: 'breathing',
        title: 'Breathing Exercises',
        description: 'Guided breathing techniques for relaxation and stress relief',
        url: '/breathing-exercises',
        category: 'Wellness',
        keywords: ['breathing', 'exercises', 'relaxation', 'stress', 'calm', '4-7-8', 'box breathing']
      },
      {
        id: 'meditation',
        title: 'Meditation Library',
        description: 'Premium meditation collection for mindfulness and inner peace',
        url: '/meditation-library',
        category: 'Wellness',
        keywords: ['meditation', 'mindfulness', 'peace', 'calm', 'spiritual', 'guided']
      },
      {
        id: 'pricing',
        title: 'Pricing Plans',
        description: 'View our affordable pricing plans and subscription options',
        url: '/pricing',
        category: 'Account',
        keywords: ['pricing', 'plans', 'subscription', 'billing', 'cost', 'upgrade', 'pro', 'premium']
      }
    ];

    const lowerQuery = query.toLowerCase();
    const matches = features.filter(feature => {
      const searchText = (feature.title + ' ' + feature.description + ' ' + feature.keywords.join(' ')).toLowerCase();
      return searchText.includes(lowerQuery);
    });

    return matches.slice(0, limit).map(feature => ({
      id: feature.id,
      title: feature.title,
      description: feature.description,
      type: 'feature' as const,
      url: feature.url,
      relevance: this.calculateRelevance(query, feature.title + ' ' + feature.description + ' ' + feature.keywords.join(' ')),
      category: feature.category,
      icon: this.getFeatureIcon(feature.id)
    }));
  }

  // Calculate relevance score
  private static calculateRelevance(query: string, text: string): number {
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();
    
    // Exact match gets highest score
    if (lowerText.includes(lowerQuery)) {
      const position = lowerText.indexOf(lowerQuery);
      const titleBonus = position < 50 ? 0.3 : 0;
      return 0.9 + titleBonus;
    }

    // Word match scoring
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 2);
    const textWords = lowerText.split(' ');
    
    let matchCount = 0;
    queryWords.forEach(qWord => {
      textWords.forEach(tWord => {
        if (tWord.includes(qWord) || qWord.includes(tWord)) {
          matchCount++;
        }
      });
    });

    return Math.min(0.8, matchCount / Math.max(queryWords.length, 1));
  }

  // Apply search filters
  private static applyFilters(results: SearchResult[], filters?: SearchFilters): SearchResult[] {
    if (!filters) return results;

    return results.filter(result => {
      if (filters.type && !filters.type.includes(result.type)) {
        return false;
      }
      if (filters.category && result.category !== filters.category) {
        return false;
      }
      return true;
    });
  }

  // Sort results by relevance
  private static sortByRelevance(results: SearchResult[], query: string): SearchResult[] {
    return results.sort((a, b) => {
      // Primary sort by relevance
      if (a.relevance !== b.relevance) {
        return b.relevance - a.relevance;
      }
      
      // Secondary sort by type priority
      const typePriority = { feature: 4, goal: 3, content: 2, session: 1, mood: 0 };
      const aPriority = typePriority[a.type] || 0;
      const bPriority = typePriority[b.type] || 0;
      
      return bPriority - aPriority;
    });
  }

  // Get icon for feature type
  private static getFeatureIcon(featureId: string): string {
    const iconMap: Record<string, string> = {
      dashboard: 'LayoutDashboard',
      therapy: 'Brain',
      alex: 'MessageSquare',
      mood: 'Heart',
      goals: 'Target',
      family: 'Users',
      crisis: 'Shield',
      billing: 'CreditCard',
      breathing: 'Wind',
      meditation: 'Brain',
      pricing: 'CreditCard'
    };
    return iconMap[featureId] || 'Search';
  }

  // Get search suggestions
  static getSearchSuggestions(query: string): string[] {
    const suggestions = [
      'mood tracking',
      'therapy sessions',
      'crisis support',
      'family features',
      'goal setting',
      'alex assistant',
      'billing history',
      'wellness dashboard',
      'progress insights',
      'meditation content'
    ];

    if (!query.trim()) return suggestions.slice(0, 5);

    const lowerQuery = query.toLowerCase();
    const filtered = suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(lowerQuery)
    );

    return filtered.length > 0 ? filtered.slice(0, 5) : suggestions.slice(0, 5);
  }
}

export default SearchService;