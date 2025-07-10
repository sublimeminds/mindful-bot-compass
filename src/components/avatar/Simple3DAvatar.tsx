import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { therapistPersonas } from './TherapistAvatarPersonas';

interface Simple3DAvatarProps {
  therapistId: string;
  emotion: string;
  isListening: boolean;
  isSpeaking: boolean;
}

const Simple3DAvatar: React.FC<Simple3DAvatarProps> = ({ 
  therapistId, 
  emotion, 
  isListening, 
  isSpeaking 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  console.log('🎭 Simple3DAvatar: Rendering for therapist:', therapistId);
  console.log('🎭 Simple3DAvatar: Emotion:', emotion, 'Listening:', isListening, 'Speaking:', isSpeaking);

  // Get persona data
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];
  console.log('🎭 Simple3DAvatar: Using persona:', persona.name);
  console.log('🎭 Simple3DAvatar: Color palette:', persona.appearance?.colorPalette);

  // Extract colors with fallbacks
  const skinColor = persona.appearance?.colorPalette?.skin || '#f4c2a1';
  const eyeColor = persona.appearance?.colorPalette?.eyes || '#4a5568';
  const hairColor = persona.appearance?.colorPalette?.hair || '#2d3748';

  console.log('🎭 Simple3DAvatar: Applied colors - Skin:', skinColor, 'Eyes:', eyeColor, 'Hair:', hairColor);

  // Animation logic
  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle idle breathing animation
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.02;
    
    // Head movement based on emotion and state
    if (isListening) {
      // Subtle listening nod
      headRef.current.rotation.x = Math.sin(time * 2) * 0.05;
    } else if (isSpeaking) {
      // Speaking animation - slight head movement
      headRef.current.rotation.y = Math.sin(time * 3) * 0.03;
      headRef.current.rotation.x = Math.sin(time * 2.5) * 0.02;
    } else {
      // Neutral gentle movement
      headRef.current.rotation.y = Math.sin(time * 0.8) * 0.02;
      headRef.current.rotation.x = Math.sin(time * 0.6) * 0.01;
    }

    // Eye blink animation
    const blinkTime = Math.sin(time * 0.5);
    if (blinkTime > 0.95) {
      if (leftEyeRef.current) leftEyeRef.current.scale.y = 0.1;
      if (rightEyeRef.current) rightEyeRef.current.scale.y = 0.1;
    } else {
      if (leftEyeRef.current) leftEyeRef.current.scale.y = 1;
      if (rightEyeRef.current) rightEyeRef.current.scale.y = 1;
    }
  });

  useEffect(() => {
    console.log('🎭 Simple3DAvatar: Component mounted successfully');
    
    return () => {
      console.log('🎭 Simple3DAvatar: Component unmounting');
    };
  }, []);

  try {
    console.log('🎭 Simple3DAvatar: Creating 3D model...');

    return (
      <group ref={groupRef} position={[0, -0.5, 0]}>
        {/* Head */}
        <group ref={headRef}>
          {/* Face */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshLambertMaterial color={skinColor} />
          </mesh>
          
          {/* Eyes */}
          <mesh ref={leftEyeRef} position={[-0.15, 1.25, 0.25]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshLambertMaterial color={eyeColor} />
          </mesh>
          <mesh ref={rightEyeRef} position={[0.15, 1.25, 0.25]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshLambertMaterial color={eyeColor} />
          </mesh>

          {/* Hair */}
          <mesh position={[0, 1.4, -0.1]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
        </group>

        {/* Body */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 0.8, 32]} />
          <meshLambertMaterial color="#4a5568" />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.4, 0.6, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshLambertMaterial color={skinColor} />
        </mesh>
        <mesh position={[0.4, 0.6, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshLambertMaterial color={skinColor} />
        </mesh>

        {/* Status indicators */}
        {isListening && (
          <mesh position={[0.6, 1.2, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshLambertMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
          </mesh>
        )}
        
        {isSpeaking && (
          <mesh position={[-0.6, 1.2, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshLambertMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
          </mesh>
        )}
      </group>
    );
  } catch (error) {
    console.error('🔥 Simple3DAvatar: Error creating 3D model:', error);
    throw error; // Re-throw to trigger error boundary
  }
};

export default Simple3DAvatar;