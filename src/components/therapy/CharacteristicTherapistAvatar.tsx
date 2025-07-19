import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTherapistPersonality } from '@/hooks/useTherapistCharacter';
import UniversalTherapistAvatar from '@/components/avatar/UniversalTherapistAvatar';

interface CharacteristicTherapistAvatarProps {
  therapistId: string;
  userId?: string;
  currentEmotion?: string;
  sessionPhase?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
  lipSyncData?: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showPersonalityIndicators?: boolean;
}

export const CharacteristicTherapistAvatar: React.FC<CharacteristicTherapistAvatarProps> = ({
  therapistId,
  userId,
  currentEmotion = 'neutral',
  sessionPhase = 'opening',
  isListening = false,
  isSpeaking = false,
  lipSyncData,
  className,
  size = 'md',
  showPersonalityIndicators = true,
}) => {
  const {
    characterProfile,
    relationship,
    currentContext,
    updateContext,
    getCommunicationStyle,
    rapportLevel,
    relationshipStage,
  } = useTherapistPersonality(therapistId, userId);

  const [displayEmotion, setDisplayEmotion] = useState(currentEmotion);
  const [personalityState, setPersonalityState] = useState<{
    warmth: number;
    engagement: number;
    culturalAdaptation: boolean;
  }>({
    warmth: 0.7,
    engagement: 0.6,
    culturalAdaptation: false,
  });

  // Update context when props change
  useEffect(() => {
    updateContext({
      sessionPhase: sessionPhase || 'opening',
      emotionalState: currentEmotion,
    });
  }, [sessionPhase, currentEmotion, updateContext]);

  // Adapt avatar emotion based on character traits and relationship
  useEffect(() => {
    if (!characterProfile) return;

    const style = getCommunicationStyle();
    let adaptedEmotion = currentEmotion;

    // Adjust emotion based on therapist's communication style
    if (style.tone === 'warm_professional' && rapportLevel > 0.5) {
      if (currentEmotion === 'neutral') adaptedEmotion = 'thoughtful';
      if (currentEmotion === 'sad') adaptedEmotion = 'concerned';
    }

    if (style.tone === 'warm_direct') {
      if (currentEmotion === 'anxious') adaptedEmotion = 'encouraging';
      if (currentEmotion === 'confused') adaptedEmotion = 'thoughtful';
    }

    setDisplayEmotion(adaptedEmotion);

    // Update personality state based on character and relationship
    setPersonalityState({
      warmth: Math.min(0.9, 0.5 + rapportLevel * 0.4),
      engagement: relationshipStage === 'initial' ? 0.6 : Math.min(0.9, 0.7 + rapportLevel * 0.2),
      culturalAdaptation: !!characterProfile.speech_patterns?.cultural_references,
    });
  }, [characterProfile, currentEmotion, rapportLevel, relationshipStage, getCommunicationStyle]);

  // Get therapist name for avatar
  const therapistName = characterProfile?.therapist_id.replace('dr-', '').replace('-', ' ') || 'Therapist';

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar */}
      <UniversalTherapistAvatar
        therapistId={therapistId}
        therapistName={therapistName}
        emotion={displayEmotion}
        isListening={isListening}
        isSpeaking={isSpeaking}
        lipSyncData={lipSyncData}
        size={size}
        className="transition-all duration-500"
      />

      {/* Personality Indicators */}
      {showPersonalityIndicators && characterProfile && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          >
            {/* Warmth Indicator */}
            <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
              <div className="flex space-x-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      i < Math.floor(personalityState.warmth * 3)
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              
              {/* Cultural Adaptation Indicator */}
              {personalityState.culturalAdaptation && (
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Relationship Stage Indicator */}
      {relationship && size !== 'sm' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium"
        >
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              relationshipStage === 'initial' ? 'bg-yellow-500' :
              relationshipStage === 'building' ? 'bg-blue-500' :
              relationshipStage === 'established' ? 'bg-green-500' :
              relationshipStage === 'deepening' ? 'bg-purple-500' :
              'bg-primary'
            }`} />
            <span className="capitalize text-muted-foreground">
              {relationshipStage}
            </span>
          </div>
        </motion.div>
      )}

      {/* Session Context Indicator */}
      {sessionPhase && size === 'lg' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs"
        >
          <span className="text-muted-foreground capitalize">
            {sessionPhase.replace('_', ' ')}
          </span>
        </motion.div>
      )}
    </div>
  );
};