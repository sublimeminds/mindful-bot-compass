
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Settings, Volume2, VolumeX, Clock, MessageCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/contexts/SessionContext";
import { useTherapist } from "@/contexts/TherapistContext";
import Header from "@/components/Header";
import TherapyChatInterface from "@/components/chat/TherapyChatInterface";
import VoiceSettings from "@/components/voice/VoiceSettings";
import TherapistCard from "@/components/therapist/TherapistCard";
import SessionTimer from "@/components/session/SessionTimer";
import EmotionIndicator from "@/components/emotion/EmotionIndicator";
import SessionEndModal from "@/components/SessionEndModal";
import { voiceService } from "@/services/voiceService";

const TherapyChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentSession, startSession, endSession, canEndSession, getSessionDuration, getContentQuality } = useSession();
  const { currentTherapist } = useTherapist();
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    // Check if voice service is available and load voice preference
    const hasApiKey = voiceService.hasApiKey();
    const savedVoicePreference = localStorage.getItem('therapy_voice_enabled') === 'true';
    setIsVoiceEnabled(hasApiKey && savedVoicePreference);
  }, []);

  const handleVoiceToggle = (enabled: boolean) => {
    if (enabled && !voiceService.hasApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please add your ElevenLabs API key in voice settings to enable voice responses.",
        variant: "destructive",
      });
      setShowVoiceSettings(true);
      return;
    }
    
    setIsVoiceEnabled(enabled);
    localStorage.setItem('therapy_voice_enabled', enabled.toString());
    
    toast({
      title: enabled ? "Voice Enabled" : "Voice Disabled",
      description: enabled 
        ? "AI responses will now be spoken aloud" 
        : "AI responses will be text only",
    });
  };

  const handleStartSession = async () => {
    if (!currentTherapist) {
      toast({
        title: "Select a Therapist",
        description: "Please select a therapist before starting your session.",
        variant: "destructive",
      });
      navigate('/therapist-matching');
      return;
    }

    try {
      await startSession(5); // Mood before
      setSessionStarted(true);
      toast({
        title: "Session Started",
        description: `Your therapy session with ${currentTherapist.name} has begun.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndSessionAttempt = () => {
    if (!canEndSession()) {
      const duration = getSessionDuration();
      const content = getContentQuality();
      
      toast({
        title: "Session Too Short",
        description: `Please continue your session. You need at least 5 minutes and meaningful conversation. Current: ${duration} min, ${content.messageCount} messages.`,
        variant: "destructive",
      });
      return;
    }
    
    setShowEndModal(true);
  };

  const handleSessionEnd = async (data: {
    moodAfter: number;
    notes: string;
    rating: number;
    breakthroughs: string[];
  }) => {
    if (!currentSession) return;
    
    try {
      await endSession(data.moodAfter, data.notes, data.rating);
      setSessionStarted(false);
      setShowEndModal(false);
      toast({
        title: "Session Completed! 🎉",
        description: "Your therapy session has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session properly.",
        variant: "destructive",
      });
    }
  };

  if (!currentTherapist) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-therapy-100 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-therapy-600" />
              </div>
              <h3 className="text-lg font-semibold">Select Your Therapist First</h3>
              <p className="text-muted-foreground">
                To start a personalized therapy session, you need to select an AI therapist that matches your needs.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/therapist-matching')}
                  className="w-full bg-therapy-600 hover:bg-therapy-700"
                >
                  Find My Therapist
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const sessionDuration = getSessionDuration();
  const contentQuality = getContentQuality();
  const sessionCanEnd = canEndSession();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
        {/* Enhanced Header with Therapist Info */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-therapy-100 rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-therapy-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold">Therapy Session</h1>
                    <p className="text-sm text-muted-foreground">
                      with {currentTherapist.name} - {currentTherapist.title}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Session Progress Indicator */}
                {sessionStarted && currentSession && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{sessionDuration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{contentQuality.messageCount}</span>
                    </div>
                    {!sessionCanEnd && (
                      <div className="flex items-center space-x-1 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs">Continue session</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Voice Settings Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={isVoiceEnabled ? "text-green-600 bg-green-50" : "text-gray-400"}
                >
                  {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                
                {/* Settings */}
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                
                {/* Session Timer */}
                {sessionStarted && currentSession && (
                  <SessionTimer 
                    startTime={new Date(currentSession.startTime)}
                    onEndSession={handleEndSessionAttempt}
                    canEnd={sessionCanEnd}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Therapist Info & Controls */}
            <div className="lg:col-span-1 space-y-4">
              {/* Current Therapist Card */}
              <TherapistCard 
                therapist={currentTherapist}
                isActive={sessionStarted}
                onSwitch={() => navigate('/therapist-matching')}
              />
              
              {/* Voice Settings Panel */}
              {showVoiceSettings && (
                <VoiceSettings
                  isEnabled={isVoiceEnabled}
                  onToggle={handleVoiceToggle}
                />
              )}
              
              {/* Session Progress Card */}
              {sessionStarted && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Session Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{sessionDuration} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Messages:</span>
                      <span className="font-medium">{contentQuality.messageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Your messages:</span>
                      <span className="font-medium">{contentQuality.userMessages}</span>
                    </div>
                    <div className="pt-2 border-t">
                      {sessionCanEnd ? (
                        <div className="text-xs text-green-600 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Ready to complete
                        </div>
                      ) : (
                        <div className="text-xs text-amber-600 flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                          Continue for meaningful session
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Emotion Indicator */}
              {sessionStarted && (
                <EmotionIndicator />
              )}
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              {!sessionStarted ? (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center space-y-6">
                    <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-therapy-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ready to Begin</h3>
                      <p className="text-muted-foreground mb-6">
                        Start your therapy session with {currentTherapist.name}
                        {isVoiceEnabled && (
                          <span className="block text-sm text-green-600 mt-1">
                            🎤 Voice responses enabled
                          </span>
                        )}
                      </p>
                      <Button 
                        onClick={handleStartSession}
                        className="bg-therapy-600 hover:bg-therapy-700 text-white px-8 py-3"
                        size="lg"
                      >
                        Start Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <TherapyChatInterface 
                  onEndSession={handleEndSessionAttempt}
                  voiceEnabled={isVoiceEnabled}
                  onVoiceToggle={handleVoiceToggle}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Session End Modal */}
      <SessionEndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onSubmit={handleSessionEnd}
      />
    </>
  );
};

export default TherapyChat;
