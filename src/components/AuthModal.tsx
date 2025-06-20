
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  // More comprehensive React validation
  const isReactReady = React && 
    typeof React === 'object' && 
    React.useRef && 
    React.useState && 
    React.useEffect &&
    React.createElement;

  if (!isReactReady) {
    console.warn('AuthModal: React not fully initialized, skipping render');
    return null;
  }

  // Don't render dialog if not open to avoid unnecessary mounting
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to TherapySync</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>
        <EnhancedAuthForm />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
