import { getVoiceIdForTherapist } from './therapistAvatarMapping';

interface VoiceConfig {
  apiKey?: string;
  voiceId: string;
  model: string;
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

interface SpeechOptions {
  text: string;
  therapistId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  onAudioData?: (audioData: ArrayBuffer) => void;
}

class EnhancedVoiceService {
  private apiKey: string | null = null;
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private audioResources: Set<AudioContext> = new Set();
  private cleanupCallbacks: Set<() => void> = new Set();

  constructor() {
    // Initialize audio context
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.audioResources.add(this.audioContext);
        
        // Add cleanup callback
        const cleanup = () => {
          if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(console.warn);
          }
        };
        this.cleanupCallbacks.add(cleanup);
      }
    } catch (error) {
      console.warn('AudioContext initialization failed:', error);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getVoiceConfig(therapistId?: string): VoiceConfig {
    const voiceId = therapistId ? getVoiceIdForTherapist(therapistId) : 'EXAVITQu4vr4xnSDxMaL';
    
    return {
      voiceId,
      model: 'eleven_multilingual_v2', // High quality model
      stability: 0.71, // Balanced stability for therapeutic voice
      similarity_boost: 0.75, // High similarity to original voice
      style: 0.25, // Subtle style variation
      use_speaker_boost: true
    };
  }

  async synthesizeSpeech(options: SpeechOptions): Promise<void> {
    const { text, therapistId, onStart, onEnd, onError, onAudioData } = options;

    if (!this.apiKey) {
      // Fallback to browser's speech synthesis
      return this.fallbackToWebSpeech(text, onStart, onEnd, onError);
    }

    if (this.isPlaying) {
      this.stopSpeech();
    }

    try {
      onStart?.();
      this.isPlaying = true;

      const config = this.getVoiceConfig(therapistId);
      const audioData = await this.generateElevenLabsAudio(text, config);
      
      if (onAudioData) {
        onAudioData(audioData);
      }

      await this.playAudioData(audioData);
      
      this.isPlaying = false;
      onEnd?.();
    } catch (error) {
      this.isPlaying = false;
      console.error('Speech synthesis failed:', error);
      onError?.(error as Error);
      
      // Fallback to web speech
      this.fallbackToWebSpeech(text, onStart, onEnd, onError);
    }
  }

  private async generateElevenLabsAudio(text: string, config: VoiceConfig): Promise<ArrayBuffer> {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey!
      },
      body: JSON.stringify({
        text,
        model_id: config.model,
        voice_settings: {
          stability: config.stability,
          similarity_boost: config.similarity_boost,
          style: config.style,
          use_speaker_boost: config.use_speaker_boost
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  private async playAudioData(audioData: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        
        this.currentAudio = new Audio(audioUrl);
        
        this.currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        this.currentAudio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        
        this.currentAudio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  private fallbackToWebSpeech(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void, 
    onError?: (error: Error) => void
  ) {
    if (!('speechSynthesis' in window)) {
      onError?.(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice for therapy
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
    ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for therapeutic effect
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      this.isPlaying = true;
      onStart?.();
    };
    
    utterance.onend = () => {
      this.isPlaying = false;
      onEnd?.();
    };
    
    utterance.onerror = (event) => {
      this.isPlaying = false;
      onError?.(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    this.isPlaying = false;
  }

  // Clean up all resources
  cleanup() {
    this.stopSpeech();
    
    // Clean up audio contexts
    this.audioResources.forEach(context => {
      if (context.state !== 'closed') {
        context.close().catch(console.warn);
      }
    });
    this.audioResources.clear();
    
    // Run cleanup callbacks
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Cleanup callback error:', error);
      }
    });
    this.cleanupCallbacks.clear();
    
    this.audioContext = null;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Generate lip sync data from audio
  async generateLipSyncData(audioData: ArrayBuffer): Promise<Float32Array | null> {
    if (!this.audioContext) {
      return null;
    }

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData.slice(0));
      const channelData = audioBuffer.getChannelData(0);
      
      // Analyze audio for lip sync
      const frameSize = 1024;
      const hopSize = 512;
      const frames = Math.floor((channelData.length - frameSize) / hopSize) + 1;
      const lipSyncData = new Float32Array(frames);
      
      for (let i = 0; i < frames; i++) {
        const start = i * hopSize;
        const end = Math.min(start + frameSize, channelData.length);
        
        // Calculate RMS energy for this frame
        let energy = 0;
        for (let j = start; j < end; j++) {
          energy += channelData[j] * channelData[j];
        }
        energy = Math.sqrt(energy / (end - start));
        
        // Apply smoothing and scaling for lip sync
        lipSyncData[i] = Math.min(energy * 10, 1.0);
      }
      
      return lipSyncData;
    } catch (error) {
      console.warn('Lip sync data generation failed:', error);
      return null;
    }
  }

  // Request user to input ElevenLabs API key
  async requestApiKey(): Promise<string | null> {
    const apiKey = prompt(
      'Enter your ElevenLabs API key for high-quality voice synthesis:\n\n' +
      'Get your free API key at: https://elevenlabs.io/sign-up\n' +
      '(Leave empty to use browser speech synthesis)'
    );
    
    if (apiKey && apiKey.trim()) {
      this.setApiKey(apiKey.trim());
      // Store in localStorage for future use
      localStorage.setItem('elevenlabs_api_key', apiKey.trim());
      return apiKey.trim();
    }
    
    return null;
  }

  // Load API key from localStorage
  loadStoredApiKey(): boolean {
    const stored = localStorage.getItem('elevenlabs_api_key');
    if (stored) {
      this.setApiKey(stored);
      return true;
    }
    return false;
  }
}

export const enhancedVoiceService = new EnhancedVoiceService();
export default enhancedVoiceService;