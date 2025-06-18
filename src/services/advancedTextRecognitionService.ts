
import { enhancedCacheService } from './enhancedCachingService';

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  boundingBoxes: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  detectedLanguages: Array<{
    language: string;
    confidence: number;
  }>;
}

export interface HandwritingResult {
  text: string;
  confidence: number;
  strokes: Array<{
    points: Array<{ x: number; y: number; timestamp: number }>;
    text: string;
    confidence: number;
  }>;
}

export interface MultiLanguageVoiceConfig {
  language: string;
  accent?: string;
  emotionDetection: boolean;
  stressAnalysis: boolean;
  realTimeTranslation: boolean;
}

export interface VoiceAnalysisResult {
  transcript: string;
  language: string;
  confidence: number;
  emotion: {
    primary: string;
    secondary: string[];
    valence: number; // -1 to 1 (negative to positive)
    arousal: number; // 0 to 1 (calm to excited)
    dominance: number; // 0 to 1 (submissive to dominant)
  };
  stress: {
    level: number; // 0 to 1
    indicators: string[];
  };
  languageDetection: {
    detected: string;
    confidence: number;
    alternatives: Array<{ language: string; confidence: number }>;
  };
}

const SUPPORTED_OCR_LANGUAGES = [
  'eng', 'spa', 'fra', 'deu', 'ita', 'por', 'rus', 'ara', 'chi_sim', 'chi_tra',
  'jpn', 'kor', 'hin', 'tur', 'heb', 'nld', 'pol', 'ukr', 'ces', 'hun'
];

const VOICE_LANGUAGES = [
  'en-US', 'en-GB', 'en-AU', 'es-ES', 'es-MX', 'es-AR', 'fr-FR', 'fr-CA',
  'de-DE', 'it-IT', 'pt-PT', 'pt-BR', 'ru-RU', 'ar-SA', 'zh-CN', 'zh-TW',
  'ja-JP', 'ko-KR', 'hi-IN', 'tr-TR', 'he-IL', 'nl-NL', 'pl-PL', 'uk-UA'
];

export class AdvancedTextRecognitionService {
  private static tesseractWorker: any = null;
  private static isInitialized = false;

  // Initialize OCR capabilities
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Dynamically import Tesseract.js to avoid build issues
      const Tesseract = await import('tesseract.js');
      
      this.tesseractWorker = await Tesseract.createWorker();
      await this.tesseractWorker.loadLanguage('eng+spa+fra+deu+ara+chi_sim+jpn+kor+hin');
      await this.tesseractWorker.initialize('eng+spa+fra+deu+ara+chi_sim+jpn+kor+hin');
      
