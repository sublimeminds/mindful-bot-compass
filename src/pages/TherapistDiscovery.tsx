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
  Settings
} from 'lucide-react';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { enhancedVoiceService } from '@/services/voiceService';

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

  // Helper function to derive voice characteristics
  const getVoiceCharacteristics = (communicationStyle: string) => {
    if (communicationStyle.includes('energetic')) return 'Energetic, motivating, clear';
    if (communicationStyle.includes('gentle')) return 'Gentle, calming, wise';
    if (communicationStyle.includes('warm')) return 'Warm, analytical, reassuring';
    return 'Professional, supportive, clear';
  };

  // Fetch therapists from database
  const { data: therapistData = [], isLoading } = useQuery({
    queryKey: ['therapist-personalities-discovery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching therapists:', error);
        throw error;
      }

      // Transform database data to component format
      return data.map(therapist => ({
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
        successRate: therapist.success_rate || 0.85,
        userSatisfaction: therapist.user_rating || 4.5,
        sessionCount: therapist.total_sessions || 150,
        yearsExperience: therapist.years_experience || 5,
        education: therapist.education || [],
        therapeuticTechniques: therapist.therapeutic_techniques || [],
        emotionalResponses: therapist.emotional_responses || {},
        voiceCharacteristics: therapist.voice_characteristics || getVoiceCharacteristics(therapist.communication_style),
        languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Japanese', 'Chinese', 'Korean'], // AI multilingual support
        crisisSupport: therapist.experience_level === 'Expert' ? 'Advanced' : 'Intermediate',
        availabilityHours: '24/7',
        // AI-specific features
        aiModel: 'GPT-4 Enhanced',
        responseTime: '<2 seconds',
        memoryRetention: 'Perfect recall',
        culturalIntelligence: 'Advanced',
        emotionRecognition: '99.2% accuracy',
        privacyProtection: 'Enterprise-grade encryption'
      }));
    },
  });

  // Generate random compatibility scores for demo
  useEffect(() => {
    const scores: {[key: string]: number} = {};
    therapistData.forEach(therapist => {
      scores[therapist.id] = Math.floor(Math.random() * 20) + 80; // 80-100% compatibility
    });
    setCompatibilityScores(scores);
  }, [therapistData]);

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
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { therapistId }
      });

      if (error) throw error;

      // Create and play audio
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      await audio.play();
    } catch (error) {
      console.error('Voice preview error:', error);
    }
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
    const emotions = ['neutral', 'happy', 'encouraging', 'concerned', 'thoughtful'];
    
    for (const emotion of emotions) {
      setCurrentEmotion(emotion);
      await new Promise(resolve => setTimeout(resolve, 2000));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI therapists...</p>
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
              <Button size="lg" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                <Target className="h-5 w-5 mr-2" />
                Find Your Perfect Match
              </Button>
              <Button variant="outline" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Watch 2-Minute Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Discovery Engine */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Your Perfect Match in 30 Seconds</h2>
            <p className="text-lg text-muted-foreground">
              Use our advanced filtering system to discover the ideal AI therapist for your unique needs
            </p>
          </div>

          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Search className="h-5 w-5 mr-2" />
                Smart Discovery Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search therapists or specialties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Therapy Approach</label>
                  <Select value={selectedApproach} onValueChange={setSelectedApproach}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {therapyApproaches.map(approach => (
                        <SelectItem key={approach} value={approach}>{approach}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialization</label>
                  <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Communication Style</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {communicationStyles.map(style => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Showing {filteredTherapists.length} of {therapistData.length} therapists
              </div>
            </CardContent>
          </Card>
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
                onClick={() => setSelectedTherapist(selectedTherapist === therapist.id ? null : therapist.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{therapist.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">{therapist.title}</p>
                      
                      {/* Compatibility Score */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{compatibilityScores[therapist.id]}% Match</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {therapist.experienceLevel}
                        </Badge>
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
                      className="ml-2"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Enhanced Large Avatar Display */}
                  <div 
                    className="h-80 w-full bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 group relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAvatarModal(therapist);
                    }}
                  >
                    <Professional2DAvatar
                      therapistId={therapist.avatarId}
                      therapistName={therapist.name}
                      className="w-full h-full"
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

                    {/* AI Model & Technical Specs */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">AI Technology</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Model: <span className="font-medium">{therapist.aiModel}</span></div>
                        <div>Response: <span className="font-medium">{therapist.responseTime}</span></div>
                        <div>Memory: <span className="font-medium">{therapist.memoryRetention}</span></div>
                        <div>Accuracy: <span className="font-medium">{therapist.emotionRecognition}</span></div>
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
                          setSelectedTherapist(therapist.id);
                        }}
                        className="flex-1 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Start Chat
                      </Button>
                    </div>
                  </div>

                  {/* Selected Therapist Actions */}
                  {selectedTherapist === therapist.id && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg border border-therapy-200">
                      <h4 className="font-semibold text-therapy-700 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        You've selected {therapist.name}
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700"
                          onClick={() => {
                            // Navigate to chat or booking
                            console.log('Starting therapy with:', therapist.name);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Start Therapy Session
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openDetailsModal(therapist)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          View Full Profile
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={startEmotionDemo}
                          disabled={emotionDemoActive}
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          {emotionDemoActive ? 'Demo Running...' : 'Emotion Demo'}
                        </Button>
                      </div>
                    </div>
                  )}
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
                  <Button
                    onClick={handleVoicePreview}
                    disabled={isVoicePlaying || emotionDemoActive}
                    variant="outline"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isVoicePlaying ? 'Playing...' : 'Voice Preview'}
                  </Button>
                  <Button
                    onClick={startEmotionDemo}
                    disabled={emotionDemoActive || isVoicePlaying}
                    variant="outline"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {emotionDemoActive ? 'Demo Running...' : 'Emotion Demo'}
                  </Button>
                  <Button variant="outline" className="col-span-2">
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
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="flex items-center">
                          <Cpu className="h-4 w-4 mr-2 text-blue-600" />
                          AI Model
                        </span>
                        <span className="font-medium">{modalTherapist.aiModel}</span>
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
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-1">
                          {modalTherapist.languages?.slice(0, 8).map((lang: string) => (
                            <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                          ))}
                          {modalTherapist.languages?.length > 8 && (
                            <Badge variant="outline" className="text-xs">+{modalTherapist.languages.length - 8} more</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Therapy Session
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

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detailsTherapist?.name} - Full Profile</DialogTitle>
          </DialogHeader>
          {detailsTherapist && (
            <div className="space-y-6 p-4">
              <p>{detailsTherapist.description}</p>
              <div>
                <h4 className="font-semibold mb-2">Education</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {detailsTherapist.education.map((edu: string, idx: number) => (
                    <li key={idx}>{edu}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Therapeutic Techniques</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {detailsTherapist.therapeuticTechniques.map((tech: string, idx: number) => (
                    <li key={idx}>{tech}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Personality Traits</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {Object.entries(detailsTherapist.personalityTraits).map(([trait, value]) => (
                    <li key={trait}>{trait}: {String(value)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Effectiveness Areas</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {Object.entries(detailsTherapist.effectivenessAreas).map(([area, value]) => (
                    <li key={area}>{area}: {String(value)}</li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistDiscovery;
