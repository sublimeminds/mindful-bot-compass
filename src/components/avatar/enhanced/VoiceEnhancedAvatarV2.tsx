import React, { useRef, useState, useEffect, useCallback } from 'react';
import { EnhancedEmotionAnalyzer, type EmotionResult } from '@/services/enhanced-emotion-analyzer';
import BulletproofThreeDAvatar from './BulletproofThreeDAvatar';

interface VoiceAnalysisResult {
  volume: number;
  pitch: number;
  energy: number;
  lipSyncData: Float32Array;
  emotion: EmotionResult | null;
  speechRate: number;
  silence: boolean;
}

interface VoiceEnhancedAvatarV2Props {
  therapistId: string;
  therapistName: string;
  audioStream?: MediaStream;
  isListening?: boolean;
  isSpeaking?: boolean;
  userText?: string;
  enableVoiceAnalysis?: boolean;
  enableEmotionDetection?: boolean;
  enableLipSync?: boolean;
  onVoiceAnalysis?: (analysis: VoiceAnalysisResult) => void;
  onEmotionDetected?: (emotion: EmotionResult) => void;
  className?: string;
}

const VoiceEnhancedAvatarV2: React.FC<VoiceEnhancedAvatarV2Props> = ({
  therapistId,
  therapistName,
  audioStream,
  isListening = false,
  isSpeaking = false,
  userText,
  enableVoiceAnalysis = true,
  enableEmotionDetection = true,
  enableLipSync = true,
  onVoiceAnalysis,
  onEmotionDetected,
  className = "w-full h-full"
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const emotionAnalyzer = useRef(new EnhancedEmotionAnalyzer());
  
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [voiceAnalysis, setVoiceAnalysis] = useState<VoiceAnalysisResult | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [lipSyncData, setLipSyncData] = useState<Float32Array>(new Float32Array(32));

  // Audio context setup with error handling
  const setupAudioContext = useCallback(async () => {
    try {
      if (!audioStream || !enableVoiceAnalysis) return;

      // Clean up existing context
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      // Create new audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create analyzer node
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;
      analyzer.smoothingTimeConstant = 0.8;
      analyzerRef.current = analyzer;

      // Connect audio stream
      const source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyzer);
      sourceRef.current = source;

      setAudioError(null);
      
      // Start analysis loop
      startVoiceAnalysis();
      
    } catch (error) {
      console.error('Audio context setup failed:', error);
      setAudioError(error instanceof Error ? error.message : 'Audio setup failed');
    }
  }, [audioStream, enableVoiceAnalysis]);

  // Voice analysis loop
  const startVoiceAnalysis = useCallback(() => {
    if (!analyzerRef.current || !enableVoiceAnalysis) return;

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const timeDataArray = new Float32Array(analyzer.fftSize);

    const analyze = () => {
      if (!analyzer) return;

      // Get frequency and time domain data
      analyzer.getFloatFrequencyData(dataArray);
      analyzer.getFloatTimeDomainData(timeDataArray);

      // Calculate volume (RMS)
      let sum = 0;
      for (let i = 0; i < timeDataArray.length; i++) {
        sum += timeDataArray[i] * timeDataArray[i];
      }
      const volume = Math.sqrt(sum / timeDataArray.length);

      // Calculate pitch (fundamental frequency)
      const pitch = calculatePitch(timeDataArray, audioContextRef.current?.sampleRate || 44100);

      // Calculate energy (spectral centroid)
      let weightedSum = 0;
      let magnitudeSum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const magnitude = Math.pow(10, dataArray[i] / 20);
        weightedSum += i * magnitude;
        magnitudeSum += magnitude;
      }
      const energy = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;

      // Calculate speech rate (zero crossing rate)
      let crossings = 0;
      for (let i = 1; i < timeDataArray.length; i++) {
        if ((timeDataArray[i] >= 0) !== (timeDataArray[i - 1] >= 0)) {
          crossings++;
        }
      }
      const speechRate = crossings / timeDataArray.length;

      // Check for silence
      const silence = volume < 0.01;

      // Generate lip sync data (formant frequencies)
      const lipSync = generateLipSyncData(dataArray, enableLipSync);
      setLipSyncData(lipSync);

      // Create analysis result
      const analysis: VoiceAnalysisResult = {
        volume: volume * 100,
        pitch,
        energy: energy / bufferLength,
        lipSyncData: lipSync,
        emotion: currentEmotion,
        speechRate: speechRate * 1000,
        silence
      };

      setVoiceAnalysis(analysis);
      onVoiceAnalysis?.(analysis);

      // Continue analysis
      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  }, [enableVoiceAnalysis, enableLipSync, currentEmotion, onVoiceAnalysis]);

  // Pitch detection using autocorrelation
  const calculatePitch = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    // Calculate RMS
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);

    if (rms < 0.01) return 0; // Too quiet

    // Autocorrelation
    let lastCorrelation = 1;
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      correlation = 1 - (correlation / MAX_SAMPLES);
      
      if (correlation > 0.9 && correlation > lastCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
      lastCorrelation = correlation;
    }

    return bestOffset > 0 ? sampleRate / bestOffset : 0;
  };

  // Generate lip sync data from frequency analysis
  const generateLipSyncData = (frequencyData: Float32Array, enabled: boolean): Float32Array => {
    if (!enabled) return new Float32Array(32);

    const lipSyncBands = 32;
    const lipSyncData = new Float32Array(lipSyncBands);
    const bandsPerSyncBand = Math.floor(frequencyData.length / lipSyncBands);

    for (let i = 0; i < lipSyncBands; i++) {
      let sum = 0;
      const start = i * bandsPerSyncBand;
      const end = start + bandsPerSyncBand;
      
      for (let j = start; j < end && j < frequencyData.length; j++) {
        sum += Math.pow(10, frequencyData[j] / 20);
      }
      
      lipSyncData[i] = Math.min(sum / bandsPerSyncBand, 1.0);
    }

    return lipSyncData;
  };

  // Text-based emotion analysis
  useEffect(() => {
    if (userText && enableEmotionDetection) {
      const emotion = emotionAnalyzer.current.analyze(userText, {
        timeOfDay: getTimeOfDay(),
        sessionDuration: Date.now() // Simplified
      });
      
      setCurrentEmotion(emotion);
      onEmotionDetected?.(emotion);
    }
  }, [userText, enableEmotionDetection, onEmotionDetected]);

  // Audio stream setup
  useEffect(() => {
    if (audioStream && enableVoiceAnalysis) {
      setupAudioContext();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioStream, setupAudioContext, enableVoiceAnalysis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Helper function to get time of day
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  };

  return (
    <div className={className}>
      <BulletproofThreeDAvatar
        therapistId={therapistId}
        therapistName={therapistName}
        emotion={currentEmotion?.emotion || 'neutral'}
        isListening={isListening}
        isSpeaking={isSpeaking}
        userEmotion={userText}
        lipSyncData={lipSyncData}
        className="w-full h-full"
        onError={(error) => {
          console.error('3D Avatar error:', error);
          setAudioError(error.message);
        }}
        onContextLoss={() => {
          console.warn('WebGL context lost in voice avatar');
        }}
        onContextRestore={() => {
          console.log('WebGL context restored in voice avatar');
        }}
      />

      {/* Audio error indicator */}
      {audioError && (
        <div className="absolute top-2 left-2 right-2">
          <div className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 text-center">
            Audio: {audioError}
          </div>
        </div>
      )}

      {/* Voice analysis debug info (dev mode) */}
      {process.env.NODE_ENV === 'development' && voiceAnalysis && (
        <div className="absolute top-2 right-2 text-xs bg-black bg-opacity-75 text-white p-2 rounded">
          <div>Vol: {voiceAnalysis.volume.toFixed(1)}</div>
          <div>Pitch: {voiceAnalysis.pitch.toFixed(0)}Hz</div>
          <div>Energy: {voiceAnalysis.energy.toFixed(2)}</div>
          <div>Rate: {voiceAnalysis.speechRate.toFixed(1)}</div>
          {currentEmotion && (
            <div>Emotion: {currentEmotion.emotion} ({(currentEmotion.confidence * 100).toFixed(0)}%)</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceEnhancedAvatarV2;