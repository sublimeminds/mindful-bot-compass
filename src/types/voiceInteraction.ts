
export interface EmotionData {
  primary: string;
  secondary?: string[];
  confidence: number;
  valence: number;
  arousal: number;
}

export interface VoiceInteractionMetadata {
  source: 'voice' | 'text';
  confidence?: number;
  emotion?: EmotionData;
}
