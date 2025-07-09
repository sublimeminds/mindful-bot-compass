import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ThreeDChatInterface from './ThreeDChatInterface';

interface ThreeDChatModalProps {
  open: boolean;
  onClose: () => void;
  therapistId: string;
  therapistName: string;
  onMessageSent?: (message: string) => void;
  onAvatarResponse?: (response: string) => void;
  onEmotionDetected?: (emotion: any) => void;
}

const ThreeDChatModal: React.FC<ThreeDChatModalProps> = ({
  open,
  onClose,
  therapistId,
  therapistName,
  onMessageSent,
  onAvatarResponse,
  onEmotionDetected
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0">
        <div className="relative w-full h-full">
          <div className="absolute top-4 left-4 z-10">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discovery
            </Button>
          </div>
          
          <ThreeDChatInterface
            therapistId={therapistId}
            therapistName={therapistName}
            onMessageSent={onMessageSent}
            onAvatarResponse={onAvatarResponse}
            onEmotionDetected={onEmotionDetected}
            enableVoiceInput={true}
            enableEmotionAnalysis={true}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreeDChatModal;