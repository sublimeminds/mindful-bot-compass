import { EmotionAnalyzer } from './emotionAnalyzer';

export interface Voice {
  id: string;
  name: string;
  synthVoice: SpeechSynthesisVoice;
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

  async playWithElevenLabs(text: string, voiceId: string): Promise<void> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not available');
      return;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v1',
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
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing with ElevenLabs:', error);
    }
  }

  // Make this method public
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
