interface VoiceConfig {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  model?: string;
}

interface EnhancedVoiceConfig extends VoiceConfig {
  multiLanguage?: boolean;
  emotionAnalysis?: boolean;
  culturalAdaptation?: boolean;
  textRecognition?: boolean;
}

class VoiceService {
  private apiKey: string | null = null;
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private supportedLanguages: string[] = [
    'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-PT', 'ru-RU', 
    'ar-SA', 'zh-CN', 'ja-JP', 'ko-KR', 'hi-IN', 'tr-TR', 'he-IL'
  ];

  constructor() {
    // Load API key from localStorage if available
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('elevenlabs_api_key', key);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  get isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  async getAvailableVoices(): Promise<any[]> {
    if (!this.hasApiKey()) {
      throw new Error('API key not configured');
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey!,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Return default voices if API call fails
      return [
        { voice_id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Calm, therapeutic" },
        { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm, supportive" },
        { voice_id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", description: "Professional, clear" },
        { voice_id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "Gentle, empathetic" }
      ];
    }
  }

  async playText(text: string, config: EnhancedVoiceConfig = {}): Promise<void> {
    if (!this.hasApiKey()) {
      throw new Error('API key not configured');
    }

    if (this.isPlaying) {
      return; // Prevent multiple simultaneous playbacks
    }

    try {
      this.isPlaying = true;

      // Apply cultural adaptation if requested
      let adaptedText = text;
      if (config.culturalAdaptation) {
        adaptedText = await this.applyCulturalAdaptation(text, config);
      }

      const voiceId = config.voiceId || "9BWtsMINqrJLrRacOk9x";
      const model = config.multiLanguage ? 'eleven_multilingual_v2' : 'eleven_turbo_v2_5';

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!,
        },
        body: JSON.stringify({
          text: adaptedText,
          model_id: model,
          voice_settings: {
            stability: config.stability || 0.75,
            similarity_boost: config.similarityBoost || 0.85,
            style: config.emotionAnalysis ? 0.8 : 0.5,
            use_speaker_boost: true
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      await new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve(void 0);
        };
        audio.onerror = reject;
        audio.play();
      });
    } catch (error) {
      console.error('Error playing text:', error);
      throw error;
    } finally {
      this.isPlaying = false;
    }
  }

  private async applyCulturalAdaptation(text: string, config: EnhancedVoiceConfig): Promise<string> {
    // Simple cultural adaptation - in production would use more sophisticated methods
    if (config.voiceId?.includes('multilingual')) {
      // Add pauses for better cross-cultural communication
      return text.replace(/\. /g, '. ... ').replace(/\? /g, '? ... ');
    }
    return text;
  }

  async playTextWithEmotion(
    text: string, 
    emotion: string, 
    intensity: number = 0.5,
    config: EnhancedVoiceConfig = {}
  ): Promise<void> {
    const emotionalConfig: EnhancedVoiceConfig = {
      ...config,
      stability: emotion === 'calm' ? 0.8 : 0.6,
      similarityBoost: 0.8,
      emotionAnalysis: true
    };

    // Adjust text for emotional delivery
    let emotionalText = text;
    if (emotion === 'excited' || emotion === 'happy') {
      emotionalText = text.replace(/\./g, '!');
    } else if (emotion === 'sad' || emotion === 'melancholy') {
      emotionalText = text.replace(/!/g, '.');
    }

    await this.playText(emotionalText, emotionalConfig);
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }

  stopPlayback(): void {
    this.stop();
  }
}

export const voiceService = new VoiceService();
