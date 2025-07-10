import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SessionAssessment from './SessionAssessment';
import { Button } from '@/components/ui/button';

interface SessionAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'pre_session' | 'post_session';
  sessionId?: string;
  onComplete?: (assessment: any) => void;
}

const SessionAssessmentModal = ({ 
  isOpen, 
  onClose, 
  type, 
  sessionId, 
  onComplete 
}: SessionAssessmentModalProps) => {
  const handleComplete = (assessment: any) => {
    onComplete?.(assessment);
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === 'pre_session' ? 'Pre-Session Check-In' : 'Post-Session Check-Out'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-2">
          <SessionAssessment
            type={type}
            sessionId={sessionId}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionAssessmentModal;