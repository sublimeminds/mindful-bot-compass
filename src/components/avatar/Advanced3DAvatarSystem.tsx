import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { supabase } from '@/integrations/supabase/client';
import { useConversation } from '@11labs/react';

interface EmotionData {
  name: string;
  score: number;
  intensity: 'low' | 'medium' | 'high';
}

interface Advanced3DAvatarSystemProps {
  therapistId: string;
  isActive?: boolean;
  emotions?: EmotionData[];
  onEmotionChange?: (emotion: string) => void;
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
  className?: string;
}

interface AvatarState {
  expression: string;
  lipSyncBlend: number;
  emotionalIntensity: number;
  gestureType: 'idle' | 'listening' | 'speaking' | 'nodding' | 'thinking';
  eyeContact: boolean;
  breathing: number;
}

const Advanced3DAvatarModel = ({ 
  avatarUrl, 
  avatarState, 
  therapistPersonality 
}: { 
  avatarUrl: string;
  avatarState: AvatarState;
  therapistPersonality: any;
}) => {
  const avatarRef = useRef<any>();
  const [model, setModel] = useState<any>(null);

  useFrame((state, delta) => {
    if (!avatarRef.current) return;

    // Breathing animation
    const breathingIntensity = 0.01 + avatarState.breathing * 0.005;
    avatarRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.5) * breathingIntensity;

    // Subtle idle movements based on personality
    if (avatarState.gestureType === 'idle') {
      const personalityFactor = therapistPersonality.energyLevel || 0.5;
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02 * personalityFactor;
      avatarRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.003 * personalityFactor;
    }

    // Listening gesture - lean forward slightly
    if (avatarState.gestureType === 'listening') {
      avatarRef.current.rotation.x = -0.05;
      avatarRef.current.position.z = 0.02;
    }

    // Speaking gestures
    if (avatarState.gestureType === 'speaking') {
      const speakingIntensity = avatarState.lipSyncBlend;
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.01 * speakingIntensity;
    }

    // Eye contact simulation
    if (avatarState.eyeContact) {
      // Subtle head tracking toward camera
      avatarRef.current.lookAt(state.camera.position);
    }
  });

  useEffect(() => {
    // Load Ready Player Me avatar
    const loadAvatar = async () => {
      try {
        const response = await fetch(avatarUrl);
        // Implementation would load and setup the 3D avatar model
        // This is a simplified version
      } catch (error) {
        console.error('Failed to load avatar:', error);
      }
    };

    if (avatarUrl) {
      loadAvatar();
    }
  }, [avatarUrl]);

  return (
    <group ref={avatarRef}>
      {/* Placeholder for actual Ready Player Me avatar */}
      <mesh>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial 
          color={avatarState.expression === 'happy' ? '#ffeb3b' : 
                 avatarState.expression === 'concerned' ? '#f44336' : '#2196f3'} 
        />
      </mesh>
    </group>
  );
};

