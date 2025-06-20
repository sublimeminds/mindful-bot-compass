
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
  // Ensure React hooks are available before rendering Dialog
  if (!React || !React.useRef || !React.useState) {
    console.warn('AuthModal: React hooks not available, not rendering dialog');
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
