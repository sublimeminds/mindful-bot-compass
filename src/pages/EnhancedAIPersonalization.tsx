import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IntelligentPersonalizationDashboard from '@/components/ai/IntelligentPersonalizationDashboard';
import ContextualAISupport from '@/components/ai/ContextualAISupport';
import SmartRecommendationEngine from '@/components/ai/SmartRecommendationEngine';
import { Brain, Lightbulb, Settings, Zap } from 'lucide-react';

const AIPersonalizationPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

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
        {/* Hero Section with Navigation-Matched Gradient */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-harmony-500 via-balance-600 to-therapy-700 p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center animate-breathe-mindful">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Enhanced AI Personalization</h1>
                <p className="text-white/90 text-lg">
                  Advanced AI-powered insights, recommendations, and contextual support tailored specifically for you
                </p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Smart Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="contextual" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Contextual AI</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>AI Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <IntelligentPersonalizationDashboard />
          </TabsContent>

          <TabsContent value="recommendations">
            <SmartRecommendationEngine />
          </TabsContent>

          <TabsContent value="contextual">
            <ContextualAISupport />
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12">
              <Settings className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
              <h3 className="text-xl font-semibold mb-2">Advanced AI Settings</h3>
              <p className="text-muted-foreground">
                Fine-tune your AI experience with advanced configuration options
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default AIPersonalizationPage;