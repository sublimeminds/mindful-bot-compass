import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useAvatarManager } from './OptimizedAvatarManager';
import EnhancedThreeDAvatar from './EnhancedThreeDAvatar';
import SimpleAvatarFallback from './SimpleAvatarFallback';
import { therapistPersonas } from './TherapistAvatarPersonas';

interface PerformanceOptimizedAvatarProps {
  therapistId: string;
  therapistName?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  userEmotion?: string;
  lipSyncData?: Float32Array;
  showControls?: boolean;
  className?: string;
  priority?: number;
  force2D?: boolean;
}

const PerformanceOptimizedAvatar: React.FC<PerformanceOptimizedAvatarProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  userEmotion,
  lipSyncData,
  showControls = true,
  className = "w-full h-full",
  priority = 0,
  force2D = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [performanceMode, setPerformanceMode] = useState<'3d' | '2d' | 'loading'>('loading');
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  
  const { canRenderAvatar, requestAvatarRender, releaseAvatarRender } = useAvatarManager();
  
  // Intersection observer to only render when visible
  const isIntersecting = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Device performance detection
  const deviceCapability = useMemo(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : isMobile;
    
    return {
      isMobile,
      isLowEnd,
      canHandle3D: !isLowEnd && !force2D
    };
  }, [force2D]);

  // WebGL detection
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setWebglSupported(!!gl);
        canvas.remove();
      } catch {
        setWebglSupported(false);
      }
    };

    checkWebGL();
  }, []);

  // Performance mode determination
  useEffect(() => {
    if (webglSupported === null) return;

    if (!webglSupported || !deviceCapability.canHandle3D || force2D) {
      setPerformanceMode('2d');
      return;
    }

    if (isIntersecting && canRenderAvatar(therapistId)) {
      const canRender = requestAvatarRender(therapistId, priority);
      setPerformanceMode(canRender ? '3d' : '2d');
    } else {
      setPerformanceMode('2d');
      releaseAvatarRender(therapistId);
    }

    return () => {
      if (!isIntersecting) {
        releaseAvatarRender(therapistId);
      }
    };
  }, [
    webglSupported,
    isIntersecting,
    deviceCapability.canHandle3D,
    force2D,
    therapistId,
    priority,
    canRenderAvatar,
    requestAvatarRender,
    releaseAvatarRender
  ]);

  // Get therapist persona with fallback
  const persona = useMemo(() => {
    try {
      return therapistPersonas?.[therapistId] || therapistPersonas?.['dr-sarah-chen'];
    } catch (error) {
      console.warn('Error loading therapist persona:', error);
      return null;
    }
  }, [therapistId]);

  const displayName = therapistName || persona?.name || 'AI Therapist';

  const render3DAvatar = () => (
    <EnhancedThreeDAvatar
      therapistId={therapistId}
      emotion={emotion}
      isListening={isListening}
      isSpeaking={isSpeaking}
      userEmotion={userEmotion}
      lipSyncData={lipSyncData}
      showControls={showControls}
      className="w-full h-full"
    />
  );

  const render2DAvatar = () => (
    <SimpleAvatarFallback
      name={displayName}
      therapistId={therapistId}
      className="w-full h-full"
      showName={false}
    />
  );

  return (
    <div ref={containerRef} className={className}>
      <div className="w-full h-full relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden border border-therapy-100">
        {performanceMode === 'loading' && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
          </div>
        )}
        
        {performanceMode === '3d' && render3DAvatar()}
        {performanceMode === '2d' && render2DAvatar()}
        
        {/* Performance indicator */}
        {performanceMode === '2d' && webglSupported && !force2D && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            2D Mode
          </div>
        )}
        
        {/* Status indicators */}
        <div className="absolute bottom-2 left-2 flex space-x-2">
          {isListening && (
            <div className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <span>Listening</span>
            </div>
          )}
          {isSpeaking && (
            <div className="bg-green-500/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce"></div>
              <span>Speaking</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizedAvatar;