import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { supabase } from '@/integrations/supabase/client';
import { AvatarPersonalityService, TherapistPersonality } from '@/services/avatarPersonalityService';

interface EmotionState {
  name: string;
  intensity: number;
  confidence: number;
}

interface FacialExpression {
  eyebrowRaise: number;
  eyeSquint: number;
  eyeLidLower: number;
  mouthSmile: number;
  mouthFrown: number;
  mouthPucker: number;
  jawOpen: number;
  cheekPuff: number;
}

interface RealisticHuman3DAvatarProps {
  therapistId: string;
  isActive?: boolean;
  emotion?: EmotionState;
  isSpeaking?: boolean;
  isListening?: boolean;
  onEmotionChange?: (emotion: string) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

// Professional therapist avatars with realistic features
const THERAPIST_AVATARS = {
  'dr-sarah-chen': {
    color: '#FFB6C1',
    ethnicity: 'asian',
    gender: 'female',
    age: 35,
    features: { eyeSize: 1.1, noseSize: 0.9, mouthSize: 1.0 }
  },
  'dr-maya-patel': {
    color: '#DEB887',
    ethnicity: 'south-asian',
    gender: 'female',
    age: 42,
    features: { eyeSize: 1.0, noseSize: 1.0, mouthSize: 0.95 }
  },
  'dr-alex-rodriguez': {
    color: '#CD853F',
    ethnicity: 'hispanic',
    gender: 'male',
    age: 38,
    features: { eyeSize: 0.95, noseSize: 1.1, mouthSize: 1.05 }
  },
  'dr-jordan-kim': {
    color: '#F5DEB3',
    ethnicity: 'korean',
    gender: 'non-binary',
    age: 40,
    features: { eyeSize: 1.05, noseSize: 0.95, mouthSize: 1.0 }
  },
  'dr-taylor-morgan': {
    color: '#E6C2A6',
    ethnicity: 'mixed',
    gender: 'non-binary',
    age: 33,
    features: { eyeSize: 1.0, noseSize: 1.0, mouthSize: 1.0 }
  },
  'dr-river-stone': {
    color: '#D2B48C',
    ethnicity: 'native-american',
    gender: 'non-binary',
    age: 45,
    features: { eyeSize: 1.0, noseSize: 1.05, mouthSize: 1.0 }
  }
};

const RealisticHumanModel = ({ 
  avatarConfig, 
  emotion, 
  isSpeaking, 
  isListening, 
  personality 
}: { 
  avatarConfig: any;
  emotion: EmotionState;
  isSpeaking: boolean;
  isListening: boolean;
  personality: TherapistPersonality | null;
}) => {
  const headRef = useRef<THREE.Group>();
  const eyesRef = useRef<THREE.Group>();
  const mouthRef = useRef<THREE.Mesh>();
  
  const [facialExpression, setFacialExpression] = useState<FacialExpression>({
    eyebrowRaise: 0,
    eyeSquint: 0,
    eyeLidLower: 0,
    mouthSmile: 0,
    mouthFrown: 0,
    mouthPucker: 0,
    jawOpen: 0,
    cheekPuff: 0
  });

  const [blinkTimer, setBlinkTimer] = useState(0);
  const [lastBlink, setLastBlink] = useState(0);

  // Map emotions to realistic facial expressions
  const mapEmotionToExpression = useCallback((emotion: EmotionState): FacialExpression => {
    const intensity = emotion.intensity * emotion.confidence;
    
    const expressions: Record<string, FacialExpression> = {
      'joy': {
        eyebrowRaise: 0.2 * intensity,
        eyeSquint: 0.3 * intensity,
        eyeLidLower: 0,
        mouthSmile: 0.8 * intensity,
        mouthFrown: 0,
        mouthPucker: 0,
        jawOpen: 0.1 * intensity,
        cheekPuff: 0.2 * intensity
      },
      'sadness': {
        eyebrowRaise: 0,
        eyeSquint: 0,
        eyeLidLower: 0.4 * intensity,
        mouthSmile: 0,
        mouthFrown: 0.7 * intensity,
        mouthPucker: 0,
        jawOpen: 0,
        cheekPuff: 0
      },
      'anger': {
        eyebrowRaise: 0,
        eyeSquint: 0.6 * intensity,
        eyeLidLower: 0.3 * intensity,
        mouthSmile: 0,
        mouthFrown: 0.5 * intensity,
        mouthPucker: 0,
        jawOpen: 0,
        cheekPuff: 0
      },
      'fear': {
        eyebrowRaise: 0.8 * intensity,
        eyeSquint: 0,
        eyeLidLower: 0,
        mouthSmile: 0,
        mouthFrown: 0.3 * intensity,
        mouthPucker: 0,
        jawOpen: 0.2 * intensity,
        cheekPuff: 0
      },
      'surprise': {
        eyebrowRaise: 0.9 * intensity,
        eyeSquint: 0,
        eyeLidLower: 0,
        mouthSmile: 0,
        mouthFrown: 0,
        mouthPucker: 0,
        jawOpen: 0.5 * intensity,
        cheekPuff: 0
      },
      'neutral': {
        eyebrowRaise: 0,
        eyeSquint: 0,
        eyeLidLower: 0,
        mouthSmile: 0.1,
        mouthFrown: 0,
        mouthPucker: 0,
        jawOpen: 0,
        cheekPuff: 0
      }
    };

    return expressions[emotion.name.toLowerCase()] || expressions['neutral'];
  }, []);

  // Animation frame for realistic movements
  useFrame((state, delta) => {
    if (!headRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Natural breathing animation
    const breathingIntensity = 0.008 + (personality?.coreTraits.energy || 0.5) * 0.004;
    headRef.current.scale.y = 1 + Math.sin(time * 1.2) * breathingIntensity;
    
    // Subtle idle movements based on personality
    if (!isSpeaking && !isListening) {
      const energyLevel = personality?.coreTraits.energy || 0.5;
      
      // Head movement
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.02 * energyLevel;
      headRef.current.position.x = Math.sin(time * 0.4) * 0.003 * energyLevel;
      
      // Shoulder movement
      headRef.current.position.z = Math.sin(time * 0.2) * 0.002;
    }

    // Listening pose - lean forward with attention
    if (isListening) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -0.05, delta * 2);
      headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, 0.02, delta * 2);
    } else {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, delta * 2);
      headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, 0, delta * 2);
    }

    // Speaking animation with lip sync
    if (isSpeaking) {
      const speakingIntensity = 0.5 + Math.sin(time * 8) * 0.3;
      headRef.current.rotation.y = Math.sin(time * 1.5) * 0.008 * speakingIntensity;
    }

    // Blinking animation
    setBlinkTimer(prev => prev + delta);
    if (blinkTimer - lastBlink > (2 + Math.random() * 3)) {
      // Trigger blink
      setLastBlink(blinkTimer);
      setFacialExpression(prev => ({
        ...prev,
        eyeLidLower: 1
      }));
      
      // Reset blink after 100ms
      setTimeout(() => {
        setFacialExpression(prev => ({
          ...prev,
          eyeLidLower: mapEmotionToExpression(emotion).eyeLidLower
        }));
      }, 100);
    }

    // Update facial expressions
    if (eyesRef.current) {
      const currentExpression = mapEmotionToExpression(emotion);
      eyesRef.current.scale.y = 1 - currentExpression.eyeLidLower;
      eyesRef.current.scale.x = 1 + currentExpression.eyeSquint * 0.5;
    }

    if (mouthRef.current) {
      const currentExpression = mapEmotionToExpression(emotion);
      mouthRef.current.scale.x = 1 + currentExpression.mouthSmile;
      mouthRef.current.rotation.z = currentExpression.mouthFrown * 0.2;
      if (isSpeaking) {
        mouthRef.current.scale.y = 1 + Math.sin(time * 8) * 0.3;
      }
    }
  });

  // Update facial expression when emotion changes
  useEffect(() => {
    const newExpression = mapEmotionToExpression(emotion);
    setFacialExpression(newExpression);
  }, [emotion, mapEmotionToExpression]);

  return (
    <group ref={headRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={avatarConfig.color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Eyes */}
      <group ref={eyesRef} position={[0, 0.1, 0.5]}>
        <mesh position={[-0.25, 0, 0]}>
          <sphereGeometry args={[0.12 * avatarConfig.features.eyeSize, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <sphereGeometry args={[0.12 * avatarConfig.features.eyeSize, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.25, 0, 0.1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.25, 0, 0.1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Nose */}
      <mesh position={[0, -0.1, 0.6]}>
        <coneGeometry args={[0.08 * avatarConfig.features.noseSize, 0.2, 8]} />
        <meshStandardMaterial 
          color={avatarConfig.color}
          roughness={0.9}
        />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.5]}>
        <sphereGeometry args={[0.15 * avatarConfig.features.mouthSize, 16, 8]} />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={0.6}
        />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.25, 0.25, 0.5]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[0.25, 0.25, 0.5]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial 
          color="#4A4A4A"
          roughness={0.9}
        />
      </mesh>

      {/* Body/Shoulders */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 2, 16]} />
        <meshStandardMaterial 
          color="#2C5F99"
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

const RealisticHuman3DAvatar: React.FC<RealisticHuman3DAvatarProps> = ({
  therapistId,
  isActive = false,
  emotion = { name: 'neutral', intensity: 0.5, confidence: 1 },
  isSpeaking = false,
  isListening = false,
  onEmotionChange,
  className = '',
  size = 'medium'
}) => {
  const [avatarConfig, setAvatarConfig] = useState<any>(null);
  const [personality, setPersonality] = useState<TherapistPersonality | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const sizeConfig = {
    small: { width: '12rem', height: '12rem', cameraDistance: 6 },
    medium: { width: '16rem', height: '16rem', cameraDistance: 5 },
    large: { width: '24rem', height: '24rem', cameraDistance: 4 }
  };

  const currentSize = sizeConfig[size];

  // Load therapist avatar configuration
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        setIsLoading(true);
        
        // Get avatar configuration
        const config = THERAPIST_AVATARS[therapistId as keyof typeof THERAPIST_AVATARS];
        if (!config) {
          throw new Error(`No avatar configuration found for therapist: ${therapistId}`);
        }

        // Get personality data
        const personalityData = AvatarPersonalityService.getPersonality(therapistId);
        
        setAvatarConfig(config);
        setPersonality(personalityData);
        
      } catch (err) {
        console.error('Failed to load avatar:', err);
        setError(err instanceof Error ? err.message : 'Failed to load avatar');
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatar();
  }, [therapistId]);

  // Handle emotion changes
  useEffect(() => {
    if (onEmotionChange) {
      onEmotionChange(emotion.name);
    }
  }, [emotion, onEmotionChange]);

  if (isLoading) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-xl`}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-2"></div>
          <p className="text-therapy-600 text-sm font-medium">Loading Avatar...</p>
        </div>
      </div>
    );
  }

  if (error || !avatarConfig) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-therapy-100 rounded-xl border-2 border-therapy-200`}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <div className="text-center text-therapy-600">
          <div className="w-12 h-12 bg-therapy-300 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-therapy-700 font-bold text-lg">
              {therapistId.split('-').map(word => word[0]?.toUpperCase()).join('')}
            </span>
          </div>
          <p className="text-xs">{error || 'Avatar unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${className} relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-xl overflow-hidden shadow-lg`}
      style={{ width: currentSize.width, height: currentSize.height }}
    >
      <Canvas shadows>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, currentSize.cameraDistance]} 
          fov={45}
        />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={false}
          target={[0, 0, 0]}
        />
        
        {/* Advanced lighting for realistic rendering */}
        <ambientLight intensity={0.4} color="#f0f4f8" />
        <directionalLight 
          position={[5, 5, 2]} 
          intensity={1.0} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-3, 2, 1]} intensity={0.3} color="#f8fafc" />
        <spotLight 
          position={[0, 3, 3]} 
          angle={0.3} 
          penumbra={0.5} 
          intensity={0.2}
        />
        
        {/* The realistic human avatar */}
        <RealisticHumanModel 
          avatarConfig={avatarConfig}
          emotion={emotion}
          isSpeaking={isSpeaking}
          isListening={isListening}
          personality={personality}
        />
        
        {/* Floor for shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.1} />
        </mesh>
      </Canvas>

      {/* Status indicators */}
      <div className="absolute top-3 right-3 space-y-1">
        {isSpeaking && (
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center shadow-md">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
            Speaking
          </div>
        )}
        {isListening && (
          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center shadow-md">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
            Listening
          </div>
        )}
      </div>

      {/* Emotion display */}
      <div className="absolute bottom-3 left-3">
        <div className="bg-white rounded-lg px-2 py-1 text-xs shadow-md border">
          <div className="font-medium text-therapy-700 capitalize">{emotion.name}</div>
          <div className="text-therapy-600">
            {Math.round(emotion.intensity * 100)}% • {Math.round(emotion.confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Personality indicator */}
      {personality && (
        <div className="absolute top-3 left-3">
          <div className="bg-white rounded-lg px-2 py-1 text-xs shadow-md border">
            <div className="font-medium text-therapy-700">{personality.communicationStyle.tone}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealisticHuman3DAvatar;