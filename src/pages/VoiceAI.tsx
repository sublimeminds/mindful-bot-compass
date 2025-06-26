
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedVoiceManager from '@/components/voice/EnhancedVoiceManager';
import AIPersonalizationEngine from '@/components/ai/AIPersonalizationEngine';
import { Brain, Mic, User, Activity } from 'lucide-react';

const VoiceAI = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Voice & AI Features...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Voice & AI Integration</h1>
          <p className="text-gray-600 mt-2">
            Advanced voice recognition, AI personalization, and intelligent therapy assistance
          </p>
        </div>

        <Tabs defaultValue="voice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="voice" className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span>Voice Recognition</span>
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Personalization</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Voice Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice">
            <EnhancedVoiceManager />
          </TabsContent>

          <TabsContent value="personalization">
            <AIPersonalizationEngine />
          </TabsContent>

          <TabsContent value="assistant">
            <div className="text-center py-12">
              <Brain className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
              <h3 className="text-xl font-semibold mb-2">AI Assistant Coming Soon</h3>
              <p className="text-muted-foreground">
                Intelligent therapy assistant with context-aware responses and personalized guidance
              </p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <Activity className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
              <h3 className="text-xl font-semibold mb-2">Voice Analytics Coming Soon</h3>
              <p className="text-muted-foreground">
                Comprehensive voice pattern analysis and emotional intelligence insights
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default VoiceAI;
