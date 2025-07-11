import React, { useState, useEffect } from 'react';

interface Alex2DAvatarProps {
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating';
  isAnimating?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showParticles?: boolean;
}

const Alex2DAvatar: React.FC<Alex2DAvatarProps> = ({
  emotion = 'neutral',
  isAnimating = false,
  isSpeaking = false,
  isListening = false,
  size = 'md',
  className = '',
  showParticles = false
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState(0);

  // Size configurations
  const sizeConfigs = {
    sm: { width: 40, height: 40, scale: 0.8 },
    md: { width: 60, height: 60, scale: 1 },
    lg: { width: 80, height: 80, scale: 1.2 },
    xl: { width: 120, height: 120, scale: 1.5 }
  };

  const config = sizeConfigs[size];

  // Animation cycles
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % 4);
      }, 150);
      return () => clearInterval(interval);
    } else {
      // Breathing animation when idle
      const interval = setInterval(() => {
        setBreathingPhase(prev => (prev + 1) % 60);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  // Emotion-based color schemes
  const getEmotionColors = () => {
    switch (emotion) {
      case 'happy':
        return {
          primary: '#10B981', // emerald-500
          secondary: '#34D399', // emerald-400
          accent: '#FCD34D', // amber-300
          bg: '#ECFDF5' // emerald-50
        };
      case 'encouraging':
        return {
          primary: '#8B5CF6', // violet-500
          secondary: '#A78BFA', // violet-400
          accent: '#F59E0B', // amber-500
          bg: '#F5F3FF' // violet-50
        };
      case 'concerned':
        return {
          primary: '#EF4444', // red-500
          secondary: '#F87171', // red-400
          accent: '#FCA5A5', // red-300
          bg: '#FEF2F2' // red-50
        };
      case 'thoughtful':
        return {
          primary: '#6366F1', // indigo-500
          secondary: '#818CF8', // indigo-400
          accent: '#C7D2FE', // indigo-200
          bg: '#EEF2FF' // indigo-50
        };
      case 'excited':
        return {
          primary: '#F59E0B', // amber-500
          secondary: '#FBBF24', // amber-400
          accent: '#FDE047', // yellow-300
          bg: '#FFFBEB' // amber-50
        };
      case 'celebrating':
        return {
          primary: '#EC4899', // pink-500
          secondary: '#F472B6', // pink-400
          accent: '#FBBF24', // amber-400
          bg: '#FDF2F8' // pink-50
        };
      case 'empathetic':
        return {
          primary: '#06B6D4', // cyan-500
          secondary: '#22D3EE', // cyan-400
          accent: '#67E8F9', // cyan-300
          bg: '#ECFEFF' // cyan-50
        };
      default:
        return {
          primary: '#6366F1', // indigo-500
          secondary: '#818CF8', // indigo-400
          accent: '#C7D2FE', // indigo-200
          bg: '#F8FAFC' // slate-50
        };
    }
  };

  const colors = getEmotionColors();
  const breathing = Math.sin(breathingPhase * 0.1) * 2;

  // Eye expressions based on emotion
  const getEyeExpression = () => {
    switch (emotion) {
      case 'happy':
      case 'celebrating':
      case 'excited':
        return { leftEye: '^', rightEye: '^', eyeSize: 6 };
      case 'concerned':
        return { leftEye: '○', rightEye: '○', eyeSize: 8 };
      case 'thoughtful':
        return { leftEye: '-', rightEye: '-', eyeSize: 6 };
      case 'encouraging':
      case 'empathetic':
        return { leftEye: '●', rightEye: '●', eyeSize: 7 };
      default:
        return { leftEye: '●', rightEye: '●', eyeSize: 6 };
    }
  };

  const eyeExpression = getEyeExpression();

  // Mouth expressions for speaking animation
  const getMouthShape = () => {
    if (isSpeaking) {
      const shapes = ['○', '◐', '◑', '●'];
      return shapes[currentFrame];
    }
    
    switch (emotion) {
      case 'happy':
      case 'excited':
      case 'celebrating':
        return '◡';
      case 'concerned':
        return '◔';
      case 'thoughtful':
        return '-';
      case 'encouraging':
      case 'empathetic':
        return '◡';
      default:
        return '◡';
    }
  };

  // Particle effects for special emotions
  const renderParticles = () => {
    if (!showParticles) return null;
    
    const particleCount = emotion === 'celebrating' ? 8 : 4;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i * 360) / particleCount;
      const delay = i * 0.2;
      
      particles.push(
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            backgroundColor: colors.accent,
            left: `${50 + Math.cos(angle * Math.PI / 180) * 40}%`,
            top: `${50 + Math.sin(angle * Math.PI / 180) * 40}%`,
            animationDelay: `${delay}s`,
            animationDuration: '2s'
          }}
        />
      );
    }
    
    return particles;
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ 
        width: config.width, 
        height: config.height,
        transform: `scale(${config.scale + breathing * 0.01})`
      }}
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 animate-pulse"
        style={{ 
          backgroundColor: colors.primary,
          filter: 'blur(8px)',
          transform: `scale(${1.2 + breathing * 0.02})`
        }}
      />
      
      {/* Main avatar container */}
      <div 
        className="relative w-full h-full rounded-full border-2 overflow-hidden shadow-lg transition-all duration-300"
        style={{ 
          backgroundColor: colors.bg,
          borderColor: colors.primary,
          transform: isAnimating ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {/* Hair/head shape */}
        <div 
          className="absolute top-1 left-1/2 transform -translate-x-1/2 rounded-full"
          style={{
            width: '80%',
            height: '60%',
            backgroundColor: colors.primary,
            clipPath: 'ellipse(40% 30% at 50% 40%)'
          }}
        />
        
        {/* Face */}
        <div className="absolute inset-2 rounded-full flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-2 mb-1">
            <div 
              className="flex items-center justify-center font-bold transition-all duration-200"
              style={{ 
                fontSize: `${eyeExpression.eyeSize * config.scale}px`,
                color: colors.primary,
                transform: isListening ? 'scaleX(1.2)' : 'scaleX(1)'
              }}
            >
              {eyeExpression.leftEye}
            </div>
            <div 
              className="flex items-center justify-center font-bold transition-all duration-200"
              style={{ 
                fontSize: `${eyeExpression.eyeSize * config.scale}px`,
                color: colors.primary,
                transform: isListening ? 'scaleX(1.2)' : 'scaleX(1)'
              }}
            >
              {eyeExpression.rightEye}
            </div>
          </div>
          
          {/* Mouth */}
          <div 
            className="flex items-center justify-center font-bold transition-all duration-150"
            style={{ 
              fontSize: `${8 * config.scale}px`,
              color: colors.secondary,
              transform: isSpeaking ? `scale(${1.1 + currentFrame * 0.1})` : 'scale(1)'
            }}
          >
            {getMouthShape()}
          </div>
        </div>
        
        {/* Cheek blush for certain emotions */}
        {(emotion === 'happy' || emotion === 'excited' || emotion === 'celebrating') && (
          <>
            <div 
              className="absolute rounded-full opacity-30"
              style={{
                width: '12%',
                height: '8%',
                backgroundColor: colors.accent,
                left: '20%',
                top: '55%'
              }}
            />
            <div 
              className="absolute rounded-full opacity-30"
              style={{
                width: '12%',
                height: '8%',
                backgroundColor: colors.accent,
                right: '20%',
                top: '55%'
              }}
            />
          </>
        )}
        
        {/* Special effects overlay */}
        {emotion === 'celebrating' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
        )}
        
        {/* Listening indicator */}
        {isListening && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
        )}
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
        )}
      </div>
      
      {/* Particle effects */}
      {renderParticles()}
      
      {/* Mood ring effect */}
      <div 
        className="absolute inset-0 rounded-full border-2 opacity-40 animate-spin"
        style={{ 
          borderColor: `transparent ${colors.accent} transparent transparent`,
          animationDuration: '4s'
        }}
      />
    </div>
  );
};

export default Alex2DAvatar;