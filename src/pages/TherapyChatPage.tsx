
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import VoiceTherapyChat from '@/components/voice/VoiceTherapyChat';
import RealTimeSessionManager from '@/components/session/RealTimeSessionManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mic, Brain } from 'lucide-react';

const TherapyChatPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(0);

  React.useEffect(() => {
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

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Text Chat</span>
            </TabsTrigger>
            
            <TabsTrigger value="voice" className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span>Voice Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <RealTimeSessionManager />
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Current Mood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-therapy-600 capitalize">
                        {currentMood}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Detected from voice
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Stress Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-therapy-600">
                        {Math.round(stressLevel * 100)}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stressLevel * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default TherapyChatPage;
