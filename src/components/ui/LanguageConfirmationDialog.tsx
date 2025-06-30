
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, X } from 'lucide-react';

interface LanguageConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  suggestedLanguage: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
  };
  currentLanguage: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
  };
}

const LanguageConfirmationDialog: React.FC<LanguageConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  suggestedLanguage,
  currentLanguage
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-xl therapy-gradient-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 therapy-gradient-bg rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-lg font-semibold text-slate-800">
                Language Preference Detected
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-therapy-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-slate-600 mt-3">
            We detected that you might prefer to use TherapySync in{' '}
            <span className="font-medium text-therapy-600">
              {suggestedLanguage.name} ({suggestedLanguage.nativeName})
            </span>{' '}
            instead of{' '}
            <span className="font-medium">
              {currentLanguage.name}
            </span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center gap-8 py-4">
          <div className="text-center">
            <div className="text-2xl mb-2">{currentLanguage.flag}</div>
            <div className="text-sm font-medium text-slate-700">{currentLanguage.name}</div>
            <div className="text-xs text-slate-500">Current</div>
          </div>
          <div className="text-therapy-400">→</div>
          <div className="text-center">
            <div className="text-2xl mb-2">{suggestedLanguage.flag}</div>
            <div className="text-sm font-medium text-therapy-600">{suggestedLanguage.name}</div>
            <div className="text-xs text-therapy-500">Suggested</div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Keep {currentLanguage.name}
          </Button>
          <Button
            onClick={onConfirm}
            className="therapy-gradient-bg text-white border-0 hover:shadow-lg"
          >
            Switch to {suggestedLanguage.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageConfirmationDialog;
