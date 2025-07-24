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
      console.log('=== Voice Preview Started ===');
      console.log('Therapist ID:', therapistId);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { 
          therapistId,
          text: text || defaultText
        }
      });

      console.log('Supabase response:', { data: !!data, error });

      if (data?.audioContent) {
        console.log('Got audio content, playing...');
        
        if (audioRef) {
          audioRef.pause();
        }
        
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audio.volume = 1.0;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsPlaying(false);
        };
        
        setAudioRef(audio);
        await audio.play();
        console.log('Audio playing successfully at volume:', audio.volume);
        
      } else {
        console.log('No audio content, using browser TTS fallback');
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(text || defaultText);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Voice preview failed:', error);
      setIsPlaying(false);
      
      // Fallback to browser TTS
      console.log('Using browser TTS fallback due to error');
      const utterance = new SpeechSynthesisUtterance(text || defaultText);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
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