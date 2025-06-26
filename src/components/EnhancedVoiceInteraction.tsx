
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  VoiceMetadata, 
  EmotionData, 
  SpeechRecognitionEvent, 
  SpeechRecognitionErrorEvent 
} from '@/types/voiceInteraction';
import VoiceControls from '@/components/voice/VoiceControls';
import VoiceTranscript from '@/components/voice/VoiceTranscript';
import VoiceEmotionAnalysis from '@/components/voice/VoiceEmotionAnalysis';
import VoiceStatus from '@/components/voice/VoiceStatus';

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
  lastResponse: string;
  settings: VoiceSettings;
}

interface EnhancedVoiceInteractionProps {
  onTranscript?: (transcript: string, metadata: VoiceMetadata) => void;
  onEmotion?: (emotion: EmotionData) => void;
  autoStart?: boolean;
  language?: string;
  className?: string;
}

const EnhancedVoiceInteraction: React.FC<EnhancedVoiceInteractionProps> = ({
  onTranscript,
  onEmotion,
  autoStart = false,
  language = 'en-US',
  className = ''
}) => {
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    emotion: null,
    lastResponse: '',
    settings: {
      pitch: 1,
      rate: 1,
      volume: 1,
      voice: null
    }
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const populateVoices = () => {
      const voices = synthRef.current?.getVoices() || [];
      setAvailableVoices(voices);
      setState(prevState => ({
        ...prevState,
        settings: {
          ...prevState.settings,
          voice: voices[0] || null
        }
      }));
    };

    if (synthRef.current?.getVoices().length > 0) {
      populateVoices();
    } else {
      synthRef.current?.addEventListener('voiceschanged', populateVoices);
    }

    return () => {
      synthRef.current?.removeEventListener('voiceschanged', populateVoices);
    };
  }, []);

  const startSpeechRecognition = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support Speech Recognition.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.addEventListener('start', () => {
      setState(prevState => ({ ...prevState, isListening: true, isProcessing: false }));
    });

    recognitionRef.current.addEventListener('result', (event: Event) => {
      const speechEvent = event as unknown as SpeechRecognitionEvent;
      let interimTranscript = '';
      let finalTranscript = '';
      let currentConfidence = 0;

      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; ++i) {
        const result = speechEvent.results[i];
        const alternative = result[0];
        currentConfidence = alternative.confidence;

        if (result.isFinal) {
          finalTranscript += alternative.transcript;
        } else {
          interimTranscript += alternative.transcript;
        }
      }

      setState(prevState => ({
        ...prevState,
        transcript: finalTranscript || interimTranscript,
        confidence: currentConfidence
      }));

      if (onTranscript) {
        const metadata: VoiceMetadata = {
          source: 'voice',
          language: language,
          confidence: currentConfidence
        };
        onTranscript(finalTranscript || interimTranscript, metadata);
      }
    });

    recognitionRef.current.addEventListener('end', () => {
      setState(prevState => ({ ...prevState, isListening: false }));
    });

    recognitionRef.current.addEventListener('error', (event: Event) => {
      const errorEvent = event as unknown as SpeechRecognitionErrorEvent;
      console.error('Speech recognition error:', errorEvent.error);
      toast({
        title: "Speech Recognition Error",
        description: `Error: ${errorEvent.error}`,
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isListening: false }));
    });

    recognitionRef.current.start();
  }, [language, onTranscript, toast]);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState(prevState => ({ ...prevState, isListening: false }));
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  }, [startSpeechRecognition, stopSpeechRecognition, state.isListening]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) {
      synthRef.current = window.speechSynthesis;
    }

    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = state.settings.pitch;
    utterance.rate = state.settings.rate;
    utterance.volume = state.settings.volume;
    utterance.voice = state.settings.voice;

    synthRef.current?.speak(utterance);
  }, [state.settings]);

  useEffect(() => {
    if (autoStart) {
      startSpeechRecognition();
    }

    return () => {
      stopSpeechRecognition();
    };
  }, [autoStart, startSpeechRecognition, stopSpeechRecognition]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <VoiceStatus 
            isListening={state.isListening}
            isProcessing={state.isProcessing}
            confidence={state.confidence}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Transcript</label>
          <VoiceTranscript 
            transcript={state.transcript}
            confidence={state.confidence}
          />
        </div>

        <VoiceControls
          isListening={state.isListening}
          isProcessing={state.isProcessing}
          transcript={state.transcript}
          onToggleListening={toggleListening}
          onSpeak={speak}
        />

        <VoiceEmotionAnalysis emotion={state.emotion} />
      </CardContent>
    </Card>
  );
};

export default EnhancedVoiceInteraction;
