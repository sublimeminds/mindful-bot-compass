
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import VoiceTherapyChat from '@/components/voice/VoiceTherapyChat';
import RealTimeSessionManager from '@/components/session/RealTimeSessionManager';
import EnhancedTherapyChatWithAvatar from '@/components/therapy/EnhancedTherapyChatWithAvatar';
import EnhancedEmotionDetection from '@/components/emotion/EnhancedEmotionDetection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mic, Brain } from 'lucide-react';

const TherapyChatPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleVoiceMessage = (message: string, isVoice: boolean) => {
    console.log('Voice message received:', { message, isVoice });
    // Here you could integrate with the chat interface
  };

  const handleVoiceAnalysis = (emotion: string, stress: number) => {
    setCurrentMood(emotion);
    setStressLevel(stress);
    console.log('Voice analysis:', { emotion, stress });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Therapy Chat...</p>
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
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-therapy-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Therapy Chat</h1>
              <p className="text-gray-600 mt-1">
                Connect with your AI therapist through text or voice
              </p>
            </div>
          </div>
        </div>

        {/* Voice Chat Prominence Banner */}
        <div className="bg-gradient-to-r from-therapy-500 to-calm-500 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Mic className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Voice Therapy Chat Available</h3>
                <p className="text-sm opacity-90">Experience natural conversations with real-time emotion recognition</p>
              </div>
            </div>
            <button 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              onClick={() => {
                const voiceTab = document.querySelector('[value="voice"]') as HTMLButtonElement;
                voiceTab?.click();
              }}
            >
              Try Voice Chat
            </button>
          </div>
        </div>

        <Tabs defaultValue="enhanced" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="enhanced" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI + Avatar Chat</span>
            </TabsTrigger>
            
            <TabsTrigger value="voice" className="flex items-center space-x-2 bg-gradient-to-r from-therapy-100 to-calm-100">
              <Mic className="h-4 w-4" />
              <span className="font-medium">Voice + Emotion</span>
            </TabsTrigger>
            
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Text Only</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enhanced" className="space-y-6">
            <div className="bg-gradient-to-br from-therapy-50 to-calm-50 p-1 rounded-lg">
              <EnhancedTherapyChatWithAvatar />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VoiceTherapyChat
                  onMessageReceived={handleVoiceMessage}
                  onVoiceAnalysis={handleVoiceAnalysis}
                />
              </div>
              
              <div className="space-y-4">
                <EnhancedEmotionDetection
                  onEmotionUpdate={(emotions, primary, stress) => {
                    setCurrentMood(primary);
                    setStressLevel(stress);
                  }}
                  isActive={true}
                  mode="voice"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-200 p-4">
              <div className="text-center text-therapy-600 mb-4">
                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">Text-Only Chat</h3>
                <p className="text-sm text-muted-foreground">Traditional text-based therapy conversations</p>
              </div>
              <RealTimeSessionManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default TherapyChatPage;
