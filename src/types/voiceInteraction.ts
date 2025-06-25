
export interface VoiceMetadata {
  source: 'voice' | 'ocr' | 'keyboard';
  language?: string;
  confidence?: number;
}

export interface EmotionData {
  primary: string;
  confidence: number;
  secondary?: string;
  valence: number; // -1 to 1
  arousal: number; // 0 to 1
}

export interface OCRBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  confidence: number;
}

// Custom speech recognition types to avoid conflicts
export interface CustomSpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface CustomSpeechRecognitionEvent {
  results: CustomSpeechRecognitionResult[];
  resultIndex: number;
}

export interface CustomSpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}
