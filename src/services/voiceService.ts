
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
  private apiKey: string | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    
    this.initializeTherapistVoices();
  }

  private initializeTherapistVoices() {
    // Database UUID mappings for therapist voices
    this.voices.set('ed979f27-2491-43f1-a779-5095febb68b2', {
      voiceName: 'Google US English',
      pitch: 0.9,
      rate: 0.8,
      volume: 0.8
    });
    
    this.voices.set('e352e13d-99f9-4ffc-95a6-a05c3d935b74', {
      voiceName: 'Google US English',
      pitch: 0.7,
      rate: 0.9,
      volume: 0.9
    });
    
    this.voices.set('0772c602-306b-42ad-b610-2dc15ba06714', {
      voiceName: 'Google US English',
      pitch: 0.8,
      rate: 0.85,
      volume: 0.8
    });
    
    // String ID fallbacks for backward compatibility
    this.voices.set('dr-sarah-chen', {
      voiceName: 'Google US English',
      pitch: 0.9,
      rate: 0.8,
      volume: 0.8
    });
    
    this.voices.set('dr-michael-rivers', {
      voiceName: 'Google US English',
      pitch: 0.7,
      rate: 0.9,
      volume: 0.9
    });
    
    this.voices.set('dr-alex-rodriguez', {
      voiceName: 'Google US English',
      pitch: 0.8,
      rate: 0.85,
      volume: 0.8
    });
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async playText(text: string, voiceId?: string): Promise<void> {
    if (!this.isSupported) {
      console.log('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voiceConfig = this.voices.get('dr-sarah-chen')!;
    
    utterance.pitch = voiceConfig.pitch;
    utterance.rate = voiceConfig.rate;
    utterance.volume = voiceConfig.volume;
    
    const availableVoices = this.synthesis.getVoices();
    const selectedVoice = availableVoices.find(voice => 
      voice.name.includes('English') && voice.name.includes('US')
    ) || availableVoices[0];
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  async playWithWebSpeech(text: string): Promise<void> {
    return this.playText(text);
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
    
    utterance.pitch = this.adjustPitchForEmotion(voiceConfig.pitch, emotion);
    utterance.rate = this.adjustRateForEmotion(voiceConfig.rate, emotion, isUrgent);
    utterance.volume = voiceConfig.volume;
    
    const availableVoices = this.synthesis.getVoices();
    const selectedVoice = availableVoices.find(voice => 
      voice.name.includes('English') && voice.name.includes('US')
    ) || availableVoices[0];
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    this.currentUtterance = utterance;
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

  stop(): void {
    if (this.isSupported) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  get isCurrentlyPlaying(): boolean {
    return this.synthesis.speaking || this.synthesis.pending;
  }

  getTherapistVoice(therapistId: string): TherapistVoice | undefined {
    return this.voices.get(therapistId);
  }

  hasApiKey(): boolean {
    return this.apiKey !== null || this.isSupported;
  }

  stopSpeaking(): void {
    this.stop();
  }
}

export const enhancedVoiceService = new EnhancedVoiceService();
export const voiceService = enhancedVoiceService;
