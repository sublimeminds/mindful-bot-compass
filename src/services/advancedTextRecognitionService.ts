
// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceAnalysisResult {
  transcript: string;
  confidence: number;
  language: string;
  emotion?: any;
  stress?: any;
  languageDetection: {
    detected: string;
    confidence: number;
  };
}

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  boundingBoxes?: any[];
}

export interface MultiLanguageVoiceConfig {
  language: string;
  emotionDetection: boolean;
  stressAnalysis: boolean;
  realTimeTranslation: boolean;
}

export class AdvancedTextRecognitionService {
  private static instance: AdvancedTextRecognitionService;
  
  public static getInstance(): AdvancedTextRecognitionService {
    if (!AdvancedTextRecognitionService.instance) {
      AdvancedTextRecognitionService.instance = new AdvancedTextRecognitionService();
    }
    return AdvancedTextRecognitionService.instance;
  }

  public static initialize(): void {
    AdvancedTextRecognitionService.getInstance();
  }

  public static async startAdvancedVoiceRecognition(
    config: MultiLanguageVoiceConfig,
    onResult: (result: VoiceAnalysisResult) => void,
    onError: (error: string) => void
  ): Promise<any> {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported');
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = config.language;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let confidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            confidence = result[0].confidence;
          }
        }

        if (finalTranscript) {
          const voiceResult: VoiceAnalysisResult = {
            transcript: finalTranscript,
            confidence,
            language: config.language,
            languageDetection: {
              detected: config.language.split('-')[0],
              confidence: 0.9
            }
          };
          
          onResult(voiceResult);
        }
      };

      recognition.onerror = (event: any) => {
        onError(`Speech recognition error: ${event.error}`);
      };

      recognition.start();
      return recognition;
    } catch (error) {
      onError(`Failed to start recognition: ${error}`);
      return null;
    }
  }

  public static async performOCR(file: File): Promise<OCRResult> {
    // Mock OCR implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: "Sample extracted text from image",
          confidence: 0.85,
          language: 'en'
        });
      }, 1000);
    });
  }
}
