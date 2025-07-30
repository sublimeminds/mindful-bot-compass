import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { therapistPersonas } from './TherapistAvatarPersonas';
import Professional2DAvatar from './Professional2DAvatar';
import { webglManager } from '@/utils/webgl-manager';
import Simple3DAvatar from './Simple3DAvatar';

interface Isolated3DAvatarProps {
  therapistId: string;
  therapistName: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  className?: string;
  onVoicePreview?: () => void;
}

// Error Boundary specifically for 3D components
class Canvas3DErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔥 Canvas3DErrorBoundary: 3D rendering error:', error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent handle fallback
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
  const [show3D, setShow3D] = useState(false);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [webglDetails, setWebglDetails] = useState<string>('');
  const [contextId, setContextId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log('🎬 Isolated3DAvatar: Rendering with show3D =', show3D, 'is3DSupported =', is3DSupported);

  // Get persona data
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  // WebGL context management
  const request3DMode = async () => {
    console.log('🎬 Isolated3DAvatar: Requesting 3D mode...');
    
    try {
      const queueStatus = webglManager.getQueueStatus();
      if (queueStatus.active < queueStatus.max) {
        console.log('✅ Isolated3DAvatar: Context available, enabling 3D mode');
        setContextId('isolated-avatar-context');
        setShow3D(true);
        setIs3DSupported(true);
        setWebglDetails('3D Mode Active');
      } else {
        console.log('❌ Isolated3DAvatar: Context request failed - limit reached');
        setWebglDetails('Context limit reached');
        setIs3DSupported(false);
      }
    } catch (error) {
      console.error('❌ Isolated3DAvatar: Context request error:', error);
      setWebglDetails('Context request failed');
      setIs3DSupported(false);
    }
  };

  const release3DMode = () => {
    console.log('🎬 Isolated3DAvatar: Releasing 3D mode...');
    
    if (contextId) {
      // Context cleanup will be handled by Canvas unmount
      setContextId(null);
    }
    setShow3D(false);
    setWebglDetails('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (contextId) {
        console.log('🎬 Isolated3DAvatar: Cleanup - releasing context:', contextId);
        // Context cleanup will be handled by Canvas disposal
      }
    };
  }, [contextId]);

  // Monitor WebGL health
  useEffect(() => {
    const checkHealth = () => {
      const queueStatus = webglManager.getQueueStatus();
      const status = `Active: ${queueStatus.active}/${queueStatus.max}`;
      
      if (show3D) {
        setWebglDetails(`3D Active (${status})`);
      } else if (webglDetails && !webglDetails.includes('Context limit') && !webglDetails.includes('failed')) {
        setWebglDetails(status);
      }
    };

    const interval = setInterval(checkHealth, 1000);
    return () => clearInterval(interval);
  }, [show3D, webglDetails]);

  const handle3DError = () => {
    console.error('🔥 Isolated3DAvatar: 3D rendering failed, falling back to 2D');
    setIs3DSupported(false);
    setShow3D(false);
    release3DMode();
  };

  // Only show 3D if explicitly requested and supported
  if (show3D && is3DSupported) {
    console.log('🎬 Isolated3DAvatar: Rendering 3D mode with therapist:', therapistId);
    
    return (
      <div className={`${className} relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden`}>
        {/* 3D Canvas */}
        <Canvas3DErrorBoundary onError={handle3DError}>
          <Canvas
            ref={canvasRef}
            camera={{ 
              position: [0, 0, 3], 
              fov: 50,
              near: 0.1,
              far: 100
            }}
            gl={{
              preserveDrawingBuffer: false,
              antialias: false,
              alpha: true,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: true,
            }}
            dpr={Math.min(window.devicePixelRatio, 2)}
            style={{ background: 'transparent' }}
            onCreated={(state) => {
              console.log('✅ Isolated3DAvatar: Canvas created successfully');
              state.gl.setClearColor(0x000000, 0);
            }}
            onError={(error) => {
              console.error('❌ Isolated3D: Canvas error:', error);
              setIs3DSupported(false);
            }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, -5, -5]} intensity={0.4} />
            
            <Suspense fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshLambertMaterial color="#cccccc" />
              </mesh>
            }>
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
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 3}
              />
            )}
          </Canvas>
        </Canvas3DErrorBoundary>

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top overlay with therapist info */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
            <div className="bg-white rounded-lg p-3 shadow-lg border">
              <h3 className="font-semibold text-therapy-700">{therapistName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {emotion}
                </Badge>
                {isListening && (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                    👂 Listening...
                  </Badge>
                )}
                {isSpeaking && (
                  <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                    💬 Speaking...
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={release3DMode}
              className="bg-white shadow-lg border"
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Exit 3D
            </Button>
          </div>

          {/* Bottom overlay with status */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-auto">
            <div className="bg-white rounded-lg px-3 py-2 shadow-lg border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">
                  3D Active • {webglDetails}
                </span>
              </div>
            </div>

            {onVoicePreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={onVoicePreview}
                className="bg-white shadow-lg border"
              >
                🎵 Voice Preview
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2D Mode (default state)
  return (
    <div className={`${className} relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden`}>
      {/* 2D Avatar */}
      <div className="w-full h-full flex items-center justify-center">
        <Professional2DAvatar
          therapistId={therapistId}
          therapistName={therapistName}
          emotion={emotion}
          isListening={isListening}
          isSpeaking={isSpeaking}
          className="w-full h-full"
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top overlay with therapist info */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <div className="bg-white rounded-lg p-3 shadow-lg border">
            <h3 className="font-semibold text-therapy-700">{therapistName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {emotion}
              </Badge>
              {isListening && (
                <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                  👂 Listening...
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                  💬 Speaking...
                </Badge>
              )}
            </div>
          </div>

          {is3DSupported && (
            <Button
              variant="outline"
              size="sm"
              onClick={request3DMode}
              className="bg-white shadow-lg border"
            >
              <Eye className="h-4 w-4 mr-1" />
              View 3D
            </Button>
          )}
        </div>

        {/* Bottom overlay with status */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-auto">
          <div className="bg-white rounded-lg px-3 py-2 shadow-lg border">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                is3DSupported ? 'bg-blue-500' : 'bg-amber-500'
              }`}></div>
              <span className="text-xs text-muted-foreground">
                {is3DSupported 
                  ? `2D Mode • Lov: ${webglManager.getQueueStatus().active === 0 ? 'healthy' : 'active'}` 
                  : `2D Mode • ${webglDetails || 'WebGL unavailable'}`
                }
              </span>
            </div>
          </div>

          {onVoicePreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={onVoicePreview}
              className="bg-white shadow-lg border"
            >
              🎵 Voice Preview
            </Button>
          )}
        </div>
      </div>

      {/* Retry button for failed 3D */}
      {!is3DSupported && webglDetails.includes('failed') && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <Button
            variant="outline"
            onClick={() => {
              setIs3DSupported(true);
              setWebglDetails('');
              request3DMode();
            }}
            className="bg-white shadow-lg border"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry 3D
          </Button>
        </div>
      )}
    </div>
  );
};

export default Isolated3DAvatar;