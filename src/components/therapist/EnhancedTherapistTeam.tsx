import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Play, 
  Volume2, 
  MessageSquare, 
  Brain, 
  Heart, 
  Shield, 
  Award,
  Languages,
  Clock,
  Sparkles,
  ArrowRight,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getAvatarImage } from '@/utils/avatarImageImports';

interface TherapistData {
  id: string;
  name: string;
  title: string;
  approach: string;
  description: string;
  specialties: string[];
  communicationStyle: string;
  experienceLevel: string;
  colorScheme: string;
  avatarId: string;
  personalityTraits: any;
  effectivenessAreas: any;
  yearsExperience: number;
  education: string[];
  therapeuticTechniques: string[];
  voiceCharacteristics: string;
  languages: string[];
  crisisSupport: string;
  availabilityHours: string;
  aiModel: string;
  responseTime: string;
  memoryRetention: string;
  culturalIntelligence: string;
}

const EnhancedTherapistTeam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Enhanced therapist data query with proper avatar mapping
  const { data: therapistData = [], isLoading, error } = useQuery({
    queryKey: ['enhanced-therapist-team'],
    queryFn: async () => {
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
          personality_traits,
          effectiveness_areas,
          years_experience,
          education,
          therapeutic_techniques,
          voice_characteristics,
          is_active
        `)
        .eq('is_active', true);

      if (error) throw error;

      return data?.map((therapist, index) => ({
        id: therapist.id,
        name: therapist.name,
        title: therapist.title,
        approach: therapist.approach,
        description: therapist.description,
        specialties: therapist.specialties || [],
        communicationStyle: therapist.communication_style,
        experienceLevel: therapist.experience_level,
        colorScheme: therapist.color_scheme,
        avatarId: therapist.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `therapist-${index}`,
        personalityTraits: therapist.personality_traits || {},
        effectivenessAreas: therapist.effectiveness_areas || {},
        yearsExperience: therapist.years_experience || 5,
        education: therapist.education || [],
        therapeuticTechniques: therapist.therapeutic_techniques || [],
        voiceCharacteristics: typeof therapist.voice_characteristics === 'object' 
          ? JSON.stringify(therapist.voice_characteristics) 
          : String(therapist.voice_characteristics || "Professional, supportive voice"),
        languages: [
          'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
          'Dutch', 'Russian', 'Japanese', 'Chinese', 'Korean', 'Arabic', 
          'Hindi', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 
          'Turkish', 'Hebrew', 'Indonesian', 'Thai', 'Vietnamese', 'Czech', 
          'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Slovak'
        ],
        crisisSupport: therapist.experience_level === 'Expert' ? 'Advanced 24/7 Crisis Support' : 'Standard Crisis Support',
        availabilityHours: '24/7',
        aiModel: 'TherapySync AI Enterprise',
        responseTime: '<2 seconds',
        memoryRetention: 'Perfect session recall',
        culturalIntelligence: 'Advanced multicultural competency'
      })) || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || therapistData.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(therapistData.length / 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, therapistData.length]);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Width of each card plus gap
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth * 3,
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => {
    const maxIndex = Math.ceil(therapistData.length / 3) - 1;
    const newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const maxIndex = Math.ceil(therapistData.length / 3) - 1;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    scrollToIndex(newIndex);
  };

  const playVoicePreview = async (therapistId: string, therapistName: string) => {
    setPlayingVoice(therapistId);
    try {
      const sampleText = `Hello, I'm ${therapistName}. I'm here to support you on your mental health journey with personalized, compassionate care.`;
      
      // Simulate voice preview for now
      setTimeout(() => {
        setPlayingVoice(null);
        toast({
          title: "Voice Preview",
          description: `This is how ${therapistName} would sound during your sessions.`,
        });
      }, 3000);
    } catch (error) {
      setPlayingVoice(null);
      toast({
        title: "Voice Preview Unavailable",
        description: "Voice sample couldn't be loaded at the moment.",
        variant: "destructive"
      });
    }
  };

  const startDemo = (therapistId: string, therapistName: string) => {
    toast({
      title: "Demo Starting",
      description: `Launching interactive demo with ${therapistName}...`,
    });
    navigate(`/demo/${therapistId}`);
  };

  const openTherapistDetails = (therapist: TherapistData) => {
    setSelectedTherapist(therapist);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-background via-therapy-50/30 to-calm-50/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-therapy-600 mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading your therapy team...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || therapistData.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-background via-therapy-50/30 to-calm-50/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-destructive mb-4">Unable to load therapist team</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  const maxSlides = Math.ceil(therapistData.length / 3);

  return (
    <section className="py-24 bg-gradient-to-br from-background via-therapy-50/30 to-calm-50/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-therapy-100 to-calm-100 rounded-full mb-6 border border-therapy-200/50"
          >
            <Users className="h-5 w-5 text-therapy-600" />
            <span className="text-therapy-700 font-medium">Meet Your AI Therapy Team</span>
            <Sparkles className="h-4 w-4 text-therapy-500" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-therapy-600 via-calm-600 to-harmony-600 bg-clip-text text-transparent"
          >
            {therapistData.length}+ Professional AI Therapists
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Each AI therapist has unique personalities, specialized approaches, and professional avatars. 
            Find your perfect therapeutic match from our diverse team of mental health professionals.
          </motion.p>
        </div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
            <div className="text-3xl font-bold text-therapy-600 mb-1">{therapistData.length}+</div>
            <div className="text-sm text-muted-foreground">AI Therapists</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
            <div className="text-3xl font-bold text-calm-600 mb-1">60+</div>
            <div className="text-sm text-muted-foreground">Approaches</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
            <div className="text-3xl font-bold text-harmony-600 mb-1">29</div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
            <div className="text-3xl font-bold text-therapy-600 mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
        </motion.div>

        {/* Enhanced Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-2 border-therapy-200 hover:bg-therapy-50 hover:border-therapy-300 shadow-lg h-12 w-12"
            onClick={prevSlide}
            disabled={maxSlides <= 1}
          >
            <ChevronLeft className="h-6 w-6 text-therapy-600" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-2 border-therapy-200 hover:bg-therapy-50 hover:border-therapy-300 shadow-lg h-12 w-12"
            onClick={nextSlide}
            disabled={maxSlides <= 1}
          >
            <ChevronRight className="h-6 w-6 text-therapy-600" />
          </Button>

          {/* Therapist Cards Grid */}
          <div 
            ref={scrollContainerRef}
            className="overflow-hidden px-12"
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              animate={{ x: -currentIndex * 100 + '%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {therapistData.map((therapist, index) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="min-w-0"
                >
                  <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-white/60 hover:border-therapy-200 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                    <CardContent className="p-6">
                      {/* Avatar Section */}
                      <div className="text-center mb-6">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-therapy-400 to-calm-400 rounded-full blur-xl opacity-20 scale-110 group-hover:opacity-30 transition-opacity" />
                          <div className="relative w-24 h-24 mx-auto">
                            <img
                              src={getAvatarImage(therapist.avatarId)}
                              alt={therapist.name}
                              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getAvatarImage('dr-sarah-chen'); // Fallback
                              }}
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm">
                            <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                          </div>
                        </div>

                        {/* Name & Title */}
                        <h3 className="text-xl font-bold text-foreground mb-1">{therapist.name}</h3>
                        <p className="text-therapy-600 font-medium mb-2">{therapist.title}</p>
                        <Badge variant="outline" className="bg-therapy-50 border-therapy-200 text-therapy-700">
                          {therapist.approach}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                        {therapist.description}
                      </p>

                      {/* Specialties */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {therapist.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-calm-50 text-calm-700 border-calm-200">
                              {specialty}
                            </Badge>
                          ))}
                          {therapist.specialties.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-harmony-50 text-harmony-700">
                              +{therapist.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.9</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          <span>{therapist.languages.length}+</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>24/7</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button 
                          onClick={() => startDemo(therapist.id, therapist.name)}
                          className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                        >
                          <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                          Try Demo
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => openTherapistDetails(therapist)}
                            className="flex-1 bg-white/80 hover:bg-white border-therapy-200 hover:border-therapy-300 text-therapy-700"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                          <Button 
                            variant="outline"
                            size="icon"
                            onClick={() => playVoicePreview(therapist.id, therapist.name)}
                            disabled={playingVoice === therapist.id}
                            className="bg-white/80 hover:bg-white border-calm-200 hover:border-calm-300 text-calm-700 disabled:opacity-50"
                          >
                            <Volume2 className={`h-4 w-4 ${playingVoice === therapist.id ? 'animate-pulse' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Pagination Dots */}
        {maxSlides > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            {Array.from({ length: maxSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-therapy-500 scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => scrollToIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Therapist Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedTherapist ? `Meet ${selectedTherapist.name}` : 'Therapist Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTherapist && (
            <div className="space-y-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-6">
                <img
                  src={getAvatarImage(selectedTherapist.avatarId)}
                  alt={selectedTherapist.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-therapy-200"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedTherapist.name}</h3>
                  <p className="text-therapy-600 font-medium">{selectedTherapist.title}</p>
                  <p className="text-muted-foreground">{selectedTherapist.approach}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.9 • {selectedTherapist.yearsExperience}+ years experience</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-muted-foreground leading-relaxed">{selectedTherapist.description}</p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-semibold mb-3">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTherapist.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-therapy-50 border-therapy-200">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Communication Style */}
              <div>
                <h4 className="font-semibold mb-2">Communication Style</h4>
                <p className="text-muted-foreground">{selectedTherapist.communicationStyle}</p>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-semibold mb-2">Languages</h4>
                <p className="text-muted-foreground">{selectedTherapist.languages.slice(0, 10).join(', ')}
                  {selectedTherapist.languages.length > 10 && ` and ${selectedTherapist.languages.length - 10} more`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => {
                    setModalOpen(false);
                    startDemo(selectedTherapist.id, selectedTherapist.name);
                  }}
                  className="flex-1 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                >
                  Start Session
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setModalOpen(false);
                    playVoicePreview(selectedTherapist.id, selectedTherapist.name);
                  }}
                >
                  Voice Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EnhancedTherapistTeam;