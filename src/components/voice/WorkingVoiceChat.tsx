import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2,
  Waves,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WorkingVoiceChatProps {
  onSpeakingChange?: (speaking: boolean) => void;
  onTranscriptChange?: (transcript: string) => void;
}

const WorkingVoiceChat: React.FC<WorkingVoiceChatProps> = ({ 
  onSpeakingChange, 
  onTranscriptChange 
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      onSpeakingChange?.(false); // User is speaking, AI is not

      toast({
        title: "Recording Started",
        description: "Speak now... Click stop when finished.",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [onSpeakingChange, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {      
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Step 1: Transcribe audio to text
      const transcribeResponse = await supabase.functions.invoke('ai-voice-chat', {
        body: { 
          audio: base64Audio,
          action: 'transcribe'
        }
      });

      if (transcribeResponse.error) {
        throw new Error(transcribeResponse.error.message);
      }

      const { text } = transcribeResponse.data;
      setCurrentTranscript(text);
      onTranscriptChange?.(text);

      if (!text.trim()) {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking more clearly.",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Get AI response
      const chatResponse = await supabase.functions.invoke('ai-voice-chat', {
        body: { 
          message: text,
          action: 'chat'
        }
      });

      if (chatResponse.error) {
        throw new Error(chatResponse.error.message);
      }

      const { response } = chatResponse.data;
      setAiResponse(response);

      // Step 3: Convert AI response to speech
      const synthesizeResponse = await supabase.functions.invoke('ai-voice-chat', {
        body: { 
          text: response,
          action: 'synthesize',
          voiceId: 'EXAVITQu4vr4xnSDxMaL' // Dr. Sarah Chen's voice
        }
      });

      if (synthesizeResponse.error) {
        throw new Error(synthesizeResponse.error.message);
      }

      const { audioContent } = synthesizeResponse.data;
      
      // Step 4: Play the audio
      await playAudio(audioContent);

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process audio",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = async (base64Audio: string) => {
    try {
      // Convert base64 to blob
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onloadeddata = () => {
          setIsPlaying(true);
          onSpeakingChange?.(true); // AI is now speaking
          audioRef.current?.play();
        };
        audioRef.current.onended = () => {
          setIsPlaying(false);
          onSpeakingChange?.(false); // AI finished speaking
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          onSpeakingChange?.(false);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Playback Error",
            description: "Could not play audio response",
            variant: "destructive",
          });
        };
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Playback Error",
        description: "Failed to play audio response",
        variant: "destructive",
      });
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      onSpeakingChange?.(false);
    }
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || isPlaying}
          className="flex items-center gap-2"
        >
          {isRecording ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          {isRecording ? "Stop Recording" : "Start Voice Chat"}
        </Button>

        <Button
          variant={isPlaying ? "default" : "outline"}
          size="lg"
          onClick={stopPlayback}
          disabled={!isPlaying}
          className="flex items-center gap-2"
        >
          {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          {isPlaying ? "AI Speaking" : "Audio Response"}
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-center gap-4">
        {isRecording && (
          <Badge variant="default" className="bg-red-500 animate-pulse">
            <Mic className="h-3 w-3 mr-1" />
            Recording...
          </Badge>
        )}
        
        {isProcessing && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Processing...
          </Badge>
        )}
        
        {isPlaying && (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Volume2 className="h-3 w-3 mr-1" />
            AI Speaking
          </Badge>
        )}
      </div>

      {/* Conversation Display */}
      {(currentTranscript || aiResponse) && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          {currentTranscript && (
            <div className="flex justify-start">
              <div className="bg-secondary/20 rounded-lg p-3 max-w-sm">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">You said:</span>
                </div>
                <p className="text-sm">{currentTranscript}</p>
              </div>
            </div>
          )}
          
          {aiResponse && (
            <div className="flex justify-end">
              <div className="bg-primary rounded-lg p-3 max-w-sm text-primary-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 className="h-3 w-3" />
                  <span className="text-xs opacity-90">Dr. Sarah Chen:</span>
                </div>
                <p className="text-sm">{aiResponse}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Technical Info */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Waves className="h-4 w-4" />
          <span>Real voice-to-voice AI therapy conversation</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-center mt-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">OpenAI Whisper</Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">GPT-4 Therapy</Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">ElevenLabs TTS</Badge>
        </div>
      </div>
    </div>
  );
};

export default WorkingVoiceChat;