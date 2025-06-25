
// TypeScript interfaces for Enhanced Voice Interaction

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start(): void;
    stop(): void;
    abort(): void;
  }
  
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

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
