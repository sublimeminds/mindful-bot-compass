interface VoiceConfig {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  model?: string;
}

class VoiceService {
  private apiKey: string | null = null;
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;

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

  async playText(text: string, config: VoiceConfig = {}): Promise<void> {
    if (!this.hasApiKey()) {
      throw new Error('API key not configured');
    }

    if (this.isPlaying) {
      return; // Prevent multiple simultaneous playbacks
    }

    try {
      this.isPlaying = true;

      const voiceId = config.voiceId || "9BWtsMINqrJLrRacOk9x";
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!,
        },
        body: JSON.stringify({
          text,
          model_id: config.model || 'eleven_multilingual_v1',
          voice_settings: {
            stability: config.stability || 0.75,
            similarity_boost: config.similarityBoost || 0.85,
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
