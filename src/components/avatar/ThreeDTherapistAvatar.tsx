import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PersonalizedAvatar, { therapistPersonas } from './TherapistAvatarPersonas';
import SimpleAvatarFallback from './SimpleAvatarFallback';
import Isolated3DAvatar from './Isolated3DAvatar';

interface TherapistAvatarProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  therapistId?: string;
  therapistPersonality?: {
    name: string;
    approach: string;
    color_scheme: string;
  };
  userEmotion?: string;
  lipSyncData?: Float32Array;
  showControls?: boolean;
}


const ThreeDTherapistAvatar: React.FC<TherapistAvatarProps> = ({
  isListening = false,
  isSpeaking = false,
  emotion = 'neutral',
  therapistId = 'dr-sarah-chen',
  therapistPersonality,
  userEmotion,
  lipSyncData,
  showControls = true
}) => {
  const [webglError, setWebglError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  // Simplified WebGL detection with enhanced fallback
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Use enhanced 3D avatar if available, otherwise fallback
    setMounted(true);
    
    if (!checkWebGLSupport()) {
      console.log('WebGL not supported, using 2D fallback');
      setWebglError(true);
    }
  }, [checkWebGLSupport]);

  // Context loss handler
  useEffect(() => {
    const handleContextLoss = () => {
      console.warn('WebGL context lost - falling back to 2D');
      setWebglError(true);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLoss);
      return () => canvas.removeEventListener('webglcontextlost', handleContextLoss);
    }
  }, [mounted]);

  // Use enhanced 3D avatar with better fallback
  if (webglError || !mounted) {
    return <SimpleAvatarFallback name={persona.name} therapistId={therapistId} />;
  }

  return (
    <Isolated3DAvatar
      therapistId={therapistId}
      therapistName={persona.name}
      emotion={emotion}
      isListening={isListening}
      isSpeaking={isSpeaking}
      showControls={showControls}
      className="w-full h-full"
    />
  );
};

export default ThreeDTherapistAvatar;