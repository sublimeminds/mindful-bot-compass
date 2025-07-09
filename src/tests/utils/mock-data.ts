export const mockTherapistData = [
  {
    id: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen',
    title: 'Clinical Psychologist',
    description: 'Specializes in cognitive behavioral therapy with a warm, empathetic approach.',
    approach: 'CBT',
    specialties: ['Anxiety', 'Depression', 'PTSD'],
    communicationStyle: 'Warm and empathetic',
    icon: 'Brain',
    colorScheme: 'from-blue-500 to-blue-600',
    effectiveness_areas: {
      anxiety: 0.95,
      depression: 0.88,
      stress: 0.92
    },
    personality_traits: {
      empathy: 0.9,
      patience: 0.95,
      directness: 0.7
    }
  },
  {
    id: 'dr-marcus-rodriguez',
    name: 'Dr. Marcus Rodriguez',
    title: 'Licensed Therapist',
    description: 'Experienced in trauma-informed care and mindfulness-based interventions.',
    approach: 'Mindfulness-Based',
    specialties: ['Trauma', 'PTSD', 'Mindfulness'],
    communicationStyle: 'Calm and grounding',
    icon: 'Heart',
    colorScheme: 'from-green-500 to-green-600',
    effectiveness_areas: {
      trauma: 0.93,
      ptsd: 0.91,
      mindfulness: 0.97
    },
    personality_traits: {
      empathy: 0.88,
      patience: 0.93,
      directness: 0.75
    }
  }
];

export const mockConversationHistory = [
  {
    id: '1',
    role: 'user',
    content: 'I\'ve been feeling really anxious lately about work.',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    emotion: 'anxious'
  },
  {
    id: '2',
    role: 'assistant',
    content: 'I understand that work anxiety can be overwhelming. Can you tell me more about what specific aspects of work are causing you the most stress?',
    timestamp: new Date('2024-01-15T10:00:30Z'),
    emotion: 'empathetic',
    therapistId: 'dr-sarah-chen'
  },
  {
    id: '3',
    role: 'user',
    content: 'It\'s mainly the deadlines and feeling like I\'m not good enough.',
    timestamp: new Date('2024-01-15T10:01:00Z'),
    emotion: 'worried'
  }
];

export const mockEmotionAnalysis = {
  primary_emotion: 'anxiety',
  confidence: 0.85,
  intensity: 0.7,
  secondary_emotions: ['worry', 'frustration'],
  stress_level: 0.8,
  risk_indicators: ['perfectionism', 'self-doubt'],
  therapeutic_recommendations: ['cognitive restructuring', 'breathing exercises']
};

export const mockVoiceData = {
  lipSyncData: new Float32Array([0.1, 0.3, 0.5, 0.7, 0.4, 0.2, 0.0]),
  emotion: 'calm',
  pitch: 220,
  volume: 0.7,
  speaking_rate: 1.0
};

export const mockAvatarPersona = {
  id: 'dr-sarah-chen',
  name: 'Dr. Sarah Chen',
  appearance: {
    hairColor: '#2C1810',
    skinTone: '#F4D3AE',
    eyeColor: '#4A5568',
    outfit: 'professional'
  },
  gestures: {
    nodding: 0.8,
    hand_movements: 0.6,
    leaning_forward: 0.7
  },
  voice_characteristics: {
    pitch: 180,
    warmth: 0.9,
    pace: 'moderate'
  }
};

export const mockWebGLCapabilities = {
  webgl: true,
  webgl2: false,
  maxTextureSize: 2048,
  maxVertexUniforms: 1024,
  extensions: ['OES_standard_derivatives']
};

export const mockPerformanceMetrics = {
  frameRate: 60,
  memoryUsage: 50.5,
  renderTime: 16.67,
  triangleCount: 1200,
  textureMemory: 25.3
};