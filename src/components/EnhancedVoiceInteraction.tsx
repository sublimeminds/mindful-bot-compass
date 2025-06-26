import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Settings, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceControls from '@/components/voice/VoiceControls';
import VoiceSettings from '@/components/voice/VoiceSettings';
import VoiceTranscript from '@/components/voice/VoiceTranscript';
import VoiceEmotionAnalysis from '@/components/voice/VoiceEmotionAnalysis';
import VoiceStatus from '@/components/voice/VoiceStatus';
import { EmotionData } from '@/types/voiceInteraction';

interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
}

interface VoiceInteractionState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  emotion: EmotionData | null;
  error: string | null;
}

interface EnhancedVoiceInteractionProps {
  onTranscript?: (text: string, metadata?: any) => void;
  onEmotion?: (emotion: EmotionData) => void;
  className?: string;
}

const EnhancedVoiceInteraction: React.FC<EnhancedVoiceInteractionProps> = ({
  onTranscript,
  onEmotion,
  className = ""
}) => {
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    emotion: null,
    error: null
  });

  const [settings, setSettings] = useState<VoiceSettings>({
    pitch: 1,
    rate: 1,
    volume: 1,
    voice: null
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        handleSpeechResult(event);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        handleSpeechError(event);
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false, isProcessing: false }));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSpeechResult = useCallback((event: SpeechRecognitionEvent) => {
    const results = Array.from(event.results);
    const transcript = results
      .map(result => result[0].transcript)
      .join('');
    
    const confidence = results.length > 0 ? results[results.length - 1][0].confidence : 0;

    setState(prev => ({
      ...prev,
      transcript,
      confidence,
      isProcessing: false
    }));

    // Call onTranscript callback if provided
    if (onTranscript) {
      onTranscript(transcript, { source: 'voice', confidence });
    }

    // Analyze emotion from transcript
    analyzeEmotion(transcript);
  }, [onTranscript]);

  const handleSpeechError = useCallback((event: SpeechRecognitionErrorEvent) => {
    let errorMessage = 'Speech recognition error occurred';
    
    switch (event.error) {
      case 'no-speech':
        errorMessage = 'No speech detected';
        break;
      case 'audio-capture':
        errorMessage = 'No microphone found';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone permission denied';
        break;
      default:
        errorMessage = `Speech recognition error: ${event.error}`;
    }

    setState(prev => ({
      ...prev,
      error: errorMessage,
      isListening: false,
      isProcessing: false
    }));

    toast({
      title: "Voice Recognition Error",
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const analyzeEmotion = useCallback((text: string) => {
    // Simple emotion analysis based on keywords
    const emotions = {
      happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing'],
      sad: ['sad', 'down', 'depressed', 'upset', 'terrible', 'awful'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'],
      excited: ['excited', 'thrilled', 'pumped', 'energetic'],
      neutral: []
    };

    const words = text.toLowerCase().split(' ');
    const emotionScores: Record<string, number> = {};

    Object.entries(emotions).forEach(([emotion, keywords]) => {
      emotionScores[emotion] = keywords.filter(keyword => 
        words.some(word => word.includes(keyword))
      ).length;
    });

    const primaryEmotion = Object.entries(emotionScores)
      .reduce((a, b) => emotionScores[a[0]] > emotionScores[b[0]] ? a : b)[0];

    if (emotionScores[primaryEmotion] > 0) {
      const emotionData: EmotionData = {
        primary: primaryEmotion,
        confidence: Math.min(emotionScores[primaryEmotion] / words.length, 1),
        valence: primaryEmotion === 'happy' || primaryEmotion === 'excited' ? 0.8 : 
                primaryEmotion === 'sad' || primaryEmotion === 'angry' ? -0.6 : 0,
        arousal: primaryEmotion === 'excited' || primaryEmotion === 'angry' ? 0.8 : 
                primaryEmotion === 'calm' ? 0.2 : 0.5
      };

      setState(prev => ({ ...prev, emotion: emotionData }));
      
      // Call onEmotion callback if provided
      if (onEmotion) {
        onEmotion(emotionData);
      }
    }
  }, [onEmotion]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !settings.voice) {
        setSettings(prev => ({ ...prev, voice: voices[0] }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [settings.voice]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    if (state.isListening) {
      recognitionRef.current.stop();
      setState(prev => ({ ...prev, isListening: false, isProcessing: false }));
    } else {
      setState(prev => ({ ...prev, isListening: true, isProcessing: true, error: null }));
      recognitionRef.current.start();
    }
  }, [state.isListening, toast]);

  const handleSpeak = useCallback((text: string) => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (settings.voice) {
      utterance.voice = settings.voice;
    }
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = settings.volume;

    speechSynthesis.speak(utterance);
  }, [settings]);

  const handleSettingsChange = useCallback((newSettings: VoiceSettings) => {
    setSettings(newSettings);
  }, []);

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Enhanced Voice Interaction
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <VoiceStatus
            isListening={state.isListening}
            isProcessing={state.isProcessing}
            confidence={state.confidence}
          />

          <VoiceControls
            isListening={state.isListening}
            isProcessing={state.isProcessing}
            transcript={state.transcript}
            onToggleListening={toggleListening}
            onSpeak={handleSpeak}
          />

          <VoiceTranscript
            transcript={state.transcript}
            confidence={state.confidence}
          />

          <VoiceEmotionAnalysis emotion={state.emotion} />

          {state.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{state.error}</p>
            </div>
          )}

          {showSettings && (
            <VoiceSettings
              settings={settings}
              availableVoices={availableVoices}
              onSettingsChange={handleSettingsChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVoiceInteraction;
