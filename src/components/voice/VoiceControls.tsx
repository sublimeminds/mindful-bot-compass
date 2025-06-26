
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  onToggleListening: () => void;
  onSpeak: (text: string) => void;
  disabled?: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isProcessing,
  transcript,
  onToggleListening,
  onSpeak,
  disabled = false
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={onToggleListening}
        disabled={isProcessing || disabled}
        className="flex-1"
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            Start Listening
          </>
        )}
      </Button>
      <Button
        variant="secondary"
        onClick={() => onSpeak(transcript)}
        disabled={!transcript || disabled}
      >
        <Volume2 className="h-4 w-4 mr-2" />
        Speak
      </Button>
    </div>
  );
};

export default VoiceControls;
