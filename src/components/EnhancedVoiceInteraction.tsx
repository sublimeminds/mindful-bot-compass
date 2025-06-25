
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, MicOff, Volume2, VolumeX, Camera, Upload, 
  Languages, Brain, Zap, Eye 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  VoiceMetadata,
  EmotionData,
  OCRBoundingBox
} from '@/types/voiceInteraction';

interface VoiceAnalysisResult {
  transcript: string;
  confidence: number;
  language: string;
  emotion?: EmotionData;
  stress?: {
    level: 'low' | 'medium' | 'high';
    confidence: number;
  };
  languageDetection: {
    detected: string;
    confidence: number;
  };
}

interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  boundingBoxes?: OCRBoundingBox[];
}

interface MultiLanguageVoiceConfig {
  language: string;
  emotionDetection: boolean;
  stressAnalysis: boolean;
  realTimeTranslation: boolean;
}

interface EnhancedVoiceInteractionProps {
  onTextReceived?: (text: string, metadata?: VoiceMetadata) => void;
  onEmotionDetected?: (emotion: EmotionData) => void;
  autoLanguageDetection?: boolean;
  enableOCR?: boolean;
  enableHandwriting?: boolean;
  className?: string;
}

const EnhancedVoiceInteraction: React.FC<EnhancedVoiceInteractionProps> = ({
  onTextReceived,
  onEmotionDetected,
  autoLanguageDetection = true,
  enableOCR = true,
  enableHandwriting = false,
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [transcript, setTranscript] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [multiModalText, setMultiModalText] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
    { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt-PT', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
    { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
    { code: 'he-IL', name: 'Hebrew', flag: '🇮🇱' },
    { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' }
  ];

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startAdvancedListening = async () => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported');
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
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
            language: selectedLanguage,
            languageDetection: {
              detected: selectedLanguage.split('-')[0],
              confidence: 0.9
            }
          };
          
          handleVoiceResult(voiceResult);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        handleVoiceError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      
      toast({
        title: "Voice Recognition Started",
        description: `Listening in ${selectedLanguage}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      handleVoiceError(`Failed to start recognition: ${errorMessage}`);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleVoiceResult = (result: VoiceAnalysisResult) => {
    setTranscript(result.transcript);
    
    const combinedText = multiModalText ? 
      `${multiModalText} ${result.transcript}` : 
      result.transcript;

    onTextReceived?.(combinedText, {
      source: 'voice',
      language: result.language,
      confidence: result.confidence
    });
  };

  const handleVoiceError = (error: string) => {
    setIsListening(false);
    toast({
      title: "Voice Recognition Error",
      description: error,
      variant: "destructive"
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingOCR(true);
    try {
      // Mock OCR functionality
      const result: OCRResult = {
        text: "Sample extracted text from image",
        confidence: 0.85,
        language: 'en'
      };
      
      setOcrResult(result);
      
      if (result.text.trim()) {
        const combinedText = multiModalText ? 
          `${multiModalText} ${result.text}` : 
          result.text;
        setMultiModalText(combinedText);

        onTextReceived?.(combinedText, {
          source: 'ocr',
          confidence: result.confidence,
          language: result.language
        });

        toast({
          title: "Text Extracted from Image",
          description: `Found ${result.text.length} characters`,
        });
      }
    } catch (error) {
      toast({
        title: "OCR Error",
        description: "Failed to extract text from image",
        variant: "destructive"
      });
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const clearAllText = () => {
    setTranscript('');
    setMultiModalText('');
    setOcrResult(null);
    setCurrentEmotion(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis?.cancel();
    }
  };

  return (
    <Card className={`border-therapy-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>Enhanced Voice & Text Recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            {isListening && (
              <Badge variant="default" className="bg-therapy-500 animate-pulse">
                <Mic className="h-3 w-3 mr-1" />
                Listening
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="flex items-center space-x-3">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={isListening ? stopListening : startAdvancedListening}
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className={isListening ? 'animate-pulse' : 'bg-therapy-600 hover:bg-therapy-700'}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Start Voice
              </>
            )}
          </Button>

          {enableOCR && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingOCR}
              variant="outline"
              size="lg"
            >
              {isProcessingOCR ? (
                <>
                  <Eye className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Scan Image
                </>
              )}
            </Button>
          )}

          <Button
            onClick={toggleMute}
            variant="outline"
            size="lg"
            className={isMuted ? "bg-red-50 border-red-200" : ""}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>

          <Button onClick={clearAllText} variant="outline" size="lg">
            Clear All
          </Button>
        </div>

        {/* Hidden file input for OCR */}
        {enableOCR && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        )}

        {/* Results Display */}
        {(transcript || multiModalText) && (
          <div className="space-y-3">
            {transcript && (
              <div className="p-4 bg-therapy-50 rounded-lg border border-therapy-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-therapy-700">
                    Voice Transcript
                  </span>
                </div>
                <p className="text-sm text-gray-700">{transcript}</p>
              </div>
            )}

            {ocrResult && ocrResult.text && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">
                    Extracted Text (OCR)
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(ocrResult.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{ocrResult.text}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedVoiceInteraction;
