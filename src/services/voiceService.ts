
interface VoiceConfig {
  voiceId: string;
  model: string;
  stability: number;
  similarityBoost: number;
}

const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  voiceId: "9BWtsMINqrJLrRacOk9x", // Aria - calm, therapeutic voice
  model: "eleven_multilingual_v2",
  stability: 0.75,
  similarityBoost: 0.85
};

export class VoiceService {
  private apiKey: string | null = null;
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('elevenlabs_api_key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async textToSpeech(text: string, config: Partial<VoiceConfig> = {}): Promise<string | null> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not set');
      return null;
    }

    const voiceConfig = { ...DEFAULT_VOICE_CONFIG, ...config };

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: voiceConfig.model,
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarityBoost
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  async playText(text: string, config: Partial<VoiceConfig> = {}): Promise<void> {
    if (this.isPlaying) {
      this.stop();
    }

    const audioUrl = await this.textToSpeech(text, config);
    if (!audioUrl) return;

    return new Promise((resolve, reject) => {
      this.currentAudio = new Audio(audioUrl);
      this.isPlaying = true;

      this.currentAudio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      this.currentAudio.onerror = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Audio playback failed'));
      };

      this.currentAudio.play().catch(reject);
    });
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  async getAvailableVoices(): Promise<any[]> {
    if (!this.apiKey) return [];

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }
}

export const voiceService = new VoiceService();
