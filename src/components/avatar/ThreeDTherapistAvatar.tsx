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
    <Card className="w-full h-[400px] bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200">
      <CardContent className="p-6 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">
              {persona.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-therapy-700 mb-1">
              {persona.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
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
      </CardContent>
    </Card>
  );

  return (
    <WebGLDetector fallback={fallbackAvatar}>
      <ThreeDErrorBoundary fallback={fallbackAvatar} showRefresh={false}>
        <Card className="w-full h-[400px] bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200">
          <CardContent className="p-0 h-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              <pointLight position={[-10, -10, -10]} intensity={0.6} />
              <pointLight position={[0, 10, 5]} intensity={0.8} />
              
              <Suspense fallback={null}>
                <PersonalizedAvatar
                  therapistId={therapistId}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  emotion={emotion}
                  userEmotion={userEmotion}
                  lipSyncData={lipSyncData}
                />
                
                {/* Therapist name and info */}
                <Text
                  position={[0, -3, 0]}
                  fontSize={0.3}
                  color="#374151"
                  anchorX="center"
                  anchorY="middle"
                >
                  {persona.name}
                </Text>
                
                <Text
                  position={[0, -3.4, 0]}
                  fontSize={0.18}
                  color="#6B7280"
                  anchorX="center"
                  anchorY="middle"
                >
                  {persona.personality.approachStyle.charAt(0).toUpperCase() + 
                   persona.personality.approachStyle.slice(1)} Therapy
                </Text>
                
                {/* Status indicators */}
                {isListening && (
                  <Text
                    position={[0, -3.8, 0]}
                    fontSize={0.16}
                    color="#3b82f6"
                    anchorX="center"
                    anchorY="middle"
                  >
                    👂 Listening...
                  </Text>
                )}
                
                {isSpeaking && (
                  <Text
                    position={[0, -3.8, 0]}
                    fontSize={0.16}
                    color="#10b981"
                    anchorX="center"
                    anchorY="middle"
                  >
                    💬 Speaking...
                  </Text>
                )}
              </Suspense>
              
              {showControls && (
                <OrbitControls 
                  enableZoom={true}
                  enablePan={false}
                  minDistance={4}
                  maxDistance={10}
                  maxPolarAngle={Math.PI / 1.8}
                  minPolarAngle={Math.PI / 4}
                />
              )}
            </Canvas>
          </CardContent>
        </Card>
      </ThreeDErrorBoundary>
    </WebGLDetector>
  );
};

export default ThreeDTherapistAvatar;