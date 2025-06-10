
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, TrendingUp, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MoodEntry {
  id: string;
  mood: number;
  energy: number;
  stress: number;
  anxiety: number;
  notes: string;
  tags: string[];
  date: Date;
}

const AdvancedMoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    mood: [7],
    energy: [7],
    stress: [3],
    anxiety: [3],
    notes: '',
    tags: [] as string[]
  });

  const moodLabels = {
    1: 'Terrible', 2: 'Very Bad', 3: 'Bad', 4: 'Poor', 5: 'Okay',
    6: 'Good', 7: 'Very Good', 8: 'Great', 9: 'Excellent', 10: 'Amazing'
  };

  const commonTags = [
    'Work Stress', 'Family', 'Exercise', 'Sleep', 'Social', 'Health',
    'Weather', 'Achievement', 'Relationship', 'Financial', 'Relaxation'
  ];

  useEffect(() => {
    loadMoodEntries();
  }, [user]);

  const loadMoodEntries = async () => {
    // Mock data for demonstration
    const mockEntries: MoodEntry[] = Array.from({ length: 14 }, (_, i) => ({
      id: (i + 1).toString(),
      mood: Math.floor(Math.random() * 6) + 5,
      energy: Math.floor(Math.random() * 6) + 4,
      stress: Math.floor(Math.random() * 5) + 1,
      anxiety: Math.floor(Math.random() * 4) + 1,
      notes: i % 3 === 0 ? 'Had a good day today, feeling positive about progress' : '',
      tags: i % 2 === 0 ? ['Work Stress'] : ['Exercise', 'Sleep'],
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000)
    }));
    setMoodEntries(mockEntries);
  };

  const handleSaveMoodEntry = async () => {
    if (!user) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: currentEntry.mood[0],
      energy: currentEntry.energy[0],
      stress: currentEntry.stress[0],
      anxiety: currentEntry.anxiety[0],
      notes: currentEntry.notes,
      tags: currentEntry.tags,
      date: new Date()
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    setIsTracking(false);
    setCurrentEntry({
      mood: [7],
      energy: [7],
      stress: [3],
      anxiety: [3],
      notes: '',
      tags: []
    });

    toast({
      title: "Mood Tracked",
      description: "Your mood entry has been saved successfully.",
    });
  };

  const toggleTag = (tag: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const chartData = moodEntries.slice(0, 7).reverse().map((entry, index) => ({
    day: `Day ${index + 1}`,
    mood: entry.mood,
    energy: entry.energy,
    stress: entry.stress,
    anxiety: entry.anxiety
  }));

  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length
    : 0;

  const moodTrend = moodEntries.length >= 2 
    ? moodEntries[0].mood - moodEntries[1].mood
    : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-bold">{averageMood.toFixed(1)}/10</p>
              </div>
              <Heart className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mood Trend</p>
                <p className={`text-2xl font-bold ${moodTrend > 0 ? 'text-green-500' : moodTrend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {moodTrend > 0 ? '+' : ''}{moodTrend.toFixed(1)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entries This Week</p>
                <p className="text-2xl font-bold">{moodEntries.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
              <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy" />
              <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress" />
              <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} name="Anxiety" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mood Entry Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Track Your Mood</CardTitle>
            {!isTracking && (
              <Button onClick={() => setIsTracking(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            )}
          </div>
        </CardHeader>

        {isTracking && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mood: {currentEntry.mood[0]}/10 ({moodLabels[currentEntry.mood[0] as keyof typeof moodLabels]})
                  </label>
                  <Slider
                    value={currentEntry.mood}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, mood: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Energy: {currentEntry.energy[0]}/10
                  </label>
                  <Slider
                    value={currentEntry.energy}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, energy: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stress: {currentEntry.stress[0]}/10
                  </label>
                  <Slider
                    value={currentEntry.stress}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, stress: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Anxiety: {currentEntry.anxiety[0]}/10
                  </label>
                  <Slider
                    value={currentEntry.anxiety}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, anxiety: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {commonTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={currentEntry.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <Textarea
                value={currentEntry.notes}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How are you feeling today? Any specific thoughts or events?"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsTracking(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMoodEntry}>
                Save Entry
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moodEntries.slice(0, 5).map(entry => (
              <div key={entry.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-muted-foreground">
                    {entry.date.toLocaleDateString()}
                  </span>
                  <div className="flex space-x-4 text-sm">
                    <span>Mood: {entry.mood}/10</span>
                    <span>Energy: {entry.energy}/10</span>
                    <span>Stress: {entry.stress}/10</span>
                    <span>Anxiety: {entry.anxiety}/10</span>
                  </div>
                </div>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedMoodTracker;
