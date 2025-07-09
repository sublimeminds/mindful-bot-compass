import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, Eye, EyeOff, Mic, MicOff, Settings } from 'lucide-react';
import BulletproofThreeDAvatar from './BulletproofThreeDAvatar';
import EmotionDetectionSystem from './EmotionDetectionSystem';
import { therapistPersonas } from './TherapistAvatarPersonas';

interface IndustryLeadingAvatarSystemProps {
  therapistId: string;
  therapistName?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
  showControls?: boolean;
  className?: string;
  onEmotionChange?: (emotion: string, confidence: number) => void;
  onAvatarError?: () => void;
}

interface AvatarSystemState {
  emotionDetectionEnabled: boolean;
  userEmotion: string;
  userEmotionConfidence: number;
  avatarEmotion: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  lipSyncData: Float32Array | null;
  systemHealth: {
    webgl: boolean;
    camera: boolean;
    model: boolean;
  };
  performanceMode: 'high' | 'medium' | 'low';
}

const IndustryLeadingAvatarSystem: React.FC<IndustryLeadingAvatarSystemProps> = ({
  therapistId,
  therapistName,
  isListening = false,
  isSpeaking = false,
  showControls = true,
  className = "w-full h-full",
  onEmotionChange,
  onAvatarError
}) => {
  const [systemState, setSystemState] = useState<AvatarSystemState>({
    emotionDetectionEnabled: false,
    userEmotion: 'neutral',
    userEmotionConfidence: 0,
    avatarEmotion: 'neutral',
    lipSyncData: null,
    systemHealth: {
      webgl: false,
      camera: false,
      model: false
    },
    performanceMode: 'high'
  });

  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const lipSyncDataRef = useRef<Float32Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Get therapist persona for emotional intelligence
  const persona = therapistPersonas[therapistId] || therapistPersonas['dr-sarah-chen'];

  // Initialize audio context for lip sync
  const initializeAudioAnalysis = useCallback(async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Create buffer for lip sync data
      lipSyncDataRef.current = new Float32Array(analyser.frequencyBinCount);
      
      return true;
    } catch (error) {
      console.warn('Failed to initialize audio analysis:', error);
      return false;
    }
  }, []);

  // Detect device capabilities
  const detectCapabilities = useCallback(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const webglSupported = !!gl;
    
    // Detect performance level
    let performanceMode: 'high' | 'medium' | 'low' = 'high';
    
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      performanceMode = 'low';
    } else if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      performanceMode = 'medium';
    }

    setSystemState(prev => ({
      ...prev,
      systemHealth: { ...prev.systemHealth, webgl: webglSupported },
      performanceMode
    }));

    canvas.remove();
  }, []);

  // Handle detected user emotion
  const handleEmotionDetected = useCallback((emotion: string, confidence: number) => {
    setSystemState(prev => ({
      ...prev,
      userEmotion: emotion,
      userEmotionConfidence: confidence
    }));

    // Determine appropriate therapist response emotion
    const responseEmotion = getTherapistResponseEmotion(emotion, confidence, persona);
    
    setSystemState(prev => ({
      ...prev,
      avatarEmotion: responseEmotion
    }));

    onEmotionChange?.(emotion, confidence);
  }, [persona, onEmotionChange]);

  // Determine therapist's emotional response
  const getTherapistResponseEmotion = (
    userEmotion: string, 
    confidence: number,
    therapistPersona: any
  ): 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' => {
    // Only respond if confidence is high enough
    if (confidence < 0.6) return 'neutral';

    // Base response on user emotion and therapist personality
    switch (userEmotion) {
      case 'sad':
      case 'angry':
        return therapistPersona.personality.facialExpressiveness > 0.7 ? 'concerned' : 'thoughtful';
      
      case 'happy':
      case 'joy':
        return therapistPersona.personality.facialExpressiveness > 0.6 ? 'happy' : 'encouraging';
      
      case 'neutral':
        return 'neutral';
      
      default:
        return 'encouraging';
    }
  };

  // Update lip sync data from audio
  const updateLipSyncData = useCallback(() => {
    if (analyserRef.current && lipSyncDataRef.current && isSpeaking) {
      analyserRef.current.getFloatFrequencyData(lipSyncDataRef.current);
      
      setSystemState(prev => ({
        ...prev,
        lipSyncData: new Float32Array(lipSyncDataRef.current!)
      }));
    } else if (!isSpeaking) {
      setSystemState(prev => ({
        ...prev,
        lipSyncData: null
      }));
    }
  }, [isSpeaking]);

  // Toggle emotion detection
  const toggleEmotionDetection = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      emotionDetectionEnabled: !prev.emotionDetectionEnabled
    }));
  }, []);

  // Initialize system
  useEffect(() => {
    detectCapabilities();
    initializeAudioAnalysis();
  }, [detectCapabilities, initializeAudioAnalysis]);

  // Update lip sync data when speaking
  useEffect(() => {
    let animationFrame: number;
    
    if (isSpeaking) {
      const updateFrame = () => {
        updateLipSyncData();
        animationFrame = requestAnimationFrame(updateFrame);
      };
      animationFrame = requestAnimationFrame(updateFrame);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isSpeaking, updateLipSyncData]);

  return (
    <div className={className}>
      <EmotionDetectionSystem
        onEmotionDetected={handleEmotionDetected}
        isActive={systemState.emotionDetectionEnabled}
        detectionInterval={1500}
      >
        <div className="relative w-full h-full">
          {/* Main 3D Avatar */}
          <BulletproofThreeDAvatar
            therapistId={therapistId}
            therapistName={therapistName}
            emotion={systemState.avatarEmotion}
            isListening={isListening}
            isSpeaking={isSpeaking}
            userEmotion={systemState.userEmotion}
            lipSyncData={systemState.lipSyncData}
            showControls={showControls}
            className="w-full h-full"
            priority={1}
            onError={onAvatarError}
          />

          {/* Control Panel */}
          {showControls && (
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              <Button
                variant={systemState.emotionDetectionEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleEmotionDetection}
                className="flex items-center space-x-2"
              >
                {systemState.emotionDetectionEnabled ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="text-xs">
                  {systemState.emotionDetectionEnabled ? 'Emotion ON' : 'Emotion OFF'}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Status Indicators */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            {isListening && (
              <Badge variant="secondary" className="bg-blue-500/80 text-white">
                <Mic className="h-3 w-3 mr-1" />
                Listening
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary" className="bg-green-500/80 text-white">
                <Mic className="h-3 w-3 mr-1" />
                Speaking
              </Badge>
            )}
            {systemState.emotionDetectionEnabled && (
              <Badge variant="secondary" className="bg-purple-500/80 text-white">
                <Camera className="h-3 w-3 mr-1" />
                Emotion Detection
              </Badge>
            )}
          </div>

          {/* Emotion Display */}
          {systemState.emotionDetectionEnabled && systemState.userEmotionConfidence > 0.5 && (
            <div className="absolute top-4 right-4">
              <Card className="bg-black/20 border-white/20">
                <CardContent className="p-3">
                  <div className="text-white text-center">
                    <div className="text-sm font-medium">User Emotion</div>
                    <div className="text-lg capitalize">{systemState.userEmotion}</div>
                    <div className="text-xs opacity-80">
                      {(systemState.userEmotionConfidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Debug Panel */}
          {showDebugPanel && (
            <div className="absolute top-16 left-4 w-64">
              <Card className="bg-black/80 border-white/20">
                <CardContent className="p-4 text-white text-xs space-y-2">
                  <div className="font-medium">System Status</div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>WebGL:</span>
                      <span className={systemState.systemHealth.webgl ? 'text-green-400' : 'text-red-400'}>
                        {systemState.systemHealth.webgl ? '✓' : '✗'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className="capitalize">{systemState.performanceMode}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Avatar Emotion:</span>
                      <span className="capitalize">{systemState.avatarEmotion}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>User Emotion:</span>
                      <span className="capitalize">{systemState.userEmotion}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Lip Sync:</span>
                      <span className={systemState.lipSyncData ? 'text-green-400' : 'text-gray-400'}>
                        {systemState.lipSyncData ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-2">
                    <div className="font-medium">Therapist: {persona?.name}</div>
                    <div>Expressiveness: {(persona?.personality.facialExpressiveness * 100 || 0).toFixed(0)}%</div>
                    <div>Gesture Freq: {(persona?.personality.gestureFrequency * 100 || 0).toFixed(0)}%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </EmotionDetectionSystem>
    </div>
  );
};

export default IndustryLeadingAvatarSystem;