import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';

export interface TherapistAvatarPersona {
  therapistId: string;
  name: string;
  appearance: {
    faceStructure: 'oval' | 'round' | 'square';
    hairStyle: 'short' | 'medium' | 'long' | 'curly';
    clothingStyle: 'professional' | 'casual' | 'warm';
    colorPalette: {
      skin: string;
      hair: string;
      eyes: string;
      clothing: string;
      accent: string;
    };
  };
  personality: {
    gestureFrequency: number;
    facialExpressiveness: number;
    postureStyle: 'formal' | 'relaxed' | 'open';
    approachStyle: string;
  };
}

export const therapistPersonas: Record<string, TherapistAvatarPersona> = {
  'dr-sarah-chen': {
    therapistId: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen',
    appearance: {
      faceStructure: 'oval',
      hairStyle: 'short',
      clothingStyle: 'professional',
      colorPalette: {
        skin: '#D2B48C',
        hair: '#2F1B14',
        eyes: '#4A4A4A',
        clothing: '#1E40AF',
        accent: '#3B82F6'
      }
    },
    personality: {
      gestureFrequency: 0.6,
      facialExpressiveness: 0.7,
      postureStyle: 'formal',
      approachStyle: 'analytical'
    }
  },
  'dr-maya-patel': {
    therapistId: 'dr-maya-patel',
    name: 'Dr. Maya Patel',
    appearance: {
      faceStructure: 'round',
      hairStyle: 'long',
      clothingStyle: 'warm',
      colorPalette: {
        skin: '#C8860D',
        hair: '#1A1A1A',
        eyes: '#654321',
        clothing: '#059669',
        accent: '#10B981'
      }
    },
    personality: {
      gestureFrequency: 0.3,
      facialExpressiveness: 0.8,
      postureStyle: 'relaxed',
      approachStyle: 'mindful'
    }
  },
  'dr-alex-rodriguez': {
    therapistId: 'dr-alex-rodriguez',
    name: 'Dr. Alex Rodriguez',
    appearance: {
      faceStructure: 'square',
      hairStyle: 'medium',
      clothingStyle: 'casual',
      colorPalette: {
        skin: '#CD853F',
        hair: '#8B4513',
        eyes: '#2E7D32',
        clothing: '#F59E0B',
        accent: '#FBBF24'
      }
    },
    personality: {
      gestureFrequency: 0.9,
      facialExpressiveness: 0.9,
      postureStyle: 'open',
      approachStyle: 'energetic'
    }
  },
  'dr-jordan-kim': {
    therapistId: 'dr-jordan-kim',
    name: 'Dr. Jordan Kim',
    appearance: {
      faceStructure: 'oval',
      hairStyle: 'medium',
      clothingStyle: 'warm',
      colorPalette: {
        skin: '#F5DEB3',
        hair: '#2C1810',
        eyes: '#4A5568',
        clothing: '#7C3AED',
        accent: '#A78BFA'
      }
    },
    personality: {
      gestureFrequency: 0.4,
      facialExpressiveness: 0.6,
      postureStyle: 'open',
      approachStyle: 'gentle'
    }
  },
  'dr-taylor-morgan': {
    therapistId: 'dr-taylor-morgan',
    name: 'Dr. Taylor Morgan',
    appearance: {
      faceStructure: 'round',
      hairStyle: 'curly',
      clothingStyle: 'professional',
      colorPalette: {
        skin: '#DDBEA9',
        hair: '#A0522D',
        eyes: '#8B4513',
        clothing: '#DC2626',
        accent: '#F87171'
      }
    },
    personality: {
      gestureFrequency: 0.7,
      facialExpressiveness: 0.8,
      postureStyle: 'formal',
      approachStyle: 'empathetic'
    }
  },
  'dr-river-stone': {
    therapistId: 'dr-river-stone',
    name: 'Dr. River Stone',
    appearance: {
      faceStructure: 'oval',
      hairStyle: 'long',
      clothingStyle: 'warm',
      colorPalette: {
        skin: '#F2E6D3',
        hair: '#8B7355',
        eyes: '#2E7D32',
        clothing: '#0D9488',
        accent: '#14B8A6'
      }
    },
    personality: {
      gestureFrequency: 0.3,
      facialExpressiveness: 0.7,
      postureStyle: 'relaxed',
      approachStyle: 'holistic'
    }
  },
  'dr-michael-rivers': {
    therapistId: 'dr-michael-rivers',
    name: 'Dr. Michael Rivers',
    appearance: {
      faceStructure: 'square',
      hairStyle: 'short',
      clothingStyle: 'warm',
      colorPalette: {
        skin: '#E8C5A0',
        hair: '#4A4A4A',
        eyes: '#2D3748',
        clothing: '#059669',
        accent: '#10B981'
      }
    },
    personality: {
      gestureFrequency: 0.4,
      facialExpressiveness: 0.8,
      postureStyle: 'relaxed',
      approachStyle: 'mindful'
    }
  },
  'dr-emma-thompson': {
    therapistId: 'dr-emma-thompson',
    name: 'Dr. Emma Thompson',
    appearance: {
      faceStructure: 'round',
      hairStyle: 'curly',
      clothingStyle: 'warm',
      colorPalette: {
        skin: '#F5E6D3',
        hair: '#8B4513',
        eyes: '#8B4513',
        clothing: '#7C3AED',
        accent: '#A78BFA'
      }
    },
    personality: {
      gestureFrequency: 0.6,
      facialExpressiveness: 0.9,
      postureStyle: 'open',
      approachStyle: 'humanistic'
    }
  },
  'dr-james-rodriguez': {
    therapistId: 'dr-james-rodriguez',
    name: 'Dr. James Rodriguez',
    appearance: {
      faceStructure: 'square',
      hairStyle: 'short',
      clothingStyle: 'professional',
      colorPalette: {
        skin: '#D4A574',
        hair: '#2F1B14',
        eyes: '#2D3748',
        clothing: '#EA580C',
        accent: '#FB923C'
      }
    },
    personality: {
      gestureFrequency: 0.8,
      facialExpressiveness: 0.8,
      postureStyle: 'formal',
      approachStyle: 'dynamic'
    }
  },
  'dr-jordan-taylor': {
    therapistId: 'dr-jordan-taylor',
    name: 'Dr. Jordan Taylor',
    appearance: {
      faceStructure: 'oval',
      hairStyle: 'medium',
      clothingStyle: 'casual',
      colorPalette: {
        skin: '#F5DEB3',
        hair: '#8B4513',
        eyes: '#FF8C00',
        clothing: '#FF7F50',
        accent: '#FFB347'
      }
    },
    personality: {
      gestureFrequency: 0.9,
      facialExpressiveness: 0.8,
      postureStyle: 'open',
      approachStyle: 'energetic'
    }
  },
  'dr-riley-chen': {
    therapistId: 'dr-riley-chen',
    name: 'Dr. Riley Chen',
    appearance: {
      faceStructure: 'round',
      hairStyle: 'short',
      clothingStyle: 'warm',
      colorPalette: {
        skin: '#E8C5A0',
        hair: '#654321',
        eyes: '#4A90E2',
        clothing: '#E91E63',
        accent: '#FF69B4'
      }
    },
    personality: {
      gestureFrequency: 0.6,
      facialExpressiveness: 0.9,
      postureStyle: 'open',
      approachStyle: 'affirming'
    }
  },
  'dr-sam-morgan': {
    therapistId: 'dr-sam-morgan',
    name: 'Dr. Sam Morgan',
    appearance: {
      faceStructure: 'oval',
      hairStyle: 'medium',
      clothingStyle: 'professional',
      colorPalette: {
        skin: '#DDBEA9',
        hair: '#8B4513',
        eyes: '#2E8B57',
        clothing: '#DC143C',
        accent: '#FFB6C1'
      }
    },
    personality: {
      gestureFrequency: 0.5,
      facialExpressiveness: 0.7,
      postureStyle: 'formal',
      approachStyle: 'balanced'
    }
  }
};

