

import { EmotionAnalyzer } from './emotionAnalyzer';

export interface Voice {
  id: string;
  name: string;
  synthVoice: SpeechSynthesisVoice;
}

export interface TherapistVoice {
  voiceId: string;
  voiceName: string;
  emotionalContext: string;
}

export interface VoiceConfig {
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
}

class EnhancedVoiceService {
  private apiKey: string | null = null;
  private voices: Voice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private emotionAnalyzer: EmotionAnalyzer;

  constructor() {
    this.emotionAnalyzer = new EmotionAnalyzer();
    this.initializeVoices();
    
    // Load API key from localStorage if available
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
  }

  private async initializeVoices(): Promise<void> {
    return new Promise(resolve => {
      if (window.speechSynthesis) {
        const loadVoices = () => {
          const synthVoices = window.speechSynthesis.getVoices();
          if (synthVoices.length > 0) {
            this.voices = synthVoices.map(voice => ({
              id: voice.name.toLowerCase().replace(/ /g, '-'),
              name: voice.name,
              synthVoice: voice
            }));
            resolve();
          } else {
            setTimeout(loadVoices, 50);
          }
        };

        loadVoices();
      } else {
        console.error('Speech synthesis not supported');
        resolve();
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

  getVoices(): Voice[] {
    return this.voices;
  }

  // Add missing isCurrentlyPlaying getter
  get isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Updated playText method to handle both string and object voiceId
  async playText(text: string, voiceId?: string | VoiceConfig): Promise<void> {
    if (this.hasApiKey()) {
      // Handle voice configuration for ElevenLabs - extract string voiceId properly
      let selectedVoiceId: string;
      let voiceSettings: any = {
        stability: 0.5,
        similarity_boost: 0.5
      };

      if (typeof voiceId === 'object' && voiceId !== null) {
        selectedVoiceId = voiceId.voiceId;
        if (voiceId.stability !== undefined) {
          voiceSettings.stability = voiceId.stability;
        }
        if (voiceId.similarityBoost !== undefined) {
          voiceSettings.similarity_boost = voiceId.similarityBoost;
        }
      } else {
        selectedVoiceId = voiceId || 'EXAVITQu4vr4xnSDxMaL'; // Default to Sarah
      }

      await this.playWithElevenLabs(text, selectedVoiceId, voiceSettings);
    } else {
      // Extract string voiceId for web speech - ensure it's always a string or undefined
      let webVoiceId: string | undefined;
      if (typeof voiceId === 'object' && voiceId !== null) {
        webVoiceId = voiceId.voiceId;
      } else {
        webVoiceId = voiceId;
      }
      
      await this.playWithWebSpeech(text, webVoiceId);
    }
  }

  async playWithElevenLabs(text: string, voiceId: string, voiceSettings?: any): Promise<void> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not available');
      return;
    }

    try {
      this.isPlaying = true;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceSettings || {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing with ElevenLabs:', error);
      this.isPlaying = false;
    }
  }

  // Make this method public and ensure it only accepts string voiceId
  async playWithWebSpeech(text: string, voiceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (voiceId) {
        const voice = this.voices.find(v => v.id === voiceId);
        if (voice) {
          utterance.voice = voice.synthVoice;
        }
      }

      utterance.onend = () => {
        this.isPlaying = false;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isPlaying = false;
        reject(error);
      };

      this.currentUtterance = utterance;
      this.isPlaying = true;
      window.speechSynthesis.speak(utterance);
    });
  }

  async generateGuidedSession(sessionType: string, duration: number, therapistId?: string): Promise<string[]> {
    // Generate guided session steps based on session type
    const steps: { [key: string]: string[] } = {
      meditation: [
        "Welcome to your guided meditation session. Find a comfortable position and close your eyes.",
        "Take a deep breath in through your nose, and slowly exhale through your mouth.",
        "Focus on your breathing, letting each breath bring you deeper into relaxation.",
        "Notice any thoughts that arise, and gently let them pass like clouds in the sky.",
        "Continue breathing deeply, feeling more peaceful with each breath."
      ],
      breathing: [
        "Let's begin with a simple breathing exercise. Sit comfortably with your back straight.",
        "Inhale slowly for 4 counts, feeling your lungs fill with air.",
        "Hold your breath gently for 7 counts.",
        "Exhale slowly through your mouth for 8 counts, releasing all tension.",
        "Repeat this cycle, allowing your body to relax with each breath."
      ],
      relaxation: [
        "Welcome to progressive muscle relaxation. Let's start by getting comfortable.",
        "Begin by tensing your feet and toes, hold for 5 seconds, then release.",
        "Move to your calves and thighs, tense them, hold, then relax completely.",
        "Continue up to your hands and arms, creating tension, then letting go.",
        "Finish with your face and head, then feel the complete relaxation throughout your body."
      ],
      sleep: [
        "It's time to prepare your mind and body for restful sleep.",
        "Let go of the day's worries and thoughts, they can wait until tomorrow.",
        "Feel your body sinking into comfort, heavy and relaxed.",
        "Your breathing becomes slower and more peaceful with each moment.",
        "Allow sleep to come naturally as you drift into peaceful rest."
      ]
    };

    return steps[sessionType] || steps.meditation;
  }

  async playTherapistMessage(text: string, therapistId?: string, emotion?: string, isCrisis?: boolean): Promise<void> {
    if (this.hasApiKey()) {
      // Use ElevenLabs for better voice quality
      const voiceId = this.getTherapistVoiceId(therapistId);
      await this.playWithElevenLabs(text, voiceId);
    } else {
      // Fallback to web speech
      await this.playWithWebSpeech(text);
    }
  }

  getTherapistVoice(therapistId: string): TherapistVoice | null {
    const therapistVoices: { [key: string]: TherapistVoice } = {
      'dr-sarah-chen': {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
        voiceName: 'Sarah',
        emotionalContext: 'supportive'
      },
      'dr-marcus-williams': {
        voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel
        voiceName: 'Daniel',
        emotionalContext: 'analytical'
      },
      'dr-elena-rodriguez': {
        voiceId: '9BWtsMINqrJLrRacOk9x', // Aria
        voiceName: 'Aria',
        emotionalContext: 'compassionate'
      }
    };

    return therapistVoices[therapistId] || therapistVoices['dr-sarah-chen'];
  }

  private getTherapistVoiceId(therapistId?: string): string {
    const voice = this.getTherapistVoice(therapistId || 'dr-sarah-chen');
    return voice?.voiceId || 'EXAVITQu4vr4xnSDxMaL';
  }

  stop(): void {
    if (this.isPlaying && this.currentUtterance) {
      window.speechSynthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }

  async analyzeEmotion(text: string): Promise<string> {
    return this.emotionAnalyzer.analyze(text);
  }
}

export const enhancedVoiceService = new EnhancedVoiceService();
// Also export as voiceService for backward compatibility
export const voiceService = enhancedVoiceService;
