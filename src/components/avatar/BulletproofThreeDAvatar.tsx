import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { therapistPersonas, TherapistAvatarPersona } from './TherapistAvatarPersonas';
import Professional2DAvatar from './Professional2DAvatar';
import { useAvatarManager } from './OptimizedAvatarManager';

interface BulletproofThreeDAvatarProps {
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
  onError?: () => void;
}

interface AdvancedAvatarMeshProps {
  persona: TherapistAvatarPersona;
  emotion: string;
  isListening: boolean;
  isSpeaking: boolean;
  userEmotion?: string;
  lipSyncData?: Float32Array;
}

const AdvancedAvatarMesh: React.FC<AdvancedAvatarMeshProps> = ({
  persona,
  emotion,
  isListening,
  isSpeaking,
  userEmotion,
  lipSyncData
}) => {
  const avatarGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const [animationState, setAnimationState] = useState({
    blinkTimer: Math.random() * 5,
    gesturePhase: 0,
    breathingPhase: 0,
    emotionTransition: 0,
    lastBlink: 0,
    lipSyncIntensity: 0
  });

  // Advanced animation frame with emotion-responsive behaviors
  useFrame((state, delta) => {
    if (!avatarGroupRef.current || !persona) return;

    try {
      const time = state.clock.getElapsedTime();
      
      // Natural floating motion based on personality
      const floatIntensity = persona.personality.gestureFrequency * 0.02;
      avatarGroupRef.current.position.y = Math.sin(time * 0.8) * floatIntensity;
      
      // Advanced breathing animation
      const breathingRate = isSpeaking ? 1.8 : isListening ? 1.4 : 1.2;
      const breathScale = 1 + Math.sin(time * breathingRate) * 0.012;
      if (bodyRef.current) {
        bodyRef.current.scale.y = breathScale;
        bodyRef.current.scale.x = 1 + Math.sin(time * breathingRate * 0.5) * 0.004;
      }

      // Realistic blinking system
      setAnimationState(prev => {
        const newBlinkTimer = prev.blinkTimer + delta;
        let newLastBlink = prev.lastBlink;
        
        // Trigger blink based on natural intervals and emotion
        const blinkInterval = emotion === 'concerned' ? 1.5 : 3.5;
        if (newBlinkTimer > blinkInterval + Math.random() * 2) {
          newLastBlink = time;
          return { ...prev, blinkTimer: 0, lastBlink: newLastBlink };
        }
        
        return { ...prev, blinkTimer: newBlinkTimer };
      });

      // Execute blink animation
      const blinkProgress = Math.max(0, 1 - Math.abs(time - animationState.lastBlink) / 0.12);
      const blinkScale = 1 - blinkProgress * 0.85;
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = blinkScale;
        rightEyeRef.current.scale.y = blinkScale;
      }

      // Advanced lip-sync animation
      if (isSpeaking && mouthRef.current) {
        let currentLipSync = 0.3;
        
        if (lipSyncData && lipSyncData.length > 0) {
          // Use actual audio data for lip sync
          const sampleIndex = Math.floor((time * 22050) % lipSyncData.length);
          const amplitude = Math.abs(lipSyncData[sampleIndex]);
          currentLipSync = Math.min(amplitude * 3, 1.0);
        } else {
          // Procedural lip sync with natural variation
          const baseFreq = 12 + Math.sin(time * 0.7) * 3;
          const variation = Math.sin(time * 25) * 0.4;
          currentLipSync = (Math.sin(time * baseFreq) + variation) * 0.25 + 0.15;
        }
        
        mouthRef.current.scale.y = 0.4 + Math.max(0, currentLipSync);
        mouthRef.current.scale.x = 1 + currentLipSync * 0.2;
        mouthRef.current.position.z = 0.85 + currentLipSync * 0.05;
      } else if (mouthRef.current) {
        // Subtle mouth movement when not speaking
        mouthRef.current.scale.y = 0.4 + Math.sin(time * 0.3) * 0.02;
        mouthRef.current.scale.x = 1;
        mouthRef.current.position.z = 0.85;
      }

      // Emotion-responsive expressions
      const emotionIntensity = getEmotionIntensity(emotion, userEmotion);
      setAnimationState(prev => ({
        ...prev,
        emotionTransition: THREE.MathUtils.lerp(prev.emotionTransition, emotionIntensity, delta * 2.5)
      }));

      // Apply emotion to facial features
      if (headGroupRef.current) {
        // Subtle head tilt based on emotion
        const emotionTilt = animationState.emotionTransition * 0.08;
        headGroupRef.current.rotation.z = Math.sin(time * 0.4) * 0.02 + emotionTilt;
      }

      // Eye position adjustments for emotion
      if (leftEyeRef.current && rightEyeRef.current) {
        const eyeShift = animationState.emotionTransition * 0.05;
        leftEyeRef.current.position.y = 0.35 + eyeShift;
        rightEyeRef.current.position.y = 0.35 + eyeShift;
        
        // Eye contact simulation with subtle tracking
        const eyeTracking = Math.sin(time * 0.25) * 0.015;
        leftEyeRef.current.position.x = -0.28 + eyeTracking;
        rightEyeRef.current.position.x = 0.28 + eyeTracking;
      }

      // Gesture animations based on personality and context
      setAnimationState(prev => ({
        ...prev,
        gesturePhase: prev.gesturePhase + delta * persona.personality.gestureFrequency * 0.8
      }));

      if (leftArmRef.current && rightArmRef.current) {
        const gestureIntensity = isSpeaking ? 0.25 : isListening ? 0.15 : 0.08;
        
        // Natural arm movement with personality variation
        leftArmRef.current.rotation.x = Math.sin(animationState.gesturePhase * 0.7) * gestureIntensity;
        rightArmRef.current.rotation.x = Math.sin(animationState.gesturePhase * 0.9) * gestureIntensity;
        
        // Slight forward lean when listening
        if (isListening && headGroupRef.current) {
          headGroupRef.current.rotation.x = Math.sin(time * 0.6) * 0.03 + 0.08;
        } else if (headGroupRef.current) {
          headGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.015;
        }
      }

    } catch (error) {
      console.warn('3D Avatar animation error:', error);
    }
  });

  const getEmotionIntensity = (currentEmotion: string, detectedEmotion?: string): number => {
    // Combine therapist emotion with detected user emotion for responsive behavior
    let baseIntensity = 0;
    
    switch (currentEmotion) {
      case 'happy': 
      case 'encouraging': 
        baseIntensity = 0.8;
        break;
      case 'concerned': 
        baseIntensity = -0.4;
        break;
      case 'thoughtful': 
        baseIntensity = 0.2;
        break;
      default: 
        baseIntensity = 0;
    }

    // Adjust based on detected user emotion
    if (detectedEmotion) {
      switch (detectedEmotion) {
        case 'sad':
        case 'angry':
          baseIntensity = Math.max(baseIntensity - 0.3, -0.6); // More concerned
          break;
        case 'happy':
        case 'joy':
          baseIntensity = Math.min(baseIntensity + 0.2, 1.0); // More encouraging
          break;
      }
    }

    return baseIntensity;
  };

  const createAdvancedHead = () => (
    <group ref={headGroupRef}>
      {/* Face base with proper proportions */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={persona.appearance.colorPalette.skin}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Advanced eye system */}
      <group>
        {/* Left eye socket and components */}
        <mesh position={[-0.28, 0.35, 0.75]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.28, 0.35, 0.78]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </mesh>
        <mesh position={[-0.28, 0.35, 0.82]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.28, 0.38, 0.83]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
        </mesh>

        {/* Right eye socket and components */}
        <mesh position={[0.28, 0.35, 0.75]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.28, 0.35, 0.78]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </mesh>
        <mesh position={[0.28, 0.35, 0.82]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.28, 0.38, 0.83]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      {/* Nose with proper shading */}
      <mesh position={[0, 0.1, 0.85]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.25, 8]} />
        <meshStandardMaterial 
          color={persona.appearance.colorPalette.skin}
          roughness={0.8}
        />
      </mesh>
      
      {/* Advanced mouth system */}
      <group ref={mouthRef} position={[0, -0.25, 0.85]}>
        <mesh>
          <boxGeometry args={[0.25, 0.08, 0.08]} />
          <meshStandardMaterial color="#CC6666" roughness={0.6} />
        </mesh>
        {/* Lip details */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.23, 0.02, 0.06]} />
          <meshStandardMaterial color="#DD7777" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Hair system */}
      {createAdvancedHair()}
    </group>
  );

  const createAdvancedHair = () => {
    const hairColor = persona.appearance.colorPalette.hair;
    
    switch (persona.appearance.hairStyle) {
      case 'short':
        return (
          <group>
            <mesh position={[0, 0.45, -0.15]}>
              <sphereGeometry args={[1.05, 24, 24]} />
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </mesh>
          </group>
        );
      case 'medium':
        return (
          <group>
            <mesh position={[0, 0.35, -0.15]}>
              <sphereGeometry args={[1.08, 24, 24]} />
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </mesh>
            <mesh position={[0, -0.15, -0.45]}>
              <boxGeometry args={[1.6, 0.4, 0.7]} />
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </mesh>
          </group>
        );
      case 'long':
        return (
          <group>
            <mesh position={[0, 0.35, -0.15]}>
              <sphereGeometry args={[1.08, 24, 24]} />
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </mesh>
            <mesh position={[0, -0.7, -0.35]} rotation={[0.1, 0, 0]}>
              <cylinderGeometry args={[0.7, 0.9, 1.8]} />
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </mesh>
          </group>
        );
      case 'curly':
        return (
          <group>
            <mesh position={[0, 0.45, -0.08]}>
              <sphereGeometry args={[1.12, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.98} />
            </mesh>
            {/* Curly volume details */}
            <mesh position={[-0.6, 0.35, 0.25]}>
              <sphereGeometry args={[0.28, 12, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.98} />
            </mesh>
            <mesh position={[0.6, 0.35, 0.25]}>
              <sphereGeometry args={[0.28, 12, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.98} />
            </mesh>
            <mesh position={[0, 0.75, 0.15]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.98} />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  const createProfessionalClothing = () => {
    const clothingColor = persona.appearance.colorPalette.clothing;
    const accentColor = persona.appearance.colorPalette.accent;
    
    switch (persona.appearance.clothingStyle) {
      case 'professional':
        return (
          <group>
            {/* Blazer */}
            <mesh position={[0, -1.4, 0]}>
              <boxGeometry args={[2.1, 1.5, 0.85]} />
              <meshStandardMaterial color={clothingColor} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Shirt */}
            <mesh position={[0, -0.35, 0.42]}>
              <boxGeometry args={[1.7, 0.35, 0.25]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            {/* Tie */}
            <mesh position={[0, -0.9, 0.48]}>
              <boxGeometry args={[0.25, 0.9, 0.04]} />
              <meshStandardMaterial color={accentColor} roughness={0.6} />
            </mesh>
            {/* Collar details */}
            <mesh position={[-0.35, -0.25, 0.48]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[0.7, 0.15, 0.08]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            <mesh position={[0.35, -0.25, 0.48]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[0.7, 0.15, 0.08]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
          </group>
        );
      case 'casual':
        return (
          <group>
            <mesh position={[0, -1.4, 0]}>
              <boxGeometry args={[1.9, 1.5, 0.75]} />
              <meshStandardMaterial color={clothingColor} roughness={0.8} />
            </mesh>
            {/* Casual logo/design */}
            <mesh position={[0, -0.9, 0.38]}>
              <boxGeometry args={[0.4, 0.4, 0.04]} />
              <meshStandardMaterial color={accentColor} roughness={0.7} />
            </mesh>
          </group>
        );
      case 'warm':
        return (
          <group>
            {/* Sweater */}
            <mesh position={[0, -1.4, 0]}>
              <boxGeometry args={[2.0, 1.5, 0.9]} />
              <meshStandardMaterial color={clothingColor} roughness={0.95} />
            </mesh>
            {/* Knit texture lines */}
            <mesh position={[0, -1.1, 0]}>
              <boxGeometry args={[2.1, 0.08, 0.95]} />
              <meshStandardMaterial color={accentColor} roughness={0.95} />
            </mesh>
            <mesh position={[0, -1.5, 0]}>
              <boxGeometry args={[2.1, 0.08, 0.95]} />
              <meshStandardMaterial color={accentColor} roughness={0.95} />
            </mesh>
            {/* High collar */}
            <mesh position={[0, -0.45, 0]}>
              <cylinderGeometry args={[1.05, 1.15, 0.25]} />
              <meshStandardMaterial color={clothingColor} roughness={0.95} />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={avatarGroupRef} position={[0, 0, 0]}>
      {/* Head */}
      {createAdvancedHead()}
      
      {/* Neck */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.28, 0.35, 0.5]} />
        <meshStandardMaterial 
          color={persona.appearance.colorPalette.skin}
          roughness={0.8}
        />
      </mesh>
      
      {/* Body with breathing animation */}
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh position={[0, -1.9, 0]}>
          <boxGeometry args={[1.7, 1.8, 0.9]} />
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.skin}
            roughness={0.8}
          />
        </mesh>
        
        {/* Professional clothing */}
        {createProfessionalClothing()}
      </group>
      
      {/* Arms with gesture capability */}
      <group ref={leftArmRef}>
        <mesh position={[-1.25, -1.4, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.22, 0.28, 1.4]} />
          <meshStandardMaterial color={persona.appearance.colorPalette.clothing} roughness={0.5} />
        </mesh>
        <mesh position={[-1.55, -2.2, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} roughness={0.8} />
        </mesh>
      </group>
      
      <group ref={rightArmRef}>
        <mesh position={[1.25, -1.4, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.22, 0.28, 1.4]} />
          <meshStandardMaterial color={persona.appearance.colorPalette.clothing} roughness={0.5} />
        </mesh>
        <mesh position={[1.55, -2.2, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

const BulletproofThreeDAvatar: React.FC<BulletproofThreeDAvatarProps> = ({
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
  onError
}) => {
  const [renderState, setRenderState] = useState<'loading' | '3d' | '2d' | 'error'>('loading');
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canRenderAvatar, requestAvatarRender, releaseAvatarRender } = useAvatarManager();

  // Get persona with comprehensive fallback
  const persona = React.useMemo(() => {
    try {
      return therapistPersonas?.[therapistId] || therapistPersonas?.['dr-sarah-chen'] || {
        therapistId: 'fallback',
        name: therapistName || 'AI Therapist',
        appearance: {
          faceStructure: 'oval' as const,
          hairStyle: 'short' as const,
          clothingStyle: 'professional' as const,
          colorPalette: {
            skin: '#F5DEB3',
            hair: '#8B4513',
            eyes: '#4A4A4A',
            clothing: '#1E40AF',
            accent: '#3B82F6'
          }
        },
        personality: {
          gestureFrequency: 0.5,
          facialExpressiveness: 0.7,
          postureStyle: 'formal' as const,
          approachStyle: 'balanced'
        }
      };
    } catch (error) {
      console.warn('Error loading therapist persona:', error);
      return null;
    }
  }, [therapistId, therapistName]);

  // Enhanced WebGL capability detection
  const checkWebGLCapability = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || 
                  canvas.getContext('webgl') || 
                  canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      
      if (!gl) {
        setWebglSupported(false);
        return;
      }

      // Test WebGL functionality
      const shader = gl.createShader(gl.VERTEX_SHADER);
      if (!shader) {
        setWebglSupported(false);
        return;
      }

      gl.deleteShader(shader);
      canvas.remove();
      setWebglSupported(true);
    } catch (error) {
      console.warn('WebGL detection error:', error);
      setWebglSupported(false);
    }
  }, []);

  // Initialize WebGL detection
  useEffect(() => {
    checkWebGLCapability();
  }, [checkWebGLCapability]);

  // Render state management
  useEffect(() => {
    if (webglSupported === null) return;

    if (!webglSupported || !persona) {
      setRenderState('2d');
      onError?.();
      return;
    }

    // Try to acquire 3D rendering slot
    if (canRenderAvatar(therapistId) && requestAvatarRender(therapistId, priority)) {
      setRenderState('3d');
    } else {
      setRenderState('2d');
    }

    return () => {
      releaseAvatarRender(therapistId);
    };
  }, [webglSupported, persona, therapistId, priority, canRenderAvatar, requestAvatarRender, releaseAvatarRender, onError]);

  // Error recovery handler
  const handleWebGLError = useCallback(() => {
    console.warn('WebGL error occurred, falling back to 2D');
    setRenderState('2d');
    setRetryCount(prev => prev + 1);
    onError?.();
  }, [onError]);

  // Context loss handler
  useEffect(() => {
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
      handleWebGLError();
    };

    const handleContextRestore = () => {
      console.log('WebGL context restored, retrying 3D rendering');
      if (retryCount < 3) {
        setTimeout(() => checkWebGLCapability(), 1000);
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLoss);
      canvas.addEventListener('webglcontextrestored', handleContextRestore);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLoss);
        canvas.removeEventListener('webglcontextrestored', handleContextRestore);
      };
    }
  }, [handleWebGLError, retryCount, checkWebGLCapability]);

  if (!persona) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading therapist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (renderState === '2d') {
    return (
      <div className={className}>
        <Professional2DAvatar
          therapistId={therapistId}
          therapistName={persona.name}
          className="w-full h-full"
          showName={false}
          size="xl"
          emotion={emotion}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />
      </div>
    );
  }

  if (renderState === 'loading') {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Initializing 3D avatar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="w-full h-full relative bg-gradient-to-br from-therapy-50/30 to-calm-50/30 rounded-lg overflow-hidden">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 4], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          gl={{
            preserveDrawingBuffer: false,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          onCreated={(state) => {
            state.gl.setClearColor('#f8fafc', 0);
          }}
        >
          {/* Professional lighting setup */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[2, 2, 3]} 
            intensity={0.8} 
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-1, 1, 1]} intensity={0.3} />
          <pointLight position={[0, 2, 2]} intensity={0.4} />
          
          <Suspense fallback={null}>
            <AdvancedAvatarMesh
              persona={persona}
              emotion={emotion}
              isListening={isListening}
              isSpeaking={isSpeaking}
              userEmotion={userEmotion}
              lipSyncData={lipSyncData}
            />
          </Suspense>
          
          {showControls && (
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
              maxAzimuthAngle={Math.PI / 4}
              minAzimuthAngle={-Math.PI / 4}
            />
          )}
        </Canvas>
        
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

        {/* Therapist name */}
        <div className="absolute bottom-2 right-2 bg-black/20 text-white text-xs px-2 py-1 rounded">
          {persona.name}
        </div>
      </div>
    </div>
  );
};

export default BulletproofThreeDAvatar;