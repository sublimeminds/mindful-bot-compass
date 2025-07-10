/**
 * Isolated 3D Avatar - Completely separated from Lovable tracking
 * This component runs in isolation to prevent lovable-tagger interference
 */

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder } from '@react-three/drei';
import { therapistPersonas } from './TherapistAvatarPersonas';
import SimpleAvatarFallback from './SimpleAvatarFallback';
import Professional2DAvatar from './Professional2DAvatar';
import { safeLovAccess, isLovHealthy } from '@/utils/lovableTaggerSafeGuard';
import { webglManager } from '@/utils/webgl-manager';
import * as THREE from 'three';

interface Isolated3DAvatarProps {
  therapistId: string;
  therapistName?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  className?: string;
  onVoicePreview?: () => void;
}

// Isolated 3D Avatar Component - bypasses all tracking
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
    
    // Floating animation
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.15;
    
    // Head movement based on state
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
      // Idle movement
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
      headRef.current.rotation.x = Math.sin(time * 0.3) * 0.01;
    }
    
    // Body breathing
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 1.5) * 0.02;
    }
    
    // Blinking
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
        {/* Face */}
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.skin} 
            roughness={0.8} 
            metalness={0.1} 
          />
        </Sphere>
        
        {/* Eyes */}
        <Sphere ref={leftEyeRef} args={[0.18, 16, 16]} position={[-0.3, 0.2, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        <Sphere ref={rightEyeRef} args={[0.18, 16, 16]} position={[0.3, 0.2, 0.8]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.eyes} />
        </Sphere>
        
        {/* Pupils */}
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
        
        {/* Nose */}
        <Sphere args={[0.12, 8, 8]} position={[0, 0, 0.9]}>
          <meshStandardMaterial color={persona.appearance.colorPalette.skin} />
        </Sphere>
        
        {/* Mouth */}
        <Sphere ref={mouthRef} args={[0.25, 8, 8]} position={[0, -0.3, 0.8]} scale={[1, 0.5, 0.5]}>
          <meshStandardMaterial color="#d4636a" />
        </Sphere>
        
        {/* Hair */}
        <Sphere args={[1.15, 32, 32]} position={[0, 0.3, 0]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.hair} 
            roughness={0.9} 
          />
        </Sphere>
      </group>
      
      {/* Body */}
      <group ref={bodyRef} position={[0, -1.5, 0]}>
        {/* Torso */}
        <Box args={[1.6, 1.8, 0.6]}>
          <meshStandardMaterial 
            color={persona.appearance.colorPalette.clothing} 
            roughness={0.7} 
          />
        </Box>
        
        {/* Arms */}
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

// Error Boundary specifically for 3D components
class Isolated3DErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    console.error('🔥 Isolated3D: Error boundary caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔥 Isolated3D: Component error details:', { error, errorInfo });
    
    // Check if this is a lov-related error
    if (error.message.includes('lov') || error.stack?.includes('lov')) {
      console.error('🚨 Isolated3D: Lovable-tagger related error detected');
      
      // Attempt to recover lov state
      safeLovAccess(() => {
        console.log('🔄 Isolated3D: Attempting lov recovery after error');
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const Isolated3DAvatar: React.FC<Isolated3DAvatarProps> = ({
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
  const [lovStatus, setLovStatus] = useState<string>('checking');
  const [webglContext, setWebglContext] = useState<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const [contextError, setContextError] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(false); // User-controlled 3D toggle
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];
  const displayName = therapistName || persona.name;

  // Check WebGL and lov health with proper context management
  useEffect(() => {
    console.log('🔍 Isolated3D: Starting health checks for', therapistId);
    
    const checkSupport = async () => {
      try {
        // Check lov health first
        const lovHealthy = isLovHealthy();
        setLovStatus(lovHealthy ? 'healthy' : 'unhealthy');
        
        if (!lovHealthy) {
          console.warn('🚨 Isolated3D: Lov is unhealthy, but continuing with 3D (isolated mode)');
        }

        // Check WebGL capabilities using manager
        const capabilities = webglManager.detectCapabilities();
        const queueStatus = webglManager.getQueueStatus();
        
        console.log('🔍 WebGL capabilities:', capabilities);
        console.log('🔍 WebGL queue status:', queueStatus);
        
        if (!capabilities.webgl) {
          console.log('❌ Isolated3D: WebGL not supported');
          setIs3DSupported(false);
          setContextError('WebGL not supported by this device');
        } else if (queueStatus.active >= queueStatus.max) {
          console.log('⏳ Isolated3D: WebGL context queue full, waiting...');
          setContextError('Another 3D avatar is active. Click to request 3D mode.');
          setIs3DSupported(true); // Device supports it, just queued
        } else {
          console.log('✅ Isolated3D: WebGL supported and available');
          setIs3DSupported(true);
          setContextError(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Isolated3D: Support check failed:', error);
        setIs3DSupported(false);
        setContextError('Failed to initialize 3D rendering');
        setIsLoading(false);
      }
    };

    checkSupport();
  }, [therapistId]);

  // Isolated WebGL context loss handling (no lov dependency)
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const handleContextLoss = (event: Event) => {
      console.warn('🔥 Isolated3D: WebGL context lost');
      event.preventDefault();
      setIs3DSupported(false);
    };

    const handleContextRestore = () => {
      console.log('🔄 Isolated3D: WebGL context restored');
      setIs3DSupported(true);
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    canvas.addEventListener('webglcontextrestored', handleContextRestore);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
      canvas.removeEventListener('webglcontextrestored', handleContextRestore);
    };
  }, []);

  // Request 3D context when user clicks to view 3D
  const request3DMode = async () => {
    if (!canvasRef.current || !is3DSupported) return;
    
    try {
      setIsLoading(true);
      setContextError(null);
      
      const context = await webglManager.createContextQueued(canvasRef.current, {
        antialias: true,
        alpha: true,
        powerPreference: 'default'
      });
      
      if (context) {
        setWebglContext(context);
        setShow3D(true);
        console.log('✅ 3D context acquired for', therapistId);
      } else {
        setContextError('Failed to create 3D context');
      }
    } catch (error) {
      console.error('❌ Failed to request 3D mode:', error);
      setContextError('Failed to enable 3D mode');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup context on unmount
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        webglManager.cleanupContext(canvasRef.current);
      }
    };
  }, []);

  // Fallback to 2D if 3D not supported or not requested
  if (!is3DSupported || !show3D) {
    return (
      <div className={className}>
        <Professional2DAvatar
          therapistId={therapistId}
          therapistName={displayName}
          emotion={emotion}
          isListening={isListening}
          isSpeaking={isSpeaking}
          className="w-full h-full"
          showName={false}
        />
        
        {/* 3D Toggle Button */}
        {is3DSupported && (
          <div className="absolute top-2 right-2">
            <button
              onClick={request3DMode}
              disabled={isLoading}
              className="bg-therapy-500 hover:bg-therapy-600 text-white text-xs px-3 py-1 rounded-full transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : contextError ? 'Request 3D' : 'View 3D'}
            </button>
          </div>
        )}
        
        {/* Error/Status Display */}
        {contextError && (
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {contextError}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Isolated3DErrorBoundary
      fallback={
        <div className={className}>
          <SimpleAvatarFallback 
            name={displayName}
            therapistId={therapistId}
            className="w-full h-full"
            showName={false}
          />
        </div>
      }
    >
      <div className={`${className} relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden`}>
        {/* Status overlay and controls */}
        <div className="absolute top-2 left-2 z-50 text-xs">
          <div className="bg-black/70 text-white px-2 py-1 rounded mb-1">
            3D Mode Active
          </div>
          <div className="bg-black/70 text-white px-2 py-1 rounded">
            Lov: {lovStatus}
          </div>
        </div>
        
        {/* Exit 3D Button */}
        <div className="absolute top-2 right-2 z-50">
          <button
            onClick={() => {
              setShow3D(false);
              if (canvasRef.current) {
                webglManager.cleanupContext(canvasRef.current);
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition-colors"
          >
            Exit 3D
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500 mx-auto mb-2"></div>
              <div className="text-xs text-therapy-600">Loading Isolated 3D...</div>
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
            console.log('🎨 Isolated3D: Canvas created successfully (isolated mode)');
            setIsLoading(false);
          }}
          onError={(error) => {
            console.error('❌ Isolated3D: Canvas error:', error);
            setIs3DSupported(false);
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
        
        {/* Status display */}
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <div className="text-xs font-medium text-therapy-700 mb-1">
            {displayName} (Isolated 3D)
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
          {onVoicePreview && (
            <button
              onClick={() => safeLovAccess(onVoicePreview, () => console.log('Voice preview called safely'))}
              className="mt-2 text-xs bg-therapy-500 hover:bg-therapy-600 text-white px-3 py-1 rounded-full transition-colors"
            >
              Preview Voice
            </button>
          )}
        </div>
      </div>
    </Isolated3DErrorBoundary>
  );
};

export default Isolated3DAvatar;