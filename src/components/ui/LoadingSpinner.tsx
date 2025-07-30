
import React from 'react';
import GradientLogo from '@/components/ui/GradientLogo';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50/60 via-healing-50/40 to-harmony-50/60">
      <div className="text-center space-y-6">
        <div className="animate-swirl-breathe">
          <GradientLogo size="lg" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
            TherapySync
          </h2>
          <p className="text-muted-foreground animate-pulse">
            Preparing your personalized therapy experience...
          </p>
        </div>
        <div className="w-32 h-1 bg-therapy-100 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-therapy-500 to-healing-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
