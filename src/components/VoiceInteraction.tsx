
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface VoiceInteractionProps {
  onMessageReceived?: (message: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  autoListen?: boolean;
  disabled?: boolean;
}

const VoiceInteraction: React.FC<VoiceInteractionProps> = ({
  onMessageReceived,
  onSpeechStart,
  onSpeechEnd,
  autoListen = false,
  disabled = false
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  
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
    if (isListening && onSpeechStart) {
      onSpeechStart();
    } else if (!isListening && onSpeechEnd) {
      onSpeechEnd();
    }
  }, [isListening, onSpeechStart, onSpeechEnd]);

  useEffect(() => {
    if (transcript && onMessageReceived) {
      onMessageReceived(transcript);
    }
  }, [transcript, onMessageReceived]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Voice Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTestSpeech = () => {
    if (!isMuted) {
      speak("Voice interaction is working. I'm ready to listen to your thoughts.");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel();
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2 text-orange-700">
            <MicOff className="h-6 w-6" />
            <span>Voice features not supported</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-therapy-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Voice Interaction</span>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={isListening ? "default" : "secondary"}
              className={isListening ? "bg-therapy-500 animate-pulse" : "bg-gray-100"}
            >
              {isListening ? "Listening" : "Ready"}
            </Badge>
            {confidence > 0.8 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                High Confidence
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-3">
          <Button
            onClick={handleMicClick}
            disabled={disabled}
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className={`${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : 'bg-therapy-600 hover:bg-therapy-700'} min-w-[140px]`}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            onClick={handleTestSpeech}
            disabled={disabled || isMuted}
            variant="outline"
            size="lg"
          >
            <Volume2 className="h-5 w-5 mr-2" />
            Test
          </Button>

          <Button
            onClick={toggleMute}
            disabled={disabled}
            variant="outline"
            size="lg"
            className={isMuted ? "bg-red-50 border-red-200" : ""}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>

        {transcript && (
          <div className="mt-4 p-4 bg-therapy-50 rounded-lg border border-therapy-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-therapy-700">
                Transcript
              </span>
              <Button
                onClick={clearTranscript}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Clear
              </Button>
            </div>
            <p className="text-sm text-gray-700">{transcript}</p>
            {confidence > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs text-gray-500">
          <span>Secure voice processing</span>
          <span>Press and hold for continuous listening</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInteraction;
