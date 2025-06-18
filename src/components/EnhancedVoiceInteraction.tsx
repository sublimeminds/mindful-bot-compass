
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
  AdvancedTextRecognitionService, 
  MultiLanguageVoiceConfig,
  VoiceAnalysisResult,
  OCRResult 
} from '@/services/advancedTextRecognitionService';

interface EnhancedVoiceInteractionProps {
  onTextReceived?: (text: string, metadata?: any) => void;
  onEmotionDetected?: (emotion: any) => void;
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
  const [currentEmotion, setCurrentEmotion] = useState<any>(null);
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
    // Initialize the advanced text recognition service
    AdvancedTextRecognitionService.initialize();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startAdvancedListening = async () => {
    try {
      const config: MultiLanguageVoiceConfig = {
        language: selectedLanguage,
        emotionDetection: true,
        stressAnalysis: true,
        realTimeTranslation: autoLanguageDetection
      };

      const recognition = await AdvancedTextRecognitionService.startAdvancedVoiceRecognition(
        config,
        handleVoiceResult,
        handleVoiceError
      );

      if (recognition) {
        recognitionRef.current = recognition;
        setIsListening(true);
        toast({
          title: "Advanced Voice Recognition Started",
          description: `Listening in ${selectedLanguage} with emotion detection`,
        });
      }
    } catch (error) {
      handleVoiceError(`Failed to start recognition: ${error}`);
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
    setCurrentEmotion(result.emotion);
    
    // Combine with any existing multi-modal text
    const combinedText = multiModalText ? 
      `${multiModalText} ${result.transcript}` : 
      result.transcript;

    onTextReceived?.(combinedText, {
      source: 'voice',
      language: result.language,
      confidence: result.confidence,
      emotion: result.emotion,
      stress: result.stress,
      languageDetection: result.languageDetection
    });

    onEmotionDetected?.(result.emotion);

    // Auto-detect language if enabled
    if (autoLanguageDetection && result.languageDetection.confidence > 0.8) {
      const detectedLang = supportedLanguages.find(lang => 
        lang.code.startsWith(result.languageDetection.detected)
      );
      if (detectedLang && detectedLang.code !== selectedLanguage) {
        setSelectedLanguage(detectedLang.code);
        toast({
          title: "Language Detected",
          description: `Switched to ${detectedLang.name}`,
        });
      }
    }
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
      const result = await AdvancedTextRecognitionService.performOCR(file);
      setOcrResult(result);
      
      if (result.text.trim()) {
        const combinedText = multiModalText ? 
          `${multiModalText} ${result.text}` : 
          result.text;
        setMultiModalText(combinedText);

        onTextReceived?.(combinedText, {
          source: 'ocr',
          confidence: result.confidence,
          language: result.language,
          boundingBoxes: result.boundingBoxes
        });

        toast({
          title: "Text Extracted from Image",
          description: `Found ${result.text.length} characters with ${Math.round(result.confidence * 100)}% confidence`,
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
            <span>Enhanced AI Voice & Text Recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            {isListening && (
              <Badge variant="default" className="bg-therapy-500 animate-pulse">
                <Mic className="h-3 w-3 mr-1" />
                Listening
              </Badge>
            )}
            {currentEmotion && (
              <Badge variant="outline" className="bg-blue-50">
                <Zap className="h-3 w-3 mr-1" />
                {currentEmotion.primary}
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
                  {currentEmotion && (
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Emotion: {currentEmotion.primary}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Valence: {currentEmotion.valence.toFixed(2)}
                      </Badge>
                    </div>
                  )}
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

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs text-green-600 font-medium">Voice AI</div>
            <div className="text-xs text-muted-foreground">
              {supportedLanguages.length}+ languages
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-blue-600 font-medium">Emotion Detection</div>
            <div className="text-xs text-muted-foreground">Real-time analysis</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-purple-600 font-medium">OCR</div>
            <div className="text-xs text-muted-foreground">Multi-language text extraction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVoiceInteraction;
