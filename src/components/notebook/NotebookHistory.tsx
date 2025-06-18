
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Search, Filter, Edit3, Heart, Mic, 
  Clock, Tag, ChevronDown, ChevronUp, FileText
} from 'lucide-react';

interface NotebookHistoryProps {
  entries: any[];
}

const NotebookHistory = ({ entries }: NotebookHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || entry.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'mood':
          return (b.mood || 0) - (a.mood || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'journal': return <Edit3 className="h-4 w-4" />;
      case 'emotion': return <Heart className="h-4 w-4" />;
      case 'voice': return <Mic className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getEntryTypeColor = (type: string) => {
    switch (type) {
      case 'journal': return 'bg-therapy-100 text-therapy-700 border-therapy-200';
      case 'emotion': return 'bg-calm-100 text-calm-700 border-calm-200';
      case 'voice': return 'bg-flow-100 text-flow-700 border-flow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpanded = (entryId: number) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Journal History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <select 
              className="px-3 py-2 border rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="journal">Journal Entries</option>
              <option value="emotion">Emotion Logs</option>
              <option value="voice">Voice Entries</option>
            </select>

            {/* Sort by */}
            <select 
              className="px-3 py-2 border rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="mood">Sort by Mood</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No entries found matching your criteria</p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className="border-l-4 border-l-therapy-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getEntryIcon(entry.type)}
                          <h3 className="font-semibold text-lg">{entry.title}</h3>
                        </div>
                        <Badge variant="outline" className={getEntryTypeColor(entry.type)}>
                          {entry.type}
                        </Badge>
                        {entry.mood && (
                          <Badge variant="outline">
                            {getMoodEmoji(entry.mood)} {entry.mood}/10
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(entry.id)}
                      >
                        {expandedEntry === entry.id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                      {entry.emotion && (
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span className="capitalize">{entry.emotion}</span>
                        </div>
                      )}
                    </div>

                    {/* Entry Preview */}
                    <div className="mb-3">
                      <p className="text-gray-700 line-clamp-2">
                        {expandedEntry === entry.id 
                          ? entry.content 
                          : entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '')
                        }
                      </p>
                    </div>

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Emotional Analysis (for voice entries) */}
                    {expandedEntry === entry.id && entry.emotionalAnalysis && (
                      <div className="mt-4 p-3 bg-calm-50 border border-calm-200 rounded-lg">
                        <h4 className="font-medium text-calm-700 mb-2">Emotional Analysis</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Primary: <span className="font-medium">{entry.emotionalAnalysis.primary}</span></div>
                          <div>Valence: <span className="font-medium">{entry.emotionalAnalysis.valence?.toFixed(2)}</span></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotebookHistory;