interface PersonalizedAvatarProps {
  therapistId: string;
  isListening: boolean;
  isSpeaking: boolean;
  emotion: string;
  userEmotion?: string;
  lipSyncData?: Float32Array;
}

const PersonalizedAvatar: React.FC<PersonalizedAvatarProps> = ({ 
  therapistId, 
  isListening, 
  isSpeaking, 
  emotion, 
  userEmotion,
  lipSyncData 
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

  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  useFrame((state, delta) => {
    if (!avatarRef.current || !headRef.current) return;

    // Breathing animation - subtle chest movement
    setBreathingPhase(prev => prev + delta * 2);
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(breathingPhase) * 0.02;
    }

    // Head movements based on personality
    const intensity = persona.personality.gestureFrequency;
    headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 * intensity;
    headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05 * intensity;

    // Posture-based body positioning
    if (avatarRef.current) {
      switch (persona.personality.postureStyle) {
        case 'formal':
          avatarRef.current.rotation.z = 0;
          break;
        case 'relaxed':
          avatarRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
          break;
        case 'open':
          avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
          break;
      }
    }

    // Blinking animation
    setBlinkTimer(prev => prev + delta);
    if (blinkTimer > 2 + Math.random() * 3) {
      setBlinkTimer(0);
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = 0.1;
        rightEyeRef.current.scale.y = 0.1;
        setTimeout(() => {
          if (leftEyeRef.current && rightEyeRef.current) {
            leftEyeRef.current.scale.y = 1;
            rightEyeRef.current.scale.y = 1;
          }
        }, 150);
      }
    }

    // Speaking animation with lip sync
    if (isSpeaking && mouthRef.current) {
      if (lipSyncData && lipSyncData.length > 0) {
        // Use actual audio data for lip sync
        const audioLevel = Array.from(lipSyncData).reduce((a, b) => a + b) / lipSyncData.length;
        const mouthScale = 1 + (audioLevel / 255) * 0.5;
        mouthRef.current.scale.y = mouthScale;
        mouthRef.current.scale.x = 1 + (audioLevel / 255) * 0.2;
      } else {
        // Fallback animation
        const speechPhase = state.clock.elapsedTime * 8;
        const mouthScale = 1 + Math.sin(speechPhase) * 0.3;
        mouthRef.current.scale.y = mouthScale;
      }
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 1;
      mouthRef.current.scale.x = 1;
    }

    // Emotional responses to user
    if (userEmotion === 'sad' && headRef.current) {
      headRef.current.rotation.x = -0.15; // Lean forward with concern
    } else if (userEmotion === 'happy' && headRef.current) {
      headRef.current.rotation.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.03; // Gentle nod
    } else if (userEmotion === 'anxious' && headRef.current) {
      // Calming, steady presence
      headRef.current.rotation.x = 0.05;
      headRef.current.rotation.y = 0;
    }

    // Gesture animations based on personality
    setGestureTimer(prev => prev + delta);
    if (gestureTimer > 3 && persona.personality.gestureFrequency > 0.5) {
      setGestureTimer(0);
      // Subtle hand/arm gestures could be added here
    }
  });

  const createHairGeometry = () => {
    switch (persona.appearance.hairStyle) {
      case 'short':
        return <Sphere args={[1.1, 16, 16]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
        </Sphere>;
      case 'medium':
        return <Sphere args={[1.15, 16, 16]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
        </Sphere>;
      case 'long':
        return (
          <>
            <Sphere args={[1.15, 16, 16]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
            </Sphere>
            <Cylinder args={[0.8, 1.0, 1.5]} position={[0, -0.5, -0.3]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
            </Cylinder>
          </>
        );
      case 'curly':
        return (
          <>
            <Sphere args={[1.2, 16, 16]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
            </Sphere>
            <Sphere args={[0.4, 8, 8]} position={[-0.7, 0.2, 0.2]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
            </Sphere>
            <Sphere args={[0.4, 8, 8]} position={[0.7, 0.2, 0.2]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
            </Sphere>
          </>
        );
      default:
        return null;
    }
  };

  const createFaceStructure = () => {
    const faceArgs: [number, number, number] = persona.appearance.faceStructure === 'round' 
      ? [1, 32, 32] 
      : persona.appearance.faceStructure === 'square'
      ? [0.9, 32, 32]
      : [1, 32, 24]; // oval

    return (
      <Sphere args={faceArgs} position={[0, 0, 0]}>
        <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
      </Sphere>
    );
  };

  const createClothing = () => {
    const clothingColor = persona.appearance.colorPalette.clothing;
    
    switch (persona.appearance.clothingStyle) {
      case 'professional':
        return (
          <>
            {/* Suit jacket */}
            <Box args={[2.2, 1.5, 0.8]} position={[0, -1.5, 0]}>
              <meshStandardMaterial color={clothingColor} />
            </Box>
            {/* Collar */}
            <Box args={[1.8, 0.3, 0.2]} position={[0, -0.5, 0.4]}>
              <meshStandardMaterial color="#FFFFFF" />
            </Box>
          </>
        );
      case 'casual':
        return (
          <Box args={[2, 1.6, 0.8]} position={[0, -1.5, 0]}>
            <meshStandardMaterial color={clothingColor} />
          </Box>
        );
      case 'warm':
        return (
          <>
            {/* Sweater */}
            <Box args={[2.1, 1.6, 0.9]} position={[0, -1.5, 0]}>
              <meshStandardMaterial color={clothingColor} />
            </Box>
            {/* Texture lines */}
            <Box args={[2.2, 0.1, 1]} position={[0, -1.2, 0]}>
              <meshStandardMaterial color={persona.appearance.colorPalette.accent} />
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={avatarRef}>
      {/* Body */}
      <group ref={bodyRef}>
        {createClothing()}
        
        {/* Arms */}
        <Cylinder args={[0.25, 0.25, 1.2]} position={[-1.2, -1.3, 0]} rotation={[0, 0, 0.3]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Cylinder>
        <Cylinder args={[0.25, 0.25, 1.2]} position={[1.2, -1.3, 0]} rotation={[0, 0, -0.3]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Cylinder>
      </group>

      {/* Head */}
      <group ref={headRef}>
        {createFaceStructure()}
        
        {/* Hair */}
        {createHairGeometry()}
        
        {/* Eyes */}
        <Sphere ref={leftEyeRef} args={[0.12, 16, 16]} position={[-0.25, 0.15, 0.85]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        <Sphere ref={rightEyeRef} args={[0.12, 16, 16]} position={[0.25, 0.15, 0.85]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        
        {/* Nose */}
        <Cone args={[0.05, 0.15]} position={[0, 0, 0.9]} rotation={[Math.PI, 0, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Cone>
        
        {/* Mouth */}
        <Box ref={mouthRef} args={[0.25, 0.08, 0.08]} position={[0, -0.25, 0.85]}>
          <meshStandardMaterial color="#CD5C5C" />
        </Box>
      </group>
      
      {/* Listening indicator */}
      {isListening && (
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.accent} 
            transparent 
            opacity={0.15} 
            wireframe 
          />
        </Sphere>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <Sphere args={[1.3, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#10B981" 
            transparent 
            opacity={0.2} 
            wireframe 
          />
        </Sphere>
      )}
    </group>
  );
};

export default PersonalizedAvatar;