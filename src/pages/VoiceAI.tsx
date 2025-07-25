
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-flow-400 to-therapy-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading Voice AI Therapy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="min-h-screen bg-gradient-to-br from-flow-50 via-flow-100 to-therapy-50">
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-flow-400 to-therapy-500 flex items-center justify-center shadow-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-flow-600 via-therapy-600 to-therapy-700 bg-clip-text text-transparent">
                  Voice AI Therapy
                </h1>
                <p className="text-flow-700 mt-1">
                  Natural voice conversations with AI therapists using advanced speech technology
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="voice" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-flow-200/30">
              <TabsTrigger 
                value="voice" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-flow-400 data-[state=active]:to-therapy-500 data-[state=active]:text-white"
              >
                <Mic className="h-4 w-4" />
                <span>Voice Recognition</span>
              </TabsTrigger>
              <TabsTrigger 
                value="personalization" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-flow-400 data-[state=active]:to-therapy-500 data-[state=active]:text-white"
              >
                <Brain className="h-4 w-4" />
                <span>AI Personalization</span>
              </TabsTrigger>
              <TabsTrigger 
                value="assistant" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-flow-400 data-[state=active]:to-therapy-500 data-[state=active]:text-white"
              >
                <User className="h-4 w-4" />
                <span>AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-flow-400 data-[state=active]:to-therapy-500 data-[state=active]:text-white"
              >
                <Activity className="h-4 w-4" />
                <span>Voice Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="bg-white/70 backdrop-blur-sm rounded-xl border border-therapy-200/30 shadow-lg">
              <EnhancedVoiceManager />
            </TabsContent>

            <TabsContent value="personalization" className="bg-white/70 backdrop-blur-sm rounded-xl border border-therapy-200/30 shadow-lg">
              <AIPersonalizationEngine />
            </TabsContent>

            <TabsContent value="assistant" className="bg-white/70 backdrop-blur-sm rounded-xl border border-therapy-200/30 shadow-lg">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-therapy-500 via-therapy-600 to-harmony-500 flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-therapy-800">AI Assistant Coming Soon</h3>
                <p className="text-therapy-600">
                  Intelligent therapy assistant with context-aware responses and personalized guidance
                </p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="bg-white/70 backdrop-blur-sm rounded-xl border border-therapy-200/30 shadow-lg">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-therapy-500 via-therapy-600 to-harmony-500 flex items-center justify-center shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-therapy-800">Voice Analytics Coming Soon</h3>
                <p className="text-therapy-600">
                  Comprehensive voice pattern analysis and emotional intelligence insights
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default VoiceAI;
