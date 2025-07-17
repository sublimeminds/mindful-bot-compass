import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, X } from 'lucide-react';

interface LanguageBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  onSwitch: () => void;
  suggestedLanguage: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
  };
}

const LanguageBanner: React.FC<LanguageBannerProps> = ({
  isVisible,
  onDismiss,
  onSwitch,
  suggestedLanguage
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-therapy-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5" />
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Would you like to view this page in{' '}
                <span className="font-medium">
                  {suggestedLanguage.name}
                </span>
                ?
              </span>
              <span className="text-lg">{suggestedLanguage.flag}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSwitch}
              className="bg-white text-therapy-600 border-0 hover:bg-therapy-50"
            >
              Switch Language
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-white hover:bg-therapy-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageBanner;