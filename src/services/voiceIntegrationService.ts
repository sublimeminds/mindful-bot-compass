import { supabase } from '@/integrations/supabase/client';

export interface VoiceToTextOptions {
  language?: string;
  model?: 'whisper-1';
}

export interface TextToSpeechOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  model?: 'tts-1' | 'tts-1-hd';
  speed?: number;
}

export class VoiceIntegrationService {
  static async convertSpeechToText(
    audioBlob: Blob, 
    options: VoiceToTextOptions = {}
  ): Promise<string> {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: {
          audio: base64Audio,
          language: options.language || 'en'
        }
      });

      if (error) {
        console.error('Voice to text error:', error);
        throw new Error(error.message || 'Failed to convert speech to text');
      }

      return data.text || '';
    } catch (error) {
      console.error('Speech to text conversion failed:', error);
      throw error;
    }
  }

  static async convertTextToSpeech(
    text: string, 
    options: TextToSpeechOptions = {}
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: options.voice || 'alloy',
          model: options.model || 'tts-1',
          speed: options.speed || 1.0
        }
      });

      if (error) {
        console.error('Text to speech error:', error);
        throw new Error(error.message || 'Failed to convert text to speech');
      }

      return data.audioContent || '';
    } catch (error) {
      console.error('Text to speech conversion failed:', error);
      throw error;
    }
  }

  static async playBase64Audio(base64Audio: string): Promise<void> {
    try {
      const audioBlob = new Blob(
        [Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Failed to play audio'));
        };
        audio.play();
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  static startRecording(): Promise<MediaRecorder> {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        resolve(mediaRecorder);
      } catch (error) {
        reject(error);
      }
    });
  }

  static stopRecording(mediaRecorder: MediaRecorder): Promise<Blob> {
    return new Promise((resolve) => {
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };
      
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }
}