const Advanced3DAvatarSystem: React.FC<Advanced3DAvatarSystemProps> = ({
  therapistId,
  isActive = false,
  emotions = [],
  onEmotionChange,
  onSpeakingStateChange,
  className = ''
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarState, setAvatarState] = useState<AvatarState>({
    expression: 'neutral',
    lipSyncBlend: 0,
    emotionalIntensity: 0.5,
    gestureType: 'idle',
    eyeContact: true,
    breathing: 1
  });
  const [therapistPersonality, setTherapistPersonality] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // ElevenLabs conversation integration
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs'),
    onDisconnect: () => console.log('Disconnected from ElevenLabs'),
    onMessage: (message) => {
      console.log('Received message:', message);
      handleVoiceMessage(message);
    },
    onError: (error) => console.error('ElevenLabs error:', error)
  });

  const handleVoiceMessage = useCallback((message: any) => {
    if (message.type === 'audio_start') {
      setAvatarState(prev => ({ ...prev, gestureType: 'speaking', lipSyncBlend: 1 }));
      onSpeakingStateChange?.(true);
    } else if (message.type === 'audio_end') {
      setAvatarState(prev => ({ ...prev, gestureType: 'idle', lipSyncBlend: 0 }));
      onSpeakingStateChange?.(false);
    } else if (message.type === 'audio_data') {
      // Process audio for lip sync
      const audioIntensity = calculateAudioIntensity(message.data);
      setAvatarState(prev => ({ ...prev, lipSyncBlend: audioIntensity }));
    }
  }, [onSpeakingStateChange]);

  const calculateAudioIntensity = (audioData: any): number => {
    // Simplified audio intensity calculation
    // In production, this would use proper audio analysis
    return Math.random() * 0.8 + 0.2;
  };

  const loadTherapistAvatar = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get therapist-specific avatar configuration
      const { data: avatarData, error } = await supabase.functions.invoke('ready-player-me', {
        body: {
          action: 'getTherapistAvatar',
          therapistId,
          includePersonality: true
        }
      });

      if (error) throw error;

      setAvatarUrl(avatarData.avatarUrl);
      setTherapistPersonality(avatarData.personality);
      
    } catch (error) {
      console.error('Failed to load therapist avatar:', error);
    } finally {
      setIsLoading(false);
    }
  }, [therapistId]);

  const updateEmotionalState = useCallback(async (emotions: EmotionData[]) => {
    if (!emotions.length) return;

    const primaryEmotion = emotions[0];
    const emotionalIntensity = primaryEmotion.score;

    // Map Hume AI emotions to avatar expressions
    const expressionMap: Record<string, string> = {
      'Joy': 'happy',
      'Sadness': 'sad',
      'Anger': 'concerned',
      'Fear': 'concerned',
      'Surprise': 'surprised',
      'Disgust': 'concerned',
      'Contempt': 'neutral',
      'Anxiety': 'concerned',
      'Excitement': 'happy',
      'Confusion': 'thoughtful'
    };

    const newExpression = expressionMap[primaryEmotion.name] || 'neutral';
    
    setAvatarState(prev => ({
      ...prev,
      expression: newExpression,
      emotionalIntensity,
      gestureType: emotionalIntensity > 0.7 ? 'listening' : prev.gestureType
    }));

    // Update avatar expression via Ready Player Me
    try {
      await supabase.functions.invoke('ready-player-me', {
        body: {
          action: 'updateExpression',
          avatarId: avatarUrl.split('/').pop()?.split('.')[0],
          emotion: newExpression,
          intensity: emotionalIntensity
        }
      });
    } catch (error) {
      console.error('Failed to update avatar expression:', error);
    }

    onEmotionChange?.(newExpression);
  }, [avatarUrl, onEmotionChange]);

  useEffect(() => {
    loadTherapistAvatar();
  }, [loadTherapistAvatar]);

  useEffect(() => {
    if (emotions.length > 0) {
      updateEmotionalState(emotions);
    }
  }, [emotions, updateEmotionalState]);

  useEffect(() => {
    if (isActive && !conversation.status) {
      // Initialize ElevenLabs conversation for this therapist
      const initializeConversation = async () => {
        try {
          // Get therapist's voice configuration
          const { data } = await supabase.functions.invoke('elevenlabs-voice-preview', {
            body: {
              action: 'getTherapistVoice',
              therapistId
            }
          });

          if (data?.voiceId) {
            // Start conversation with therapist-specific voice
            await conversation.startSession({
              agentId: data.agentId,
              overrides: {
                tts: {
                  voiceId: data.voiceId
                }
              }
            });
          }
        } catch (error) {
          console.error('Failed to initialize conversation:', error);
        }
      };

      initializeConversation();
    }

    return () => {
      if (conversation.status === 'connected') {
        conversation.endSession();
      }
    };
  }, [isActive, therapistId, conversation]);

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-therapy-50 rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600">Loading 3D Avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        
        {/* Lighting setup for realistic avatar rendering */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
        
        {/* Environment for realistic reflections */}
        <Environment preset="studio" />
        
        {/* The 3D Avatar */}
        <Advanced3DAvatarModel 
          avatarUrl={avatarUrl}
          avatarState={avatarState}
          therapistPersonality={therapistPersonality}
        />
      </Canvas>

      {/* Avatar status overlay */}
      <div className="absolute top-4 right-4 space-y-2">
        {avatarState.gestureType === 'speaking' && (
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Speaking
          </div>
        )}
        {avatarState.gestureType === 'listening' && (
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Listening
          </div>
        )}
      </div>

      {/* Emotion indicator */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
          <div className="font-medium text-therapy-700">Current Emotion</div>
          <div className="text-therapy-600 capitalize">{avatarState.expression}</div>
        </div>
      </div>
    </div>
  );
};

export default Advanced3DAvatarSystem;