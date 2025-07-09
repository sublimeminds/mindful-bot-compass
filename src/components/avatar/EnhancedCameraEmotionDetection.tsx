import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, CameraOff, Eye, EyeOff, Brain, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emotionDetector, EmotionResult } from '@/services/advancedEmotionDetection';

interface EnhancedCameraEmotionDetectionProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  isActive?: boolean;
  showPreview?: boolean;
  enableMLModels?: boolean;
}

const EnhancedCameraEmotionDetection: React.FC<EnhancedCameraEmotionDetectionProps> = ({
  onEmotionDetected,
  isActive = false,
  showPreview = true,
  enableMLModels = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [showVideo, setShowVideo] = useState(showPreview);
  const [isInitializing, setIsInitializing] = useState(false);
  const [mlModelsReady, setMlModelsReady] = useState(false);
  const [processingQuality, setProcessingQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const { toast } = useToast();

  // Initialize ML models
  useEffect(() => {
    if (enableMLModels) {
      setIsInitializing(true);
      emotionDetector.initialize().then(() => {
        setMlModelsReady(true);
        setIsInitializing(false);
        toast({
          title: "AI Models Ready",
          description: "Advanced emotion detection is now available",
        });
      }).catch(() => {
        setIsInitializing(false);
        toast({
          title: "Using Basic Detection",
          description: "AI models unavailable, using heuristic analysis",
          variant: "default"
        });
      });
    }
  }, [enableMLModels, toast]);

  // Enhanced emotion detection
  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !isDetecting) return;

    try {
      const emotion = await emotionDetector.detectFromCamera(videoRef.current);
      
      if (emotion) {
        setCurrentEmotion(emotion);
        setEmotionHistory(prev => [...prev.slice(-29), emotion]); // Keep last 30
        onEmotionDetected?.(emotion);
      }
    } catch (error) {
      console.error('Enhanced emotion detection error:', error);
    }
  }, [isDetecting, onEmotionDetected]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 15 }
        }
      });

      setStream(mediaStream);
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Assess processing quality based on device capabilities
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.width && capabilities.width.max >= 1280) {
        setProcessingQuality('high');
      } else if (capabilities.width && capabilities.width.max >= 720) {
        setProcessingQuality('medium');
      } else {
        setProcessingQuality('low');
      }

      toast({
        title: "Camera Active",
        description: `Enhanced emotion detection ready (${processingQuality} quality)`,
      });

    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraPermission('denied');
      
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access for emotion detection",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsDetecting(false);
  };

  const toggleDetection = () => {
    if (!stream) {
      startCamera();
      return;
    }
    
    setIsDetecting(!isDetecting);
  };

  const toggleVideoVisibility = () => {
    setShowVideo(!showVideo);
  };

  // Detection loop
  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(detectEmotion, 500); // 2 FPS for emotion detection
    return () => clearInterval(interval);
  }, [detectEmotion, isDetecting]);

  // Auto-start if active
  useEffect(() => {
    if (isActive && !stream) {
      startCamera();
    }
  }, [isActive, stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      joy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      excitement: 'bg-orange-100 text-orange-800 border-orange-200',
      sadness: 'bg-blue-100 text-blue-800 border-blue-200',
      anxiety: 'bg-purple-100 text-purple-800 border-purple-200',
      anger: 'bg-red-100 text-red-800 border-red-200',
      fear: 'bg-gray-100 text-gray-800 border-gray-200',
      surprise: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      trust: 'bg-green-100 text-green-800 border-green-200',
      empathy: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      breakthrough: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colorMap[emotion] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-500';
    if (intensity <= 6) return 'bg-yellow-500';
    if (intensity <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const calculateAverageEmotion = () => {
    if (emotionHistory.length === 0) return null;
    
    const last10 = emotionHistory.slice(-10);
    const avgConfidence = last10.reduce((sum, e) => sum + e.confidence, 0) / last10.length;
    const avgIntensity = last10.reduce((sum, e) => sum + e.intensity, 0) / last10.length;
    const avgValence = last10.reduce((sum, e) => sum + e.valence, 0) / last10.length;
    
    return {
      confidence: avgConfidence,
      intensity: avgIntensity,
      valence: avgValence
    };
  };

  const avgEmotion = calculateAverageEmotion();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Enhanced Emotion Detection
          {mlModelsReady && <Badge variant="secondary" className="text-xs">AI</Badge>}
          {isInitializing && <Badge variant="outline" className="text-xs">Loading...</Badge>}
        </CardTitle>
        <div className="flex gap-2">
          {stream && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVideoVisibility}
            >
              {showVideo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant={isDetecting ? "destructive" : "default"}
            size="sm"
            onClick={toggleDetection}
            disabled={isInitializing}
          >
            {stream ? (isDetecting ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />) : <Camera className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Preview */}
        {stream && showVideo && (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-40 object-cover rounded-lg bg-black"
              muted
              playsInline
            />
            {isDetecting && (
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <Badge variant="secondary" className="text-xs">
                  {processingQuality.toUpperCase()}
                </Badge>
              </div>
            )}
            {currentEmotion && isDetecting && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/60 text-white p-2 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span>{currentEmotion.emotion}</span>
                    <span>{Math.round(currentEmotion.confidence * 100)}%</span>
                  </div>
                  <Progress 
                    value={currentEmotion.intensity * 10} 
                    className="h-1 mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Emotion Display */}
        {currentEmotion && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Emotion:</span>
              <Badge className={getEmotionColor(currentEmotion.emotion)}>
                {currentEmotion.emotion}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span>{Math.round(currentEmotion.confidence * 100)}%</span>
                </div>
                <Progress value={currentEmotion.confidence * 100} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Intensity:</span>
                  <span>{currentEmotion.intensity}/10</span>
                </div>
                <Progress 
                  value={currentEmotion.intensity * 10} 
                  className="h-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Valence:</span>
                  <span className={currentEmotion.valence > 0 ? 'text-green-600' : 'text-red-600'}>
                    {currentEmotion.valence > 0 ? '+' : ''}{currentEmotion.valence.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Arousal:</span>
                  <span>{currentEmotion.arousal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Average Emotion Over Time */}
        {avgEmotion && emotionHistory.length >= 5 && (
          <div className="border-t pt-3">
            <span className="text-xs text-muted-foreground">10-Second Average:</span>
            <div className="grid grid-cols-3 gap-2 text-xs mt-1">
              <div>
                <span className="block text-muted-foreground">Confidence</span>
                <span className="font-medium">{Math.round(avgEmotion.confidence * 100)}%</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Intensity</span>
                <span className="font-medium">{avgEmotion.intensity.toFixed(1)}/10</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Mood</span>
                <span className={`font-medium ${avgEmotion.valence > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {avgEmotion.valence > 0.1 ? 'Positive' : avgEmotion.valence < -0.1 ? 'Negative' : 'Neutral'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {cameraPermission === 'denied' && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
            <AlertTriangle className="h-4 w-4" />
            Camera access denied. Please enable camera permissions for emotion detection.
          </div>
        )}

        {!stream && cameraPermission !== 'denied' && (
          <div className="text-sm text-muted-foreground text-center p-4">
            <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Click the camera button to start emotion detection
          </div>
        )}

        {stream && !isDetecting && (
          <div className="text-sm text-muted-foreground text-center p-2 border rounded">
            Camera ready. Click the camera button to start detection.
          </div>
        )}

        {isInitializing && (
          <div className="text-sm text-blue-600 text-center p-2 bg-blue-50 rounded">
            <Brain className="h-4 w-4 mx-auto mb-1 animate-pulse" />
            Loading AI emotion models...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCameraEmotionDetection;