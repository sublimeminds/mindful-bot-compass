import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { therapistPersonas, TherapistAvatarPersona } from './TherapistAvatarPersonas';
import SimpleAvatarFallback from './SimpleAvatarFallback';

interface EnhancedAvatarProps {
  therapistId: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  userEmotion?: string;
  lipSyncData?: Float32Array;
  showControls?: boolean;
  className?: string;
}

interface HumanlikeAvatarProps {
  persona: TherapistAvatarPersona;
  emotion: string;
  isListening: boolean;
  isSpeaking: boolean;
  userEmotion?: string;
  lipSyncData?: Float32Array;
}

const HumanlikeAvatar: React.FC<HumanlikeAvatarProps> = ({ 
  persona, 
  emotion, 
  isListening, 
  isSpeaking, 
  userEmotion,
  lipSyncData 
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  
  const [blinkTimer, setBlinkTimer] = useState(Math.random() * 5);
  const [gesturePhase, setGesturePhase] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [emotionTransition, setEmotionTransition] = useState(0);
  const [lastBlink, setLastBlink] = useState(0);

  // Enhanced frame-by-frame animation
  useFrame((state, delta) => {
    if (!avatarRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    try {
      // Natural floating motion with personality-based variation
      const floatIntensity = persona.personality.gestureFrequency * 0.03;
      avatarRef.current.position.y = Math.sin(time * 0.8) * floatIntensity;
      
      // Realistic breathing animation
      const breathingRate = isSpeaking ? 1.8 : 1.2;
      const breathScale = 1 + Math.sin(time * breathingRate) * 0.015;
      if (bodyRef.current) {
        bodyRef.current.scale.y = breathScale;
        bodyRef.current.scale.x = 1 + Math.sin(time * breathingRate * 0.5) * 0.005;
      }
      
      // Enhanced blinking system
      setBlinkTimer(prev => prev + delta);
      if (blinkTimer > 2 + Math.random() * 3) {
        setLastBlink(time);
        setBlinkTimer(0);
      }
      
      // Realistic blink animation
      const blinkProgress = Math.max(0, 1 - Math.abs(time - lastBlink) / 0.15);
      const blinkScale = 1 - blinkProgress * 0.8;
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = blinkScale;
        rightEyeRef.current.scale.y = blinkScale;
      }
      
      // Lip sync animation for speaking
      if (isSpeaking && mouthRef.current) {
        let lipSyncIntensity = 0.3;
        
        // Use actual lip sync data if available
        if (lipSyncData && lipSyncData.length > 0) {
          const sample = Math.floor((time * 22050) % lipSyncData.length);
          lipSyncIntensity = Math.abs(lipSyncData[sample]) * 2;
        } else {
          // Fallback procedural lip sync
          lipSyncIntensity = (Math.sin(time * 15) + Math.sin(time * 25) * 0.5) * 0.2 + 0.1;
        }
        
        mouthRef.current.scale.y = 0.5 + lipSyncIntensity;
        mouthRef.current.scale.x = 1 + lipSyncIntensity * 0.3;
      } else if (mouthRef.current) {
        // Mouth closed, subtle movement
        mouthRef.current.scale.y = 0.5 + Math.sin(time * 0.5) * 0.05;
        mouthRef.current.scale.x = 1;
      }
      
      // Gesture animations based on personality
      setGesturePhase(prev => prev + delta * persona.personality.gestureFrequency);
      
      if (leftArmRef.current && rightArmRef.current) {
        // Subtle arm movements during conversation
        const gestureIntensity = isSpeaking ? 0.3 : 0.1;
        leftArmRef.current.rotation.x = Math.sin(gesturePhase * 0.7) * gestureIntensity;
        rightArmRef.current.rotation.x = Math.sin(gesturePhase * 0.9) * gestureIntensity;
        
        // Listening gesture - slight lean forward
        if (isListening && headRef.current) {
          headRef.current.rotation.x = Math.sin(time * 0.5) * 0.05 + 0.1;
        } else if (headRef.current) {
          headRef.current.rotation.x = Math.sin(time * 0.3) * 0.02;
        }
      }
      
      // Emotion-based facial expressions
      setEmotionTransition(prev => {
        const target = getEmotionTarget(emotion);
        return THREE.MathUtils.lerp(prev, target, delta * 2);
      });
      
      // Apply emotion to facial features
      if (leftEyeRef.current && rightEyeRef.current) {
        const eyePositionY = emotionTransition * 0.1;
        leftEyeRef.current.position.y = 0.3 + eyePositionY;
        rightEyeRef.current.position.y = 0.3 + eyePositionY;
      }
      
      // Eye contact simulation - subtle eye movements
      if (leftEyeRef.current && rightEyeRef.current) {
        const eyeMovement = Math.sin(time * 0.3) * 0.02;
        leftEyeRef.current.position.x = -0.3 + eyeMovement;
        rightEyeRef.current.position.x = 0.3 + eyeMovement;
      }
      
    } catch (error) {
      console.warn('Avatar animation error:', error);
    }
  });

  const getEmotionTarget = (currentEmotion: string): number => {
    switch (currentEmotion) {
      case 'happy': return 1;
      case 'concerned': return -0.5;
      case 'encouraging': return 0.7;
      case 'thoughtful': return 0.3;
      default: return 0;
    }
  };

  const createRealisticHead = () => (
    <group ref={headRef}>
      {/* Face base */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={persona.appearance.colorPalette.skin}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Eyes */}
      <group>
        {/* Left eye socket */}
        <Sphere args={[0.25, 16, 16]} position={[-0.3, 0.3, 0.7]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Sphere>
        {/* Left iris */}
        <Sphere ref={leftEyeRef} args={[0.15, 16, 16]} position={[-0.3, 0.3, 0.75]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        {/* Left pupil */}
        <Sphere args={[0.08, 16, 16]} position={[-0.3, 0.3, 0.8]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        
        {/* Right eye socket */}
        <Sphere args={[0.25, 16, 16]} position={[0.3, 0.3, 0.7]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Sphere>
        {/* Right iris */}
        <Sphere ref={rightEyeRef} args={[0.15, 16, 16]} position={[0.3, 0.3, 0.75]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        {/* Right pupil */}
        <Sphere args={[0.08, 16, 16]} position={[0.3, 0.3, 0.8]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
      </group>
      
      {/* Nose */}
      <Cone args={[0.15, 0.3, 8]} position={[0, 0, 0.8]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial 
          color={persona.appearance.colorPalette.skin}
          roughness={0.8}
        />
      </Cone>
      
      {/* Mouth */}
      <group ref={mouthRef} position={[0, -0.3, 0.7]}>
        <Box args={[0.3, 0.1, 0.1]}>
          <meshStandardMaterial color="#CC6666" />
        </Box>
      </group>
      
      {/* Hair */}
      {createDetailedHair()}
    </group>
  );

  const createDetailedHair = () => {
    const hairColor = persona.appearance.colorPalette.hair;
    
    switch (persona.appearance.hairStyle) {
      case 'short':
        return (
          <group>
            <Sphere args={[1.05, 20, 20]} position={[0, 0.4, -0.2]}>
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </Sphere>
          </group>
        );
      case 'medium':
        return (
          <group>
            <Sphere args={[1.1, 20, 20]} position={[0, 0.3, -0.2]}>
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </Sphere>
            <Box args={[1.8, 0.5, 0.8]} position={[0, -0.2, -0.5]}>
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </Box>
          </group>
        );
      case 'long':
        return (
          <group>
            <Sphere args={[1.1, 20, 20]} position={[0, 0.3, -0.2]}>
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </Sphere>
            <Cylinder args={[0.8, 1.0, 2]} position={[0, -0.8, -0.4]}>
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </Cylinder>
          </group>
        );
      case 'curly':
        return (
          <group>
            <Sphere args={[1.15, 16, 16]} position={[0, 0.4, -0.1]}>
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </Sphere>
            {/* Curly details */}
            <Sphere args={[0.3, 12, 12]} position={[-0.7, 0.3, 0.3]}>
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </Sphere>
            <Sphere args={[0.3, 12, 12]} position={[0.7, 0.3, 0.3]}>
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </Sphere>
            <Sphere args={[0.25, 12, 12]} position={[0, 0.7, 0.2]}>
              <meshStandardMaterial color={hairColor} roughness={0.95} />
            </Sphere>
          </group>
        );
      default:
        return null;
    }
  };

  const createDetailedClothing = () => {
    const clothingColor = persona.appearance.colorPalette.clothing;
    const accentColor = persona.appearance.colorPalette.accent;
    
    switch (persona.appearance.clothingStyle) {
      case 'professional':
        return (
          <group>
            {/* Blazer */}
            <Box args={[2.2, 1.6, 0.9]} position={[0, -1.5, 0]}>
              <meshStandardMaterial color={clothingColor} roughness={0.3} />
            </Box>
            {/* Shirt */}
            <Box args={[1.8, 0.4, 0.3]} position={[0, -0.4, 0.45]}>
              <meshStandardMaterial color="#FFFFFF" />
            </Box>
            {/* Tie */}
            <Box args={[0.3, 1, 0.05]} position={[0, -1, 0.5]}>
              <meshStandardMaterial color={accentColor} />
            </Box>
            {/* Collar */}
            <Box args={[0.8, 0.2, 0.1]} position={[-0.4, -0.3, 0.5]} rotation={[0, 0, 0.3]}>
              <meshStandardMaterial color="#FFFFFF" />
            </Box>
            <Box args={[0.8, 0.2, 0.1]} position={[0.4, -0.3, 0.5]} rotation={[0, 0, -0.3]}>
              <meshStandardMaterial color="#FFFFFF" />
            </Box>
          </group>
        );
      case 'casual':
        return (
          <group>
            {/* T-shirt */}
            <Box args={[2, 1.6, 0.8]} position={[0, -1.5, 0]}>
              <meshStandardMaterial color={clothingColor} roughness={0.7} />
            </Box>
            {/* Logo/design */}
            <Box args={[0.5, 0.5, 0.05]} position={[0, -1, 0.4]}>
              <meshStandardMaterial color={accentColor} />
            </Box>
          </group>
        );
      case 'warm':
        return (
          <group>
            {/* Sweater */}
            <Box args={[2.1, 1.6, 0.95]} position={[0, -1.5, 0]}>
              <meshStandardMaterial color={clothingColor} roughness={0.9} />
            </Box>
            {/* Knit pattern */}
            <Box args={[2.2, 0.1, 1]} position={[0, -1.2, 0]}>
              <meshStandardMaterial color={accentColor} />
            </Box>
            <Box args={[2.2, 0.1, 1]} position={[0, -1.6, 0]}>
              <meshStandardMaterial color={accentColor} />
            </Box>
            {/* Collar */}
            <Cylinder args={[1.1, 1.2, 0.3]} position={[0, -0.5, 0]}>
              <meshStandardMaterial color={clothingColor} roughness={0.9} />
            </Cylinder>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={avatarRef} position={[0, 0, 0]}>
      {/* Head */}
      {createRealisticHead()}
      
      {/* Neck */}
      <Cylinder args={[0.3, 0.4, 0.6]} position={[0, -0.8, 0]}>
        <meshStandardMaterial 
          color={persona.appearance.colorPalette.skin}
          roughness={0.8}
        />
      </Cylinder>
      
      {/* Body */}
      <group ref={bodyRef}>
        {/* Torso */}
        <Box args={[1.8, 2, 1]} position={[0, -2, 0]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.skin}
            roughness={0.8}
          />
        </Box>
        
        {/* Clothing */}
        {createDetailedClothing()}
      </group>
      
      {/* Arms */}
      <group ref={leftArmRef}>
        <Cylinder args={[0.25, 0.3, 1.5]} position={[-1.3, -1.5, 0]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.clothing} />
        </Cylinder>
        {/* Hand */}
        <Sphere args={[0.2, 12, 12]} position={[-1.6, -2.3, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
      </group>
      
      <group ref={rightArmRef}>
        <Cylinder args={[0.25, 0.3, 1.5]} position={[1.3, -1.5, 0]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.clothing} />
        </Cylinder>
        {/* Hand */}
        <Sphere args={[0.2, 12, 12]} position={[1.6, -2.3, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
      </group>
    </group>
  );
};

const EnhancedThreeDAvatar: React.FC<EnhancedAvatarProps> = ({
  therapistId,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  userEmotion,
  lipSyncData,
  showControls = true,
  className = "w-full h-full"
}) => {
  const [webglError, setWebglError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  // Enhanced WebGL detection
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        
        if (!gl) {
          setWebglError(true);
          return;
        }
        
        // Test basic WebGL functionality
        const shader = gl.createShader(gl.VERTEX_SHADER);
        if (shader) {
          gl.deleteShader(shader);
        }
        setMounted(true);
      } catch (error) {
        console.warn('WebGL detection failed:', error);
        setWebglError(true);
      }
    };

    checkWebGL();
  }, []);

  // Context loss recovery
  useEffect(() => {
    const handleContextLoss = (event: Event) => {
      console.warn('WebGL context lost, attempting recovery...');
      event.preventDefault();
      setWebglError(true);
      
      // Attempt recovery after a delay
      setTimeout(() => {
        setWebglError(false);
        setMounted(true);
      }, 2000);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLoss);
      return () => canvas.removeEventListener('webglcontextlost', handleContextLoss);
    }
  }, [mounted]);

  if (webglError || !mounted) {
    return (
      <div className={className}>
        <SimpleAvatarFallback 
          name={persona.name} 
          therapistId={therapistId}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas 
        ref={canvasRef}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ 
          preserveDrawingBuffer: false, 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        onCreated={(state) => {
          state.gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setWebglError(true);
          });
        }}
      >
        {/* Enhanced lighting for realistic appearance */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[2, 4, 3]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-2, 2, 1]} intensity={0.3} />
        <pointLight position={[0, 2, 4]} intensity={0.2} />
        
        <Suspense fallback={null}>
          <HumanlikeAvatar
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
            enableZoom={true}
            enablePan={false}
            autoRotate={false}
            maxDistance={10}
            minDistance={3}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
          />
        )}
      </Canvas>
      
      {/* Status indicators */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2">
          <div className="text-xs font-medium text-white text-center mb-1">
            {persona.name}
          </div>
          <div className="flex justify-center space-x-2">
            {isListening && (
              <div className="flex items-center text-xs text-blue-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-1"></div>
                Listening
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center text-xs text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                Speaking
              </div>
            )}
            <div className="text-xs text-gray-300 capitalize">
              {emotion}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedThreeDAvatar;