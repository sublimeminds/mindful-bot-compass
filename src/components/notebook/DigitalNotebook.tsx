
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, PlusCircle, Heart, Calendar, Camera, 
  Mic, Edit3, Search, Filter, Tag
} from 'lucide-react';
import EmotionLogger from './EmotionLogger';
import JournalEntry from './JournalEntry';
import NotebookHistory from './NotebookHistory';
import VoiceJournal from './VoiceJournal';

const DigitalNotebook = () => {
  const [activeTab, setActiveTab] = useState('journal');
  const [entries, setEntries] = useState([
    {
      id: 1,
      type: 'journal',
      title: 'Morning Reflection',
      content: 'Feeling optimistic about today. Had a good night\'s sleep and ready to tackle my goals.',
      emotion: 'happy',
      mood: 8,
      date: new Date('2024-01-15T08:30:00'),
      tags: ['morning', 'optimistic', 'goals']
    },
    {
      id: 2,
      type: 'emotion',
      title: 'Quick Check-in',
      content: 'Feeling a bit overwhelmed with work deadlines.',
      emotion: 'anxious',
      mood: 4,
      date: new Date('2024-01-15T14:15:00'),
      tags: ['work', 'stress', 'deadlines']
    }
  ]);

  const addEntry = (newEntry: any) => {
    setEntries(prev => [
      {
        ...newEntry,
        id: Date.now(),
        date: new Date()
      },
      ...prev
    ]);
  };

  const recentStats = {
    totalEntries: entries.length,
    averageMood: entries.reduce((acc, entry) => acc + (entry.mood || 0), 0) / entries.length,
    streakDays: 7,
    mostCommonEmotion: 'content'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <Card className="border-therapy-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-therapy-600" />
                <div>
                  <CardTitle className="text-3xl">Digital Mental Health Notebook</CardTitle>
                  <p className="text-muted-foreground">Track your emotions, thoughts, and progress</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-therapy-600">{recentStats.streakDays}</div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-therapy-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-therapy-600">{recentStats.totalEntries}</div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </CardContent>
          </Card>
          
          <Card className="border-calm-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-calm-600">
                {recentStats.averageMood.toFixed(1)}/10
              </div>
              <p className="text-sm text-muted-foreground">Average Mood</p>
            </CardContent>
          </Card>
          
          <Card className="border-harmony-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-harmony-600">{recentStats.streakDays}</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="border-flow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-flow-600 capitalize">
                {recentStats.mostCommonEmotion}
              </div>
              <p className="text-sm text-muted-foreground">Common Emotion</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Notebook Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-5">
              <TabsTrigger value="journal" className="flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>Journal</span>
              </TabsTrigger>
              <TabsTrigger value="emotion" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Emotions</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center space-x-2">
                <Mic className="h-4 w-4" />
                <span>Voice</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <TabsContent value="journal" className="space-y-6">
            <JournalEntry onSave={addEntry} />
          </TabsContent>

          <TabsContent value="emotion" className="space-y-6">
            <EmotionLogger onSave={addEntry} />
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceJournal onSave={addEntry} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <NotebookHistory entries={entries} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-therapy-50 rounded-lg">
                    <h3 className="font-semibold text-therapy-700 mb-2">Emotional Patterns</h3>
                    <p className="text-sm text-gray-600">
                      Your mood tends to be highest in the morning hours. Consider scheduling 
                      important activities during this time.
                    </p>
                  </div>
                  <div className="p-4 bg-calm-50 rounded-lg">
                    <h3 className="font-semibold text-calm-700 mb-2">Trigger Recognition</h3>
                    <p className="text-sm text-gray-600">
                      Work-related entries show increased stress levels. Consider stress 
                      management techniques during work hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DigitalNotebook;
