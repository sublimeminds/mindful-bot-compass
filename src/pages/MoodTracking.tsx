import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, TrendingUp, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DetailedMoodTracker from "@/components/mood/DetailedMoodTracker";
import MoodInsightsDashboard from "@/components/mood/MoodInsightsDashboard";
import Header from "@/components/Header";

// Mock mood entry type
interface MoodEntry {
  id: string;
  mood: number;
  date: string;
  notes?: string;
  energy?: number;
  stress?: number;
  sleep?: number;
}

const MoodTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for MoodInsightsDashboard
  const mockMoodData = [
    { date: '2024-01-01', overall: 7, anxiety: 3, energy: 8, stress: 4 },
    { date: '2024-01-02', overall: 6, anxiety: 4, energy: 6, stress: 5 },
    { date: '2024-01-03', overall: 8, anxiety: 2, energy: 9, stress: 3 },
    { date: '2024-01-04', overall: 5, anxiety: 6, energy: 5, stress: 7 },
    { date: '2024-01-05', overall: 7, anxiety: 3, energy: 7, stress: 4 },
    { date: '2024-01-06', overall: 9, anxiety: 1, energy: 9, stress: 2 },
    { date: '2024-01-07', overall: 8, anxiety: 2, energy: 8, stress: 3 },
  ];

  const mockInsights = [
    {
      type: 'positive' as const,
      title: 'Weekend Boost',
      description: 'Your mood consistently improves on weekends, suggesting good work-life balance.',
      confidence: 0.85
    },
    {
      type: 'info' as const,
      title: 'Sleep Pattern Connection',
      description: 'Better sleep quality correlates with higher energy levels the next day.',
      confidence: 0.78
    },
    {
      type: 'warning' as const,
      title: 'Stress Spike Detected',
      description: 'Stress levels were elevated on Tuesday. Consider identifying triggers.',
      confidence: 0.72
    }
  ];

  const mockPatterns = {
    bestTimeOfDay: 'Morning',
    worstTimeOfDay: 'Evening',
    averageMood: 7.2,
    moodVariability: 1.8,
    streak: 5
  };

  const handleMoodSubmit = (moodData: any) => {
    console.log('Mood submitted:', moodData);
    // Here you would typically save to database
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8">Please sign in to track your mood.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  Mood Tracking
                </h1>
                <p className="text-muted-foreground">
                  Track and analyze your emotional well-being over time
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="log" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Log Mood</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <MoodInsightsDashboard 
                moodData={mockMoodData}
                insights={mockInsights}
                patterns={mockPatterns}
              />
            </TabsContent>

            <TabsContent value="log" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Log Your Current Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailedMoodTracker onMoodSubmit={handleMoodSubmit} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mood History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Mood history coming soon</h3>
                    <p className="text-muted-foreground">
                      View your mood trends and patterns over time
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default MoodTracking;
