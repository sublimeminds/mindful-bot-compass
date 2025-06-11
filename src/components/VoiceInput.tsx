
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Trash2 } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { Badge } from '@/components/ui/badge';

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscriptChange,
  onSend,
  disabled = false
}) => {
  const {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    speak,
    clearTranscript
  } = useVoiceInteraction();

  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendTranscript = () => {
    if (transcript.trim()) {
      onSend();
      clearTranscript();
    }
  };

  const handleTestSpeech = () => {
    speak("Voice interaction is working correctly. You can now speak your thoughts and I'll listen.");
  };

  if (!isSupported) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-orange-700">
            <MicOff className="h-5 w-5" />
            <span className="text-sm">Voice input not supported in this browser</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-therapy-200">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={isListening ? "default" : "secondary"} className="bg-therapy-100">
              {isListening ? "Listening..." : "Voice Ready"}
            </Badge>
            {confidence > 0 && (
              <Badge variant="outline" className="text-xs">
                {Math.round(confidence * 100)}% confident
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSpeech}
              disabled={disabled}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            
            {transcript && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearTranscript}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={handleMicClick}
            disabled={disabled}
            className={isListening ? "animate-pulse" : ""}
          >
            {isListening ? (
              <MicOff className="h-5 w-5 mr-2" />
            ) : (
              <Mic className="h-5 w-5 mr-2" />
            )}
            {isListening ? "Stop" : "Start"} Recording
          </Button>

          {transcript && (
            <Button
              onClick={handleSendTranscript}
              disabled={disabled}
              className="bg-therapy-600 hover:bg-therapy-700"
            >
              Send Message
            </Button>
          )}
        </div>

        {transcript && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Transcript:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceInput;
