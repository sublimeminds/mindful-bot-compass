import React, { Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User, AlertTriangle } from 'lucide-react';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import ReactErrorBoundary from './ReactErrorBoundary';
import BulletproofLovableGuard from '@/components/BulletproofLovableGuard';

// Lazy load with comprehensive error handling
const Professional2DAvatar = React.lazy(() => 
  import('@/components/avatar/Professional2DAvatar').catch((error) => {
    console.warn('Professional2DAvatar import failed:', error);
    return {
      default: ({ therapistName }: { therapistName: string }) => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg p-4">
          <div className="w-24 h-24 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
            {therapistName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AI'}
          </div>
          <p className="text-sm font-medium text-therapy-700">{therapistName}</p>
        </div>
      )
    };
  })
);

interface BulletproofAvatarDisplayProps {
  therapist: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  onClick?: () => void;
}

// Progressive fallback components
const TextFallback = ({ therapist }: { therapist: any }) => (
  <div className="text-center w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg p-4">
    <div className="w-24 h-24 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
      {therapist.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'AI'}
    </div>
    <p className="text-sm font-medium text-therapy-700">{therapist.name}</p>
    <p className="text-xs text-muted-foreground">AI Therapist</p>
  </div>
);

const IconFallback = ({ therapist }: { therapist: any }) => (
  <div className="text-center w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg p-4">
    <div className="w-24 h-24 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center text-white mb-2">
      <User className="h-12 w-12" />
    </div>
    <p className="text-sm font-medium text-therapy-700">{therapist.name}</p>
    <p className="text-xs text-muted-foreground">AI Therapist</p>
  </div>
);

const ErrorFallback = ({ therapist, retry }: { therapist: any; retry: () => void }) => (
  <div className="text-center w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
    <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white mb-2">
      <AlertTriangle className="h-12 w-12" />
    </div>
    <p className="text-sm font-medium text-amber-700">{therapist.name}</p>
    <p className="text-xs text-muted-foreground mb-2">Avatar loading issue</p>
    <button 
      onClick={retry}
      className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded transition-colors"
    >
      Retry
    </button>
  </div>
);

const LoadingSkeleton = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-4">
    <Skeleton className="w-24 h-24 rounded-full mb-2" />
    <Skeleton className="h-4 w-24 mb-1" />
    <Skeleton className="h-3 w-16" />
  </div>
);

const BulletproofAvatarDisplay = ({ 
  therapist, 
  className = "h-64 w-full", 
  size = "lg",
  showName = true,
  onClick 
}: BulletproofAvatarDisplayProps) => {
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error' | 'fallback'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  
  const avatarId = getAvatarIdForTherapist(therapist.id);

  const handleRetry = () => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setLoadingState('loading');
    } else {
      setLoadingState('fallback');
    }
  };

  const handleAvatarError = (error: Error) => {
    console.warn('Avatar error (safe):', error.message);
    setLoadingState('error');
  };

  const handleAvatarSuccess = () => {
    setLoadingState('success');
  };

  // Progressive enhancement logic
  const renderAvatar = () => {
    switch (loadingState) {
      case 'loading':
        return <LoadingSkeleton />;
      
      case 'error':
        return retryCount >= 2 ? 
          <IconFallback therapist={therapist} /> : 
          <ErrorFallback therapist={therapist} retry={handleRetry} />;
      
      case 'fallback':
        return <IconFallback therapist={therapist} />;
      
      case 'success':
      default:
        return (
          <Suspense fallback={<LoadingSkeleton />}>
            <ReactErrorBoundary 
              fallback={<IconFallback therapist={therapist} />}
              onError={handleAvatarError}
            >
              <Professional2DAvatar
                therapistId={avatarId}
                therapistName={therapist.name}
                className="flex-1 flex items-center justify-center"
                showName={showName}
                size={size}
                onLoad={handleAvatarSuccess}
              />
            </ReactErrorBoundary>
          </Suspense>
        );
    }
  };

  return (
    <BulletproofLovableGuard
      fallback={<LoadingSkeleton />}
      onError={() => setLoadingState('fallback')}
    >
      <div 
        className={`${className} bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 group`}
        onClick={onClick}
      >
        {renderAvatar()}
      </div>
    </BulletproofLovableGuard>
  );
};

export default BulletproofAvatarDisplay;