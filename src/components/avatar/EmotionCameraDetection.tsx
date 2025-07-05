import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: Date;
}

interface EmotionCameraDetectionProps {
  onEmotionDetected?: (emotion: EmotionResult) => void;
  isActive?: boolean;
  showPreview?: boolean;
}

const EmotionCameraDetection: React.FC<EmotionCameraDetectionProps> = ({
  onEmotionDetected,
  isActive = false,
  showPreview = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [showVideo, setShowVideo] = useState(showPreview);
  const { toast } = useToast();

  // Simple emotion detection using face analysis
  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isDetecting) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Simple heuristic-based emotion detection
      // In a real implementation, you'd use a proper ML model
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const emotion = analyzeImageForEmotion(imageData);
      
      const result: EmotionResult = {
        emotion: emotion.label,
        confidence: emotion.confidence,
        timestamp: new Date()
      };

      setCurrentEmotion(result);
      onEmotionDetected?.(result);

    } catch (error) {
      console.error('Error detecting emotion:', error);
    }
  }, [isDetecting, onEmotionDetected]);

  // Simplified emotion analysis (placeholder for real ML model)
  const analyzeImageForEmotion = (imageData: ImageData): { label: string; confidence: number } => {
    // This is a placeholder - in reality you'd use @huggingface/transformers
    // with a proper emotion detection model
    
    // Simple brightness-based emotion estimation as a demo
    const data = imageData.data;
    let brightness = 0;
    let colorfulness = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      brightness += (r + g + b) / 3;
      colorfulness += Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
    }
    
    brightness /= (data.length / 4);
    colorfulness /= (data.length / 4);
    
    // Basic heuristics for demo purposes
    if (brightness > 150 && colorfulness > 50) {
      return { label: 'happy', confidence: 0.7 };
    } else if (brightness < 100) {
      return { label: 'sad', confidence: 0.6 };
    } else if (colorfulness > 80) {
      return { label: 'excited', confidence: 0.6 };
    } else {
      return { label: 'neutral', confidence: 0.8 };
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      setStream(mediaStream);
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      toast({
        title: "Camera Access Granted",
        description: "Emotion detection is now active",
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

  // Start emotion detection loop
  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(detectEmotion, 1000); // Detect every second
    return () => clearInterval(interval);
  }, [detectEmotion, isDetecting]);

  // Auto-start if isActive prop is true
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
    switch (emotion) {
      case 'happy': return 'bg-green-100 text-green-800 border-green-200';
      case 'sad': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'angry': return 'bg-red-100 text-red-800 border-red-200';
      case 'surprised': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excited': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Emotion Detection
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
              className="w-full h-32 object-cover rounded-lg bg-black"
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            {isDetecting && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        )}

        {/* Current Emotion Display */}
        {currentEmotion && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Emotion:</span>
            <Badge className={getEmotionColor(currentEmotion.emotion)}>
              {currentEmotion.emotion} ({Math.round(currentEmotion.confidence * 100)}%)
            </Badge>
          </div>
        )}

        {/* Status Messages */}
        {cameraPermission === 'denied' && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Camera access denied. Please enable camera permissions for emotion detection.
          </div>
        )}

        {!stream && cameraPermission !== 'denied' && (
          <div className="text-sm text-muted-foreground text-center p-4">
            Click the camera button to start emotion detection
          </div>
        )}

        {stream && !isDetecting && (
          <div className="text-sm text-muted-foreground text-center p-2">
            Camera ready. Click the camera button to start detection.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionCameraDetection;