import React, { useRef, useEffect, useState, Suspense } from 'react';
import ThreeDTherapistAvatar from './ThreeDTherapistAvatar';
import SimpleAvatarFallback from './SimpleAvatarFallback';
import WebGLDetector from './WebGLDetector';
import ThreeDErrorBoundary from '../ThreeDErrorBoundary';
import { useAvatarVirtualization } from './AvatarVirtualizationManager';

interface IntersectionObserverAvatarProps {
  therapistId: string;
  therapistName: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  priority?: number;
  className?: string;
}

const IntersectionObserverAvatar: React.FC<IntersectionObserverAvatarProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  showControls = false,
  priority = 0,
  className = "h-64"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [canRender3D, setCanRender3D] = useState(false);
  const { requestAvatarRender, releaseAvatarRender, isAvatarAllowedToRender } = useAvatarVirtualization();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      const allowed = requestAvatarRender(therapistId, priority);
      setCanRender3D(allowed);
    } else {
      releaseAvatarRender(therapistId);
      setCanRender3D(false);
    }

    return () => {
      if (isIntersecting) {
        releaseAvatarRender(therapistId);
      }
    };
  }, [isIntersecting, therapistId, priority, requestAvatarRender, releaseAvatarRender]);

  const shouldRender3D = isIntersecting && canRender3D && isAvatarAllowedToRender(therapistId);

  return (
    <div ref={containerRef} className={`${className} bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden border border-therapy-100`}>
      <WebGLDetector fallback={<SimpleAvatarFallback name={therapistName} therapistId={therapistId} />}>
        <ThreeDErrorBoundary fallback={<SimpleAvatarFallback name={therapistName} therapistId={therapistId} />}>
          {shouldRender3D ? (
            <Suspense fallback={<SimpleAvatarFallback name={therapistName} therapistId={therapistId} />}>
              <ThreeDTherapistAvatar
                therapistId={therapistId}
                emotion={emotion}
                isListening={isListening}
                isSpeaking={isSpeaking}
                showControls={showControls}
              />
            </Suspense>
          ) : (
            <SimpleAvatarFallback name={therapistName} therapistId={therapistId} />
          )}
        </ThreeDErrorBoundary>
      </WebGLDetector>
    </div>
  );
};

export default IntersectionObserverAvatar;