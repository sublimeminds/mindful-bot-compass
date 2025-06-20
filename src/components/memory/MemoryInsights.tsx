import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, TrendingUp, Heart, Lightbulb, Target, Users, Calendar, BarChart3, Zap, Shield, MessageCircle, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const MemoryInsights = () => {
  const { user } = useSimpleApp();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: memoryData, isLoading, error } = useQuery({
    queryKey: ['memory-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Mock memory insights data
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        totalEntries: 125,
        recentTopics: ['Childhood', 'Relationships', 'Career'],
        emotionalTone: 'Positive',
        recallRate: 0.85,
        entryFrequency: 3.2,
        mostUsedKeywords: ['happy', 'family', 'success']
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading memory insights...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">Error loading memory insights.</div>
        </CardContent>
      </Card>
    );
  }

  if (!memoryData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">No memory data available.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Memory Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trends</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Details</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium">Total Entries</h3>
                    <p className="text-3xl font-bold">{memoryData.totalEntries}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium">Recent Topics</h3>
                    <p>{memoryData.recentTopics.join(', ')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium">Emotional Tone</h3>
                    <p>{memoryData.emotionalTone}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium">Recall Rate</h3>
                    <p>{Math.round(memoryData.recallRate * 100)}%</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium">Entry Frequency</h3>
                    <p>{memoryData.entryFrequency} entries per week</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium">Most Used Keywords</h3>
                    <p>{memoryData.mostUsedKeywords.join(', ')}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <p>Detailed memory insights will be available soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryInsights;
