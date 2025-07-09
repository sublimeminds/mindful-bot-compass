import React, { useRef, useEffect, useState, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';

interface EmotionDetectionSystemProps {
  onEmotionDetected: (emotion: string, confidence: number) => void;
  isActive?: boolean;
  detectionInterval?: number;
  children?: React.ReactNode;
}

interface DetectedEmotion {
  label: string;
  score: number;
}

interface EmotionState {
  currentEmotion: string;
  confidence: number;
  history: Array<{ emotion: string; confidence: number; timestamp: number }>;
  isDetecting: boolean;
  error: string | null;
}

const EmotionDetectionSystem: React.FC<EmotionDetectionSystemProps> = ({
  onEmotionDetected,
  isActive = false,
  detectionInterval = 2000,
  children
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pipelineRef = useRef<any>(null);

  const [emotionState, setEmotionState] = useState<EmotionState>({
    currentEmotion: 'neutral',
    confidence: 0,
    history: [],
    isDetecting: false,
    error: null
  });

  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [modelLoaded, setModelLoaded] = useState(false);

  // Initialize emotion detection model
  const initializeModel = useCallback(async () => {
    try {
      console.log('Loading emotion detection model...');
      
      // Use a lightweight emotion detection model
      const emotionPipeline = await pipeline(
        'image-classification',
        'onnx-community/emotion-ferplus-8',
        { device: 'webgpu' }
      );
      
      pipelineRef.current = emotionPipeline;
      setModelLoaded(true);
      console.log('Emotion detection model loaded successfully');
    } catch (error) {
      console.warn('Failed to load emotion detection model:', error);
      setEmotionState(prev => ({ 
        ...prev, 
        error: 'Failed to load emotion detection model' 
      }));
    }
  }, []);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setPermissionState('granted');
      }
    } catch (error) {
      console.warn('Camera access denied or failed:', error);
      setPermissionState('denied');
      setEmotionState(prev => ({ 
        ...prev, 
        error: 'Camera access required for emotion detection' 
      }));
    }
  }, []);

  // Capture frame from video
  const captureFrame = useCallback((): ImageData | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== 4) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  // Detect emotion from current frame
  const detectEmotion = useCallback(async () => {
    if (!pipelineRef.current || !isActive || !modelLoaded) return;

    try {
      setEmotionState(prev => ({ ...prev, isDetecting: true }));

      const imageData = captureFrame();
      if (!imageData) return;

      // Convert ImageData to format suitable for the model
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Use canvas as input for the emotion detection pipeline
      const emotions = await pipelineRef.current(canvas) as DetectedEmotion[];
      
      if (emotions && emotions.length > 0) {
        // Get the highest confidence emotion
        const topEmotion = emotions.reduce((prev, current) => 
          prev.score > current.score ? prev : current
        );

        const emotionLabel = mapEmotionLabel(topEmotion.label);
        const confidence = topEmotion.score;

        // Update emotion state
        setEmotionState(prev => ({
          ...prev,
          currentEmotion: emotionLabel,
          confidence,
          history: [
            ...prev.history.slice(-10), // Keep last 10 detections
            { emotion: emotionLabel, confidence, timestamp: Date.now() }
          ],
          isDetecting: false,
          error: null
        }));

        // Call callback with detected emotion
        onEmotionDetected(emotionLabel, confidence);
      }
    } catch (error) {
      console.warn('Emotion detection error:', error);
      setEmotionState(prev => ({ 
        ...prev, 
        isDetecting: false,
        error: 'Detection failed' 
      }));
    }
  }, [isActive, modelLoaded, captureFrame, onEmotionDetected]);

  // Map model emotion labels to our emotion system
  const mapEmotionLabel = (modelLabel: string): string => {
    const emotionMap: Record<string, string> = {
      'angry': 'angry',
      'disgust': 'concerned',
      'fear': 'concerned',
      'happy': 'happy',
      'sad': 'sad',
      'surprise': 'encouraging',
      'neutral': 'neutral',
      'joy': 'happy',
      'sadness': 'sad',
      'anger': 'angry',
      'contempt': 'concerned'
    };

    const lowerLabel = modelLabel.toLowerCase();
    return emotionMap[lowerLabel] || 'neutral';
  };

  // Get smoothed emotion (average of recent detections)
  const getSmoothedEmotion = useCallback((): { emotion: string; confidence: number } => {
    if (emotionState.history.length === 0) {
      return { emotion: 'neutral', confidence: 0 };
    }

    // Use recent history (last 3 detections)
    const recentHistory = emotionState.history.slice(-3);
    
    // Group by emotion
    const emotionCounts: Record<string, { count: number; totalConfidence: number }> = {};
    
    recentHistory.forEach(({ emotion, confidence }) => {
      if (!emotionCounts[emotion]) {
        emotionCounts[emotion] = { count: 0, totalConfidence: 0 };
      }
      emotionCounts[emotion].count++;
      emotionCounts[emotion].totalConfidence += confidence;
    });

    // Find most frequent emotion with highest average confidence
    let bestEmotion = 'neutral';
    let bestScore = 0;

    Object.entries(emotionCounts).forEach(([emotion, data]) => {
      const avgConfidence = data.totalConfidence / data.count;
      const score = data.count * avgConfidence; // Frequency * confidence
      
      if (score > bestScore) {
        bestScore = score;
        bestEmotion = emotion;
      }
    });

    const avgConfidence = emotionCounts[bestEmotion]?.totalConfidence / emotionCounts[bestEmotion]?.count || 0;
    
    return { emotion: bestEmotion, confidence: avgConfidence };
  }, [emotionState.history]);

  // Initialize system when activated
  useEffect(() => {
    if (isActive && !modelLoaded) {
      initializeModel();
    }
    
    if (isActive && permissionState === 'pending') {
      initializeCamera();
    }
  }, [isActive, modelLoaded, permissionState, initializeModel, initializeCamera]);

  // Start/stop detection interval
  useEffect(() => {
    if (isActive && modelLoaded && permissionState === 'granted') {
      intervalRef.current = setInterval(detectEmotion, detectionInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, modelLoaded, permissionState, detectEmotion, detectionInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="emotion-detection-system">
      {/* Hidden video element for camera feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ display: 'none' }}
      />
      
      {/* Hidden canvas for image processing */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {/* Debug panel - only show in development */}
      {process.env.NODE_ENV === 'development' && isActive && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
          <div className="space-y-1">
            <div>Model: {modelLoaded ? '✅ Loaded' : '⏳ Loading...'}</div>
            <div>Camera: {permissionState === 'granted' ? '✅ Active' : 
                         permissionState === 'denied' ? '❌ Denied' : '⏳ Requesting...'}</div>
            <div>Status: {emotionState.isDetecting ? '🔍 Detecting' : '⏸️ Idle'}</div>
            <div>Emotion: {emotionState.currentEmotion}</div>
            <div>Confidence: {(emotionState.confidence * 100).toFixed(1)}%</div>
            {emotionState.error && <div className="text-red-400">Error: {emotionState.error}</div>}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default EmotionDetectionSystem;