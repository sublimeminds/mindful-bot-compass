import React, { useState, useEffect, useRef } from 'react';
import UniversalTherapistAvatar from './UniversalTherapistAvatar';
import { getVoiceIdForTherapist } from '@/services/therapistAvatarMapping';

interface VoiceEnhancedAvatarProps {
  therapistId: string;
  therapistName?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  userEmotion?: string;
  showControls?: boolean;
  className?: string;
  currentMessage?: string; // Current message being spoken
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
}

const VoiceEnhancedAvatar: React.FC<VoiceEnhancedAvatarProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  userEmotion,
  showControls = true,
  className = "w-full h-full",
  currentMessage,
  onSpeakingStateChange
}) => {
  const [lipSyncData, setLipSyncData] = useState<Float32Array | undefined>();
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Initialize audio analysis for lip sync
  useEffect(() => {
    if (isSpeaking && currentMessage) {
      initializeAudioAnalysis();
    } else {
      stopAudioAnalysis();
    }

    return () => {
      stopAudioAnalysis();
    };
  }, [isSpeaking, currentMessage]);

  const initializeAudioAnalysis = async () => {
    try {
      // Create audio context for analyzing speech
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create analyzer for frequency analysis
      analyzerRef.current = audioContext.createAnalyser();
      analyzerRef.current.fftSize = 256;
      
      setIsAnalyzingAudio(true);
      startLipSyncAnalysis();
      
    } catch (error) {
      console.warn('Audio analysis initialization failed:', error);
      // Generate synthetic lip sync data as fallback
      generateSyntheticLipSync();
    }
  };

  const startLipSyncAnalysis = () => {
    if (!analyzerRef.current) return;

    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    
    const analyze = () => {
      if (!analyzerRef.current || !isAnalyzingAudio) return;

      analyzerRef.current.getByteFrequencyData(dataArray);
      
      // Convert to Float32Array for lip sync
      const lipSyncArray = new Float32Array(dataArray.length);
      for (let i = 0; i < dataArray.length; i++) {
        lipSyncArray[i] = (dataArray[i] / 255.0) * 2 - 1; // Normalize to -1 to 1
      }
      
      setLipSyncData(lipSyncArray);
      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  const generateSyntheticLipSync = () => {
    if (!currentMessage) return;

    // Generate synthetic lip sync based on message content
    const messageLength = currentMessage.length;
    const duration = Math.max(2, messageLength * 0.1); // Estimate speaking duration
    
    let startTime = Date.now();
    
    const generateFrame = () => {
      if (!isSpeaking) return;

      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Generate synthetic audio data that simulates speech patterns
      const dataLength = 128;
      const syntheticData = new Float32Array(dataLength);
      
      for (let i = 0; i < dataLength; i++) {
        // Create speech-like frequency patterns
        const frequency = i / dataLength;
        let amplitude = 0;
        
        // Simulate vowel sounds (lower frequencies)
        if (frequency < 0.3) {
          amplitude = Math.sin(elapsed * 10 + i * 0.5) * 0.4;
        }
        // Simulate consonant sounds (higher frequencies)
        else if (frequency < 0.6) {
          amplitude = Math.sin(elapsed * 15 + i * 0.8) * 0.2;
        }
        // Add some noise for realism
        amplitude += (Math.random() - 0.5) * 0.1;
        
        // Apply speech envelope
        const envelope = Math.sin(elapsed * 3) * 0.5 + 0.5;
        syntheticData[i] = amplitude * envelope * (1 - progress);
      }
      
      setLipSyncData(syntheticData);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(generateFrame);
      }
    };

    generateFrame();
  };

  const stopAudioAnalysis = () => {
    setIsAnalyzingAudio(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyzerRef.current = null;
    setLipSyncData(undefined);
  };

  // Enhanced emotion detection based on message content
  const detectEmotionFromMessage = (message: string): 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' => {
    if (!message) return 'neutral';
    
    const lowerMessage = message.toLowerCase();
    
    // Happy/encouraging words
    if (lowerMessage.match(/\b(great|wonderful|excellent|amazing|fantastic|good job|well done|proud|success|achievement)\b/)) {
      return 'happy';
    }
    
    // Encouraging words
    if (lowerMessage.match(/\b(you can|believe in|support|help|together|strength|courage|possible)\b/)) {
      return 'encouraging';
    }
    
    // Concerned words
    if (lowerMessage.match(/\b(difficult|hard|challenging|struggle|worry|concern|understand|sorry)\b/)) {
      return 'concerned';
    }
    
    // Thoughtful words
    if (lowerMessage.match(/\b(think|consider|reflect|explore|understand|perspective|insight)\b/)) {
      return 'thoughtful';
    }
    
    return 'neutral';
  };

  // Auto-detect emotion from current message
  const autoEmotion = currentMessage ? detectEmotionFromMessage(currentMessage) : emotion;

  return (
    <UniversalTherapistAvatar
      therapistId={therapistId}
      therapistName={therapistName}
      emotion={autoEmotion}
      isListening={isListening}
      isSpeaking={isSpeaking}
      userEmotion={userEmotion}
      lipSyncData={lipSyncData}
      showControls={showControls}
      className={className}
    />
  );
};

export default VoiceEnhancedAvatar;