      this.isInitialized = true;
      console.log('Advanced text recognition initialized');
    } catch (error) {
      console.error('Failed to initialize text recognition:', error);
    }
  }

  // Enhanced OCR with multi-language support
  static async performOCR(
    imageFile: File | string,
    targetLanguages: string[] = ['eng']
  ): Promise<OCRResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const cacheKey = `ocr_${typeof imageFile === 'string' ? imageFile.substring(0, 50) : imageFile.name}`;
      
      return await enhancedCacheService.get(cacheKey, async () => {
        const langString = targetLanguages.join('+');
        await this.tesseractWorker.loadLanguage(langString);
        await this.tesseractWorker.initialize(langString);

        const result = await this.tesseractWorker.recognize(imageFile);
        
        // Extract bounding boxes for words
        const boundingBoxes = result.data.words.map((word: any) => ({
          text: word.text,
          x: word.bbox.x0,
          y: word.bbox.y0,
          width: word.bbox.x1 - word.bbox.x0,
          height: word.bbox.y1 - word.bbox.y0,
          confidence: word.confidence / 100
        }));

        // Detect languages in the text
        const detectedLanguages = await this.detectLanguagesInText(result.data.text);

        return {
          text: result.data.text,
          confidence: result.data.confidence / 100,
          language: this.mapTesseractLanguage(targetLanguages[0]),
          boundingBoxes,
          detectedLanguages
        };
      });
    } catch (error) {
      console.error('OCR processing error:', error);
      return {
        text: '',
        confidence: 0,
        language: 'unknown',
        boundingBoxes: [],
        detectedLanguages: []
      };
    }
  }

  // Enhanced voice recognition with multi-language support
  static async startAdvancedVoiceRecognition(
    config: MultiLanguageVoiceConfig,
    onResult: (result: VoiceAnalysisResult) => void,
    onError: (error: string) => void
  ): Promise<SpeechRecognition | null> {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        onError('Speech recognition not supported');
        return null;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = config.language;

      recognition.onresult = async (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;

            // Analyze the speech result
            const analysisResult = await this.analyzeVoiceResult(
              transcript,
              confidence,
              config
            );

            onResult(analysisResult);
          }
        }
      };

      recognition.onerror = (event) => {
        onError(`Speech recognition error: ${event.error}`);
      };

      recognition.start();
      return recognition;
    } catch (error) {
      onError(`Failed to start voice recognition: ${error}`);
      return null;
    }
  }

  // Handwriting recognition (simplified implementation)
  static async recognizeHandwriting(
    strokes: Array<{ points: Array<{ x: number; y: number; timestamp: number }> }>
  ): Promise<HandwritingResult> {
    try {
      // This is a simplified implementation - in production you'd use
      // Google Cloud Vision API, Azure Cognitive Services, or similar
      const mockResult: HandwritingResult = {
        text: 'Handwritten text detected',
        confidence: 0.85,
        strokes: strokes.map(stroke => ({
          points: stroke.points,
          text: 'word',
          confidence: 0.8
        }))
      };

      return mockResult;
    } catch (error) {
      console.error('Handwriting recognition error:', error);
      return {
        text: '',
        confidence: 0,
        strokes: []
      };
    }
  }

  // Multi-modal input processing
  static async processMultiModalInput(input: {
    text?: string;
    audio?: Blob;
    image?: File;
    handwriting?: Array<{ points: Array<{ x: number; y: number; timestamp: number }> }>;
    targetLanguage?: string;
  }): Promise<{
    consolidatedText: string;
    detectedLanguage: string;
    confidence: number;
    sources: Array<{ type: string; content: string; confidence: number }>;
  }> {
    const sources: Array<{ type: string; content: string; confidence: number }> = [];
    let consolidatedText = '';

    // Process text input
    if (input.text) {
      sources.push({
        type: 'text',
        content: input.text,
        confidence: 1.0
      });
      consolidatedText += input.text + ' ';
    }

    // Process image OCR
    if (input.image) {
      const ocrResult = await this.performOCR(input.image);
      if (ocrResult.text.trim()) {
        sources.push({
          type: 'image',
          content: ocrResult.text,
          confidence: ocrResult.confidence
        });
        consolidatedText += ocrResult.text + ' ';
      }
    }

    // Process handwriting
    if (input.handwriting) {
      const handwritingResult = await this.recognizeHandwriting(input.handwriting);
      if (handwritingResult.text.trim()) {
        sources.push({
          type: 'handwriting',
          content: handwritingResult.text,
          confidence: handwritingResult.confidence
        });
        consolidatedText += handwritingResult.text + ' ';
      }
    }

    // Detect primary language
    const languageDetection = await this.detectLanguagesInText(consolidatedText);
    const primaryLanguage = languageDetection[0]?.language || 'en';

    // Calculate overall confidence
    const avgConfidence = sources.reduce((sum, source) => sum + source.confidence, 0) / sources.length || 0;

    return {
      consolidatedText: consolidatedText.trim(),
      detectedLanguage: primaryLanguage,
      confidence: avgConfidence,
      sources
    };
  }

  // Language detection in text
  private static async detectLanguagesInText(text: string): Promise<Array<{ language: string; confidence: number }>> {
    try {
      // Simple language detection based on character patterns
      const patterns = {
        'ar': /[\u0600-\u06FF]/,
        'zh': /[\u4e00-\u9fff]/,
        'ja': /[\u3040-\u309f\u30a0-\u30ff]/,
        'ko': /[\uac00-\ud7af]/,
        'ru': /[\u0400-\u04FF]/,
        'he': /[\u0590-\u05FF]/,
        'hi': /[\u0900-\u097F]/,
        'th': /[\u0E00-\u0E7F]/
      };

      const detections: Array<{ language: string; confidence: number }> = [];

      for (const [lang, pattern] of Object.entries(patterns)) {
        const matches = text.match(pattern);
        if (matches) {
          const confidence = matches.length / text.length;
          detections.push({ language: lang, confidence });
        }
      }

      // Default to English if no specific patterns found
      if (detections.length === 0) {
        detections.push({ language: 'en', confidence: 0.8 });
      }

      return detections.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      return [{ language: 'en', confidence: 0.5 }];
    }
  }

  // Analyze voice recognition result
  private static async analyzeVoiceResult(
    transcript: string,
    confidence: number,
    config: MultiLanguageVoiceConfig
  ): Promise<VoiceAnalysisResult> {
    try {
      // Language detection
      const languageDetection = await this.detectLanguagesInText(transcript);

      // Emotion analysis (simplified)
      const emotion = await this.analyzeEmotionInText(transcript);

      // Stress analysis (simplified)
      const stress = await this.analyzeStressInText(transcript);

      return {
        transcript,
        language: config.language,
        confidence,
        emotion,
        stress,
        languageDetection: {
          detected: languageDetection[0]?.language || config.language,
          confidence: languageDetection[0]?.confidence || 0.5,
          alternatives: languageDetection.slice(1, 4)
        }
      };
    } catch (error) {
      console.error('Voice analysis error:', error);
      return {
        transcript,
        language: config.language,
        confidence,
        emotion: {
          primary: 'neutral',
          secondary: [],
          valence: 0,
          arousal: 0.5,
          dominance: 0.5
        },
        stress: {
          level: 0.5,
          indicators: []
        },
        languageDetection: {
          detected: config.language,
          confidence: 0.5,
          alternatives: []
        }
      };
    }
  }

  // Emotion analysis in text
  private static async analyzeEmotionInText(text: string): Promise<{
    primary: string;
    secondary: string[];
    valence: number;
    arousal: number;
    dominance: number;
  }> {
    // Simplified emotion analysis - in production use sentiment analysis APIs
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing'],
      sad: ['sad', 'depressed', 'down', 'terrible', 'awful', 'horrible'],
      angry: ['angry', 'mad', 'furious', 'upset', 'annoyed', 'frustrated'],
      anxious: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil']
    };

    const emotions = Object.entries(emotionKeywords).map(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
      ).length;
      return { emotion, score: matches };
    });

    const primary = emotions.reduce((max, current) => 
      current.score > max.score ? current : max
    );

    return {
      primary: primary.emotion,
      secondary: emotions
        .filter(e => e.emotion !== primary.emotion && e.score > 0)
        .map(e => e.emotion),
      valence: primary.emotion === 'happy' ? 0.8 : primary.emotion === 'sad' ? -0.6 : 0,
      arousal: primary.emotion === 'excited' ? 0.9 : primary.emotion === 'calm' ? 0.2 : 0.5,
      dominance: primary.emotion === 'angry' ? 0.8 : primary.emotion === 'anxious' ? 0.2 : 0.5
    };
  }

  // Stress analysis in text
  private static async analyzeStressInText(text: string): Promise<{
    level: number;
    indicators: string[];
  }> {
    const stressIndicators = [
      'overwhelmed', 'stressed', 'pressure', 'exhausted', 'burned out',
      'can\'t cope', 'too much', 'breaking point', 'falling apart'
    ];

    const foundIndicators = stressIndicators.filter(indicator =>
      text.toLowerCase().includes(indicator)
    );

    const stressLevel = Math.min(foundIndicators.length / stressIndicators.length, 1);

    return {
      level: stressLevel,
      indicators: foundIndicators
    };
  }

  // Helper method to map Tesseract language codes
  private static mapTesseractLanguage(tesseractLang: string): string {
    const mapping: { [key: string]: string } = {
      'eng': 'en',
      'spa': 'es',
      'fra': 'fr',
      'deu': 'de',
      'ita': 'it',
      'por': 'pt',
      'rus': 'ru',
      'ara': 'ar',
      'chi_sim': 'zh',
      'chi_tra': 'zh-TW',
      'jpn': 'ja',
      'kor': 'ko',
      'hin': 'hi',
      'tur': 'tr',
      'heb': 'he',
      'nld': 'nl'
    };
    return mapping[tesseractLang] || tesseractLang;
  }

  // Get supported languages
  static getSupportedOCRLanguages(): string[] {
    return SUPPORTED_OCR_LANGUAGES;
  }

  static getSupportedVoiceLanguages(): string[] {
    return VOICE_LANGUAGES;
  }

  // Cleanup
  static async cleanup(): Promise<void> {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
      this.isInitialized = false;
    }
  }
}
