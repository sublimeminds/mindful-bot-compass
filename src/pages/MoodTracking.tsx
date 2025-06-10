
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, TrendingUp, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DetailedMoodTracker from "@/components/mood/DetailedMoodTracker";
import MoodInsightsDashboard from "@/components/mood/MoodInsightsDashboard";

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

// Mock functions to replace missing service imports
const generateMoodInsights = (entries: MoodEntry[]) => {
  return "Your mood has been stable over the past week with slight improvements on weekends.";
};

const calculateMoodTrends = (entries: MoodEntry[]) => {
  return { trend: 'improving', percentage: 15 };
};

const analyzeMoodPatterns = (entries: MoodEntry[]) => {
  return [
    { pattern: 'Weekend boost', description: 'Mood tends to improve on weekends' },
    { pattern: 'Morning clarity', description: 'Better mood in morning hours' }
  ];
};

const MoodTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock mood entries for demonstration
  const mockMoodEntries: MoodEntry[] = [
    { id: '1', mood: 7, date: '2024-01-15', notes: 'Feeling good today', energy: 8, stress: 3, sleep: 7 },
    { id: '2', mood: 5, date: '2024-01-14', notes: 'Neutral day', energy: 6, stress: 5, sleep: 6 },
    { id: '3', mood: 8, date: '2024-01-13', notes: 'Great mood!', energy: 9, stress: 2, sleep: 8 },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Please sign in to track your mood.</div>
        </div>
      </div>
    );
  }

  return (
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
            <MoodInsightsDashboard />
          </TabsContent>

          <TabsContent value="log" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Log Your Current Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailedMoodTracker />
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
  );
};

export default MoodTracking;
