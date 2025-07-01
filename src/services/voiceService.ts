
interface TherapistVoice {
  voiceName: string;
  pitch: number;
  rate: number;
  volume: number;
}

class EnhancedVoiceService {
  private voices: Map<string, TherapistVoice> = new Map();
  private synthesis: SpeechSynthesis;
  private isSupported: boolean;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    
    // Initialize therapist voices
    this.initializeTherapistVoices();
  }

  private initializeTherapistVoices() {
    this.voices.set('dr-sarah-chen', {
      voiceName: 'Google US English',
      pitch: 0.9,
      rate: 0.8,
      volume: 0.8
    });
    
    this.voices.set('dr-michael-thompson', {
      voiceName: 'Google US English',
      pitch: 0.7,
      rate: 0.9,
      volume: 0.9
    });
    
    this.voices.set('dr-elena-rodriguez', {
      voiceName: 'Google US English',
      pitch: 1.0,
      rate: 0.85,
      volume: 0.8
    });
  }

  async playTherapistMessage(
    text: string,
    therapistId: string,
    emotion?: string,
    isUrgent?: boolean
  ): Promise<void> {
    if (!this.isSupported) {
      console.log('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voiceConfig = this.voices.get(therapistId) || this.voices.get('dr-sarah-chen')!;
    
    // Adjust voice based on emotion
    utterance.pitch = this.adjustPitchForEmotion(voiceConfig.pitch, emotion);
    utterance.rate = this.adjustRateForEmotion(voiceConfig.rate, emotion, isUrgent);
    utterance.volume = voiceConfig.volume;
    
    // Try to find the specified voice
    const availableVoices = this.synthesis.getVoices();
    const selectedVoice = availableVoices.find(voice => 
      voice.name.includes('English') && voice.name.includes('US')
    ) || availableVoices[0];
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    this.synthesis.speak(utterance);
  }

  private adjustPitchForEmotion(basePitch: number, emotion?: string): number {
    switch (emotion) {
      case 'empathetic':
        return basePitch - 0.1;
      case 'calming':
        return basePitch - 0.2;
      case 'reassuring':
        return basePitch - 0.1;
      case 'encouraging':
        return basePitch + 0.1;
      default:
        return basePitch;
    }
  }

  private adjustRateForEmotion(baseRate: number, emotion?: string, isUrgent?: boolean): number {
    if (isUrgent) {
      return baseRate + 0.1;
    }
    
    switch (emotion) {
      case 'calming':
        return baseRate - 0.1;
      case 'reassuring':
        return baseRate - 0.05;
      default:
        return baseRate;
    }
  }

  getTherapistVoice(therapistId: string): TherapistVoice | undefined {
    return this.voices.get(therapistId);
  }

  hasApiKey(): boolean {
    return this.isSupported;
  }

  stopSpeaking(): void {
    if (this.isSupported) {
      this.synthesis.cancel();
    }
  }
}

export const enhancedVoiceService = new EnhancedVoiceService();
