
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

// Proper speech recognition types
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

// Speech recognition interfaces
export interface SpeechRecognitionEventResult {
  [index: number]: {
    transcript: string;
    confidence: number;
  };
  isFinal: boolean;
  length: number;
}

export interface SpeechRecognitionEventResults {
  [index: number]: SpeechRecognitionEventResult;
  length: number;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionEventResults;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent {
  error: 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
  message?: string;
}
