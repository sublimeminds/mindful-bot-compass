import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder } from '@react-three/drei';
import { therapistPersonas } from './TherapistAvatarPersonas';
import SimpleAvatarFallback from './SimpleAvatarFallback';
import { webglManager } from '@/utils/webgl-manager';
import * as THREE from 'three';

interface Enhanced3DAvatarProps {
  therapistId: string;
  therapistName?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  className?: string;
  onVoicePreview?: () => void;
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
  const mouthRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // More noticeable floating animation
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.15;
    
    // Enhanced head movement
    if (isListening) {
      headRef.current.rotation.x = Math.sin(time * 2) * 0.1;
      headRef.current.rotation.y = Math.sin(time * 1.5) * 0.05;
    } else if (isSpeaking) {
      headRef.current.rotation.y = Math.sin(time * 4) * 0.08;
      headRef.current.rotation.z = Math.sin(time * 3) * 0.03;
      
      // Speaking mouth animation
      if (mouthRef.current) {
        mouthRef.current.scale.y = 0.5 + Math.sin(time * 8) * 0.3;
        mouthRef.current.scale.x = 1 + Math.sin(time * 6) * 0.2;
      }
    } else {
      // Idle subtle movement
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
      headRef.current.rotation.x = Math.sin(time * 0.3) * 0.01;
    }
    
    // Body breathing animation
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 1.5) * 0.02;
    }
    
    // Enhanced blinking animation
    const blinkCycle = Math.sin(time * 0.8);
    if (blinkCycle > 0.95 && leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = 0.1;
      rightEyeRef.current.scale.y = 0.1;
    } else if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = 1;
      rightEyeRef.current.scale.y = 1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <group ref={headRef}>
        {/* Face - More detailed */}
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.skin} 
            roughness={0.8} 
            metalness={0.1} 
          />
        </Sphere>
        
        {/* Eyes - More realistic */}
        <Sphere ref={leftEyeRef} args={[0.18, 16, 16]} position={[-0.3, 0.2, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        <Sphere ref={rightEyeRef} args={[0.18, 16, 16]} position={[0.3, 0.2, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        
        {/* Eye pupils */}
        <Sphere args={[0.08, 8, 8]} position={[-0.3, 0.2, 0.9]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>
        <Sphere args={[0.08, 8, 8]} position={[0.3, 0.2, 0.9]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>
        
        {/* Eyebrows */}
        <Box args={[0.3, 0.05, 0.1]} position={[-0.3, 0.4, 0.85]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
        </Box>
        <Box args={[0.3, 0.05, 0.1]} position={[0.3, 0.4, 0.85]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.hair} />
        </Box>
        
        {/* Nose - More defined */}
        <Sphere args={[0.12, 8, 8]} position={[0, 0, 0.9]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
        
        {/* Mouth - More expressive */}
        <Sphere ref={mouthRef} args={[0.25, 8, 8]} position={[0, -0.3, 0.8]} scale={[1, 0.5, 0.5]}>
          <meshStandardMaterial color="#d4636a" />
        </Sphere>
        
        {/* Hair - More detailed */}
        <Sphere args={[1.15, 32, 32]} position={[0, 0.3, 0]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.hair} 
            roughness={0.9} 
          />
        </Sphere>
      </group>
      
      {/* Body */}
      <group ref={bodyRef} position={[0, -1.5, 0]}>
        {/* Torso - More realistic proportions */}
        <Box args={[1.6, 1.8, 0.6]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.clothing} 
            roughness={0.7} 
          />
        </Box>
        
        {/* Arms - More detailed */}
        <Cylinder args={[0.15, 0.2, 1.2]} position={[-1.1, 0, 0]} rotation={[0, 0, 0.3]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Cylinder>
        <Cylinder args={[0.15, 0.2, 1.2]} position={[1.1, 0, 0]} rotation={[0, 0, -0.3]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Cylinder>
        
        {/* Hands */}
        <Sphere args={[0.12, 8, 8]} position={[-1.6, -0.5, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
        <Sphere args={[0.12, 8, 8]} position={[1.6, -0.5, 0]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
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
  className = "w-full h-full",
  onVoicePreview
}) => {
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [webglDetails, setWebglDetails] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];
  const displayName = therapistName || persona.name;

  // Simplified WebGL check using webglManager
  useEffect(() => {
    console.log('🔍 3D Avatar: Starting support check for', therapistId);
    
    const checkSupport = () => {
      try {
        // Use webglManager for better reliability
        const isViable = webglManager.isWebGLViable();
        const capabilities = webglManager.detectCapabilities();
        
        console.log('📊 3D Avatar: WebGL capabilities:', capabilities);
        
        if (isViable && capabilities.webgl) {
          setWebglDetails(`WebGL ${capabilities.webgl2 ? '2.0' : '1.0'} - ${capabilities.renderer}`);
          setIs3DSupported(true);
          console.log('✅ 3D Avatar: 3D rendering enabled for', therapistId);
        } else {
          console.log('❌ 3D Avatar: WebGL not viable');
          setWebglDetails('WebGL not supported or not viable');
          setIs3DSupported(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ 3D Avatar: WebGL check failed:', error);
        setWebglDetails(`WebGL check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIs3DSupported(false);
        setIsLoading(false);
      }
    };

    // Run the check
    checkSupport();
  }, [therapistId]);

  // WebGL context loss handling
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const handleContextLoss = () => {
      console.warn('🔥 3D Avatar: WebGL context lost - falling back to 2D');
      setIs3DSupported(false);
      setWebglDetails('WebGL context lost');
    };

    const handleContextRestore = () => {
      console.log('🔄 3D Avatar: WebGL context restored - attempting 3D recovery');
      const isViable = webglManager.isWebGLViable();
      if (isViable) {
        setIs3DSupported(true);
        setWebglDetails('WebGL context restored');
      }
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    canvas.addEventListener('webglcontextrestored', handleContextRestore);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
      canvas.removeEventListener('webglcontextrestored', handleContextRestore);
    };
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
      {/* Debug info overlay */}
      <div className="absolute top-2 left-2 z-50">
        <div className="text-xs bg-black/70 text-white px-2 py-1 rounded">
          {webglDetails}
        </div>
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="text-xs bg-therapy-500 text-white px-2 py-1 rounded mt-1 block"
        >
          Debug: {debugMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500 mx-auto mb-2"></div>
            <div className="text-xs text-therapy-600">Loading 3D Avatar...</div>
          </div>
        </div>
      )}
      
      <Canvas 
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "default",
          preserveDrawingBuffer: false
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        onCreated={(state) => {
          console.log('🎨 3D Avatar: Canvas created successfully');
          console.log('🎨 3D Avatar: GL Context:', state.gl);
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('❌ 3D Avatar: Canvas error:', error);
          setIs3DSupported(false);
          setWebglDetails('Canvas creation failed');
        }}
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
        {debugMode && (
          <div className="text-xs bg-black/70 text-white px-2 py-1 rounded mb-2">
            3D Mode: {is3DSupported ? 'Active' : 'Disabled'} | 
            Loading: {isLoading ? 'Yes' : 'No'}
          </div>
        )}
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
        {onVoicePreview && (
          <button
            onClick={onVoicePreview}
            className="mt-2 text-xs bg-therapy-500 hover:bg-therapy-600 text-white px-3 py-1 rounded-full transition-colors"
          >
            Preview Voice
          </button>
        )}
      </div>
    </div>
  );
};

export default Enhanced3DAvatar;