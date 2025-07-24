import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Brain, 
  Heart, 
  MessageCircle,
  Mic,
  MicOff
} from 'lucide-react';
import VoiceEnhancedAvatar from '@/components/avatar/VoiceEnhancedAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
}

interface PersonalizedTherapyDemoProps {
  therapist: {
    id: string;
    name: string;
    specialties: string[];
    approach: string;
    communicationStyle: string;
  };
  onComplete?: () => void;
}

const PersonalizedTherapyDemo: React.FC<PersonalizedTherapyDemoProps> = ({ 
  therapist, 
  onComplete 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'encouraging' | 'concerned' | 'thoughtful'>('neutral');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const avatarId = getAvatarIdForTherapist(therapist.id);

  // Personalized demo scenarios based on therapist specialties
  const getDemoScenario = () => {
    const primarySpecialty = therapist.specialties[0]?.toLowerCase() || 'general';
    
    if (primarySpecialty.includes('relationship') || primarySpecialty.includes('couples')) {
      return {
        initialMessage: `Hi there! I'm ${therapist.name}, and I specialize in relationship counseling. In this demo, let's explore how I help couples communicate better. How has communication been in your relationships lately?`,
        userResponse: "Sometimes I feel like my partner doesn't really listen to me.",
        therapistResponse: "That feeling of not being heard can be really painful. It's actually one of the most common challenges couples face. Let me share a technique called 'reflective listening' that many of my clients find transformative. Would you like to try it together?",
        finalMessage: "In our full sessions, we'd practice these techniques with real scenarios from your relationship. I use evidence-based approaches like Gottman Method and EFT to help couples rebuild connection."
      };
    } else if (primarySpecialty.includes('anxiety') || primarySpecialty.includes('stress')) {
      return {
        initialMessage: `Hello! I'm ${therapist.name}, specializing in anxiety and stress management. Let's do a quick demo of how I help people manage overwhelming feelings. What's been causing you stress lately?`,
        userResponse: "Work has been really overwhelming, and I can't seem to turn my mind off.",
        therapistResponse: "That constant mental chatter is exhausting, isn't it? Let's try a grounding technique I teach all my clients. It's called the 5-4-3-2-1 method. Can you tell me 5 things you can see right now?",
        finalMessage: "In our sessions, we'd develop a personalized anxiety management toolkit using CBT and mindfulness techniques tailored to your specific triggers and lifestyle."
      };
    } else if (primarySpecialty.includes('trauma') || primarySpecialty.includes('ptsd')) {
      return {
        initialMessage: `Hi, I'm ${therapist.name}. I specialize in trauma-informed therapy using EMDR and other gentle approaches. This demo will show how I create a safe space for healing. How are you feeling today?`,
        userResponse: "I've been having trouble sleeping and feeling on edge lately.",
        therapistResponse: "Thank you for sharing that with me. Those symptoms are your nervous system's way of protecting you. In trauma therapy, we always go at your pace. Let's start with some gentle breathing that can help regulate your nervous system. Would that feel safe for you?",
        finalMessage: "In our work together, I'd use specialized trauma therapies like EMDR and somatic approaches, always ensuring you feel safe and in control of the process."
      };
    } else {
      return {
        initialMessage: `Welcome! I'm ${therapist.name}. In this demo, I'll show you my ${therapist.approach} approach to therapy. What brings you here today?`,
        userResponse: "I've been feeling stuck and unsure about my direction in life.",
        therapistResponse: "Feeling stuck is actually a sign that you're ready for growth. Many people experience this when they're transitioning between life phases. Let's explore what 'stuck' means to you and identify some small steps forward.",
        finalMessage: "In our sessions, I'd help you develop clarity about your values and goals, using evidence-based techniques to create lasting positive change."
      };
    }
  };

  const scenario = getDemoScenario();
  
  const demoSteps = [
    {
      type: 'therapist',
      content: scenario.initialMessage,
      emotion: 'encouraging'
    },
    {
      type: 'user',
      content: scenario.userResponse,
      emotion: 'neutral'
    },
    {
      type: 'therapist',
      content: scenario.therapistResponse,
      emotion: 'thoughtful'
    },
    {
      type: 'therapist',
      content: scenario.finalMessage,
      emotion: 'encouraging'
    }
  ];

  useEffect(() => {
    // Start with initial therapist message
    if (messages.length === 0) {
      addMessage(demoSteps[0].content, false, demoSteps[0].emotion);
    }
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = async (content: string, isUser: boolean, emotion?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      emotion
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (!isUser) {
      setAvatarEmotion(emotion as any || 'neutral');
      if (isVoiceEnabled) {
        await playTherapistVoice(content);
      }
    }
  };

  const playTherapistVoice = async (text: string) => {
    try {
      setIsListening(true);
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { 
          therapistId: therapist.id,
          text: text.substring(0, 200) // Limit for demo
        }
      });

      if (data?.audioContent && isVoiceEnabled) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audioRef.current.onended = () => setIsListening(false);
        audioRef.current.onerror = () => setIsListening(false);
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Voice synthesis error:', error);
      setIsListening(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      const nextStep = demoSteps[currentStep + 1];
      addMessage(nextStep.content, nextStep.type === 'user', nextStep.emotion);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentStep(0);
    setAvatarEmotion('neutral');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // Restart with initial message
    setTimeout(() => {
      addMessage(demoSteps[0].content, false, demoSteps[0].emotion);
    }, 500);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (!isVoiceEnabled && audioRef.current) {
      audioRef.current.pause();
      setIsListening(false);
    }
  };

  const stopVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsListening(false);
    }
  };

  return (
    <div className="h-full max-h-[600px] flex gap-4">
      {/* Avatar Section */}
      <div className="w-64 flex-shrink-0">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Heart className="mr-2 h-4 w-4 text-therapy-600" />
              {therapist.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="aspect-square bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden">
              <VoiceEnhancedAvatar
                therapistId={avatarId}
                therapistName={therapist.name}
                emotion={avatarEmotion}
                isSpeaking={isListening}
                isListening={false}
                showControls={false}
                className="w-full h-full"
                force2D={true}
              />
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center text-xs">
                Demo Mode
              </Badge>
              <div className="text-xs text-center text-muted-foreground">
                {therapist.approach}
              </div>
            </div>

            {/* Voice Controls */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                className="text-xs"
              >
                {isVoiceEnabled ? (
                  <Volume2 className="h-3 w-3" />
                ) : (
                  <VolumeX className="h-3 w-3" />
                )}
              </Button>
              {isListening && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopVoice}
                  className="text-xs"
                >
                  <Pause className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Brain className="mr-2 h-4 w-4 text-therapy-600" />
                Personalized Demo
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {therapist.specialties[0]}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestart}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restart
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      message.isUser 
                        ? 'bg-therapy-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {!message.isUser && message.emotion && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            😊 {message.emotion}
                          </Badge>
                        </div>
                      )}
                      
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
            </ScrollArea>

            {/* Demo Controls */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {demoSteps.length}
                </div>
                <div className="flex gap-2">
                  {currentStep < demoSteps.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={handleNextStep}
                      className="bg-therapy-600 hover:bg-therapy-700"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Continue Demo
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={onComplete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Start Real Session
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalizedTherapyDemo;