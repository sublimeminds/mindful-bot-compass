
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalizationEngine from '@/components/ai/PersonalizationEngine';
import SmartRecommendationEngine from '@/components/ai/SmartRecommendationEngine';
import { Brain, Lightbulb, Settings, Target } from 'lucide-react';

const AIPersonalization = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading AI Personalization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Personalization</h1>
          <p className="text-gray-600 mt-2">
            Intelligent insights and personalized recommendations powered by advanced AI
          </p>
        </div>

        <Tabs defaultValue="engine" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engine" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Personalization Engine</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Smart Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>AI Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="engine">
            <PersonalizationEngine />
          </TabsContent>

          <TabsContent value="recommendations">
            <SmartRecommendationEngine />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
              <h3 className="text-xl font-semibold mb-2">AI Personalization Settings</h3>
              <p className="text-muted-foreground">
                Advanced configuration options for AI-powered personalization features
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default AIPersonalization;
