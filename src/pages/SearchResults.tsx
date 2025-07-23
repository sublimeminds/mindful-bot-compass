
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Clock, FileText, User, Calendar, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchResults = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  const searchResults = [
    {
      id: 1,
      type: 'therapy',
      icon: FileText,
      title: 'AI Therapy Sessions',
      description: 'Start a personalized therapy conversation with our AI therapist',
      href: '/ai-therapy',
      relevance: 95
    },
    {
      id: 2,
      type: 'mood',
      icon: TrendingUp,
      title: 'Mood Tracking',
      description: 'Track your emotional patterns and mental health progress',
      href: '/mood-tracking',
      relevance: 87
    },
    {
      id: 3,
      type: 'profile',
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and therapy preferences',
      href: '/profile',
      relevance: 76
    },
    {
      id: 4,
      type: 'schedule',
      icon: Calendar,
      title: 'Schedule Session',
      description: 'Book and manage your therapy appointments',
      href: '/calendar',
      relevance: 82
    }
  ];

  const filters = [
    { key: 'all', label: 'All Results' },
    { key: 'therapy', label: 'Therapy' },
    { key: 'mood', label: 'Mood' },
    { key: 'profile', label: 'Profile' },
    { key: 'schedule', label: 'Schedule' }
  ];

  const filteredResults = activeFilter === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === activeFilter);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search TherapySync..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.key)}
                className="flex items-center gap-1"
              >
                <Filter className="h-3 w-3" />
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600">
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} 
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-therapy-100 rounded-lg flex items-center justify-center">
                      <result.icon className="h-5 w-5 text-therapy-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-therapy-600 transition-colors">
                        <a href={result.href}>{result.title}</a>
                      </h3>
                      <span className="text-sm text-gray-500">{result.relevance}% match</span>
                    </div>
                    <p className="text-gray-600 mt-1">{result.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm text-therapy-600 font-medium capitalize">
                        {result.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {result.href}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button onClick={() => setActiveFilter('all')} variant="outline">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
