import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRealEnhancedChat } from '@/hooks/useRealEnhancedChat';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import EmotionCameraDetection from '@/components/avatar/EmotionCameraDetection';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import EnhancedSessionFlow from '@/components/therapy/EnhancedSessionFlow';
import StructuredSessionInterface from '@/components/therapy/StructuredSessionInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Camera, 
  CameraOff,
  MessageSquare,
  Brain,
  Heart,
  CheckCircle,
  Clock,
  Target,
  PlayCircle,
  PauseCircle,
  StopCircle,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SessionState {
  phase: 'approach-selection' | 'active' | 'check-out' | 'completed';
  startTime: Date | null;
  selectedApproach: any | null;
  checkInData: {
    mood: number;
    concerns: string;
    goals: string[];
    energy: number;
  };
  checkOutData: {
    mood: number;
    insights: string;
    progress: number;
    nextSteps: string[];
  };
}

interface TherapistPersonality {
  id: string;
  name: string;
  approach: string;
  communication_style: string;
  color_scheme: string;
  description: string;
}

const FullTherapySession = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const {
    messages,
    isLoading,
    isPlaying,
    currentSessionId,
    sendMessage,
    playMessage,
    stopPlayback,
    loadPreferences,
    analyzeSession
  } = useRealEnhancedChat();

  const [sessionState, setSessionState] = useState<SessionState>({
    phase: 'approach-selection',
    startTime: null,
    selectedApproach: null,
    checkInData: {
      mood: 5,
      concerns: '',
      goals: [],
      energy: 5
    },
    checkOutData: {
      mood: 5,
      insights: '',
      progress: 5,
      nextSteps: []
    }
  });

  const [messageInput, setMessageInput] = useState('');
  const [currentTherapist, setCurrentTherapist] = useState<TherapistPersonality | null>(null);
  const [userEmotion, setUserEmotion] = useState<string>('neutral');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      loadPreferences();
      loadCurrentTherapist();
    }
  }, [user, loading, navigate, loadPreferences]);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState.phase === 'active' && sessionState.startTime) {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((new Date().getTime() - sessionState.startTime!.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState.phase, sessionState.startTime]);

  const loadCurrentTherapist = async () => {
    if (!user) return;
    
    try {
      const { data: relationship } = await supabase
        .from('therapeutic_relationship')
        .select('therapist_id')
        .eq('user_id', user.id)
        .single();

      if (relationship?.therapist_id) {
        const { data: therapist } = await supabase
          .from('therapist_personalities')
          .select('*')
          .eq('id', relationship.therapist_id)
          .single();

        if (therapist) {
          setCurrentTherapist(therapist);
        }
      }
    } catch (error) {
      console.error('Error loading therapist:', error);
    }
  };

  const handleSessionStart = (approach: any) => {
    setSessionState(prev => ({
      ...prev,
      phase: 'active',
      startTime: new Date(),
      selectedApproach: approach
    }));
  };

  const handleStartCheckOut = () => {
    setSessionState(prev => ({
      ...prev,
      phase: 'check-out'
    }));
  };

  const handleCompleteSession = async () => {
    // Save session data
    const sessionInsights = await analyzeSession();
    
    setSessionState(prev => ({
      ...prev,
      phase: 'completed'
    }));
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    await sendMessage(messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmotionDetected = useCallback((emotion: any) => {
    setUserEmotion(emotion.emotion);
  }, []);

  const handleVoiceTranscription = useCallback((text: string) => {
    setMessageInput(text);
  }, []);

  const handleVoiceRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsListening(isRecording);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvatarEmotion = () => {
    if (userEmotion === 'sad') return 'concerned';
    if (userEmotion === 'happy') return 'encouraging';
    if (userEmotion === 'angry' || userEmotion === 'frustrated') return 'thoughtful';
    if (isLoading) return 'thoughtful';
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Therapy Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Approach Selection Phase
  if (sessionState.phase === 'approach-selection') {
    return (
      <div className="p-6">
        <EnhancedSessionFlow onSessionStart={handleSessionStart} />
      </div>
    );
  }

  // Check-out Phase
  if (sessionState.phase === 'check-out') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-calm-50 to-therapy-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-therapy-600" />
              Session Check-Out
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">How do you feel now? (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sessionState.checkOutData.mood}
                    onChange={(e) => setSessionState(prev => ({
                      ...prev,
                      checkOutData: { ...prev.checkOutData, mood: parseInt(e.target.value) }
                    }))}
                    className="w-full mt-2"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {sessionState.checkOutData.mood}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Session Progress (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sessionState.checkOutData.progress}
                    onChange={(e) => setSessionState(prev => ({
                      ...prev,
                      checkOutData: { ...prev.checkOutData, progress: parseInt(e.target.value) }
                    }))}
                    className="w-full mt-2"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {sessionState.checkOutData.progress}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Key Insights from Today</label>
                  <Textarea
                    placeholder="What did you learn or realize during this session?"
                    value={sessionState.checkOutData.insights}
                    onChange={(e) => setSessionState(prev => ({
                      ...prev,
                      checkOutData: { ...prev.checkOutData, insights: e.target.value }
                    }))}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setSessionState(prev => ({ ...prev, phase: 'active' }))}
                variant="outline"
              >
                Continue Session
              </Button>
              <Button
                onClick={handleCompleteSession}
                className="bg-therapy-600 hover:bg-therapy-700 px-8 py-3"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completed Phase
  if (sessionState.phase === 'completed') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-green-50 to-therapy-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-green-700">
              <CheckCircle className="h-6 w-6" />
              Session Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-lg">Great work today! Your session lasted {formatDuration(sessionDuration)}.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold">Mood Change</h3>
                <div className="text-2xl font-bold text-therapy-600">
                  {sessionState.checkOutData.mood > sessionState.checkInData.mood ? '+' : ''}
                  {sessionState.checkOutData.mood - sessionState.checkInData.mood}
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold">Messages</h3>
                <div className="text-2xl font-bold text-therapy-600">{messages.length}</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold">Progress</h3>
                <div className="text-2xl font-bold text-therapy-600">
                  {sessionState.checkOutData.progress}/10
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Return to Dashboard
              </Button>
              <Button 
                onClick={() => setSessionState({
                  phase: 'approach-selection',
                  startTime: null,
                  selectedApproach: null,
                  checkInData: { mood: 5, concerns: '', goals: [], energy: 5 },
                  checkOutData: { mood: 5, insights: '', progress: 5, nextSteps: [] }
                })}
                className="bg-therapy-600 hover:bg-therapy-700"
              >
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Session Phase - Use Structured Session Interface
  return (
    <div className="p-6">
      <StructuredSessionInterface
        therapyApproach={sessionState.selectedApproach?.name || 'General Therapy'}
        onSessionComplete={handleCompleteSession}
        initialMood={sessionState.checkInData.mood}
      />
    </div>
  );
};

export default FullTherapySession;