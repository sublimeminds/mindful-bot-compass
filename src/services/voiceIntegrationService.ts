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

  static async convertSpeechToTextAndTranslate(
    audioBlob: Blob,
    sourceLanguage: string,
    targetLanguage: string,
    culturalContext?: string
  ): Promise<{ originalText: string; translatedText: string }> {
    try {
      // First, convert speech to text in source language
      const originalText = await this.convertSpeechToText(audioBlob, { language: sourceLanguage });

      // If target language is the same as source, return original text
      if (sourceLanguage === targetLanguage) {
        return { originalText, translatedText: originalText };
      }

      // Translate the text
      const { data: translationData, error: translationError } = await supabase.functions.invoke('ai-translate', {
        body: {
          texts: [originalText],
          targetLanguage: targetLanguage,
          context: 'conversation',
          culturalContext: culturalContext
        }
      });

      if (translationError) {
        console.error('Translation error:', translationError);
        return { originalText, translatedText: originalText };
      }

      const translatedText = translationData.translations[0] || originalText;
      return { originalText, translatedText };
    } catch (error) {
      console.error('Speech to text and translation failed:', error);
      throw error;
    }
  }

  static async enhancedTranscriptionAnalysis(
    audioBlob: Blob,
    userId: string,
    sessionId: string,
    options: VoiceToTextOptions = {}
  ): Promise<{
    transcript: string;
    analysis: any;
    subscription_tier: string;
    model_used: string;
  }> {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      const { data, error } = await supabase.functions.invoke('enhanced-transcription-analysis', {
        body: {
          audio: base64Audio,
          userId,
          sessionId,
          language: options.language || 'en'
        }
      });

      if (error) {
        console.error('Enhanced transcription analysis error:', error);
        throw new Error(error.message || 'Failed to analyze transcription');
      }

      return data;
    } catch (error) {
      console.error('Enhanced transcription analysis failed:', error);
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

  static async translateAndConvertToSpeech(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    options: TextToSpeechOptions = {},
    culturalContext?: string
  ): Promise<{ originalAudio: string; translatedAudio: string; translatedText: string }> {
    try {
      // If source and target languages are the same, just convert to speech
      if (sourceLanguage === targetLanguage) {
        const audioContent = await this.convertTextToSpeech(text, options);
        return { originalAudio: audioContent, translatedAudio: audioContent, translatedText: text };
      }

      // Translate the text first
      const { data: translationData, error: translationError } = await supabase.functions.invoke('ai-translate', {
        body: {
          texts: [text],
          targetLanguage: targetLanguage,
          context: 'conversation',
          culturalContext: culturalContext
        }
      });

      if (translationError) {
        console.error('Translation error:', translationError);
        throw new Error('Failed to translate text');
      }

      const translatedText = translationData.translations[0] || text;

      // Convert both original and translated text to speech
      const [originalAudio, translatedAudio] = await Promise.all([
        this.convertTextToSpeech(text, options),
        this.convertTextToSpeech(translatedText, options)
      ]);

      return { originalAudio, translatedAudio, translatedText };
    } catch (error) {
      console.error('Translate and text to speech conversion failed:', error);
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