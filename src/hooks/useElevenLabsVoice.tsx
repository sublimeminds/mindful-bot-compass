import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getVoiceIdForTherapist } from '@/services/therapistAvatarMapping';

export interface VoiceSettings {
  voiceId: string;
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export const useElevenLabsVoice = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateSpeech = useCallback(async (
    text: string,
    therapistId?: string,
    customVoiceId?: string
  ): Promise<string | null> => {
    if (!text.trim()) return null;

    setIsGenerating(true);
    try {
      const voiceId = customVoiceId || getVoiceIdForTherapist(therapistId || '1');
      
    const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
      body: {
        therapistId: therapistId || '1',
        text: text.trim()
      }
    });

      if (error) {
        console.error('ElevenLabs TTS Error:', error);
        return null;
      }

      if (data?.audioContent) {
        // Convert base64 to blob URL
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        return url;
      }

      return null;
    } catch (error) {
      console.error('Speech generation error:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const playSpeech = useCallback(async (
    text: string,
    therapistId?: string,
    customVoiceId?: string
  ): Promise<void> => {
    const audioUrl = await generateSpeech(text, therapistId, customVoiceId);
    
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play().catch(reject);
      });
    }
  }, [generateSpeech]);

  const stopSpeech = useCallback(() => {
    // Stop any currently playing audio
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    isGenerating,
    audioUrl,
    generateSpeech,
    playSpeech,
    stopSpeech
  };
};