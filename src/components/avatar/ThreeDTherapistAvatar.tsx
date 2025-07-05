import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TherapistAvatarProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  therapistPersonality?: {
    name: string;
    approach: string;
    color_scheme: string;
  };
  userEmotion?: string;
}

interface AvatarFaceProps {
  isListening: boolean;
  isSpeaking: boolean;
  emotion: string;
  userEmotion?: string;
}

const AvatarFace: React.FC<AvatarFaceProps> = ({ isListening, isSpeaking, emotion, userEmotion }) => {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [speechAnimation, setSpeechAnimation] = useState(0);

  useFrame((state, delta) => {
    if (headRef.current) {
      // Gentle head movement
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }

    // Blinking animation
    setBlinkTimer(prev => prev + delta);
    if (blinkTimer > 3 + Math.random() * 2) {
      setBlinkTimer(0);
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = 0.1;
        rightEyeRef.current.scale.y = 0.1;
        setTimeout(() => {
          if (leftEyeRef.current && rightEyeRef.current) {
            leftEyeRef.current.scale.y = 1;
            rightEyeRef.current.scale.y = 1;
          }
        }, 100);
      }
    }

    // Speaking animation
    if (isSpeaking && mouthRef.current) {
      setSpeechAnimation(prev => prev + delta * 10);
      const mouthScale = 1 + Math.sin(speechAnimation) * 0.3;
      mouthRef.current.scale.y = mouthScale;
    }

    // Emotion-based reactions to user
    if (userEmotion === 'sad' && headRef.current) {
      headRef.current.rotation.x = -0.1; // Lean forward with concern
    } else if (userEmotion === 'happy' && headRef.current) {
      headRef.current.rotation.y += Math.sin(state.clock.elapsedTime * 2) * 0.02; // Gentle nod
    }
  });

  // Color based on emotion
  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return '#4ade80'; // green
      case 'concerned': return '#f59e0b'; // amber
      case 'encouraging': return '#3b82f6'; // blue
      case 'thoughtful': return '#8b5cf6'; // purple
      default: return '#6b7280'; // gray
    }
  };

  const emotionColor = getEmotionColor();

  return (
    <group ref={headRef}>
      {/* Head */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={emotionColor} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere ref={leftEyeRef} args={[0.15, 16, 16]} position={[-0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      <Sphere ref={rightEyeRef} args={[0.15, 16, 16]} position={[0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      
      {/* Mouth */}
      <Box ref={mouthRef} args={[0.3, 0.1, 0.1]} position={[0, -0.3, 0.8]}>
        <meshStandardMaterial color="#dc2626" />
      </Box>
      
      {/* Listening indicator */}
      {isListening && (
        <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.2} 
            wireframe 
          />
        </Sphere>
      )}
    </group>
  );
};

const ThreeDTherapistAvatar: React.FC<TherapistAvatarProps> = ({
  isListening = false,
  isSpeaking = false,
  emotion = 'neutral',
  therapistPersonality,
  userEmotion
}) => {
  const [mounted, setMounted] = useState(false);

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

  return (
    <Card className="w-full h-[400px] bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200">
      <CardContent className="p-0 h-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <AvatarFace
              isListening={isListening}
              isSpeaking={isSpeaking}
              emotion={emotion}
              userEmotion={userEmotion}
            />
            
            {/* Therapist name and info */}
            {therapistPersonality && (
              <Text
                position={[0, -2, 0]}
                fontSize={0.3}
                color="#374151"
                anchorX="center"
                anchorY="middle"
              >
                {`Dr. ${therapistPersonality.name}`}
              </Text>
            )}
            
            {/* Status indicators */}
            {isListening && (
              <Text
                position={[0, -2.5, 0]}
                fontSize={0.2}
                color="#3b82f6"
                anchorX="center"
                anchorY="middle"
              >
                Listening...
              </Text>
            )}
            
            {isSpeaking && (
              <Text
                position={[0, -2.5, 0]}
                fontSize={0.2}
                color="#10b981"
                anchorX="center"
                anchorY="middle"
              >
                Speaking...
              </Text>
            )}
          </Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </CardContent>
    </Card>
  );
};

export default ThreeDTherapistAvatar;