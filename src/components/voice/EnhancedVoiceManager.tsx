
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Languages, 
  Settings,
  Waveform,
  Heart,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedTextRecognitionService, VoiceAnalysisResult, MultiLanguageVoiceConfig } from '@/services/advancedTextRecognitionService';

const EnhancedVoiceManager = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState(0);
  const [voiceConfig, setVoiceConfig] = useState<MultiLanguageVoiceConfig>({
    language: 'en-US',
    emotionDetection: true,
    stressAnalysis: true,
    realTimeTranslation: false
  });
  const [speechSettings, setSpeechSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 0.8
  });
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    AdvancedTextRecognitionService.initialize();
  }, []);

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'ru-RU', name: 'Russian' }
  ];

  const handleVoiceResult = (result: VoiceAnalysisResult) => {
    setTranscript(result.transcript);
    setConfidence(result.confidence);
    
    if (result.emotion) {
      setDetectedEmotion(result.emotion.primary || null);
    }
    
    if (result.stress) {
      setStressLevel(result.stress.level || 0);
    }

    console.log('Voice analysis result:', result);
  };

  const handleVoiceError = (error: string) => {
    toast({
      title: "Voice Recognition Error",
      description: error,
      variant: "destructive",
    });
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      const recognitionInstance = await AdvancedTextRecognitionService.startAdvancedVoiceRecognition(
        voiceConfig,
        handleVoiceResult,
        handleVoiceError
      );
      
      if (recognitionInstance) {
        setRecognition(recognitionInstance);
        setIsListening(true);
        toast({
          title: "Voice Recognition Started",
          description: `Listening in ${voiceConfig.language}...`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Start",
        description: "Could not start voice recognition",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsListening(false);
    toast({
      title: "Voice Recognition Stopped",
      description: "Voice input has been disabled",
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechSettings.rate;
      utterance.pitch = speechSettings.pitch;
      utterance.volume = speechSettings.volume;
      utterance.lang = voiceConfig.language;
      
      speechSynthesis.speak(utterance);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'text-green-500',
      sad: 'text-blue-500',
      angry: 'text-red-500',
      anxious: 'text-yellow-500',
      calm: 'text-teal-500',
      excited: 'text-purple-500'
    };
    return colors[emotion.toLowerCase()] || 'text-gray-500';
  };

  const getStressColor = (level: number) => {
    if (level < 0.3) return 'text-green-500';
    if (level < 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Voice Recognition Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>Enhanced Voice Recognition</span>
            <Badge variant="outline" className="ml-2">AI Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              
              {transcript && (
                <Button
                  onClick={() => speakText(transcript)}
                  variant="outline"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Speak Back
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {confidence > 0 && (
                <Badge variant="outline">
                  {Math.round(confidence * 100)}% confident
                </Badge>
              )}
              <Badge variant={isListening ? "default" : "secondary"}>
                {isListening ? "Listening..." : "Ready"}
              </Badge>
            </div>
          </div>

          {isListening && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Waveform className="h-4 w-4 animate-pulse text-therapy-600" />
                <span className="text-sm text-muted-foreground">
                  Voice activity detected...
                </span>
              </div>
              <Progress value={confidence * 100} className="h-2" />
            </div>
          )}

          {transcript && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Transcript:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {(detectedEmotion || stressLevel > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-therapy-600" />
              <span>AI Voice Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detectedEmotion && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Heart className={`h-5 w-5 ${getEmotionColor(detectedEmotion)}`} />
                    <span className="font-medium">Detected Emotion</span>
                  </div>
                  <Badge className={getEmotionColor(detectedEmotion)}>
                    {detectedEmotion}
                  </Badge>
                </div>
              )}

              {stressLevel > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Activity className={`h-5 w-5 ${getStressColor(stressLevel)}`} />
                    <span className="font-medium">Stress Level</span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={stressLevel * 100} className="h-2" />
                    <span className={`text-sm ${getStressColor(stressLevel)}`}>
                      {Math.round(stressLevel * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Language & Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5 text-therapy-600" />
            <span>Language & Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language-select">Recognition Language</Label>
              <Select
                value={voiceConfig.language}
                onValueChange={(value) => setVoiceConfig(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="emotion-detection">Emotion Detection</Label>
                <Switch
                  id="emotion-detection"
                  checked={voiceConfig.emotionDetection}
                  onCheckedChange={(checked) => 
                    setVoiceConfig(prev => ({ ...prev, emotionDetection: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="stress-analysis">Stress Analysis</Label>
                <Switch
                  id="stress-analysis"
                  checked={voiceConfig.stressAnalysis}
                  onCheckedChange={(checked) => 
                    setVoiceConfig(prev => ({ ...prev, stressAnalysis: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="real-time-translation">Real-time Translation</Label>
                <Switch
                  id="real-time-translation"
                  checked={voiceConfig.realTimeTranslation}
                  onCheckedChange={(checked) => 
                    setVoiceConfig(prev => ({ ...prev, realTimeTranslation: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speech Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-therapy-600" />
            <span>Speech Output Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Speech Rate: {speechSettings.rate}</Label>
              <Slider
                value={[speechSettings.rate]}
                onValueChange={([value]) => setSpeechSettings(prev => ({ ...prev, rate: value }))}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Pitch: {speechSettings.pitch}</Label>
              <Slider
                value={[speechSettings.pitch]}
                onValueChange={([value]) => setSpeechSettings(prev => ({ ...prev, pitch: value }))}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Volume: {Math.round(speechSettings.volume * 100)}%</Label>
              <Slider
                value={[speechSettings.volume]}
                onValueChange={([value]) => setSpeechSettings(prev => ({ ...prev, volume: value }))}
                min={0}
                max={1}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>

          <Button
            onClick={() => speakText("This is a test of the speech synthesis settings.")}
            variant="outline"
            className="w-full"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Test Speech Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVoiceManager;
