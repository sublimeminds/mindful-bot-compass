import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PersonalizedAvatar, { therapistPersonas } from './TherapistAvatarPersonas';
import SimpleAvatarFallback from './SimpleAvatarFallback';

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

  // Simple WebGL detection
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setWebglError(true);
    } else {
      setMounted(true);
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

  if (webglError || !mounted) {
    return <SimpleAvatarFallback name={persona.name} />;
  }

  return (
    <div className="w-full h-full relative">
      <Canvas 
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          preserveDrawingBuffer: false, 
          antialias: false,
          alpha: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: true
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        onCreated={(state) => {
          // Ensure proper cleanup
          state.gl.domElement.addEventListener('webglcontextlost', () => {
            setWebglError(true);
          });
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        
        <Suspense fallback={null}>
          <PersonalizedAvatar
            therapistId={therapistId}
            isListening={isListening}
            isSpeaking={isSpeaking}
            emotion={emotion}
            userEmotion={userEmotion}
            lipSyncData={lipSyncData}
          />
        </Suspense>
        
        {showControls && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        )}
      </Canvas>
      
      {/* Status overlay */}
      <div className="absolute bottom-2 left-2 right-2 text-center">
        <div className="text-xs font-medium text-therapy-700 mb-1">
          {persona.name}
        </div>
        {isListening && (
          <div className="text-xs text-blue-600">👂 Listening...</div>
        )}
        {isSpeaking && (
          <div className="text-xs text-green-600">💬 Speaking...</div>
        )}
      </div>
    </div>
  );
};

export default ThreeDTherapistAvatar;