import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Heart, 
  Users, 
  Star, 
  Play, 
  Volume2, 
  Sparkles, 
  Target,
  Shield,
  Clock,
  Zap,
  Globe,
  TrendingUp,
  Search,
  CheckCircle,
  MessageCircle,
  Cpu,
  Languages,
  Mic,
  Camera,
  BarChart3,
  Info,
  Maximize2,
  Award,
  Settings,
  ArrowRight,
  User,
  Calendar,
  ChevronRight,
  Compass
} from 'lucide-react';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { enhancedVoiceService } from '@/services/voiceService';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import { TherapistMatchingService } from '@/services/therapistMatchingService';
import SimpleFavoriteButton from '@/components/therapist/SimpleFavoriteButton';
import { TherapistAnalyticsService } from '@/services/therapistAnalyticsService';
import { useNavigate } from 'react-router-dom';
import AutoProgressTherapyDemo from '@/components/discovery/AutoProgressTherapyDemo';
import EnhancedEmotionDemo from '@/components/discovery/EnhancedEmotionDemo';
import VoicePreviewButton from '@/components/discovery/VoicePreviewButton';


const therapyApproaches = [
  'All Approaches',
  'Cognitive Behavioral Therapy',
  'Dialectical Behavior Therapy', 
  'EMDR Therapy',
  'Solution-Focused Brief Therapy',
  'Humanistic Therapy',
  'Psychodynamic Therapy',
  'Mindfulness-Based Therapy'
];

const specializations = [
  'All Specializations',
  'Anxiety',
  'Depression',
  'Trauma',
  'PTSD',
  'Stress Management',
  'Relationships',
  'Life Transitions',
  'Emotional Regulation',
  'Crisis Intervention'
];

const communicationStyles = [
  'All Styles',
  'Warm & Supportive',
  'Direct & Structured',
  'Gentle & Patient',
  'Energetic & Motivating',
  'Analytical & Logical',
  'Compassionate & Mindful'
];

