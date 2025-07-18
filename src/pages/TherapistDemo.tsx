import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  MessageSquare, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Heart,
  Brain,
  Target,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TherapistDemo = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'>('neutral');

  // Fetch therapist data
  const { data: therapist, isLoading } = useQuery({
    queryKey: ['therapist', therapistId],
    queryFn: async () => {
      if (!therapistId) throw new Error('No therapist ID provided');
      
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('id', therapistId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Therapist not found');
      
      return {
        ...data,
        avatarId: getAvatarIdForTherapist(data.id),
        languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Japanese', 'Chinese (Mandarin)', 'Korean', 'Arabic', 'Hindi', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish', 'Hebrew', 'Indonesian', 'Thai', 'Vietnamese', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Slovak', 'Slovenian', 'Estonian', 'Latvian', 'Lithuanian']
      };
    },
    enabled: !!therapistId
  });

  const demoScenarios = [
    {
      title: "Initial Greeting",
      description: "Experience how your therapist would greet you in your first session",
      emotion: "happy",
      message: `Hello! I'm so glad you decided to take this step towards better mental health. I'm ${therapist?.name}, and I'll be your AI therapist. This is a safe space where you can share your thoughts and feelings without judgment.`,
      userResponse: "Hi, I'm feeling a bit nervous about this..."
    },
    {
      title: "Active Listening",
      description: "See how your therapist demonstrates empathy and understanding",
      emotion: "concerned", 
      message: "I completely understand feeling nervous - that's very normal and shows you're being brave by being here. Can you tell me a little about what brought you to seek therapy today?",
      userResponse: "I've been feeling anxious and overwhelmed lately with work and relationships."
    },
    {
      title: "Supportive Response",
      description: "Experience compassionate guidance and validation",
      emotion: "encouraging",
      message: "Thank you for sharing that with me. Feeling anxious and overwhelmed can be really challenging, and it takes courage to recognize when we need support. You're not alone in this - these feelings are very common, and we can work together to develop strategies to help you feel more balanced.",
      userResponse: "That makes me feel a bit better already."
    },
    {
      title: "Therapeutic Technique",
      description: "Learn about therapeutic approaches in action",
      emotion: "thoughtful",
      message: "I'm glad to hear that. Let's try a simple grounding technique together. Can you name 5 things you can see around you right now? This is called the 5-4-3-2-1 technique, and it can help when you're feeling anxious.",
      userResponse: "I can see my laptop, a coffee cup, a plant, some books, and a picture on the wall."
    },
    {
      title: "Session Conclusion",
      description: "See how sessions end with encouragement and next steps",
      emotion: "encouraging",
      message: "Excellent! You did really well with that exercise. Remember, managing anxiety is a skill that gets stronger with practice. Between now and our next session, try using this grounding technique whenever you feel overwhelmed. You're making great progress already.",
      userResponse: "Thank you, this was really helpful."
    }
  ];

  const playVoiceDemo = async (message: string) => {
    if (!isSoundOn) return;
    
    setIsPlaying(true);
    try {
      const response = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { therapistId, text: message }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const audio = new Audio(`data:audio/mpeg;base64,${response.data.audioContent}`);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Audio Unavailable",
          description: "Voice sample couldn't be loaded.",
          variant: "destructive"
        });
      };
      
      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      toast({
        title: "Audio Unavailable",
        description: "Voice sample couldn't be loaded.",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => {
    if (demoStep < demoScenarios.length - 1) {
      setDemoStep(demoStep + 1);
      const nextScenario = demoScenarios[demoStep + 1];
      setCurrentEmotion(nextScenario.emotion as any);
      setTimeout(() => {
        playVoiceDemo(nextScenario.message);
      }, 500);
    }
  };

  const resetDemo = () => {
    setDemoStep(0);
    setCurrentEmotion('happy');
    setIsPlaying(false);
  };

  useEffect(() => {
    if (therapist) {
      setCurrentEmotion('happy');
      setTimeout(() => {
        playVoiceDemo(demoScenarios[0].message);
      }, 1000);
    }
  }, [therapist]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading demo...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Therapist not found</p>
          <Button onClick={() => navigate('/ai-therapist-team')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </div>
      </div>
    );
  }

  const currentScenario = demoScenarios[demoStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/ai-therapist-team')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Team
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Demo Session</h1>
            <p className="text-muted-foreground">Interactive preview with {therapist.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar and Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-therapy-600" />
                  {therapist.name}
                </CardTitle>
                <Badge variant="secondary">{therapist.approach}</Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="h-64 bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <Professional2DAvatar
                    therapistId={therapist.avatarId}
                    therapistName={therapist.name}
                    className="w-48 h-48"
                    size="xl"
                    emotion={currentEmotion}
                    showVoiceIndicator={true}
                    isSpeaking={isPlaying}
                    showName={false}
                  />
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMicrophoneOn(!isMicrophoneOn)}
                      className={isMicrophoneOn ? "bg-green-50 border-green-200" : ""}
                    >
                      {isMicrophoneOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSoundOn(!isSoundOn)}
                      className={isSoundOn ? "bg-blue-50 border-blue-200" : ""}
                    >
                      {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetDemo}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Demo
                    </Button>
                  </div>

                  <Button
                    onClick={() => playVoiceDemo(currentScenario.message)}
                    disabled={isPlaying}
                    className="w-full"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Replay Message
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Demo Progress</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {demoStep + 1} of {demoScenarios.length}
                  </span>
                </div>
                <Progress value={((demoStep + 1) / demoScenarios.length) * 100} className="w-full" />
              </CardHeader>
            </Card>

            {/* Current Scenario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  {currentScenario.title}
                </CardTitle>
                <p className="text-muted-foreground">{currentScenario.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Therapist Message */}
                <div className="bg-gradient-to-r from-therapy-50 to-blue-50 p-4 rounded-lg border-l-4 border-therapy-400">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-therapy-500 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-therapy-800">{therapist.name}</p>
                      <p className="text-therapy-700 mt-1">{currentScenario.message}</p>
                    </div>
                  </div>
                </div>

                {/* User Response */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-l-4 border-gray-400">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">You</p>
                      <p className="text-gray-700 mt-1">{currentScenario.userResponse}</p>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                {demoStep < demoScenarios.length - 1 ? (
                  <Button onClick={nextStep} className="w-full">
                    Continue to Next Step
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800">Demo Complete!</h3>
                      <p className="text-green-700 text-sm mt-1">
                        You've experienced a sample session with {therapist.name}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={resetDemo} className="flex-1">
                        Try Again
                      </Button>
                      <Button onClick={() => navigate('/onboarding')} className="flex-1">
                        Start Your Journey
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Therapist Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {therapist.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{therapist.description}</p>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialties?.slice(0, 5).map((specialty: string) => (
                    <Badge key={specialty} variant="outline">{specialty}</Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Communication Style:</strong> {therapist.communication_style}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Languages:</strong> {therapist.languages.length}+ languages supported
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDemo;