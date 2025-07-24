import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoicePreviewButtonProps {
  therapistId: string;
  therapistName: string;
  text?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const VoicePreviewButton: React.FC<VoicePreviewButtonProps> = ({ 
  therapistId, 
  therapistName, 
  text,
  className = '',
  size = 'default'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const defaultText = `Hello, I'm ${therapistName}. I'm here to support you on your mental health journey with evidence-based therapy approaches tailored to your needs.`;

  const handleVoicePreview = async () => {
    if (isPlaying && audioRef) {
      audioRef.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { 
          therapistId,
          text: text || defaultText
        }
      });

      if (error || !data) {
        console.error('Voice preview error:', error);
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(text || defaultText);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
        return;
      }

      if (data?.audioContent) {
        if (audioRef) {
          audioRef.pause();
        }
        
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audio.volume = 1.0; // Increase volume to maximum
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          toast({
            title: "Audio Playback Error",
            description: "Unable to play the voice preview.",
            variant: "destructive"
          });
        };
        
        setAudioRef(audio);
        try {
          await audio.play();
          console.log('Audio playing successfully at volume:', audio.volume);
        } catch (playError) {
          console.error('Audio play error:', playError);
          setIsPlaying(false);
          toast({
            title: "Audio Playback Error", 
            description: "Please check your audio settings and try again.",
            variant: "destructive"
          });
        }
      } else {
        setIsPlaying(false);
        toast({
          title: "Voice Preview Unavailable",
          description: "No audio content received from the voice service.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Voice preview failed:', error);
      setIsPlaying(false);
      toast({
        title: "Voice Preview Failed",
        description: "There was an error generating the voice preview. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleVoicePreview}
      variant="outline"
      size={size}
      className={className}
      disabled={false}
    >
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4 mr-2" />
          Stop Preview
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 mr-2" />
          Voice Preview
        </>
      )}
    </Button>
  );
};

export default VoicePreviewButton;