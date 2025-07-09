import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PersonalizedAvatar, { therapistPersonas } from './TherapistAvatarPersonas';
import WebGLDetector from './WebGLDetector';
import ThreeDErrorBoundary from '@/components/ThreeDErrorBoundary';

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
  const [mounted, setMounted] = useState(false);
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="w-full h-[400px] bg-gradient-to-br from-therapy-50 to-calm-50">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const fallbackAvatar = (
    <div className="w-full h-full bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-xl">
            {persona.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-therapy-700 mb-1">
            {persona.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            {persona.personality.approachStyle.charAt(0).toUpperCase() + 
             persona.personality.approachStyle.slice(1)} Therapy
          </p>
          {isListening && (
            <p className="text-xs text-blue-600">👂 Listening...</p>
          )}
          {isSpeaking && (
            <p className="text-xs text-green-600">💬 Speaking...</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      <WebGLDetector fallback={fallbackAvatar}>
        <ThreeDErrorBoundary fallback={fallbackAvatar} showRefresh={false}>
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ preserveDrawingBuffer: true, antialias: false }}
            dpr={1}
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
        </ThreeDErrorBoundary>
      </WebGLDetector>
    </div>
  );
};

export default ThreeDTherapistAvatar;