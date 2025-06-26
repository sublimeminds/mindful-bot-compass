
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VoiceTranscriptProps {
  transcript: string;
  confidence: number;
}

const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  transcript,
  confidence
}) => {
  if (!transcript) {
    return (
      <div className="border rounded-md p-2 bg-gray-50 text-gray-500">
        No transcript available.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="border rounded-md p-2 bg-gray-50">
        {transcript}
      </div>
      {confidence > 0 && (
        <Badge variant="outline" className="text-xs">
          {Math.round(confidence * 100)}% confidence
        </Badge>
      )}
    </div>
  );
};

export default VoiceTranscript;
