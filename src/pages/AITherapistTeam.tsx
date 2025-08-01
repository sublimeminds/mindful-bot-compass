import React, { useState } from 'react';
import { Users, Brain, Heart, Shield, Star, Zap, Palette, Mic, Camera, Video, MessageSquare, Target, Compass, Globe, Award, Sparkles, ArrowRight, Check, Play, ChevronDown, Clock, Languages, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import UltraSafeAvatarDisplay from '@/components/avatar/UltraSafeAvatarDisplay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getVoiceIdForTherapist } from '@/services/therapistAvatarMapping';
import { useToast } from '@/hooks/use-toast';

const AITherapistTeam = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch real therapists from database
  const { data: therapistData = [], isLoading, error } = useQuery({
    queryKey: ['ai-therapist-team'],
    queryFn: async () => {
      console.log('Fetching therapists for AI team...');
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
          is_active
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching therapists:', error);
        throw error;
      }

      console.log('Fetched therapists:', data?.length || 0, 'therapists');

      return data?.map(therapist => ({
        id: therapist.id,
        name: therapist.name,
        title: therapist.title,
        approach: therapist.approach,
        description: therapist.description,
        specialties: therapist.specialties || [],
        communicationStyle: therapist.communication_style,
        experienceLevel: therapist.experience_level,
        colorScheme: therapist.color_scheme,
        avatarId: getAvatarIdForTherapist(therapist.id),
        personalityTraits: therapist.personality_traits || {},
        effectivenessAreas: therapist.effectiveness_areas || {},
        yearsExperience: therapist.years_experience || 5,
        education: therapist.education || [],
        therapeuticTechniques: therapist.therapeutic_techniques || [],
        voiceCharacteristics: typeof therapist.voice_characteristics === 'object' 
          ? JSON.stringify(therapist.voice_characteristics) 
          : therapist.voice_characteristics || "Professional, supportive, clear voice",
        languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Japanese', 'Chinese (Mandarin)', 'Korean', 'Arabic', 'Hindi', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish', 'Hebrew', 'Indonesian', 'Thai', 'Vietnamese', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Slovak', 'Slovenian', 'Estonian', 'Latvian', 'Lithuanian'],
        crisisSupport: therapist.experience_level === 'Expert' ? 'Advanced 24/7 Crisis Support' : 'Standard Crisis Support',
        availabilityHours: '24/7',
        aiModel: 'TherapySync AI Enterprise',
        responseTime: '<2 seconds',
        memoryRetention: 'Perfect session recall across all conversations',
        culturalIntelligence: 'Advanced multicultural therapeutic competency'
      })) || [];
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Log error if any
  if (error) {
    console.error('Query error:', error);
  }

  const openTherapistModal = (therapist: any) => {
    setSelectedTherapist(therapist);
    setModalOpen(true);
  };

  const playVoicePreview = async (therapistId: string, therapistName: string) => {
    setPlayingVoice(therapistId);
    try {
      const sampleText = `Hello, I'm ${therapistName}. I'm here to support you on your mental health journey. My approach combines evidence-based therapy with personalized care, creating a safe space where you can explore your thoughts and feelings at your own pace.`;
      
      const response = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: { therapistId, text: sampleText }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const audio = new Audio(`data:audio/mpeg;base64,${response.data.audioContent}`);
      
      audio.onended = () => setPlayingVoice(null);
      audio.onerror = () => {
        setPlayingVoice(null);
        toast({
          title: "Voice Preview Unavailable",
          description: "Voice sample couldn't be loaded at the moment.",
          variant: "destructive"
        });
      };
      
      await audio.play();
    } catch (error) {
      setPlayingVoice(null);
      toast({
        title: "Voice Preview Unavailable", 
        description: "Voice sample couldn't be loaded at the moment.",
        variant: "destructive"
      });
    }
  };

  const startDemo = (therapistId: string) => {
    toast({
      title: "Demo Starting",
      description: "Launching interactive demo with your selected therapist...",
    });
    // TODO: Implement demo functionality
    navigate(`/demo/${therapistId}`);
  };

  const features = [
    {
      icon: Video,
      title: "2D Avatar Interaction",
      description: "Professional 2D avatars with expressive personalities and unique styles"
    },
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Advanced voice analysis for emotional state detection"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Real-time therapeutic insights and personalized recommendations"
    },
    {
      icon: MessageSquare,
      title: "Multi-Modal Communication",
      description: "Text, voice, and visual communication options"
    }
  ];

  const stats = [
    { label: "Active Therapists", value: isLoading ? "..." : therapistData.length.toString(), suffix: "" },
    { label: "Therapy Sessions", value: "18.4K", suffix: "+" },
    { label: "Success Rate", value: "94", suffix: "%" },
    { label: "Patient Satisfaction", value: "4.8", suffix: "/5" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-therapy-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-2xl mb-8 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              AI Therapist Team
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Meet our specialized AI therapists with unique approaches, 2D avatars, and proven therapeutic methodologies
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm">
                  <div className="text-2xl md:text-3xl font-bold text-therapy-600 mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-gradient-to-r from-therapy-500 to-blue-500 hover:from-therapy-600 hover:to-blue-600 text-white font-medium px-10 py-7 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Start Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-therapy-400 font-medium px-10 py-7 text-lg rounded-2xl transition-all duration-500 shadow-lg hover:shadow-xl">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Advanced AI Therapy Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI therapists combine cutting-edge technology with proven therapeutic methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Therapists Grid */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Your Therapy Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each AI therapist brings unique expertise and personalized approaches to your mental health journey
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading AI therapists...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading therapists: {error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-therapy-600 text-white px-4 py-2 rounded-lg hover:bg-therapy-700"
            >
              Retry
            </button>
          </div>
        ) : therapistData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No therapists found</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-therapy-600 text-white px-4 py-2 rounded-lg hover:bg-therapy-700"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-16">
            {therapistData.slice(0, 16).map((therapist) => (
              <div key={therapist.id} className="bg-white rounded-2xl p-4 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="relative mb-4">
                  {/* 2D Avatar Display */}
                  <div className="w-20 h-20 mx-auto mb-3 cursor-pointer" onClick={() => openTherapistModal(therapist)}>
                    <Professional2DAvatar
                      therapistId={therapist.avatarId}
                      therapistName={therapist.name}
                      className="w-full h-full"
                      size="lg"
                      showName={false}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-1">{therapist.name}</h3>
                <p className="text-therapy-600 font-medium text-xs mb-1">{therapist.title}</p>
                <p className="text-blue-600 font-medium text-xs mb-2">{therapist.approach}</p>
                <p className="text-muted-foreground text-xs mb-3 leading-relaxed line-clamp-2">{therapist.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {therapist.specialties.slice(0, 2).map((specialty: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-[10px] px-1 py-0">
                      {specialty}
                    </Badge>
                  ))}
                  {therapist.specialties.length > 2 && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      +{therapist.specialties.length - 2}
                     </Badge>
                   )}
                 </div>

                 <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>24/7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Languages className="h-3 w-3" />
                    <span>{therapist.languages.length}+</span>
                  </div>
                </div>

                 <div className="space-y-2">
                   <button 
                     onClick={() => startDemo(therapist.id)}
                     className="w-full bg-gradient-to-r from-therapy-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                   >
                     Try Demo
                   </button>
                   <div className="flex gap-1">
                     <button 
                       onClick={() => openTherapistModal(therapist)}
                       className="flex-1 bg-white border border-therapy-200 text-therapy-600 py-1.5 rounded-lg font-medium hover:bg-therapy-50 transition-all duration-300 text-xs"
                     >
                       Details
                     </button>
                     <button 
                       onClick={() => playVoicePreview(therapist.id, therapist.name)}
                       disabled={playingVoice === therapist.id}
                       className="px-2 bg-white border border-blue-200 text-blue-600 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 flex items-center gap-1 disabled:opacity-50 text-xs"
                     >
                       <Headphones className="h-3 w-3" />
                     </button>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Meet Your AI Therapist?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Take our quick assessment to be matched with the perfect AI therapist for your unique needs and goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Take Assessment
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Therapist Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTherapist && (
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                {selectedTherapist.name} - {selectedTherapist.title}
              </DialogTitle>
            </DialogHeader>
          )}
          
          {selectedTherapist && (
            <div className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 flex-shrink-0">
                  <Professional2DAvatar
                    therapistId={selectedTherapist.avatarId}
                    therapistName={selectedTherapist.name}
                    className="w-full h-full"
                    size="xl"
                    showName={false}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{selectedTherapist.approach}</h3>
                  <p className="text-muted-foreground mb-4">{selectedTherapist.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Experience:</span> {selectedTherapist.experienceLevel}
                    </div>
                    <div>
                      <span className="font-medium">Availability:</span> {selectedTherapist.availabilityHours}
                    </div>
                    <div>
                      <span className="font-medium">Response Time:</span> {selectedTherapist.responseTime}
                    </div>
                    <div>
                      <span className="font-medium">Crisis Support:</span> {selectedTherapist.crisisSupport}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-semibold mb-3">Specialties & Areas of Focus</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {selectedTherapist.specialties.map((specialty: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="bg-therapy-50">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Therapeutic Techniques */}
              <div>
                <h4 className="font-semibold mb-3">Therapeutic Techniques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTherapist.therapeuticTechniques.map((technique: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{technique}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Capabilities */}
              <div>
                <h4 className="font-semibold mb-3">AI Capabilities</h4>
                <div className="bg-gradient-to-r from-therapy-50 to-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">AI Model:</span> {selectedTherapist.aiModel}
                    </div>
                    <div>
                      <span className="font-medium">Memory:</span> {selectedTherapist.memoryRetention}
                    </div>
                    <div>
                      <span className="font-medium">Cultural Intelligence:</span> {selectedTherapist.culturalIntelligence}
                    </div>
                    <div>
                      <span className="font-medium">Voice Support:</span> Advanced AI Voice & Audio Processing
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-semibold mb-3">Supported Languages ({selectedTherapist.languages.length})</h4>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {selectedTherapist.languages.map((language: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Voice Characteristics */}
              <div>
                <h4 className="font-semibold mb-3">Voice & Communication Style</h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tone:</span> Warm, professional, empathetic
                    </div>
                    <div>
                      <span className="font-medium">Pace:</span> Measured and thoughtful
                    </div>
                    <div>
                      <span className="font-medium">Emotional Range:</span> Calm to encouraging
                    </div>
                    <div>
                      <span className="font-medium">Style:</span> {selectedTherapist.communicationStyle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex gap-3">
                  <button 
                    onClick={() => startDemo(selectedTherapist.id)}
                    className="flex-1 bg-gradient-to-r from-therapy-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Start Demo Session
                  </button>
                  <button 
                    onClick={() => playVoicePreview(selectedTherapist.id, selectedTherapist.name)}
                    disabled={playingVoice === selectedTherapist.id}
                    className="px-6 bg-white border border-therapy-200 text-therapy-600 py-3 rounded-xl font-medium hover:bg-therapy-50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Headphones className="h-4 w-4" />
                    {playingVoice === selectedTherapist.id ? 'Playing...' : 'Voice Preview'}
                  </button>
                </div>
                <button 
                  onClick={() => {
                    if (!user) {
                      navigate('/auth');
                    } else {
                      navigate('/onboarding');
                    }
                  }}
                  className="w-full bg-white border border-blue-200 text-blue-600 py-2 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300"
                >
                  {!user ? 'Get Started' : 'Continue Your Journey'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AITherapistTeam;