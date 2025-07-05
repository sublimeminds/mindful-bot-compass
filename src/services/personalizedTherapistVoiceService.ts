import { supabase } from '@/integrations/supabase/client';

export interface TherapistVoiceConfig {
  therapistId: string;
  voiceId: string;
  voiceName: string;
  personalityModifiers: {
    stability: number;
    similarityBoost: number;
    style: number;
    speakerBoost: boolean;
  };
  emotionalRange: {
    supportive: VoiceSettings;
    analytical: VoiceSettings;
    calming: VoiceSettings;
    encouraging: VoiceSettings;
    crisis: VoiceSettings;
  };
}

export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  temperature: number;
}

export interface EmotionalContext {
  primaryEmotion: string;
  intensity: number;
  supportLevel: 'low' | 'medium' | 'high';
  crisisLevel: boolean;
  userMood?: string;
}

class PersonalizedTherapistVoiceService {
  private apiKey: string | null = null;
  private therapistVoices: Map<string, TherapistVoiceConfig> = new Map();
  private currentTherapistId: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
    this.initializeTherapistVoices();
  }

  private initializeTherapistVoices(): void {
    // Dr. Sarah Chen (CBT) - Analytical, structured approach
    this.therapistVoices.set('dr-sarah-chen', {
      therapistId: 'dr-sarah-chen',
      voiceId: '9BWtsMINqrJLrRacOk9x', // Aria - clear, analytical
      voiceName: 'Aria',
      personalityModifiers: {
        stability: 0.85,
        similarityBoost: 0.9,
        style: 0.7,
        speakerBoost: true
      },
      emotionalRange: {
        supportive: { stability: 0.8, similarityBoost: 0.85, style: 0.6, temperature: 0.7 },
        analytical: { stability: 0.9, similarityBoost: 0.95, style: 0.8, temperature: 0.5 },
        calming: { stability: 0.85, similarityBoost: 0.8, style: 0.5, temperature: 0.6 },
        encouraging: { stability: 0.8, similarityBoost: 0.9, style: 0.7, temperature: 0.8 },
        crisis: { stability: 0.95, similarityBoost: 0.9, style: 0.3, temperature: 0.4 }
      }
    });

    // Dr. Maya Patel (Mindfulness) - Calm, gentle approach
    this.therapistVoices.set('dr-maya-patel', {
      therapistId: 'dr-maya-patel',
      voiceId: 'XB0fDUnXU5powFXDhCwa', // Charlotte - soft, calming
      voiceName: 'Charlotte',
      personalityModifiers: {
        stability: 0.9,
        similarityBoost: 0.8,
        style: 0.4,
        speakerBoost: true
      },
      emotionalRange: {
        supportive: { stability: 0.9, similarityBoost: 0.8, style: 0.4, temperature: 0.6 },
        analytical: { stability: 0.85, similarityBoost: 0.85, style: 0.6, temperature: 0.5 },
        calming: { stability: 0.95, similarityBoost: 0.8, style: 0.3, temperature: 0.5 },
        encouraging: { stability: 0.85, similarityBoost: 0.8, style: 0.5, temperature: 0.7 },
        crisis: { stability: 0.98, similarityBoost: 0.85, style: 0.2, temperature: 0.3 }
      }
    });

    // Dr. Alex Rodriguez (Solution-Focused) - Energetic, optimistic
    this.therapistVoices.set('dr-alex-rodriguez', {
      therapistId: 'dr-alex-rodriguez',
      voiceId: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - energetic, confident
      voiceName: 'Liam',
      personalityModifiers: {
        stability: 0.75,
        similarityBoost: 0.85,
        style: 0.8,
        speakerBoost: true
      },
      emotionalRange: {
        supportive: { stability: 0.8, similarityBoost: 0.85, style: 0.7, temperature: 0.8 },
        analytical: { stability: 0.8, similarityBoost: 0.9, style: 0.8, temperature: 0.6 },
        calming: { stability: 0.85, similarityBoost: 0.8, style: 0.6, temperature: 0.6 },
        encouraging: { stability: 0.75, similarityBoost: 0.9, style: 0.9, temperature: 0.9 },
        crisis: { stability: 0.9, similarityBoost: 0.85, style: 0.4, temperature: 0.5 }
      }
    });

    // Dr. Jordan Kim (Trauma-Informed) - Gentle, patient
    this.therapistVoices.set('dr-jordan-kim', {
      therapistId: 'dr-jordan-kim',
      voiceId: 'FGY2WhTYpPnrIDTdsKH5', // Laura - gentle, therapeutic
      voiceName: 'Laura',
      personalityModifiers: {
        stability: 0.95,
        similarityBoost: 0.9,
        style: 0.3,
        speakerBoost: true
      },
      emotionalRange: {
        supportive: { stability: 0.95, similarityBoost: 0.9, style: 0.4, temperature: 0.6 },
        analytical: { stability: 0.9, similarityBoost: 0.9, style: 0.5, temperature: 0.5 },
        calming: { stability: 0.98, similarityBoost: 0.85, style: 0.2, temperature: 0.4 },
        encouraging: { stability: 0.9, similarityBoost: 0.9, style: 0.4, temperature: 0.7 },
        crisis: { stability: 0.99, similarityBoost: 0.95, style: 0.1, temperature: 0.3 }
      }
    });

    // Dr. Taylor Morgan (Relationship Counseling) - Balanced, empathetic
    this.therapistVoices.set('dr-taylor-morgan', {
      therapistId: 'dr-taylor-morgan',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - balanced, empathetic
      voiceName: 'Sarah',
      personalityModifiers: {
        stability: 0.8,
        similarityBoost: 0.85,
        style: 0.6,
        speakerBoost: true
      },
      emotionalRange: {
        supportive: { stability: 0.85, similarityBoost: 0.85, style: 0.6, temperature: 0.7 },
        analytical: { stability: 0.8, similarityBoost: 0.9, style: 0.7, temperature: 0.6 },
        calming: { stability: 0.9, similarityBoost: 0.8, style: 0.4, temperature: 0.5 },
        encouraging: { stability: 0.8, similarityBoost: 0.9, style: 0.7, temperature: 0.8 },
        crisis: { stability: 0.95, similarityBoost: 0.9, style: 0.3, temperature: 0.4 }
      }
    });
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('elevenlabs_api_key', key);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  setCurrentTherapist(therapistId: string): void {
    this.currentTherapistId = therapistId;
    localStorage.setItem('current_therapist_id', therapistId);
  }

  getCurrentTherapist(): string | null {
    return this.currentTherapistId || localStorage.getItem('current_therapist_id');
  }

  private getTherapistVoiceConfig(therapistId: string): TherapistVoiceConfig | null {
    return this.therapistVoices.get(therapistId) || null;
  }

  private selectOptimalVoiceSettings(
    voiceConfig: TherapistVoiceConfig,
    emotionalContext: EmotionalContext
  ): VoiceSettings {
    // Crisis situations get immediate calm, stable voice
    if (emotionalContext.crisisLevel) {
      return voiceConfig.emotionalRange.crisis;
    }

    // High intensity emotions need calming approach
    if (emotionalContext.intensity > 0.7) {
      return voiceConfig.emotionalRange.calming;
    }

    // Match emotional context to voice settings
    switch (emotionalContext.primaryEmotion) {
      case 'anxious':
      case 'stressed':
      case 'overwhelmed':
        return voiceConfig.emotionalRange.calming;
      
      case 'sad':
      case 'depressed':
      case 'hopeless':
        return voiceConfig.emotionalRange.supportive;
      
      case 'confused':
      case 'uncertain':
        return voiceConfig.emotionalRange.analytical;
      
      case 'motivated':
      case 'hopeful':
        return voiceConfig.emotionalRange.encouraging;
      
      default:
        return voiceConfig.emotionalRange.supportive;
    }
  }

  async generateTherapeuticSpeech(
    text: string, 
    emotionalContext: EmotionalContext,
    therapistId?: string
  ): Promise<string | null> {
    if (!this.hasApiKey()) {
      console.warn('ElevenLabs API key not set');
      return null;
    }

    const targetTherapistId = therapistId || this.getCurrentTherapist();
    if (!targetTherapistId) {
      console.warn('No therapist selected');
      return null;
    }

    const voiceConfig = this.getTherapistVoiceConfig(targetTherapistId);
    if (!voiceConfig) {
      console.warn(`Voice config not found for therapist: ${targetTherapistId}`);
      return null;
    }

    const voiceSettings = this.selectOptimalVoiceSettings(voiceConfig, emotionalContext);
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!
        },
        body: JSON.stringify({
          text: this.adaptTextForTherapy(text, emotionalContext, voiceConfig),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceSettings.stability,
            similarity_boost: voiceSettings.similarityBoost,
            style: voiceSettings.style,
            use_speaker_boost: voiceConfig.personalityModifiers.speakerBoost
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

  private adaptTextForTherapy(
    text: string, 
    emotionalContext: EmotionalContext,
    voiceConfig: TherapistVoiceConfig
  ): string {
    // Add subtle pauses and emphasis based on therapist personality and context
    let adaptedText = text;

    // Crisis situations - add calming pauses
    if (emotionalContext.crisisLevel) {
      adaptedText = adaptedText.replace(/\. /g, '... ');
    }

    // High anxiety - slower pacing
    if (emotionalContext.primaryEmotion === 'anxious' && emotionalContext.intensity > 0.6) {
      adaptedText = adaptedText.replace(/,/g, ', ');
    }

    // Therapist-specific adaptations
    switch (voiceConfig.therapistId) {
      case 'dr-maya-patel':
        // Mindfulness therapist - add breathing cues
        if (emotionalContext.supportLevel === 'high') {
          adaptedText = `Let's take a moment... ${adaptedText}`;
        }
        break;
      
      case 'dr-alex-rodriguez':
        // Solution-focused - more energetic delivery
        adaptedText = adaptedText.replace(/!/g, '!!');
        break;
      
      case 'dr-jordan-kim':
        // Trauma-informed - gentle, careful pacing
        adaptedText = adaptedText.replace(/\./g, '...');
        break;
    }

    return adaptedText;
  }

  getAvailableTherapistVoices(): Array<{
    therapistId: string;
    voiceName: string;
    description: string;
  }> {
    return Array.from(this.therapistVoices.values()).map(config => ({
      therapistId: config.therapistId,
      voiceName: config.voiceName,
      description: this.getTherapistDescription(config.therapistId)
    }));
  }

  private getTherapistDescription(therapistId: string): string {
    const descriptions = {
      'dr-sarah-chen': 'Clear, analytical voice perfect for CBT sessions',
      'dr-maya-patel': 'Soft, calming voice ideal for mindfulness practices',
      'dr-alex-rodriguez': 'Energetic, optimistic voice for solution-focused therapy',
      'dr-jordan-kim': 'Gentle, patient voice specialized for trauma therapy',
      'dr-taylor-morgan': 'Balanced, empathetic voice for relationship counseling'
    };
    return descriptions[therapistId as keyof typeof descriptions] || 'Professional therapeutic voice';
  }

  async testTherapistVoice(therapistId: string, sampleText?: string): Promise<string | null> {
    const testText = sampleText || "Hello, I'm here to support you on your journey to better mental health.";
    const testContext: EmotionalContext = {
      primaryEmotion: 'neutral',
      intensity: 0.5,
      supportLevel: 'medium',
      crisisLevel: false
    };

    return this.generateTherapeuticSpeech(testText, testContext, therapistId);
  }
}

export const personalizedTherapistVoiceService = new PersonalizedTherapistVoiceService();