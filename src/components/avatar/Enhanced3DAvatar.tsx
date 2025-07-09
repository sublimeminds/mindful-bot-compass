import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder } from '@react-three/drei';
import { therapistPersonas } from './TherapistAvatarPersonas';
import SimpleAvatarFallback from './SimpleAvatarFallback';
import * as THREE from 'three';

interface Enhanced3DAvatarProps {
  therapistId: string;
  therapistName?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  className?: string;
}

const Simple3DAvatar: React.FC<{ 
  therapistId: string;
  emotion: string;
  isListening: boolean;
  isSpeaking: boolean;
}> = ({ therapistId, emotion, isListening, isSpeaking }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle floating animation
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    
    // Subtle head movement
    if (isListening) {
      headRef.current.rotation.x = Math.sin(time * 2) * 0.05;
    } else if (isSpeaking) {
      headRef.current.rotation.y = Math.sin(time * 3) * 0.03;
    }
    
    // Blinking animation
    const blinkCycle = Math.sin(time * 0.5);
    if (blinkCycle > 0.95 && leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = 0.2;
      rightEyeRef.current.scale.y = 0.2;
    } else if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = 1;
      rightEyeRef.current.scale.y = 1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <group ref={headRef}>
        {/* Face */}
        <Sphere args={[1, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
        
        {/* Eyes */}
        <Sphere ref={leftEyeRef} args={[0.15, 8, 8]} position={[-0.3, 0.2, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        <Sphere ref={rightEyeRef} args={[0.15, 8, 8]} position={[0.3, 0.2, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        
        {/* Nose */}
        <Sphere args={[0.08, 8, 8]} position={[0, 0, 0.9]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
        
        {/* Mouth */}
        <Sphere args={[0.2, 8, 8]} position={[0, -0.3, 0.8]} scale={[1, 0.5, 0.5]}>
          <meshStandardMaterial color="#FF69B4" />
        </Sphere>
        
        {/* Hair */}
        <Sphere args={[1.1, 16, 16]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
        </Sphere>
      </group>
      
      {/* Body */}
      <group position={[0, -1.5, 0]}>
        {/* Torso */}
        <Box args={[1.8, 1.5, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.clothing} />
        </Box>
        
        {/* Arms */}
        <Cylinder args={[0.2, 0.2, 1]} position={[-1.2, 0, 0]} rotation={[0, 0, 0.5]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Cylinder>
        <Cylinder args={[0.2, 0.2, 1]} position={[1.2, 0, 0]} rotation={[0, 0, -0.5]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Cylinder>
      </group>
    </group>
  );
};

const Enhanced3DAvatar: React.FC<Enhanced3DAvatarProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  showControls = true,
  className = "w-full h-full"
}) => {
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];
  const displayName = therapistName || persona.name;

  // Simple WebGL detection
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
        return !!context;
      } catch {
        return false;
      }
    };

    if (!checkWebGLSupport()) {
      setIs3DSupported(false);
    }
    
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Fallback to 2D if 3D not supported
  if (!is3DSupported) {
    return (
      <div className={className}>
        <SimpleAvatarFallback 
          name={displayName}
          therapistId={therapistId}
          className="w-full h-full"
          showName={false}
        />
      </div>
    );
  }

  return (
    <div className={`${className} relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500"></div>
        </div>
      )}
      
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        onCreated={() => setIsLoading(false)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />
        
        <Suspense fallback={null}>
          <Simple3DAvatar
            therapistId={therapistId}
            emotion={emotion}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />
        </Suspense>
        
        {showControls && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={1}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        )}
      </Canvas>
      
      {/* Status overlay */}
      <div className="absolute bottom-2 left-2 right-2 text-center">
        <div className="text-xs font-medium text-therapy-700 mb-1">
          {displayName}
        </div>
        {isListening && (
          <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Listening...
          </div>
        )}
        {isSpeaking && (
          <div className="text-xs text-green-600 flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            Speaking...
          </div>
        )}
      </div>
    </div>
  );
};

export default Enhanced3DAvatar;