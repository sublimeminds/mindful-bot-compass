import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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
  MessageCircle
} from 'lucide-react';
import ThreeDTherapistAvatar from '@/components/avatar/ThreeDTherapistAvatar';
import ThreeDErrorBoundary from '@/components/ThreeDErrorBoundary';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  // Helper function to get icon component by name
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
      TrendingUp
    };
    return icons[iconName as keyof typeof icons] || Brain;
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
        successRate: Math.floor(Math.random() * 20) + 80, // 80-100% for demo
        userSatisfaction: (Math.random() * 1 + 4).toFixed(1), // 4.0-5.0 for demo
        sessionCount: Math.floor(Math.random() * 10000) + 5000, // Demo data
        voiceCharacteristics: getVoiceCharacteristics(therapist.communication_style),
        languages: ['English'], // Default, could be expanded
        crisisSupport: therapist.experience_level === 'Expert' ? 'Advanced' : 'Intermediate',
        availabilityHours: '24/7'
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

  const playVoicePreview = (therapistId: string) => {
    // Voice preview functionality would be implemented here
    console.log(`Playing voice preview for ${therapistId}`);
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
                  {/* 3D Avatar */}
                  <div className="h-64 bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden border border-therapy-100">
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-xl">
                              {therapist.name.charAt(0)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Loading...</p>
                        </div>
                      </div>
                    }>
                      <ThreeDTherapistAvatar
                        therapistId={therapist.avatarId}
                        emotion="neutral"
                        showControls={false}
                      />
                    </Suspense>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{therapist.description}</p>

                  {/* Approach Badge */}
                  <div className="flex items-center space-x-2">
                    <therapist.icon className="h-4 w-4 text-therapy-600" />
                    <Badge variant="outline" className="text-xs">
                      {therapist.approach}
                    </Badge>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialties.slice(0, 4).map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {therapist.specialties.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{therapist.specialties.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-therapy-600">{therapist.successRate}%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-calm-600">{therapist.userSatisfaction}</div>
                      <div className="text-xs text-muted-foreground">User Rating</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Learn more about this therapist
                      }}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Try demo conversation
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {selectedTherapist === therapist.id && (
                    <div className="space-y-4 pt-4 border-t animate-accordion-down">
                      <div>
                        <p className="text-sm font-medium mb-2">Communication Style</p>
                        <p className="text-sm text-muted-foreground">{therapist.communicationStyle}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Languages</p>
                        <div className="flex flex-wrap gap-1">
                          {therapist.languages.map((lang, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-sm font-bold">{therapist.sessionCount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Sessions Completed</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold">{therapist.crisisSupport}</div>
                          <div className="text-xs text-muted-foreground">Crisis Support</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why TherapySync AI is Different */}
      <section className="py-16 bg-gradient-to-r from-therapy-50/50 via-calm-50/50 to-harmony-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why TherapySync AI is Industry Leading</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our AI therapists combine cutting-edge technology with proven therapeutic approaches, 
              delivering personalized care that adapts to your unique needs and cultural background.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-therapy-500/10 rounded-lg">
                    <Brain className="h-6 w-6 text-therapy-600" />
                  </div>
                  <CardTitle className="text-lg">Perfect Memory</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Never repeats questions or forgets important details. Our AI remembers every conversation, 
                  building deeper understanding over time.
                </p>
                <div className="flex items-center space-x-2 text-sm text-therapy-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>100% conversation retention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-calm-500/10 rounded-lg">
                    <Globe className="h-6 w-6 text-calm-600" />
                  </div>
                  <CardTitle className="text-lg">Cultural Intelligence</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Automatically adapts therapeutic approach based on your cultural background, 
                  values, and communication preferences.
                </p>
                <div className="flex items-center space-x-2 text-sm text-calm-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>15+ cultural frameworks</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-harmony-500/10 rounded-lg">
                    <Shield className="h-6 w-6 text-harmony-600" />
                  </div>
                  <CardTitle className="text-lg">Crisis Detection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Advanced AI monitors for signs of distress and automatically provides 
                  appropriate crisis intervention resources.
                </p>
                <div className="flex items-center space-x-2 text-sm text-harmony-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Real-time safety monitoring</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-balance-500/10 rounded-lg">
                    <Zap className="h-6 w-6 text-balance-600" />
                  </div>
                  <CardTitle className="text-lg">Multi-Model Intelligence</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Combines ChatGPT, Anthropic Claude, and specialized therapy models for 
                  the most sophisticated AI responses available.
                </p>
                <div className="flex items-center space-x-2 text-sm text-balance-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>3+ AI models working together</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-flow-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-flow-600" />
                  </div>
                  <CardTitle className="text-lg">24/7 Availability</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your AI therapist never sleeps. Get support whenever you need it, 
                  whether it's 3 AM or during a crisis.
                </p>
                <div className="flex items-center space-x-2 text-sm text-flow-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Instant response anytime</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-energy-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-energy-600" />
                  </div>
                  <CardTitle className="text-lg">Continuous Learning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our AI gets better with every conversation, learning your preferences 
                  and adapting to provide increasingly personalized care.
                </p>
                <div className="flex items-center space-x-2 text-sm text-energy-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Personalized adaptation</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-therapy-500/10 via-calm-500/10 to-harmony-500/10 border-therapy-200">
            <CardContent className="text-center p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Meet Your Perfect AI Therapist?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join over 100,000 users who have found their ideal therapeutic match with TherapySync AI. 
                Start your mental health journey today with the world's most advanced AI therapy platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Your Free Assessment
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Try 2-Minute Demo
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No commitment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>HIPAA compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TherapistDiscovery;