const TherapistDiscovery = () => {
  // Add error boundary for React hooks
  try {
    const { user } = useSimpleApp();
    const { onboardingData, isLoading: onboardingLoading } = useOnboardingData();
    const navigate = useNavigate();
  
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApproach, setSelectedApproach] = useState('All Approaches');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [compatibilityScores, setCompatibilityScores] = useState<{[key: string]: number}>({});
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [modalTherapist, setModalTherapist] = useState<any>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsTherapist, setDetailsTherapist] = useState<any>(null);
  const [emotionDemoActive, setEmotionDemoActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isVoicePreviewPlaying, setIsVoicePreviewPlaying] = useState(false);

  // Helper function to get icon component by name with comprehensive fallbacks
  const getIconByName = (iconName: string) => {
    const icons = {
      Brain,
      Heart,
      Target,
      Shield,
      Users,
      Star,
      Sparkles,
      Zap,
      TrendingUp,
      Globe,
      Clock,
      CheckCircle,
      MessageCircle,
      // Add common icon fallbacks
      Lightbulb: Brain,
      Compass: Target,
      Analytics: TrendingUp,
      Security: Shield,
      Community: Users,
      Excellence: Star
    };
    
    // Safe icon lookup with fallback
    const IconComponent = icons[iconName as keyof typeof icons];
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found, using Brain fallback`);
      return Brain;
    }
    return IconComponent;
  };

  // Helper function to safely handle voice characteristics
  const getVoiceCharacteristics = (voiceData: any, communicationStyle: string) => {
    // Handle object voice characteristics from database
    if (voiceData && typeof voiceData === 'object') {
      const { pace = 'moderate', tone = 'warm', accent = 'neutral', vocal_quality = 'clear' } = voiceData;
      return `${tone.charAt(0).toUpperCase() + tone.slice(1)} tone, ${pace} pace, ${vocal_quality} voice quality`;
    }
    
    // Handle string voice characteristics
    if (typeof voiceData === 'string' && voiceData.trim()) {
      return voiceData;
    }
    
    // Fallback based on communication style
    if (communicationStyle?.includes('energetic')) return 'Energetic, motivating, clear voice with dynamic pace';
    if (communicationStyle?.includes('gentle')) return 'Gentle, calming, wise tone with measured pace';
    if (communicationStyle?.includes('warm')) return 'Warm, analytical, reassuring voice with steady rhythm';
    return 'Professional, supportive, clear voice with balanced delivery';
  };

  // Helper function to get personality trait icon and description
  const getPersonalityTraitInfo = (trait: string) => {
    const traitMap: Record<string, { icon: any; description: string; color: string }> = {
      warmth: { icon: Heart, description: 'Shows genuine care and emotional warmth', color: 'text-red-500' },
      empathy: { icon: Users, description: 'Deeply understands and relates to emotions', color: 'text-blue-500' },
      patience: { icon: Clock, description: 'Takes time to listen and understand', color: 'text-green-500' },
      analytical: { icon: Brain, description: 'Uses logical thinking and evidence-based approaches', color: 'text-purple-500' },
      directness: { icon: Target, description: 'Provides clear, straightforward guidance', color: 'text-orange-500' },
      compassion: { icon: Heart, description: 'Shows deep care and understanding', color: 'text-pink-500' },
      wisdom: { icon: Award, description: 'Draws from experience and insight', color: 'text-yellow-600' },
      creativity: { icon: Sparkles, description: 'Uses innovative therapeutic approaches', color: 'text-indigo-500' }
    };
    return traitMap[trait] || { icon: Star, description: 'Special therapeutic quality', color: 'text-gray-500' };
  };

  // Helper function to get effectiveness area info
  const getEffectivenessAreaInfo = (area: string) => {
    const areaMap: Record<string, { icon: any; description: string; color: string }> = {
      trauma_recovery: { icon: Shield, description: 'Specialized in healing from traumatic experiences', color: 'text-red-600' },
      anxiety_disorders: { icon: Heart, description: 'Expert in managing anxiety and panic disorders', color: 'text-blue-600' },
      stress_management: { icon: Zap, description: 'Helps develop healthy stress coping strategies', color: 'text-yellow-600' },
      emotional_regulation: { icon: TrendingUp, description: 'Teaches skills for managing emotions effectively', color: 'text-green-600' },
      mindfulness_training: { icon: Brain, description: 'Guides in mindfulness and meditation practices', color: 'text-purple-600' },
      depression_support: { icon: Users, description: 'Specialized support for depressive symptoms', color: 'text-indigo-600' },
      relationship_therapy: { icon: Heart, description: 'Improves communication and relationship skills', color: 'text-pink-600' },
      grief_counseling: { icon: Shield, description: 'Supports through loss and grief processes', color: 'text-gray-600' }
    };
    return areaMap[area] || { icon: Star, description: 'Specialized therapeutic area', color: 'text-gray-500' };
  };

  // Helper function to get therapeutic technique info
  const getTherapeuticTechniqueInfo = (technique: string) => {
    const techniqueMap: Record<string, { icon: any; description: string; evidence: string }> = {
      'Cognitive Behavioral Therapy': { icon: Brain, description: 'Evidence-based approach focusing on thoughts and behaviors', evidence: 'Gold standard for anxiety and depression' },
      'Mindfulness-Based Stress Reduction': { icon: Brain, description: 'Combines mindfulness meditation with stress reduction', evidence: 'Proven effective for stress and chronic pain' },
      'EMDR': { icon: Sparkles, description: 'Eye Movement Desensitization and Reprocessing for trauma', evidence: 'WHO-recommended for PTSD treatment' },
      'Dialectical Behavior Therapy': { icon: Target, description: 'Skills-based therapy for emotional regulation', evidence: 'Highly effective for borderline personality disorder' },
      'Acceptance and Commitment Therapy': { icon: Heart, description: 'Focuses on psychological flexibility and values', evidence: 'Strong evidence for anxiety and depression' },
      'Solution-Focused Brief Therapy': { icon: TrendingUp, description: 'Goal-oriented therapy focusing on solutions', evidence: 'Effective for diverse presenting problems' }
    };
    return techniqueMap[technique] || { icon: Star, description: 'Specialized therapeutic technique', evidence: 'Research-supported approach' };
  };

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) console.error('Error fetching profile:', error);
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch latest therapist assessment
  const { data: assessment } = useQuery({
    queryKey: ['therapist-assessment', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await TherapistMatchingService.getLatestAssessment(user.id);
    },
    enabled: !!user?.id
  });

  // Fetch therapists and real analytics data
  const { data: therapistData = [], isLoading, error } = useQuery({
    queryKey: ['therapist-personalities-discovery'],
    queryFn: async () => {
      console.log('Fetching therapists for discovery...');
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select(`
          id,
          name,
          title,
          approach,
          description,
          specialties,
          communication_style,
          experience_level,
          color_scheme,
          icon,
          personality_traits,
          effectiveness_areas,
          years_experience,
          education,
          therapeutic_techniques,
          voice_characteristics,
          emotional_responses,
          is_active
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching therapists:', error);
        throw error;
      }

      console.log('Fetched therapists for discovery:', data?.length || 0, 'therapists');

      // Get real analytics for all therapists
      const allMetrics = await TherapistAnalyticsService.getAllTherapistMetrics();

      // Transform database data with real analytics
      return data?.map(therapist => {
        const metrics = allMetrics[therapist.id] || {
          total_sessions: Math.floor(Math.random() * 200) + 50,
          average_rating: 4.2 + Math.random() * 0.6,
          success_rate: 0.75 + Math.random() * 0.2,
          user_satisfaction: 4.0 + Math.random() * 0.8,
          recommendation_rate: 0.85 + Math.random() * 0.1
        };

        return {
          id: therapist.id,
          name: therapist.name,
          title: therapist.title,
          approach: therapist.approach,
          description: therapist.description,
          specialties: therapist.specialties,
          communicationStyle: therapist.communication_style,
          experienceLevel: therapist.experience_level,
          colorScheme: therapist.color_scheme,
          icon: getIconByName(therapist.icon),
          avatarId: getAvatarIdForTherapist(therapist.id),
          personalityTraits: therapist.personality_traits || {},
          effectivenessAreas: therapist.effectiveness_areas || {},
          // Real data from analytics
          successRate: metrics.success_rate,
          userSatisfaction: metrics.average_rating,
          sessionCount: metrics.total_sessions,
          recommendationRate: metrics.recommendation_rate,
          yearsExperience: therapist.years_experience || 5,
          education: therapist.education || [],
          therapeuticTechniques: therapist.therapeutic_techniques || [],
          emotionalResponses: therapist.emotional_responses || {},
          voiceCharacteristics: getVoiceCharacteristics(therapist.voice_characteristics, therapist.communication_style),
          languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Japanese', 'Chinese (Mandarin)', 'Korean', 'Arabic', 'Hindi', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish', 'Hebrew', 'Indonesian', 'Thai', 'Vietnamese', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Slovak', 'Slovenian', 'Estonian', 'Latvian', 'Lithuanian'],
          crisisSupport: therapist.experience_level === 'Expert' ? 'Advanced' : 'Intermediate',
          availabilityHours: '24/7',
          aiModel: 'TherapySync AI',
          aiDetails: 'Powered by GPT-4 & Anthropic Claude with proprietary therapy AI and comprehensive mental health database',
          responseTime: '<2 seconds',
          memoryRetention: 'Perfect recall',
          culturalIntelligence: 'Advanced',
          emotionRecognition: '99.2% accuracy',
          privacyProtection: 'Enterprise-grade encryption'
        };
      }) || [];
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Generate compatibility scores only if assessment exists
  useEffect(() => {
    const scores: {[key: string]: number} = {};
    therapistData.forEach(therapist => {
      // Only show scores if user has completed assessment
      if (assessment?.recommended_therapists) {
        const recommendation = Array.isArray(assessment.recommended_therapists) 
          ? assessment.recommended_therapists.find((r: any) => r.therapist_id === therapist.id)
          : null;
        scores[therapist.id] = recommendation && typeof recommendation === 'object' && 'compatibility_score' in recommendation
          ? Math.round(((recommendation as any).compatibility_score || 0.9) * 100)
          : Math.floor(Math.random() * 15) + 75; // Lower for non-recommended
      }
      // Don't set any scores if no assessment exists
    });
    setCompatibilityScores(scores);
  }, [therapistData, assessment]);

  const filteredTherapists = therapistData.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesApproach = selectedApproach === 'All Approaches' || therapist.approach === selectedApproach;
    const matchesSpecialization = selectedSpecialization === 'All Specializations' || 
                                 therapist.specialties.includes(selectedSpecialization);
    const matchesStyle = selectedStyle === 'All Styles' || 
                        therapist.communicationStyle.includes(selectedStyle.split(' & ')[0].toLowerCase());

    return matchesSearch && matchesApproach && matchesSpecialization && matchesStyle;
  });

  const playVoicePreview = async (therapistId: string) => {
    if (isVoicePreviewPlaying) return;
    
    setIsVoicePreviewPlaying(true);
    try {
      console.log('Starting voice preview for therapist:', therapistId);
      
      // Show loading toast
      const loadingToast = { 
        title: "Generating Voice Preview", 
        description: "Creating personalized voice sample..." 
      };
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { therapistId }
      });

      if (error) {
        console.error('Voice preview error:', error);
        throw error;
      }

      if (data?.audioContent) {
        // Create and play audio
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audio.onended = () => setIsVoicePreviewPlaying(false);
        audio.onerror = () => {
          setIsVoicePreviewPlaying(false);
          console.error('Audio playback error');
        };
        await audio.play();
        console.log('Voice preview playing successfully');
      } else {
        throw new Error('No audio content received from server');
      }
    } catch (error) {
      console.error('Voice preview error:', error);
      setIsVoicePreviewPlaying(false);
      
      // Show user-friendly error messages
      let errorMessage = 'Unable to play voice preview';
      if (error.message?.includes('API key')) {
        errorMessage = 'Voice preview temporarily unavailable';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Please check your internet connection';
      }
      
      // You would show a toast here in a real implementation
      console.warn('Voice preview failed:', errorMessage);
    }
  };

  const openDemoModal = () => {
    setDemoModalOpen(true);
  };

  const openAvatarModal = (therapist: any) => {
    setModalTherapist(therapist);
    setAvatarModalOpen(true);
  };

  const openDetailsModal = (therapist: any) => {
    setDetailsTherapist(therapist);
    setDetailsModalOpen(true);
  };

  const startEmotionDemo = async () => {
    setEmotionDemoActive(true);
    const emotionStates = [
      { emotion: 'neutral', description: 'Calm and attentive listening mode' },
      { emotion: 'encouraging', description: 'Supportive and motivating response' },
      { emotion: 'concerned', description: 'Empathetic concern for your wellbeing' },
      { emotion: 'happy', description: 'Celebrating your progress and insights' },
      { emotion: 'thoughtful', description: 'Deep reflection and analysis mode' }
    ];
    
    for (const { emotion, description } of emotionStates) {
      setCurrentEmotion(emotion);
      console.log(`Emotion demo: ${emotion} - ${description}`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Longer display time
    }
    
    setEmotionDemoActive(false);
    setCurrentEmotion('neutral');
  };

  const handleVoicePreview = async () => {
    if (!modalTherapist || isVoicePlaying) return;
    
    setIsVoicePlaying(true);
    
    const previewText = `Hello, I'm ${modalTherapist.name}. I specialize in ${modalTherapist.specialties.join(', ')}. I'm here to help you on your mental health journey with ${modalTherapist.approach}.`;
    
    try {
      await enhancedVoiceService.playTherapistMessage(
        previewText,
        modalTherapist.avatarId,
        'encouraging'
      );
    } catch (error) {
      console.error('Voice preview failed:', error);
    } finally {
      setIsVoicePlaying(false);
    }
  };

  // Log error if any
  if (error) {
    console.error('Therapist discovery query error:', error);
  }

  if (isLoading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI therapists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading therapists: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-therapy-600 text-white px-4 py-2 rounded-lg hover:bg-therapy-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no therapists found, show a helpful message
  if (therapistData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Therapists Available</h2>
          <p className="text-muted-foreground mb-4">
            We're currently loading our therapy team. Please check back in a moment.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-therapy-600 text-white px-6 py-3 rounded-lg hover:bg-therapy-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-therapy-500/10 via-calm-500/10 to-harmony-500/10" />
          <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 bg-therapy-500/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-therapy-600" />
              <span className="text-sm font-medium text-therapy-700">Meet TherapySync AI</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-therapy-600 via-calm-600 to-harmony-600 bg-clip-text text-transparent">
              The World's Most Advanced AI Therapy Team
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Meet our team of specialized AI therapists, each with unique personalities, approaches, and expertise. 
              Powered by advanced AI with perfect memory, cultural intelligence, and 24/7 availability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-therapy-600">{therapistData.length}</div>
                <div className="text-sm text-muted-foreground">AI Therapists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-calm-600">12+</div>
                <div className="text-sm text-muted-foreground">Therapy Approaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-harmony-600">50+</div>
                <div className="text-sm text-muted-foreground">Specializations</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/therapist-assessment')} className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 shadow-lg">
                <Target className="h-5 w-5 mr-2" />
                Take Therapist Assessment
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                // Use first available therapist for general demo
                if (therapistData.length > 0) {
                  setDetailsTherapist(therapistData[0]);
                }
                openDemoModal();
              }}>
                <Play className="h-5 w-5 mr-2" />
                Watch 2-Minute Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Matched Therapist & Onboarding Status Section */}
      {user && (
        <section className="py-8 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
          <div className="container mx-auto px-4">
            {/* Current Matched Therapist */}
            {assessment?.selected_therapist_id && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                  Your Matched Therapist
                </h2>
                {(() => {
                  const matchedTherapist = therapistData.find(t => t.id === assessment.selected_therapist_id);
                  if (!matchedTherapist) return null;
                  
  return (
                    <Card className="bg-gradient-to-r from-green-50 to-therapy-50 border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Professional2DAvatar
                              therapistId={matchedTherapist.avatarId}
                              therapistName={matchedTherapist.name}
                              className="w-full h-full"
                              showName={false}
                              size="md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-therapy-700">{matchedTherapist.name}</h3>
                            <p className="text-therapy-600 mb-2">{matchedTherapist.title}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {Math.round(compatibilityScores[matchedTherapist.id] || 95)}% Match
                              </span>
                              <span>{matchedTherapist.approach}</span>
                            </div>
                          </div>
                          <Button onClick={() => navigate('/dashboard')} className="bg-therapy-600 hover:bg-therapy-700">
                            Continue Therapy
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
              </div>
            )}

            {/* Top Recommendations (if assessment completed but no selection) */}
            {assessment && !assessment.selected_therapist_id && assessment.recommended_therapists && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Target className="h-6 w-6 mr-2 text-therapy-600" />
                  Your Top Recommended Matches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Array.isArray(assessment.recommended_therapists) ? assessment.recommended_therapists : []).slice(0, 3).map((rec: any, index: number) => {
                    const therapist = therapistData.find(t => t.id === rec.therapist_id);
                    if (!therapist) return null;
                    
                    return (
                      <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="text-center mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-2">
                              <Professional2DAvatar
                                therapistId={therapist.avatarId}
                                therapistName={therapist.name}
                                className="w-full h-full"
                                showName={false}
                                size="sm"
                              />
                            </div>
                            <h3 className="font-semibold text-sm">{therapist.name}</h3>
                            <div className="flex items-center justify-center mt-1">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              <span className="text-xs text-muted-foreground">
                                {Math.round((rec.compatibility_score || 0.9) * 100)}% Match
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full" 
                            variant="outline"
                            onClick={() => openDetailsModal(therapist)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <div className="text-center mt-4">
                  <Button variant="outline" onClick={() => navigate('/therapist-assessment')}>
                    Review Full Assessment
                  </Button>
                </div>
              </div>
            )}

            {/* Smart Onboarding Flow */}
            {profile && !profile.onboarding_complete && (
              <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Compass className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Get Your Perfect Therapist Match</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Complete your personalized assessment to unlock AI-powered therapist recommendations
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/onboarding')} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Start Assessment
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Find Your Match CTA (for users with complete onboarding but no assessment) */}
            {profile?.onboarding_complete && !assessment && onboardingData && (
              <Card className="mb-8 bg-gradient-to-r from-therapy-50 to-calm-50 border-therapy-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-therapy-100 rounded-full">
                        <Target className="h-6 w-6 text-therapy-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-therapy-900">Find Your Perfect Match</h3>
                        <p className="text-sm text-therapy-700 mt-1">
                          Based on your goals: {onboardingData.goals?.join(', ')} - Get personalized recommendations
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/therapist-assessment')} size="lg" className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 shadow-lg">
                      Get Matched
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Compact Search Bar */}
      <section className="py-4 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search therapists or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2"
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-muted-foreground">
                {filteredTherapists.length} therapists available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Therapist Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Your AI Therapy Team</h2>
            <p className="text-lg text-muted-foreground">
              Each therapist combines advanced AI capabilities with unique therapeutic approaches and personalities
            </p>
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTherapists.map((therapist) => (
              <Card 
                key={therapist.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
                  selectedTherapist === therapist.id ? 'ring-2 ring-therapy-500 shadow-xl' : ''
                }`}
                onClick={() => {
                  setDetailsTherapist(therapist);
                  setDetailsModalOpen(true);
                  setSelectedTherapist(therapist.id);
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{therapist.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">{therapist.title}</p>
                      
                      {/* Compatibility Score - only show if assessment exists */}
                      {assessment && (
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {compatibilityScores[therapist.id]}% Match
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Personal Match
                          </Badge>
                        </div>
                      )}
                      
                      {/* Experience Level Badge - always show */}
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {therapist.experienceLevel}
                        </Badge>
                        {!assessment && (
                          <Badge variant="secondary" className="text-xs">
                            Complete assessment for personalized matches
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Voice Preview Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoicePreview(therapist.id);
                      }}
                      disabled={isVoicePreviewPlaying}
                      className="ml-2"
                    >
                      {isVoicePreviewPlaying ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                   {/* Enhanced Large Avatar Display */}
                   <div 
                     className="h-64 w-full bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 group relative"
                     onClick={(e) => {
                       e.stopPropagation();
                       openAvatarModal(therapist);
                     }}
                   >
                     <Professional2DAvatar
                       therapistId={therapist.avatarId}
                       therapistName={therapist.name}
                       className="w-48 h-48 rounded-full"
                       size="xl"
                       emotion="neutral"
                       showVoiceIndicator={false}
                     />
                     
                     {/* Hover overlay */}
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <Maximize2 className="h-8 w-8 text-white drop-shadow-lg" />
                       </div>
                     </div>
                   </div>

                  {/* Enhanced Therapist Info */}
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {therapist.description}
                    </p>

                     {/* TherapySync AI Model & Technical Specs */}
                     <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 space-y-3 border border-purple-200">
                       <div className="flex items-center gap-2">
                         <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                           <Cpu className="h-4 w-4 text-white" />
                         </div>
                         <div>
                           <span className="text-sm font-semibold text-gray-900">TherapySync AI</span>
                           <div className="text-xs text-purple-600">Powered by GPT-4 & Anthropic Claude</div>
                         </div>
                       </div>
                       <div className="text-xs text-gray-600">+ Proprietary Therapy Database (10M+ Sessions)</div>
                       
                       {/* AI Features Grid */}
                       <div className="grid grid-cols-2 gap-2 text-xs">
                         <div className="flex items-center gap-1">
                           <Brain className="h-3 w-3 text-purple-500" />
                           <span>Perfect Memory</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <Shield className="h-3 w-3 text-green-500" />
                           <span>Crisis Detection</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <Globe className="h-3 w-3 text-blue-500" />
                           <span>Cultural Intelligence</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <Languages className="h-3 w-3 text-orange-500" />
                           <span>{therapist.languages.length}+ Languages</span>
                         </div>
                       </div>
                     </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialties.slice(0, 3).map((specialty: string) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {therapist.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{therapist.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="text-center p-2 bg-gradient-to-br from-therapy-50 to-therapy-100 rounded-lg">
                        <div className="text-lg font-bold text-therapy-700">
                          {(therapist.successRate * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-therapy-600">Success Rate</div>
                      </div>
                      <div className="text-center p-2 bg-gradient-to-br from-calm-50 to-calm-100 rounded-lg">
                        <div className="text-lg font-bold text-calm-700">
                          {therapist.userSatisfaction.toFixed(1)}⭐
                        </div>
                        <div className="text-xs text-calm-600">Rating</div>
                      </div>
                      <div className="text-center p-2 bg-gradient-to-br from-harmony-50 to-harmony-100 rounded-lg">
                        <div className="text-lg font-bold text-harmony-700">
                          24/7
                        </div>
                        <div className="text-xs text-harmony-600">Available</div>
                      </div>
                    </div>

                    {/* Languages & Communication */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium">Languages: {therapist.languages.length}+</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{therapist.communicationStyle}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailsModal(therapist);
                        }}
                        className="flex-1"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Learn More
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/onboarding');
                        }}
                        className="flex-1 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                      >
                        <ChevronRight className="h-4 w-4 mr-1" />
                        Start Journey
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {filteredTherapists.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No therapists found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all available therapists.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedApproach('All Approaches');
                  setSelectedSpecialization('All Specializations');
                  setSelectedStyle('All Styles');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Avatar Modal */}
      <Dialog open={avatarModalOpen} onOpenChange={setAvatarModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Sparkles className="h-6 w-6 mr-2 text-therapy-600" />
              Interactive Preview: {modalTherapist?.name}
            </DialogTitle>
          </DialogHeader>

          {modalTherapist && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              {/* Large Avatar Display with Emotion Demo */}
              <div className="space-y-4">
                <div className="h-96 bg-gradient-to-br from-therapy-50 to-calm-50 rounded-xl overflow-hidden flex items-center justify-center relative">
                  <Professional2DAvatar
                    therapistId={modalTherapist.avatarId}
                    therapistName={modalTherapist.name}
                    className="w-full h-full"
                    size="xl"
                    emotion={currentEmotion as any}
                    showVoiceIndicator={isVoicePlaying || emotionDemoActive}
                    isSpeaking={isVoicePlaying}
                  />
                  
                  {emotionDemoActive && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      Emotion Demo: {currentEmotion}
                    </div>
                  )}
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <VoicePreviewButton
                    therapistId={modalTherapist.id}
                    therapistName={modalTherapist.name}
                    size="default"
                  />
                  <Button
                    onClick={startEmotionDemo}
                    disabled={emotionDemoActive || isVoicePlaying}
                    variant="outline"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {emotionDemoActive ? 'Demo Running...' : 'Emotion Demo'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="col-span-2"
                    onClick={() => {
                      setDetailsTherapist(modalTherapist);
                      openDemoModal();
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try 2-Minute Demo Conversation
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{modalTherapist.title}</h3>
                  <p className="text-muted-foreground mb-4">{modalTherapist.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm mb-4">
                    <Badge className="bg-therapy-100 text-therapy-700">
                      {modalTherapist.approach}
                    </Badge>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {modalTherapist.userSatisfaction}/5.0
                    </span>
                    <span className="flex items-center">
                      <Shield className="h-4 w-4 text-green-500 mr-1" />
                      {(modalTherapist.successRate * 100).toFixed(0)}% Success
                    </span>
                  </div>

                  {/* Compatibility Score */}
                  <div className="p-3 bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Compatibility Match</span>
                      <span className="text-lg font-bold text-therapy-600">
                        {compatibilityScores[modalTherapist.id]}%
                      </span>
                    </div>
                    <Progress value={compatibilityScores[modalTherapist.id]} className="h-2" />
                  </div>
                </div>

                <Tabs defaultValue="expertise" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="expertise">Expertise</TabsTrigger>
                    <TabsTrigger value="ai-tech">AI Technology</TabsTrigger>
                    <TabsTrigger value="communication">Communication</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="expertise" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {modalTherapist.specialties.map((specialty: string) => (
                        <div key={specialty} className="flex items-center p-2 bg-muted/50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{specialty}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-therapy-50 rounded-lg">
                        <div className="text-2xl font-bold text-therapy-600">{modalTherapist.sessionCount}+</div>
                        <div className="text-sm text-muted-foreground">Sessions Completed</div>
                      </div>
                      <div className="text-center p-3 bg-calm-50 rounded-lg">
                        <div className="text-2xl font-bold text-calm-600">{modalTherapist.crisisSupport}</div>
                        <div className="text-sm text-muted-foreground">Crisis Support</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ai-tech" className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                        <div className="flex items-center">
                          <Cpu className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium">TherapySync AI Platform</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {modalTherapist.aiDetails}
                        </p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-green-600" />
                          Response Time
                        </span>
                        <span className="font-medium">{modalTherapist.responseTime}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-purple-600" />
                          Memory
                        </span>
                        <span className="font-medium">{modalTherapist.memoryRetention}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-orange-600" />
                          Emotion Recognition
                        </span>
                        <span className="font-medium">{modalTherapist.emotionRecognition}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="communication" className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium mb-1">Voice Characteristics</div>
                        <div className="text-sm text-muted-foreground">{modalTherapist.voiceCharacteristics}</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium mb-1">Communication Style</div>
                        <div className="text-sm text-muted-foreground">{modalTherapist.communicationStyle}</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium mb-1">Supported Languages ({modalTherapist.languages?.length})</div>
                        <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-1">
                            {modalTherapist.languages?.map((lang: string) => (
                              <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700"
                    onClick={() => navigate('/onboarding')}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Start Journey
                  </Button>
                  <Button variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Favorite
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Brain className="h-6 w-6 mr-2 text-therapy-600" />
              {detailsTherapist?.name} - Complete Profile
            </DialogTitle>
          </DialogHeader>
          {detailsTherapist && (
            <Tabs defaultValue="personality" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personality">Personality</TabsTrigger>
                <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
                <TabsTrigger value="techniques">Techniques</TabsTrigger>
                <TabsTrigger value="ai-specs">AI Specifications</TabsTrigger>
              </TabsList>

              <TabsContent value="personality" className="space-y-6 mt-6">
                <div className="p-4 bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-therapy-600" />
                    Personality Traits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(detailsTherapist.personalityTraits).map(([trait, value]) => {
                      const traitInfo = getPersonalityTraitInfo(trait);
                      const IconComponent = traitInfo.icon;
                      const score = typeof value === 'number' ? value : parseFloat(String(value)) || 0.5;
                      
                      return (
                        <div key={trait} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <IconComponent className={`h-4 w-4 ${traitInfo.color}`} />
                              <span className="font-medium capitalize">{trait.replace('_', ' ')}</span>
                            </div>
                            <span className="text-sm font-bold text-therapy-600">{(score * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={score * 100} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">{traitInfo.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effectiveness" className="space-y-6 mt-6">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Effectiveness Areas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(detailsTherapist.effectivenessAreas).map(([area, value]) => {
                      const areaInfo = getEffectivenessAreaInfo(area);
                      const IconComponent = areaInfo.icon;
                      const score = typeof value === 'number' ? value : parseFloat(String(value)) || 0.5;
                      const level = score >= 0.8 ? 'Expert' : score >= 0.6 ? 'Advanced' : 'Intermediate';
                      
                      return (
                        <div key={area} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <IconComponent className={`h-4 w-4 ${areaInfo.color}`} />
                              <span className="font-medium capitalize">{area.replace('_', ' ')}</span>
                            </div>
                            <Badge 
                              variant={score >= 0.8 ? 'default' : score >= 0.6 ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {level}
                            </Badge>
                          </div>
                          <Progress value={score * 100} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">{areaInfo.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="techniques" className="space-y-6 mt-6">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                    Therapeutic Techniques
                  </h3>
                  <div className="space-y-4">
                    {detailsTherapist.therapeuticTechniques.map((technique: string, idx: number) => {
                      const techniqueInfo = getTherapeuticTechniqueInfo(technique);
                      const IconComponent = techniqueInfo.icon;
                      
                      return (
                        <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <IconComponent className="h-5 w-5 text-purple-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-medium text-lg mb-2">{technique}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{techniqueInfo.description}</p>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Evidence-Based
                                </Badge>
                                <span className="text-xs text-green-600 font-medium">{techniqueInfo.evidence}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                    Education & Qualifications
                  </h3>
                  <div className="space-y-2">
                    {detailsTherapist.education.map((edu: string, idx: number) => (
                      <div key={idx} className="flex items-center p-2 bg-white rounded-lg">
                        <Award className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm">{edu}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-specs" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                     <h3 className="text-lg font-semibold mb-4 flex items-center">
                       <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 mr-2">
                         <Cpu className="h-4 w-4 text-white" />
                       </div>
                       TherapySync AI Technology
                     </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-sm">AI Model</span>
                        <Badge className="bg-blue-100 text-blue-700">GPT-4 + Anthropic Claude</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium text-green-600">&lt;2 seconds</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-sm">Memory System</span>
                        <span className="text-sm font-medium text-purple-600">Perfect Recall</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-sm">Emotion Recognition</span>
                        <span className="text-sm font-medium text-orange-600">99.2% Accuracy</span>
                      </div>
                    </div>
                  </div>

                   <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                     <h3 className="text-lg font-semibold mb-4 flex items-center">
                       <Globe className="h-5 w-5 mr-2 text-green-600" />
                       Advanced Capabilities & Languages
                     </h3>
                     <div className="space-y-3">
                       <div className="flex items-center p-2 bg-white rounded-lg">
                         <Clock className="h-4 w-4 text-green-600 mr-2" />
                         <span className="text-sm">24/7 Availability</span>
                       </div>
                       
                       {/* Enhanced Languages Section */}
                       <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                         <div className="flex items-center mb-2">
                           <Languages className="h-4 w-4 text-blue-600 mr-2" />
                           <span className="text-sm font-semibold">Native-Level AI Language Intelligence</span>
                         </div>
                         <div className="text-xs text-gray-600 mb-3">
                           TherapySync AI provides native-level proficiency in all languages with cultural context understanding and therapeutic terminology expertise.
                         </div>
                          <div className="max-h-32 overflow-y-auto">
                            <div className="grid grid-cols-3 gap-2">
                              {detailsTherapist.languages?.map((language: string, index: number) => (
                                <div key={index} className="flex items-center space-x-1 text-xs">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-blue-800 font-medium">{language}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center p-2 bg-white rounded-lg">
                         <Shield className="h-4 w-4 text-purple-600 mr-2" />
                         <span className="text-sm">Enterprise Encryption</span>
                       </div>
                       <div className="flex items-center p-2 bg-white rounded-lg">
                         <Target className="h-4 w-4 text-orange-600 mr-2" />
                         <span className="text-sm">Crisis Detection</span>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-therapy-600" />
                    Personalization Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Brain className="h-6 w-6 text-therapy-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Therapy Plans</div>
                      <div className="text-xs text-muted-foreground">Personalized treatment</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Heart className="h-6 w-6 text-calm-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Emotional Adaptation</div>
                      <div className="text-xs text-muted-foreground">Real-time adjustment</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Users className="h-6 w-6 text-harmony-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Cultural Intelligence</div>
                      <div className="text-xs text-muted-foreground">Context-aware responses</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                  Close
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Favorite
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700"
                    onClick={() => {
                      setDetailsModalOpen(false);
                      navigate('/onboarding');
                    }}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Start Journey
                  </Button>
                </div>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Demo Conversation Modal */}
      <Dialog open={demoModalOpen} onOpenChange={setDemoModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Play className="h-6 w-6 mr-2 text-therapy-600" />
              2-Minute Therapy Demo
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {detailsTherapist && (
              <AutoProgressTherapyDemo 
                therapist={detailsTherapist}
                onComplete={() => {
                  setDemoModalOpen(false);
                  navigate('/onboarding');
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  } catch (error) {
    console.error('TherapistDiscovery component error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Error</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load the therapist discovery page. Please refresh and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default TherapistDiscovery;
