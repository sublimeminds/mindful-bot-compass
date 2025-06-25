
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

// Use existing browser Speech Recognition types instead of redeclaring
export interface SpeechRecognitionEventTarget extends EventTarget {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface VoiceRecognitionEvent extends Event {
  target: SpeechRecognitionEventTarget;
}

export interface SpeechRecognitionErrorEventTarget extends EventTarget {
  error: string;
}

export interface VoiceErrorEvent extends Event {
  target: SpeechRecognitionErrorEventTarget;
}
