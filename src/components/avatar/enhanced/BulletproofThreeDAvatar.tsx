import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { webglManager } from '@/utils/webgl-manager';
import { EnhancedEmotionAnalyzer, type EmotionResult } from '@/services/enhanced-emotion-analyzer';
import { therapistPersonas } from '../TherapistAvatarPersonas';
import SimpleAvatarFallback from '../SimpleAvatarFallback';

interface BulletproofThreeDProps {
  therapistId: string;
  therapistName: string;
  emotion?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
  userEmotion?: string;
  lipSyncData?: Float32Array;
  showControls?: boolean;
  className?: string;
  onError?: (error: Error) => void;
  onContextLoss?: () => void;
  onContextRestore?: () => void;
  performanceMode?: 'low' | 'medium' | 'high' | 'auto';
}

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage: number;
  frameDrops: number;
}

const BulletproofThreeDAvatar: React.FC<BulletproofThreeDProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  userEmotion,
  lipSyncData,
  showControls = true,
  className = "w-full h-full",
  onError,
  onContextLoss,
  onContextRestore,
  performanceMode = 'auto'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    memoryUsage: 0,
    frameDrops: 0
  });
  const [qualitySettings, setQualitySettings] = useState(webglManager.getRecommendedSettings());
  const emotionAnalyzer = useRef(new EnhancedEmotionAnalyzer());
  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());
  const renderTimes = useRef<number[]>([]);

  // WebGL capability detection
  const detectWebGL = useCallback(() => {
    try {
      const isViable = webglManager.isWebGLViable();
      setWebglSupported(isViable);
      
      if (isViable) {
        const settings = webglManager.getRecommendedSettings();
        setQualitySettings(settings);
      }
      
      return isViable;
    } catch (error) {
      console.error('WebGL detection failed:', error);
      setWebglSupported(false);
      onError?.(error as Error);
      return false;
    }
  }, [onError]);

  // Performance monitoring
  const updatePerformanceMetrics = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;
    lastFrameTime.current = now;

    frameCount.current++;
    renderTimes.current.push(deltaTime);
    
    // Keep only last 60 frames for averaging
    if (renderTimes.current.length > 60) {
      renderTimes.current.shift();
    }

    // Update metrics every 60 frames
    if (frameCount.current % 60 === 0) {
      const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
      const fps = 1000 / averageRenderTime;
      const frameDrops = renderTimes.current.filter(time => time > 33.33).length; // > 30fps threshold
      const memory = webglManager.monitorMemoryUsage();

      setPerformanceMetrics({
        fps: Math.round(fps),
        renderTime: Math.round(averageRenderTime * 100) / 100,
        memoryUsage: memory.usedJSHeapSize || 0,
        frameDrops
      });

      // Adjust quality based on performance
      if (performanceMode === 'auto') {
        adjustQualitySettings(fps, frameDrops);
      }
    }
  }, [performanceMode]);

  // Dynamic quality adjustment
  const adjustQualitySettings = useCallback((fps: number, frameDrops: number) => {
    const currentSettings = { ...qualitySettings };
    let needsUpdate = false;

    // Reduce quality if performance is poor
    if (fps < 25 || frameDrops > 10) {
      if (currentSettings.shadowQuality !== 'low') {
        currentSettings.shadowQuality = 'low';
        needsUpdate = true;
      }
      if (currentSettings.particleCount > 50) {
        currentSettings.particleCount = Math.max(25, currentSettings.particleCount / 2);
        needsUpdate = true;
      }
      if (currentSettings.antialias) {
        currentSettings.antialias = false;
        needsUpdate = true;
      }
    }
    // Increase quality if performance is good
    else if (fps > 55 && frameDrops < 2) {
      if (currentSettings.shadowQuality === 'low') {
        currentSettings.shadowQuality = 'medium';
        needsUpdate = true;
      }
      if (currentSettings.particleCount < 100) {
        currentSettings.particleCount = Math.min(200, currentSettings.particleCount * 1.5);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      setQualitySettings(currentSettings);
    }
  }, [qualitySettings]);

  // Context loss/restore handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLoss = () => {
      setContextLost(true);
      onContextLoss?.();
    };

    const handleContextRestore = () => {
      setContextLost(false);
      onContextRestore?.();
      // Re-detect capabilities after restore
      detectWebGL();
    };

    canvas.addEventListener('webgl-context-lost', handleContextLoss);
    canvas.addEventListener('webgl-context-restored', handleContextRestore);

    return () => {
      canvas.removeEventListener('webgl-context-lost', handleContextLoss);
      canvas.removeEventListener('webgl-context-restored', handleContextRestore);
    };
  }, [detectWebGL, onContextLoss, onContextRestore]);

  // Initial WebGL detection
  useEffect(() => {
    const timer = setTimeout(detectWebGL, 100);
    return () => clearTimeout(timer);
  }, [detectWebGL]);

  // Analyze user emotion for avatar response
  const analyzedEmotion = useRef<EmotionResult | null>(null);
  useEffect(() => {
    if (userEmotion) {
      analyzedEmotion.current = emotionAnalyzer.current.analyze(userEmotion);
    }
  }, [userEmotion]);

  // Get current persona
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  // Fallback for WebGL issues
  if (webglSupported === false || contextLost) {
    return (
      <div className={className}>
        <SimpleAvatarFallback 
          name={therapistName}
          therapistId={therapistId}
          className="w-full h-full"
          showName={false}
        />
        {contextLost && (
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <div className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">
              3D context lost - using 2D fallback
            </div>
          </div>
        )}
      </div>
    );
  }

  // Loading state
  if (webglSupported === null) {
    return (
      <div className={`${className} bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg flex items-center justify-center`}>
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-therapy-200 rounded-full mb-2"></div>
          <div className="h-4 bg-therapy-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden`}>
      <Canvas 
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          preserveDrawingBuffer: false, 
          antialias: qualitySettings.antialias,
          alpha: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        onCreated={(state) => {
          // Set up WebGL context management
          if (state.gl.domElement) {
            webglManager.getContext(state.gl.domElement);
          }
          // Start performance monitoring
          updatePerformanceMetrics();
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        
        <Suspense fallback={null}>
          {/* Placeholder for actual 3D avatar component */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color="#3B82F6"
              transparent
              opacity={isListening ? 0.8 : 1.0}
            />
          </mesh>
          
          {/* Emotion-based particles */}
          {qualitySettings.particleCount > 0 && analyzedEmotion.current && (
            <group>
              {Array.from({ length: Math.min(qualitySettings.particleCount, 50) }).map((_, i) => (
                <mesh 
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                  ]}
                >
                  <sphereGeometry args={[0.02]} />
                  <meshBasicMaterial 
                    color={analyzedEmotion.current.emotion === 'happy' ? '#FFD700' : 
                           analyzedEmotion.current.emotion === 'calm' ? '#87CEEB' : '#DDD'}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              ))}
            </group>
          )}
        </Suspense>
        
        {showControls && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={!isListening && !isSpeaking}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        )}
      </Canvas>
      
      {/* Status overlay */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="text-center">
          <div className="text-xs font-medium text-therapy-700 mb-1">
            {therapistName}
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center justify-center space-x-2 text-xs">
            {isListening && (
              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                👂 Listening
              </span>
            )}
            {isSpeaking && (
              <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full">
                💬 Speaking
              </span>
            )}
            {analyzedEmotion.current && (
              <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                {analyzedEmotion.current.emotion}
              </span>
            )}
          </div>
          
          {/* Performance indicators (dev mode) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-1">
              FPS: {performanceMetrics.fps} | 
              Render: {performanceMetrics.renderTime}ms |
              Quality: {qualitySettings.shadowQuality}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulletproofThreeDAvatar;
