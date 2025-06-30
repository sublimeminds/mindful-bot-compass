
import { enhancedVoiceService } from './voiceService';

export interface TherapyVoiceConfig {
  voiceId: string;
  voiceName: string;
  emotionalContext: string;
  therapeuticApproach: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
}

export interface EmotionalContext {
  primaryEmotion: string;
  intensity: number;
  supportLevel: 'low' | 'medium' | 'high';
  crisisLevel: boolean;
}

class EnhancedTherapyVoiceService {
  private apiKey: string | null = null;
  private therapyVoices: Map<string, TherapyVoiceConfig> = new Map();

  constructor() {
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
    this.initializeTherapyVoices();
  }

  private initializeTherapyVoices(): void {
    // Specialized voice configurations for different therapeutic contexts
    this.therapyVoices.set('compassionate', {
      voiceId: '9BWtsMINqrJLrRacOk9x', // Aria
      voiceName: 'Aria',
      emotionalContext: 'compassionate',
      therapeuticApproach: 'person-centered',
      stability: 0.8,
      similarityBoost: 0.9,
      style: 0.6,
      speakerBoost: true
    });

    this.therapyVoices.set('calming', {
      voiceId: 'XB0fDUnXU5powFXDhCwa', // Charlotte
      voiceName: 'Charlotte',
      emotionalContext: 'calming',
      therapeuticApproach: 'mindfulness',
      stability: 0.9,
      similarityBoost: 0.8,
      style: 0.3,
      speakerBoost: true
    });

    this.therapyVoices.set('supportive', {
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
      voiceName: 'Sarah',
      emotionalContext: 'supportive',
      therapeuticApproach: 'cbt',
      stability: 0.7,
      similarityBoost: 0.85,
      style: 0.4,
      speakerBoost: true
    });

    this.therapyVoices.set('crisis', {
      voiceId: 'FGY2WhTYpPnrIDTdsKH5', // Laura
      voiceName: 'Laura',
      emotionalContext: 'crisis-support',
      therapeuticApproach: 'crisis-intervention',
      stability: 0.95,
      similarityBoost: 0.9,
      style: 0.2,
      speakerBoost: true
    });
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('elevenlabs_api_key', key);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Generate therapeutic speech with emotional context
  async generateTherapeuticSpeech(
    text: string, 
    emotionalContext: EmotionalContext,
    therapeuticApproach: string = 'person-centered'
  ): Promise<string | null> {
    if (!this.hasApiKey()) return null;

    const voiceConfig = this.selectOptimalVoice(emotionalContext, therapeuticApproach);
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!
        },
        body: JSON.stringify({
          text: this.adaptTextForTherapy(text, emotionalContext),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarityBoost,
            style: voiceConfig.style,
            use_speaker_boost: voiceConfig.speakerBoost
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating therapeutic speech:', error);
      return null;
    }
  }

  private selectOptimalVoice(
    emotionalContext: EmotionalContext, 
    therapeuticApproach: string
  ): TherapyVoiceConfig {
    // Crisis situations get immediate calm, stable voice
    if (emotionalContext.crisisLevel) {
      return this.therapyVoices.get('crisis')!;
    }

    // High intensity emotions need calming voice
    if (emotionalContext.intensity > 0.7) {
      return this.therapyVoices.get('calming')!;
    }

    // Match therapeutic approach
    switch (therapeuticApproach.toLowerCase()) {
      case 'cbt':
      case 'cognitive-behavioral':
        return this.therapyVoices.get('supportive')!;
      case 'mindfulness':
      case 'meditation':
        return this.therapyVoices.get('calming')!;
      case 'person-centered':
      case 'humanistic':
      default:
        return this.therapyVoices.get('compassionate')!;
    }
  }

  private adaptTextForTherapy(text: string, emotionalContext: EmotionalContext): string {
    // Add therapeutic pacing and breathing cues for high-stress situations
    if (emotionalContext.intensity > 0.8 || emotionalContext.crisisLevel) {
      return this.addTherapeuticPacing(text);
    }

    // Add gentle pauses for emotional processing
    if (emotionalContext.intensity > 0.5) {
      return this.addGentlePauses(text);
    }

    return text;
  }

  private addTherapeuticPacing(text: string): string {
    // Add longer pauses and breathing cues
    return text
      .replace(/\./g, '... Take a moment to breathe.')
      .replace(/\?/g, '? Let that settle for a moment.')
      .replace(/!/g, '. Remember, you are safe.');
  }

  private addGentlePauses(text: string): string {
    // Add gentle pauses for emotional processing
    return text
      .replace(/\./g, '... ')
      .replace(/,/g, ', ... ');
  }

  // Real-time emotional adaptation during conversation
  async adaptVoiceForEmotion(
    currentEmotion: string, 
    intensity: number, 
    previousContext?: EmotionalContext
  ): Promise<TherapyVoiceConfig> {
    const emotionalContext: EmotionalContext = {
      primaryEmotion: currentEmotion,
      intensity,
      supportLevel: intensity > 0.7 ? 'high' : intensity > 0.4 ? 'medium' : 'low',
      crisisLevel: intensity > 0.9 && ['panic', 'crisis', 'suicidal'].includes(currentEmotion)
    };

    return this.selectOptimalVoice(emotionalContext, 'adaptive');
  }

  // Get available therapy voices
  getTherapyVoices(): TherapyVoiceConfig[] {
    return Array.from(this.therapyVoices.values());
  }

  // Stream therapeutic audio for real-time conversations
  async streamTherapeuticAudio(
    text: string,
    emotionalContext: EmotionalContext,
    onAudioChunk: (chunk: ArrayBuffer) => void
  ): Promise<void> {
    if (!this.hasApiKey()) return;

    const voiceConfig = this.selectOptimalVoice(emotionalContext, 'streaming');
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}/stream`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!
        },
        body: JSON.stringify({
          text: this.adaptTextForTherapy(text, emotionalContext),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarityBoost,
            style: voiceConfig.style,
            use_speaker_boost: voiceConfig.speakerBoost
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs streaming error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        onAudioChunk(value.buffer);
      }
    } catch (error) {
      console.error('Error streaming therapeutic audio:', error);
    }
  }
}

export const enhancedTherapyVoiceService = new EnhancedTherapyVoiceService();
