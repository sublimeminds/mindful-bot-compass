
// TypeScript interfaces for Enhanced Voice Interaction
export interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  0: {
    transcript: string;
    confidence: number;
  };
}

export interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export interface EmotionData {
  emotion: string;
  confidence: number;
  valence?: number;
  arousal?: number;
}

export interface StressAnalysisData {
  level: 'low' | 'medium' | 'high';
  confidence: number;
  indicators: string[];
}

export interface OCRBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  text: string;
}

export interface VoiceMetadata {
  source: 'voice' | 'ocr';
  language?: string;
  confidence?: number;
  emotion?: EmotionData;
  stress?: StressAnalysisData;
}
