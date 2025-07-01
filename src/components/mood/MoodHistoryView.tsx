import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Heart, 
  Calendar as CalendarIcon,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, isValid } from 'date-fns';

interface MoodEntry {
  id: string;
  created_at: string;
  overall: number;
  anxiety: number;
  depression: number;
  stress: number;
  energy: number;
  sleep_quality: number;
  social_connection: number;
  notes: string;
  activities: string[];
  triggers: string[];
  weather: string;
}

const MoodHistoryView = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [filterMood, setFilterMood] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const { data: moodEntries, isLoading } = useQuery({
    queryKey: ['mood-history', user?.id, selectedDate, filterMood],
    queryFn: async () => {
      if (!user?.id) return null;

      let query = supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filter by date if selected
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching mood history:', error);
        throw error;
      }

      let filteredData = data || [];

      // Filter by mood level
      if (filterMood !== 'all') {
        filteredData = filteredData.filter(entry => {
          if (filterMood === 'high') return entry.overall >= 7;
          if (filterMood === 'medium') return entry.overall >= 4 && entry.overall < 7;
          if (filterMood === 'low') return entry.overall < 4;
          return true;
        });
      }

      return filteredData;
    },
    enabled: !!user?.id,
  });

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-green-100 text-green-800 border-green-200';
    if (mood >= 6) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (mood >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 8) return 'Great';
    if (mood >= 6) return 'Good';
    if (mood >= 4) return 'Okay';
    return 'Low';
  };

  const exportData = () => {
    if (!moodEntries) return;

    const csvContent = [
      'Date,Overall Mood,Anxiety,Depression,Stress,Energy,Sleep Quality,Social Connection,Notes',
      ...moodEntries.map(entry => 
        `${format(new Date(entry.created_at), 'yyyy-MM-dd')},${entry.overall},${entry.anxiety},${entry.depression},${entry.stress},${entry.energy},${entry.sleep_quality},${entry.social_connection},"${entry.notes?.replace(/"/g, '""') || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Mood Filter */}
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'high', label: 'High (7-10)' },
              { key: 'medium', label: 'Medium (4-6)' },
              { key: 'low', label: 'Low (1-3)' }
            ].map(filter => (
              <Button
                key={filter.key}
                variant={filterMood === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMood(filter.key as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {selectedDate && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedDate(undefined)}
            >
              Clear Date
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{moodEntries?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {moodEntries?.length ? 
                  (moodEntries.reduce((sum, entry) => sum + entry.overall, 0) / moodEntries.length).toFixed(1)
                  : '0'
                }
              </p>
              <p className="text-sm text-muted-foreground">Average Mood</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {moodEntries?.filter(entry => entry.overall >= 7).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Good Days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {moodEntries?.filter(entry => entry.notes && entry.notes.length > 0).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">With Notes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Entries List */}
      <div className="space-y-4">
        {moodEntries && moodEntries.length > 0 ? (
          moodEntries.map((entry: MoodEntry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">
                          {isValid(new Date(entry.created_at)) 
                            ? format(new Date(entry.created_at), 'EEEE, MMM dd, yyyy')
                            : 'Invalid Date'
                          }
                        </h3>
                        <Badge className={getMoodColor(entry.overall)}>
                          {getMoodLabel(entry.overall)} ({entry.overall}/10)
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isValid(new Date(entry.created_at))
                          ? format(new Date(entry.created_at), 'h:mm a')
                          : 'Invalid Time'
                        }
                      </div>
                    </div>

                    {/* Mood Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
                      {[
                        { label: 'Anxiety', value: entry.anxiety, color: 'text-red-600' },
                        { label: 'Stress', value: entry.stress, color: 'text-orange-600' },
                        { label: 'Energy', value: entry.energy, color: 'text-green-600' },
                        { label: 'Sleep', value: entry.sleep_quality, color: 'text-blue-600' },
                        { label: 'Social', value: entry.social_connection, color: 'text-purple-600' }
                      ].map(metric => (
                        <div key={metric.label} className="text-center">
                          <p className={`text-lg font-semibold ${metric.color}`}>
                            {metric.value}/10
                          </p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {entry.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">{entry.notes}</p>
                      </div>
                    )}

                    {/* Activities and Triggers */}
                    <div className="flex flex-wrap gap-2">
                      {entry.activities?.map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                      {entry.triggers?.map((trigger, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          ⚠️ {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No Mood Entries Found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedDate || filterMood !== 'all' 
                  ? 'Try adjusting your filters to see more entries.'
                  : 'Start tracking your mood to see your history here.'
                }
              </p>
              <Button onClick={() => {
                setSelectedDate(undefined);
                setFilterMood('all');
              }}>
                {selectedDate || filterMood !== 'all' ? 'Clear Filters' : 'Start Tracking'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MoodHistoryView;