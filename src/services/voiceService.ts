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

interface TherapistVoiceProfile {
  therapistId: string;
  voiceId: string;
  voiceName: string;
  emotionalRange: {
    stability: number;
    similarityBoost: number;
    style: number;
  };
  speakingPace: number;
  culturalAdaptations: string[];
  crisisSettings: {
    calmingTone: boolean;
    slowerPace: boolean;
    reassuringStyle: boolean;
  };
}

class EnhancedVoiceService {
  private apiKey: string = 'sk_46edd7c96a5d29fe7435c0ba27668c753c678cf992b553a9';
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private supportedLanguages: string[] = [
    'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-PT', 'ru-RU', 
    'ar-SA', 'zh-CN', 'ja-JP', 'ko-KR', 'hi-IN', 'tr-TR', 'he-IL',
    'pl-PL', 'nl-NL', 'sv-SE', 'da-DK', 'no-NO', 'fi-FI'
  ];

  // Therapist voice mappings based on personality and approach
  private therapistVoices: TherapistVoiceProfile[] = [
    {
      therapistId: 'dr-sarah-chen',
      voiceId: '9BWtsMINqrJLrRacOk9x', // Aria
      voiceName: 'Aria',
      emotionalRange: { stability: 0.8, similarityBoost: 0.85, style: 0.6 },
      speakingPace: 0.9,
      culturalAdaptations: ['professional', 'direct', 'supportive'],
      crisisSettings: { calmingTone: true, slowerPace: true, reassuringStyle: true }
    },
    {
      therapistId: 'dr-michael-rodriguez',
      voiceId: 'N2lVS1w4EtoT3dr4eOWO', // Callum
      voiceName: 'Callum',
      emotionalRange: { stability: 0.75, similarityBoost: 0.8, style: 0.7 },
      speakingPace: 0.85,
      culturalAdaptations: ['gentle', 'trauma-informed', 'patient'],
      crisisSettings: { calmingTone: true, slowerPace: true, reassuringStyle: true }
    },
    {
      therapistId: 'dr-emily-johnson',
      voiceId: 'XB0fDUnXU5powFXDhCwa', // Charlotte
      voiceName: 'Charlotte',
      emotionalRange: { stability: 0.85, similarityBoost: 0.9, style: 0.5 },
      speakingPace: 0.8,
      culturalAdaptations: ['mindful', 'soothing', 'meditative'],
      crisisSettings: { calmingTone: true, slowerPace: true, reassuringStyle: true }
    },
    {
      therapistId: 'dr-david-kim',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
      voiceName: 'Sarah',
      emotionalRange: { stability: 0.8, similarityBoost: 0.85, style: 0.6 },
      speakingPace: 0.9,
      culturalAdaptations: ['warm', 'analytical', 'structured'],
      crisisSettings: { calmingTone: true, slowerPace: true, reassuringStyle: true }
    }
  ];

  constructor() {
    // Initialize with API key
    this.setApiKey(this.apiKey);
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

  getTherapistVoice(therapistId: string): TherapistVoiceProfile | null {
    return this.therapistVoices.find(voice => voice.therapistId === therapistId) || null;
  }

  async getAvailableVoices(): Promise<any[]> {
    if (!this.hasApiKey()) {
      throw new Error('API key not configured');
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Return therapist voices as fallback
      return this.therapistVoices.map(voice => ({
        voice_id: voice.voiceId,
        name: voice.voiceName,
        description: `Therapist voice for ${voice.therapistId}`
      }));
    }
  }

  async playTherapistMessage(
    text: string, 
    therapistId: string, 
    emotionalContext?: string,
    isCrisis: boolean = false
  ): Promise<void> {
    const therapistVoice = this.getTherapistVoice(therapistId);
    if (!therapistVoice) {
      // Fallback to default voice
      return this.playText(text);
    }

    const config: EnhancedVoiceConfig = {
      voiceId: therapistVoice.voiceId,
      stability: isCrisis ? 0.9 : therapistVoice.emotionalRange.stability,
      similarityBoost: therapistVoice.emotionalRange.similarityBoost,
      multiLanguage: true,
      emotionAnalysis: true,
      culturalAdaptation: true
    };

    // Adjust text based on crisis settings
    let adaptedText = text;
    if (isCrisis && therapistVoice.crisisSettings.slowerPace) {
      adaptedText = text.replace(/\. /g, '. ... ').replace(/\? /g, '? ... ');
    }

    await this.playText(adaptedText, config);
  }

  async playText(text: string, config: EnhancedVoiceConfig = {}): Promise<void> {
    if (!this.hasApiKey()) {
      throw new Error('API key not configured');
    }

    if (this.isPlaying) {
      this.stop(); // Stop current playback
    }

    try {
      this.isPlaying = true;

      const voiceId = config.voiceId || "9BWtsMINqrJLrRacOk9x";
      const model = config.multiLanguage ? 'eleven_multilingual_v2' : 'eleven_turbo_v2_5';

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
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

  async generateGuidedSession(
    sessionType: 'meditation' | 'breathing' | 'relaxation' | 'sleep',
    duration: number,
    therapistId?: string
  ): Promise<string[]> {
    const sessions = {
      meditation: [
        "Welcome to your mindfulness meditation. Find a comfortable position and close your eyes.",
        "Begin by taking three deep breaths, feeling your body relax with each exhale.",
        "Notice your breath naturally flowing in and out, without trying to change it.",
        "If your mind wanders, gently bring your attention back to your breath.",
        "Feel the peace and calm growing within you with each moment."
      ],
      breathing: [
        "Let's practice the 4-7-8 breathing technique together.",
        "Breathe in through your nose for 4 counts... 1, 2, 3, 4.",
        "Hold your breath for 7 counts... 1, 2, 3, 4, 5, 6, 7.",
        "Exhale through your mouth for 8 counts... 1, 2, 3, 4, 5, 6, 7, 8.",
        "Feel the relaxation spreading through your entire body."
      ],
      relaxation: [
        "We'll begin progressive muscle relaxation starting with your toes.",
        "Tense the muscles in your feet for 5 seconds, then release.",
        "Notice the contrast between tension and relaxation.",
        "Move up to your calves, tense and release.",
        "Continue this process, feeling deeper relaxation with each muscle group."
      ],
      sleep: [
        "It's time to prepare your mind and body for peaceful sleep.",
        "Let go of the day's worries and tensions.",
        "Feel your body sinking into comfort and warmth.",
        "Allow your breathing to become slow and natural.",
        "Drift into peaceful, restorative sleep."
      ]
    };

    return sessions[sessionType] || sessions.meditation;
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

export const enhancedVoiceService = new EnhancedVoiceService();
// Keep backwards compatibility
export const voiceService = enhancedVoiceService;
