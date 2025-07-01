import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Brain,
  Radio,
  Settings,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VoiceIntegrationService } from '@/services/voiceIntegrationService';
import { cn } from '@/lib/utils';

interface VoiceTherapyChatProps {
  onMessageReceived?: (message: string, isVoice: boolean) => void;
  onVoiceAnalysis?: (emotion: string, stressLevel: number) => void;
  isTherapistSpeaking?: boolean;
  className?: string;
}

const VoiceTherapyChat = ({ 
  onMessageReceived, 
  onVoiceAnalysis,
  isTherapistSpeaking = false,
  className 
}: VoiceTherapyChatProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>('alloy');
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      
      const mediaRecorder = await VoiceIntegrationService.startRecording();
      mediaRecorderRef.current = mediaRecorder;
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak now... Tap stop when finished.",
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      const audioBlob = await VoiceIntegrationService.stopRecording(mediaRecorderRef.current);
      mediaRecorderRef.current = null;

      // Convert speech to text
      const transcript = await VoiceIntegrationService.convertSpeechToText(audioBlob, {
        language: 'en'
      });

      if (transcript.trim()) {
        // Simulate voice analysis (in real implementation, this would come from AI analysis)
        const mockEmotions = ['calm', 'anxious', 'sad', 'happy', 'stressed'];
        const detectedEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
        const stressLevel = Math.random() * 0.8; // 0-0.8 range

        onVoiceAnalysis?.(detectedEmotion, stressLevel);
        onMessageReceived?.(transcript, true);

        toast({
          title: "Voice Message Processed",
          description: `Transcript: "${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}"`,
        });
      } else {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking more clearly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to process recording:', error);
      toast({
        title: "Processing Failed",
        description: "Could not process your voice message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setRecordingDuration(0);
    }
  };

  const speakText = async (text: string) => {
    if (!autoSpeak || !text.trim()) return;

    try {
      const base64Audio = await VoiceIntegrationService.convertTextToSpeech(text, {
        voice: selectedVoice,
        model: 'tts-1',
        speed: 1.0
      });

      await VoiceIntegrationService.playBase64Audio(base64Audio);

      toast({
        title: "AI Response",
        description: "Playing voice response...",
      });
    } catch (error) {
      console.error('Failed to speak text:', error);
      toast({
        title: "Speech Error",
        description: "Could not play voice response.",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingColor = () => {
    if (recordingDuration < 5) return 'text-green-500';
    if (recordingDuration < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className={cn("bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>Voice Therapy Chat</span>
            <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
              AI Enhanced
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={voiceEnabled}
              onCheckedChange={setVoiceEnabled}
              id="voice-enabled"
            />
            <Label htmlFor="voice-enabled" className="text-sm">Voice Input</Label>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!voiceEnabled || isProcessing}
            className={cn(
              "transition-all duration-200",
              isRecording && "animate-pulse scale-105 shadow-lg"
            )}
          >
            {isRecording ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop Recording
              </>
            ) : isProcessing ? (
              <>
                <Activity className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </>
            )}
          </Button>

          {isRecording && (
            <div className="flex items-center space-x-2">
              <Radio className={cn("h-4 w-4 animate-pulse", getRecordingColor())} />
              <span className={cn("text-sm font-mono", getRecordingColor())}>
                {formatDuration(recordingDuration)}
              </span>
            </div>
          )}
        </div>

        {/* Voice Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-therapy-200">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-speak" className="text-sm">Auto-speak responses</Label>
            <Switch
              checked={autoSpeak}
              onCheckedChange={setAutoSpeak}
              id="auto-speak"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-therapy-600" />
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="text-sm border rounded px-2 py-1 bg-white"
            >
              <option value="alloy">Alloy (Neutral)</option>
              <option value="echo">Echo (Male)</option>
              <option value="fable">Fable (British)</option>
              <option value="onyx">Onyx (Deep)</option>
              <option value="nova">Nova (Female)</option>
              <option value="shimmer">Shimmer (Soft)</option>
            </select>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-therapy-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                voiceEnabled ? "bg-green-500" : "bg-gray-400"
              )} />
              <span>Voice {voiceEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                autoSpeak ? "bg-blue-500" : "bg-gray-400"
              )} />
              <span>Auto-speak {autoSpeak ? 'On' : 'Off'}</span>
            </div>
          </div>

          {isTherapistSpeaking && (
            <div className="flex items-center space-x-1">
              <Volume2 className="h-3 w-3 animate-pulse text-therapy-600" />
              <span>AI is speaking...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceTherapyChat;