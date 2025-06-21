
// Enhanced voice service integrating ElevenLabs for realistic therapy conversations
class EnhancedVoiceService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private apiKey: string | null = null;

  constructor() {
    // Load API key from localStorage
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
  }

  // Set API key
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('elevenlabs_api_key', key);
  }

  // Check if API key is available
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Add missing playText method for compatibility
  async playText(text: string, options?: { voiceId?: string; stability?: number; similarityBoost?: number }): Promise<void> {
    const voiceId = options?.voiceId || '9BWtsMINqrJLrRacOk9x';
    await this.playTherapistMessage(text, voiceId);
  }

  // Add missing isCurrentlyPlaying property
  get isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Play therapist message with ElevenLabs voice - updated signature to handle multiple parameters
  async playTherapistMessage(text: string, therapistIdOrVoiceId: string, emotion?: string, isUrgent?: boolean): Promise<void> {
    console.log(`Playing voice message for therapist ${therapistIdOrVoiceId}: ${text.substring(0, 50)}...`);
    
    // Use ElevenLabs if API key is available, otherwise fallback to Web Speech API
    if (this.hasApiKey()) {
      // If therapistIdOrVoiceId looks like a voice ID, use it directly, otherwise get voice ID from therapist
      const voiceId = therapistIdOrVoiceId.length > 20 ? therapistIdOrVoiceId : this.getTherapistVoiceId(therapistIdOrVoiceId);
      await this.playWithElevenLabs(text, voiceId);
    } else {
      await this.playWithWebSpeech(text, therapistIdOrVoiceId);
    }
  }

  // Web Speech API fallback
  private async playWithWebSpeech(text: string, therapistId: string): Promise<void> {
    try {
      if ('speechSynthesis' in window) {
        this.stop();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        const preferredVoice = this.getPreferredVoice(therapistId, voices);
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        this.isPlaying = true;
        
        utterance.onend = () => {
          this.isPlaying = false;
        };
        
        utterance.onerror = () => {
          this.isPlaying = false;
          console.error('Speech synthesis error');
        };
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing voice message:', error);
      this.isPlaying = false;
    }
  }

  // ElevenLabs integration
  async playWithElevenLabs(text: string, voiceId: string): Promise<void> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not available, falling back to Web Speech API');
      return;
    }

    try {
      this.stop();
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
          voice_settings: {
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
      
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
      };
      
      await this.currentAudio.play();
    } catch (error) {
      console.error('Error with ElevenLabs:', error);
      this.isPlaying = false;
      // Fallback to Web Speech API
      await this.playWithWebSpeech(text, voiceId);
    }
  }

  // Stop current playback
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    this.isPlaying = false;
  }

  // Get therapist voice information
  getTherapistVoice(therapistId: string): { voiceId: string; voiceName: string } {
    const voiceMap: Record<string, { voiceId: string; voiceName: string }> = {
      'dr-sarah-chen': { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Aria' },
      'dr-michael-rodriguez': { voiceId: 'N2lVS1w4EtoT3dr4eOWO', voiceName: 'Callum' },
      'dr-emily-johnson': { voiceId: 'XB0fDUnXU5powFXDhCwa', voiceName: 'Charlotte' },
      'dr-maria-santos': { voiceId: 'cgSgspJ2msm6clMCkdW9', voiceName: 'Jessica' },
      'dr-james-wilson': { voiceId: 'nPczCjzI2devNBz1zQrb', voiceName: 'Brian' },
      'dr-aisha-patel': { voiceId: 'pFZP5JQG7iQjIQuC4Bku', voiceName: 'Lily' },
      'dr-robert-kim': { voiceId: 'onwK4e9ZLuTAKqWW03F9', voiceName: 'Daniel' },
      'dr-sofia-andersson': { voiceId: 'Xb7hH8MSUJpSbSDYk0k2', voiceName: 'Alice' },
    };
    
    return voiceMap[therapistId] || { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Aria' };
  }

  // Get voice ID for therapist
  getTherapistVoiceId(therapistId: string): string {
    return this.getTherapistVoice(therapistId).voiceId;
  }

  // Generate guided session steps
  async generateGuidedSession(sessionType: string, duration: number, therapistId?: string): Promise<string[]> {
    const sessions = {
      meditation: [
        "Welcome to your mindfulness meditation session. Let's begin by finding a comfortable position.",
        "Close your eyes gently and take a deep breath in through your nose.",
        "As you exhale slowly, let go of any tension in your body.",
        "Now, bring your attention to your breath, feeling each inhale and exhale.",
        "If your mind wanders, that's perfectly normal. Gently return your focus to your breathing.",
        "Continue to breathe naturally, staying present in this moment."
      ],
      breathing: [
        "Let's practice the 4-7-8 breathing technique together.",
        "Start by exhaling completely through your mouth.",
        "Close your mouth and inhale through your nose for 4 counts.",
        "Hold your breath for 7 counts.",
        "Exhale through your mouth for 8 counts.",
        "This completes one cycle. Let's continue with a few more rounds."
      ],
      relaxation: [
        "Welcome to progressive muscle relaxation. We'll tense and release each muscle group.",
        "Start with your toes. Tense them tightly for 5 seconds, then release.",
        "Notice the contrast between tension and relaxation.",
        "Move to your calves. Tense them, hold, and release.",
        "Continue this process, working your way up through your body.",
        "Feel the wave of relaxation spreading through your entire body."
      ],
      sleep: [
        "Let's prepare your mind and body for restful sleep.",
        "Begin by making yourself comfortable in your bed.",
        "Take three deep, slow breaths, releasing the day's stress.",
        "Starting from your toes, consciously relax each part of your body.",
        "Let your breathing become slow and natural.",
        "Allow your mind to drift peacefully as you sink into relaxation."
      ]
    };

    const baseSteps = sessions[sessionType as keyof typeof sessions] || sessions.meditation;
    
    // Adjust number of steps based on duration
    const stepsPerMinute = duration / 10; // Base session is ~10 minutes
    const totalSteps = Math.ceil(baseSteps.length * stepsPerMinute);
    
    // Repeat and extend steps for longer sessions
    let extendedSteps = [...baseSteps];
    while (extendedSteps.length < totalSteps) {
      extendedSteps = [...extendedSteps, ...baseSteps];
    }
    
    return extendedSteps.slice(0, totalSteps);
  }

  // Get preferred voice for therapist (Web Speech API)
  private getPreferredVoice(therapistId: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const voicePreferences: Record<string, { gender: string; language: string }> = {
      'dr-sarah-chen': { gender: 'female', language: 'en-US' },
      'dr-michael-rodriguez': { gender: 'male', language: 'en-US' },
      'dr-emily-johnson': { gender: 'female', language: 'en-GB' },
      'dr-maria-santos': { gender: 'female', language: 'es-ES' },
      'dr-james-wilson': { gender: 'male', language: 'en-US' },
      'dr-aisha-patel': { gender: 'female', language: 'en-IN' },
      'dr-robert-kim': { gender: 'male', language: 'en-US' },
      'dr-sofia-andersson': { gender: 'female', language: 'sv-SE' },
    };

    const preference = voicePreferences[therapistId];
    if (!preference) return null;

    return voices.find(voice => 
      voice.lang.startsWith(preference.language.split('-')[0]) &&
      (preference.gender === 'female' ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') : 
       voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man'))
    ) || voices.find(voice => voice.lang.startsWith('en')) || null;
  }

  // Check if currently playing
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Get available ElevenLabs voices
  async getAvailableVoices(): Promise<any[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return [];
    }
  }

  // Analyze voice emotion (future integration)
  async analyzeVoiceEmotion(audioBlob: Blob): Promise<any> {
    console.log('Future: Analyze voice emotion', audioBlob.size);
    
    return {
      emotion: 'neutral',
      confidence: 0.8,
      energy: 0.6,
      stress: 0.3
    };
  }
}

// Create and export both the class instance and the class itself
export const enhancedVoiceService = new EnhancedVoiceService();
export const voiceService = enhancedVoiceService; // Alias for compatibility
export { EnhancedVoiceService };
