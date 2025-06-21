
// Enhanced voice service integrating ElevenLabs for realistic therapy conversations
class EnhancedVoiceService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;

  // Play therapist message with ElevenLabs voice
  async playTherapistMessage(text: string, therapistId: string): Promise<void> {
    console.log(`Playing voice message for therapist ${therapistId}: ${text.substring(0, 50)}...`);
    
    // For now, we'll use Web Speech API as fallback
    // In production, this would integrate with ElevenLabs API
    try {
      if ('speechSynthesis' in window) {
        // Stop any currently playing speech
        this.stop();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice based on therapist
        const voices = speechSynthesis.getVoices();
        const preferredVoice = this.getPreferredVoice(therapistId, voices);
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Set playing state
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

  // Get preferred voice for therapist
  private getPreferredVoice(therapistId: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    // Map therapist IDs to preferred voice characteristics
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

    // Find matching voice
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

  // Future: ElevenLabs integration
  async playWithElevenLabs(text: string, voiceId: string): Promise<void> {
    // This would integrate with ElevenLabs API
    console.log(`Future: Play with ElevenLabs voice ${voiceId}: ${text}`);
    
    // Placeholder for actual ElevenLabs implementation
    // const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'audio/mpeg',
    //     'Content-Type': 'application/json',
    //     'xi-api-key': process.env.ELEVENLABS_API_KEY
    //   },
    //   body: JSON.stringify({
    //     text: text,
    //     model_id: 'eleven_multilingual_v2',
    //     voice_settings: {
    //       stability: 0.5,
    //       similarity_boost: 0.5
    //     }
    //   })
    // });
    
    // For now, fallback to Web Speech API
    await this.playTherapistMessage(text, voiceId);
  }

  // Analyze voice emotion (future integration)
  async analyzeVoiceEmotion(audioBlob: Blob): Promise<any> {
    console.log('Future: Analyze voice emotion', audioBlob.size);
    
    // Placeholder for voice emotion analysis
    return {
      emotion: 'neutral',
      confidence: 0.8,
      energy: 0.6,
      stress: 0.3
    };
  }

  // Real-time voice chat (future integration)
  async startRealTimeChat(therapistId: string): Promise<void> {
    console.log(`Future: Start real-time voice chat with ${therapistId}`);
    
    // Placeholder for WebRTC or WebSocket voice chat
  }
}

export const enhancedVoiceService = new EnhancedVoiceService();
