import React, { useState } from 'react';
import { Users, Brain, Heart, Shield, Star, Zap, Palette, Mic, Camera, Video, MessageSquare, Target, Compass, Globe, Award, Sparkles, ArrowRight, Check, Play, ChevronDown, Clock, Languages, Headphones } from 'lucide-react';
import UltraSafeAvatarDisplay from '@/components/avatar/UltraSafeAvatarDisplay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AITherapistTeam = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
        voiceCharacteristics: therapist.voice_characteristics || "Professional, supportive, clear voice",
        languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Japanese', 'Chinese', 'Korean'],
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
              <button className="bg-gradient-to-r from-therapy-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group">
                Start Free Consultation
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-therapy-600 border border-therapy-200 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {therapistData.map((therapist) => (
              <div key={therapist.id} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="relative mb-6">
                  {/* 2D Avatar Display */}
                  <div className="w-24 h-24 mx-auto mb-4 cursor-pointer" onClick={() => openTherapistModal(therapist)}>
                    <UltraSafeAvatarDisplay
                      therapist={{
                        id: therapist.avatarId,
                        name: therapist.name
                      }}
                      className="w-full h-full"
                      size="lg"
                      showName={false}
                    />
                  </div>
                  <div className="absolute -top-2 -right-8 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Online
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{therapist.name}</h3>
                <p className="text-therapy-600 font-medium text-sm mb-1">{therapist.title}</p>
                <p className="text-blue-600 font-medium text-sm mb-3">{therapist.approach}</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">{therapist.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {therapist.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {therapist.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{therapist.specialties.length - 3} more
                     </Badge>
                   )}
                 </div>

                 <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>24/7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Languages className="h-4 w-4" />
                    <span>10+ languages</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => openTherapistModal(therapist)}
                    className="w-full bg-gradient-to-r from-therapy-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                  >
                    Start Session
                  </button>
                  <button 
                    onClick={() => openTherapistModal(therapist)}
                    className="w-full bg-white border border-therapy-200 text-therapy-600 py-2 rounded-xl font-medium hover:bg-therapy-50 transition-all duration-300"
                  >
                    View Details
                  </button>
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
                  <UltraSafeAvatarDisplay
                    therapist={{
                      id: selectedTherapist.avatarId,
                      name: selectedTherapist.name
                    }}
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
                <div className="flex flex-wrap gap-2">
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
                      <span className="font-medium">Voice Support:</span> {selectedTherapist.voiceCharacteristics}
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-semibold mb-3">Supported Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTherapist.languages.slice(0, 8).map((language: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                  {selectedTherapist.languages.length > 8 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedTherapist.languages.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button className="flex-1 bg-gradient-to-r from-therapy-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Start Session with {selectedTherapist.name}
                </button>
                <button className="px-6 bg-white border border-therapy-200 text-therapy-600 py-3 rounded-xl font-medium hover:bg-therapy-50 transition-all duration-300 flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Voice Preview
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