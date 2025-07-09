import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import LightweightAvatarSystem from './LightweightAvatarSystem';
import ThreeDTherapistAvatar from './ThreeDTherapistAvatar';

interface SafeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapist: {
    id: string;
    avatarId: string;
    name: string;
    title: string;
    approach: string;
    specialties: string[];
  } | null;
}

const SafeAvatarModal: React.FC<SafeAvatarModalProps> = ({
  isOpen,
  onClose,
  therapist
}) => {
  const [avatarMode, setAvatarMode] = useState<'2d' | '3d' | 'error'>('3d');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setAvatarMode('3d');
      setRetryCount(0);
    }
  }, [isOpen]);

  const tryLoadingAvatar = () => {
    if (retryCount < maxRetries) {
      setAvatarMode('3d');
      setRetryCount(prev => prev + 1);
    } else {
      setAvatarMode('error');
    }
  };

  const renderAvatar = () => {
    if (!therapist) return null;

    switch (avatarMode) {
      case '3d':
        return (
          <div className="w-full h-full relative">
            <ThreeDTherapistAvatar
              therapistId={therapist.avatarId}
              isListening={false}
              isSpeaking={false}
              emotion="encouraging"
              showControls={true}
            />
            
            {/* Switch to 2D option */}
            <div className="absolute bottom-4 right-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAvatarMode('2d')}
                className="text-xs bg-white/90 backdrop-blur-sm"
              >
                Switch to 2D
              </Button>
            </div>
          </div>
        );
        
      case 'error':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-therapy-700 mb-2">
                3D Avatar Unavailable
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Unable to load 3D avatar after {maxRetries} attempts
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAvatarMode('2d')}
                className="text-xs"
              >
                View 2D Avatar
              </Button>
            </div>
          </div>
        );
        
      default: // 2d
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg">
            <LightweightAvatarSystem
              therapistId={therapist.avatarId}
              therapistName={therapist.name}
              className="flex-1 w-full h-full"
              showControls={true}
              size="xl"
              emotion="encouraging"
            />
            
            <div className="space-y-2 absolute bottom-4 left-4">
              <Button
                variant="outline"
                size="sm"
                onClick={tryLoadingAvatar}
                disabled={retryCount >= maxRetries}
                className="text-xs bg-white/90 backdrop-blur-sm"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {retryCount < maxRetries ? 'Enhanced Mode' : 'Max Attempts Reached'}
              </Button>
              
              {retryCount > 0 && retryCount < maxRetries && (
                <p className="text-xs text-muted-foreground text-center">
                  Attempt {retryCount} of {maxRetries}
                </p>
              )}
            </div>
          </div>
        );
    }
  };

  if (!therapist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[500px]">
        <DialogHeader>
          <DialogTitle>Meet {therapist.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Avatar Section */}
          <div className="h-full">
            {renderAvatar()}
          </div>

          {/* Info Section */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{therapist.name}</h3>
                <p className="text-muted-foreground">{therapist.title}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Approach & Specialties</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{therapist.approach}</Badge>
                  {therapist.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Avatar Status</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    avatarMode === '3d' ? 'bg-green-500' : 
                    avatarMode === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-xs text-muted-foreground">
                    {avatarMode === '3d' ? '3D Avatar Active' : 
                     avatarMode === 'error' ? 'Avatar Error' : '2D Avatar Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button 
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button 
                className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                onClick={onClose}
              >
                Select {therapist.name}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SafeAvatarModal;