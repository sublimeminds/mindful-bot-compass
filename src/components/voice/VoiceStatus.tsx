
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface VoiceStatusProps {
  isListening: boolean;
  isProcessing: boolean;
  confidence: number;
}

const VoiceStatus: React.FC<VoiceStatusProps> = ({
  isListening,
  isProcessing,
  confidence
}) => {
  return (
    <div className="flex items-center justify-between">
      <span>Voice Interaction</span>
      <div className="flex items-center space-x-2">
        <Badge 
          variant={isListening ? "default" : "secondary"}
          className={isListening ? "animate-pulse" : ""}
        >
          {isProcessing ? 'Processing' : isListening ? 'Listening' : 'Inactive'}
        </Badge>
        {confidence > 0.8 && (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
            <Activity className="h-3 w-3 mr-1" />
            High Confidence
          </Badge>
        )}
      </div>
    </div>
  );
};

export default VoiceStatus;
