import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, Cone, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { therapistPersonas, TherapistAvatarPersona } from './TherapistAvatarPersonas';

interface OptimizedAvatarProps {
  therapistId: string;
  isListening: boolean;
  isSpeaking: boolean;
  emotion: string;
  userEmotion?: string;
  lipSyncData?: Float32Array;
  performanceLevel: 'high' | 'medium' | 'low';
  showDetails: boolean;
}

interface LODSettings {
  geometryDetail: number;
  textureQuality: number;
  animationComplexity: number;
  lightingQuality: number;
}

const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({ 
  therapistId, 
  isListening, 
  isSpeaking, 
  emotion, 
  userEmotion,
  lipSyncData,
  performanceLevel,
  showDetails
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [gestureTimer, setGestureTimer] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [lastFrameTime, setLastFrameTime] = useState(0);

  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];
  
  // LOD Settings based on performance level
  const lodSettings: LODSettings = useMemo(() => {
    switch (performanceLevel) {
      case 'high':
        return {
          geometryDetail: 1.0,
          textureQuality: 1.0,
          animationComplexity: 1.0,
          lightingQuality: 1.0
        };
      case 'medium':
        return {
          geometryDetail: 0.7,
          textureQuality: 0.7,
          animationComplexity: 0.7,
          lightingQuality: 0.7
        };
      case 'low':
        return {
          geometryDetail: 0.4,
          textureQuality: 0.4,
          animationComplexity: 0.4,
          lightingQuality: 0.4
        };
    }
  }, [performanceLevel]);

  // Optimized geometry based on LOD
  const geometrySegments = useMemo(() => {
    const baseSegments = 32;
    return Math.max(8, Math.floor(baseSegments * lodSettings.geometryDetail));
  }, [lodSettings.geometryDetail]);

  // Frame rate limiting for performance
  useFrame((state, delta) => {
    const currentTime = state.clock.elapsedTime;
    const targetFPS = performanceLevel === 'high' ? 60 : performanceLevel === 'medium' ? 30 : 15;
    const frameTime = 1 / targetFPS;
    
    if (currentTime - lastFrameTime < frameTime) {
      return;
    }
    setLastFrameTime(currentTime);

    if (!avatarRef.current || !headRef.current) return;

    // Simplified breathing animation
    if (lodSettings.animationComplexity > 0.5) {
      setBreathingPhase(prev => prev + delta * 2);
      if (bodyRef.current) {
        bodyRef.current.scale.y = 1 + Math.sin(breathingPhase) * 0.015 * lodSettings.animationComplexity;
      }
    }

    // Head movements based on personality (simplified for low performance)
    const intensity = persona.personality.gestureFrequency * lodSettings.animationComplexity;
    if (intensity > 0.3) {
      headRef.current.rotation.y = Math.sin(currentTime * 0.5) * 0.08 * intensity;
      headRef.current.rotation.x = Math.sin(currentTime * 0.3) * 0.04 * intensity;
    }

    // Optimized posture animation
    if (avatarRef.current && lodSettings.animationComplexity > 0.6) {
      switch (persona.personality.postureStyle) {
        case 'relaxed':
          avatarRef.current.rotation.z = Math.sin(currentTime * 0.2) * 0.015;
          break;
        case 'open':
          avatarRef.current.rotation.y = Math.sin(currentTime * 0.3) * 0.03;
          break;
      }
    }

    // Blinking with reduced frequency for performance
    setBlinkTimer(prev => prev + delta);
    const blinkInterval = performanceLevel === 'low' ? 5 : 3;
    if (blinkTimer > blinkInterval + Math.random() * 2) {
      setBlinkTimer(0);
      if (leftEyeRef.current && rightEyeRef.current && lodSettings.animationComplexity > 0.4) {
        leftEyeRef.current.scale.y = 0.1;
        rightEyeRef.current.scale.y = 0.1;
        setTimeout(() => {
          if (leftEyeRef.current && rightEyeRef.current) {
            leftEyeRef.current.scale.y = 1;
            rightEyeRef.current.scale.y = 1;
          }
        }, 120);
      }
    }

    // Speaking animation with performance optimization
    if (isSpeaking && mouthRef.current) {
      if (lipSyncData && lipSyncData.length > 0 && lodSettings.animationComplexity > 0.7) {
        // High quality lip sync
        const audioLevel = Array.from(lipSyncData).reduce((a, b) => a + b) / lipSyncData.length;
        const mouthScale = 1 + (audioLevel / 255) * 0.4;
        mouthRef.current.scale.y = mouthScale;
        mouthRef.current.scale.x = 1 + (audioLevel / 255) * 0.15;
      } else if (lodSettings.animationComplexity > 0.3) {
        // Simplified animation
        const speechPhase = currentTime * 6;
        const mouthScale = 1 + Math.sin(speechPhase) * 0.2;
        mouthRef.current.scale.y = mouthScale;
      }
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 1;
      mouthRef.current.scale.x = 1;
    }

    // Emotional responses (simplified for performance)
    if (userEmotion && lodSettings.animationComplexity > 0.5) {
      switch (userEmotion) {
        case 'sad':
          if (headRef.current) headRef.current.rotation.x = -0.1;
          break;
        case 'happy':
          if (headRef.current) headRef.current.rotation.y += Math.sin(currentTime * 1.2) * 0.02;
          break;
        case 'anxious':
          if (headRef.current) {
            headRef.current.rotation.x = 0.05;
            headRef.current.rotation.y = 0;
          }
          break;
      }
    }

    // Gesture animations (only for high performance)
    if (lodSettings.animationComplexity > 0.8) {
      setGestureTimer(prev => prev + delta);
      if (gestureTimer > 4 && persona.personality.gestureFrequency > 0.6) {
        setGestureTimer(0);
        // Subtle gesture animation could be added here
      }
    }
  });

  // Optimized hair geometry
  const createOptimizedHair = () => {
    const segments = Math.max(8, Math.floor(16 * lodSettings.geometryDetail));
    
    switch (persona.appearance.hairStyle) {
      case 'short':
        return <Sphere args={[1.05, segments, segments]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
        </Sphere>;
      case 'medium':
        return <Sphere args={[1.1, segments, segments]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
        </Sphere>;
      case 'long':
        return (
          <>
            <Sphere args={[1.1, segments, segments]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
            </Sphere>
            {lodSettings.geometryDetail > 0.5 && (
              <Cylinder args={[0.7, 0.9, 1.2]} position={[0, -0.4, -0.25]}>
                <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
              </Cylinder>
            )}
          </>
        );
      case 'curly':
        return (
          <>
            <Sphere args={[1.15, segments, segments]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
            </Sphere>
            {lodSettings.geometryDetail > 0.6 && (
              <>
                <Sphere args={[0.35, Math.max(6, segments/2), Math.max(6, segments/2)]} position={[-0.6, 0.15, 0.15]}>
                  <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
                </Sphere>
                <Sphere args={[0.35, Math.max(6, segments/2), Math.max(6, segments/2)]} position={[0.6, 0.15, 0.15]}>
                  <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
                </Sphere>
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  // Optimized face structure
  const createOptimizedFace = () => {
    const faceSegments = Math.max(12, Math.floor(geometrySegments * 0.8));
    const faceArgs: [number, number, number] = persona.appearance.faceStructure === 'round' 
      ? [0.95, faceSegments, faceSegments] 
      : persona.appearance.faceStructure === 'square'
      ? [0.85, faceSegments, Math.max(8, faceSegments * 0.7)]
      : [0.9, faceSegments, Math.max(10, faceSegments * 0.8)]; // oval

    return (
      <Sphere args={faceArgs} position={[0, 0, 0]}>
        <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
      </Sphere>
    );
  };

  // Optimized clothing
  const createOptimizedClothing = () => {
    const clothingColor = persona.appearance.colorPalette.clothing;
    const segments = Math.max(6, Math.floor(geometrySegments * 0.5));
    
    switch (persona.appearance.clothingStyle) {
      case 'professional':
        return (
          <>
            <Box args={[2, 1.4, 0.7]} position={[0, -1.4, 0]}>
              <meshStandardMaterial color={clothingColor} />
            </Box>
            {lodSettings.geometryDetail > 0.6 && (
              <Box args={[1.6, 0.25, 0.15]} position={[0, -0.4, 0.35]}>
                <meshStandardMaterial color="#FFFFFF" />
              </Box>
            )}
          </>
        );
      case 'casual':
        return (
          <Box args={[1.9, 1.5, 0.75]} position={[0, -1.4, 0]}>
            <meshStandardMaterial color={clothingColor} />
          </Box>
        );
      case 'warm':
        return (
          <>
            <Box args={[2, 1.5, 0.8]} position={[0, -1.4, 0]}>
              <meshStandardMaterial color={clothingColor} />
            </Box>
            {lodSettings.geometryDetail > 0.5 && (
              <Box args={[2.1, 0.08, 0.9]} position={[0, -1.1, 0]}>
                <meshStandardMaterial color={persona.appearance.colorPalette.accent} />
              </Box>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={avatarRef}>
      {/* Body with optimized detail */}
      <group ref={bodyRef}>
        {createOptimizedClothing()}
        
        {/* Arms - simplified for performance */}
        {lodSettings.geometryDetail > 0.4 && (
          <>
            <Cylinder args={[0.22, 0.22, 1.1]} position={[-1.1, -1.2, 0]} rotation={[0, 0, 0.25]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
            </Cylinder>
            <Cylinder args={[0.22, 0.22, 1.1]} position={[1.1, -1.2, 0]} rotation={[0, 0, -0.25]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
            </Cylinder>
          </>
        )}
      </group>

      {/* Head with optimized detail */}
      <group ref={headRef}>
        {createOptimizedFace()}
        
        {/* Hair */}
        {showDetails && createOptimizedHair()}
        
        {/* Eyes with performance optimization */}
        <Sphere ref={leftEyeRef} args={[0.1, Math.max(8, geometrySegments/3), Math.max(8, geometrySegments/3)]} position={[-0.22, 0.12, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        <Sphere ref={rightEyeRef} args={[0.1, Math.max(8, geometrySegments/3), Math.max(8, geometrySegments/3)]} position={[0.22, 0.12, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        
        {/* Nose - only show for medium/high detail */}
        {lodSettings.geometryDetail > 0.5 && (
          <Cone args={[0.04, 0.12]} position={[0, 0, 0.85]} rotation={[Math.PI, 0, 0]}>
            <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
          </Cone>
        )}
        
        {/* Mouth */}
        <Box ref={mouthRef} args={[0.2, 0.06, 0.06]} position={[0, -0.22, 0.8]}>
          <meshStandardMaterial color="#CD5C5C" />
        </Box>
      </group>
      
      {/* Listening indicator - simplified */}
      {isListening && lodSettings.animationComplexity > 0.3 && (
        <Sphere args={[1.4, Math.max(16, geometrySegments/2), Math.max(16, geometrySegments/2)]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.accent} 
            transparent 
            opacity={0.12} 
            wireframe 
          />
        </Sphere>
      )}

      {/* Speaking indicator - simplified */}
      {isSpeaking && lodSettings.animationComplexity > 0.3 && (
        <Sphere args={[1.2, Math.max(16, geometrySegments/2), Math.max(16, geometrySegments/2)]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#10B981" 
            transparent 
            opacity={0.15} 
            wireframe 
          />
        </Sphere>
      )}
    </group>
  );
};

export default OptimizedAvatar;