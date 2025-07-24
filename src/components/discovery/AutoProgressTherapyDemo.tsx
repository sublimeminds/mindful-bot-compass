import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Brain, 
  Heart, 
  MessageCircle,
  Clock,
  Sparkles
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

interface DemoStep {
  type: 'therapist' | 'user';
  content: string;
  emotion?: string;
  delay: number; // milliseconds
  typingDuration?: number;
}

interface AutoProgressTherapyDemoProps {
  therapist: {
    id: string;
    name: string;
    specialties: string[];
    approach: string;
  };
  onComplete?: () => void;
}

const AutoProgressTherapyDemo: React.FC<AutoProgressTherapyDemoProps> = ({ 
  therapist, 
  onComplete 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<'therapist' | 'user' | null>(null);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'encouraging' | 'concerned' | 'thoughtful'>('neutral');
  const [progress, setProgress] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const avatarId = getAvatarIdForTherapist(therapist.id);

  // Extended demo conversation based on therapist specialty
  const getDemoSteps = (): DemoStep[] => {
    const primarySpecialty = therapist.specialties[0]?.toLowerCase() || 'general';
    
    if (primarySpecialty.includes('anxiety')) {
      return [
        {
          type: 'therapist',
          content: `Hi there! I'm ${therapist.name}. Welcome to our session. I want you to know this is a completely safe space where you can share anything that's on your mind. How are you feeling today?`,
          emotion: 'encouraging',
          delay: 2000,
          typingDuration: 3500
        },
        {
          type: 'user',
          content: "I've been feeling really anxious lately. My heart races and I can't seem to calm down, especially before work meetings.",
          delay: 4000,
          typingDuration: 3500
        },
        {
          type: 'therapist',
          content: "Thank you for sharing that with me. Anxiety before important situations is really common, and I want you to know that what you're experiencing is valid. When you notice your heart racing, what thoughts typically go through your mind?",
          emotion: 'empathetic',
          delay: 3000,
          typingDuration: 4000
        },
        {
          type: 'user',
          content: "I keep thinking 'What if I mess up?' or 'Everyone will think I'm incompetent.' It's like my brain just spirals into worst-case scenarios.",
          delay: 3500,
          typingDuration: 2800
        },
        {
          type: 'therapist',
          content: "That spiral of 'what if' thoughts is what we call catastrophic thinking, and it's one of anxiety's favorite tricks. Let me teach you a technique called the '5-4-3-2-1 grounding method' that can help interrupt that spiral. Can you tell me 5 things you can see right now?",
          emotion: 'thoughtful',
          delay: 2500,
          typingDuration: 3500
        },
        {
          type: 'user',
          content: "Um... I can see my laptop, a coffee mug, some books on my shelf, a plant, and... a picture frame.",
          delay: 3000,
          typingDuration: 2200
        },
        {
          type: 'therapist',
          content: "Perfect! Now 4 things you can touch... Notice how your breathing has already started to slow down? This technique works by bringing your nervous system back to the present moment, away from those anxious future scenarios.",
          emotion: 'encouraging',
          delay: 2000,
          typingDuration: 3200
        },
        {
          type: 'user',
          content: "Wow, you're right. I do feel a bit calmer. I can touch my keyboard, the armrest of my chair, my phone, and this soft throw blanket.",
          delay: 3200,
          typingDuration: 2600
        },
        {
          type: 'therapist',
          content: "Excellent! You're already learning to work with your anxiety instead of fighting against it. In our sessions, we'll build on this foundation with CBT techniques, breathing exercises, and personalized strategies for your specific triggers. You have more control than anxiety wants you to believe.",
          emotion: 'encouraging',
          delay: 2500,
          typingDuration: 4000
        }
      ];
    } else if (primarySpecialty.includes('relationship')) {
      return [
        {
          type: 'therapist',
          content: `Hello! I'm ${therapist.name}, and I specialize in helping people build stronger, healthier relationships. I'm really glad you're here today. What's been on your heart lately regarding your relationships?`,
          emotion: 'encouraging',
          delay: 1000,
          typingDuration: 2200
        },
        {
          type: 'user',
          content: "My partner and I keep having the same argument over and over. It feels like we're speaking different languages sometimes.",
          delay: 3000,
          typingDuration: 2400
        },
        {
          type: 'therapist',
          content: "That feeling of speaking different languages is actually a really insightful way to describe it. Many couples experience this, and it often stems from different communication styles and love languages. Can you tell me what these arguments typically start about?",
          emotion: 'thoughtful',
          delay: 2200,
          typingDuration: 3000
        },
        {
          type: 'user',
          content: "Usually small things - like household chores or scheduling. But then it escalates and suddenly we're both upset and nothing gets resolved.",
          delay: 3200,
          typingDuration: 2600
        },
        {
          type: 'therapist',
          content: "What you're describing is what Dr. John Gottman calls the 'Four Horsemen' pattern - it starts small but escalates quickly. The good news is that this pattern is completely changeable. Let me share something that might help: instead of focusing on the content of the argument, what if we focused on the process?",
          emotion: 'encouraging',
          delay: 2500,
          typingDuration: 3500
        },
        {
          type: 'user',
          content: "What do you mean by process? Like how we're arguing instead of what we're arguing about?",
          delay: 2800,
          typingDuration: 2200
        },
        {
          type: 'therapist',
          content: "Exactly! For example, try this: next time tensions rise, one of you could say 'I'm feeling overwhelmed right now. Can we take a 20-minute break and come back to this?' This isn't avoiding the issue - it's creating space for both of your nervous systems to calm down so you can actually hear each other.",
          emotion: 'thoughtful',
          delay: 2400,
          typingDuration: 3800
        },
        {
          type: 'user',
          content: "That actually makes a lot of sense. When we're both heated, neither of us is really listening - we're just waiting for our turn to defend ourselves.",
          delay: 3000,
          typingDuration: 2800
        },
        {
          type: 'therapist',
          content: "You've just had a breakthrough moment! That awareness is the first step toward transformation. In our work together, we'd practice tools like active listening, emotional regulation, and rebuilding trust and intimacy. Every healthy relationship is built on skills that can be learned and strengthened.",
          emotion: 'encouraging',
          delay: 2200,
          typingDuration: 3600
        }
      ];
    } else {
      // General therapy demo
      return [
        {
          type: 'therapist',
          content: `Welcome! I'm ${therapist.name}. I'm here to support you on your journey toward healing and growth. This is your time and space - what would you like to explore today?`,
          emotion: 'encouraging',
          delay: 1000,
          typingDuration: 2000
        },
        {
          type: 'user',
          content: "I've been feeling stuck lately, like I'm going through the motions but not really living. Does that make sense?",
          delay: 3000,
          typingDuration: 2200
        },
        {
          type: 'therapist',
          content: "That makes complete sense, and you're not alone in feeling this way. What you're describing - that sense of going through the motions - often happens when there's a disconnect between our actions and our deeper values or authentic self. When did you first notice this feeling?",
          emotion: 'empathetic',
          delay: 2200,
          typingDuration: 3200
        },
        {
          type: 'user',
          content: "I think it started a few months ago. I have a good job, good relationships, but something feels... missing. Like I'm living someone else's idea of a good life.",
          delay: 3500,
          typingDuration: 2800
        },
        {
          type: 'therapist',
          content: "What a profound insight. That feeling of living someone else's idea of a good life often points to a need to reconnect with your authentic self. Let me ask you this: if you could design a day that felt completely 'you' - not what others expect, but what genuinely energizes you - what would that look like?",
          emotion: 'thoughtful',
          delay: 2400,
          typingDuration: 3600
        },
        {
          type: 'user',
          content: "Hmm... I think I'd spend time in nature, create something with my hands, maybe have a meaningful conversation with a friend. Not just scrolling through social media or watching TV.",
          delay: 3200,
          typingDuration: 2600
        },
        {
          type: 'therapist',
          content: "Listen to how your voice changed when you described those activities - there's more energy, more life in it. That's your authentic self speaking. The path forward isn't about completely overhauling your life, but about intentionally weaving more of these authentic moments into your days. Small steps toward a life that feels genuinely yours.",
          emotion: 'encouraging',
          delay: 2600,
          typingDuration: 4000
        }
      ];
    }
  };

  const demoSteps = getDemoSteps();

  useEffect(() => {
    if (isPlaying && currentStep < demoSteps.length) {
      const step = demoSteps[currentStep];
      
      timeoutRef.current = setTimeout(() => {
        setIsTyping(true);
        setTypingUser(step.type);
        
        setTimeout(() => {
          addMessage(step.content, step.type === 'user', step.emotion);
          setIsTyping(false);
          setTypingUser(null);
          setCurrentStep(prev => prev + 1);
          setProgress((currentStep + 1) / demoSteps.length * 100);
        }, step.typingDuration || 2000);
      }, step.delay);
    } else if (currentStep >= demoSteps.length && isPlaying) {
      setIsPlaying(false);
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStep, isPlaying, demoSteps, onComplete]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { 
          therapistId: therapist.id,
          text: text.substring(0, 300)
        }
      });

      if (data?.audioContent && isVoiceEnabled) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audioRef.current.volume = 0.7;
        
        audioRef.current.onended = () => {
          // Audio finished playing
        };
        
        audioRef.current.onerror = (e) => {
          console.error('Audio playback error:', e);
        };
        
        try {
          await audioRef.current.play();
        } catch (playError) {
          console.error('Audio play failed:', playError);
        }
      }
    } catch (error) {
      console.error('Voice synthesis error:', error);
    }
  };

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setMessages([]);
    setProgress(0);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setMessages([]);
    setProgress(0);
    setIsTyping(false);
    setTypingUser(null);
    setAvatarEmotion('neutral');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (!isVoiceEnabled && audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="h-full max-h-[700px] flex gap-4">
      {/* Avatar Section */}
      <div className="w-72 flex-shrink-0">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Heart className="mr-2 h-4 w-4 text-therapy-600" />
              {therapist.name}
            </CardTitle>
            <Badge variant="outline" className="w-fit text-xs">
              2-Minute Demo
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="aspect-square bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden">
              <VoiceEnhancedAvatar
                therapistId={avatarId}
                therapistName={therapist.name}
                emotion={avatarEmotion}
                isSpeaking={typingUser === 'therapist'}
                isListening={false}
                showControls={false}
                className="w-full h-full"
                force2D={true}
              />
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-center text-muted-foreground">
                {therapist.approach} • {therapist.specialties[0]}
              </div>
              
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-center text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <div className="flex justify-center gap-2">
                {!isPlaying ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={startDemo}
                    className="bg-therapy-600 hover:bg-therapy-700"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {currentStep === 0 ? 'Start Demo' : 'Resume'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={pauseDemo}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetDemo}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoice}
                  className="text-xs"
                >
                  {isVoiceEnabled ? (
                    <Volume2 className="h-3 w-3 mr-1" />
                  ) : (
                    <VolumeX className="h-3 w-3 mr-1" />
                  )}
                  Voice {isVoiceEnabled ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Brain className="mr-2 h-4 w-4 text-therapy-600" />
              Live Therapy Session Demo
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Experience an authentic therapy conversation with automatic progression
            </p>
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
                            {message.emotion === 'encouraging' && '✨'}
                            {message.emotion === 'empathetic' && '💙'}
                            {message.emotion === 'thoughtful' && '🤔'}
                            {message.emotion === 'calming' && '🌊'}
                            {' '}{message.emotion}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className={`flex w-full ${typingUser === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      typingUser === 'user' 
                        ? 'bg-therapy-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs ml-2">
                          {typingUser === 'user' ? 'Client typing...' : `${therapist.name} typing...`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>
            </ScrollArea>

            {/* Demo status */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Step {currentStep} of {demoSteps.length}
                </div>
                
                {currentStep >= demoSteps.length && !isPlaying && (
                  <div className="flex items-center text-green-600">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Demo Complete!
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoProgressTherapyDemo;