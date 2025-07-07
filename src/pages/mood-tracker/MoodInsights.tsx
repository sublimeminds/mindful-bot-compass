import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Lightbulb } from 'lucide-react';
import MoodInsightsDashboard from '@/components/mood/MoodInsightsDashboard';

const MoodInsights = () => {
  const mockMoodData = [
    { date: 'Jan 1', overall: 7, anxiety: 3, energy: 8, stress: 4 },
    { date: 'Jan 2', overall: 6, anxiety: 4, energy: 7, stress: 5 },
    { date: 'Jan 3', overall: 8, anxiety: 2, energy: 9, stress: 3 }
  ];

  const mockInsights = [
    {
      type: 'positive' as const,
      title: 'Mood Improvement Detected',
      description: 'Your mood has improved by 15% this week',
      confidence: 0.85
    }
  ];

  const mockPatterns = {
    averageMood: 7.2,
    moodVariability: 1.3,
    bestTimeOfDay: 'Morning',
    worstTimeOfDay: 'Evening',
    streak: 12
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mood Insights</h1>
          <p className="text-muted-foreground mt-1">Discover patterns in your emotional well-being</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MoodInsightsDashboard 
              moodData={mockMoodData}
              insights={mockInsights}
              patterns={mockPatterns}
            />
          </TabsContent>

          <TabsContent value="patterns">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Weekly Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Pattern analysis will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">AI-powered recommendations based on your mood patterns.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MoodInsights;