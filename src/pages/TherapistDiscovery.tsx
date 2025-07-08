import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Award,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  MessageCircle,
  Mic,
  Camera
} from 'lucide-react';
import ThreeDTherapistAvatar from '@/components/avatar/ThreeDTherapistAvatar';
import { therapistPersonas } from '@/components/avatar/TherapistAvatarPersonas';
import { getVoiceIdForTherapist } from '@/services/therapistAvatarMapping';

// Enhanced therapist data with comprehensive information
const therapistData = [
  {
    id: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen',
    title: 'Cognitive Behavioral Therapist',
    approach: 'Cognitive Behavioral Therapy',
    description: 'Specializes in anxiety and depression using evidence-based CBT techniques with a warm, supportive approach.',
    specialties: ['Anxiety', 'Depression', 'Stress Management', 'CBT', 'Panic Disorders'],
    communicationStyle: 'Warm, direct, and solution-focused',
    culturalCompetencies: ['Asian-American', 'Multicultural', 'LGBTQ+ Affirming'],
    experienceLevel: 'Expert',
    successRate: 94,
    userSatisfaction: 4.9,
    sessionCount: 15420,
    voiceCharacteristics: 'Warm, analytical, reassuring',
    personalityTraits: ['Empathetic', 'Structured', 'Evidence-based', 'Patient'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    crisisSupport: 'Advanced',
    availabilityHours: '24/7',
    icon: Brain,
    colorScheme: 'from-therapy-500 to-therapy-600',
    avatarId: 'dr-sarah-chen'
  },
  {
    id: 'dr-maya-patel',
    name: 'Dr. Maya Patel',
    title: 'Mindfulness-Based Therapist',
    approach: 'Dialectical Behavior Therapy',
    description: 'Focuses on mindfulness-based approaches and emotional regulation skills with a compassionate, mindful presence.',
    specialties: ['Mindfulness', 'Emotional Regulation', 'DBT', 'Stress', 'Meditation'],
    communicationStyle: 'Compassionate, mindful, and accepting',
    culturalCompetencies: ['South Asian', 'Hindu/Buddhist Traditions', 'Mindfulness-based'],
    experienceLevel: 'Expert',
    successRate: 91,
    userSatisfaction: 4.8,
    sessionCount: 12340,
    voiceCharacteristics: 'Gentle, calming, wise',
    personalityTraits: ['Mindful', 'Accepting', 'Gentle', 'Spiritual'],
    languages: ['English', 'Hindi', 'Gujarati'],
    crisisSupport: 'Intermediate',
    availabilityHours: '24/7',
    icon: Heart,
    colorScheme: 'from-calm-500 to-calm-600',
    avatarId: 'dr-maya-patel'
  },
  {
    id: 'dr-alex-rodriguez',
    name: 'Dr. Alex Rodriguez',
    title: 'Solution-Focused Therapist',
    approach: 'Solution-Focused Brief Therapy',
    description: 'Expert in solution-focused approaches helping clients identify strengths and achieve rapid positive change.',
    specialties: ['Goal Setting', 'Life Transitions', 'SFBT', 'Career Counseling', 'Motivation'],
    communicationStyle: 'Energetic, optimistic, and goal-oriented',
    culturalCompetencies: ['Latino/Hispanic', 'Bilingual Therapy', 'Cultural Adaptation'],
    experienceLevel: 'Advanced',
    successRate: 89,
    userSatisfaction: 4.7,
    sessionCount: 9870,
    voiceCharacteristics: 'Energetic, motivating, clear',
    personalityTraits: ['Optimistic', 'Goal-oriented', 'Motivating', 'Action-focused'],
    languages: ['English', 'Spanish'],
    crisisSupport: 'Basic',
    availabilityHours: '24/7',
    icon: Target,
    colorScheme: 'from-harmony-500 to-harmony-600',
    avatarId: 'dr-alex-rodriguez'
  },
  {
    id: 'dr-jordan-kim',
    name: 'Dr. Jordan Kim',
    title: 'Trauma Specialist',
    approach: 'EMDR Therapy',
    description: 'Expert in trauma-informed care and EMDR therapy for PTSD treatment with a gentle, patient-centered approach.',
    specialties: ['Trauma', 'PTSD', 'EMDR', 'Crisis Intervention', 'Complex Trauma'],
    communicationStyle: 'Gentle, patient, and trauma-informed',
    culturalCompetencies: ['Korean-American', 'Trauma-informed', 'Military Families'],
    experienceLevel: 'Expert',
    successRate: 96,
    userSatisfaction: 4.9,
    sessionCount: 18750,
    voiceCharacteristics: 'Gentle, grounding, secure',
    personalityTraits: ['Trauma-informed', 'Patient', 'Grounding', 'Safe'],
    languages: ['English', 'Korean'],
    crisisSupport: 'Expert',
    availabilityHours: '24/7',
    icon: Shield,
    colorScheme: 'from-balance-500 to-balance-600',
    avatarId: 'dr-jordan-kim'
  }
];

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

  // Generate random compatibility scores for demo
  useEffect(() => {
    const scores: {[key: string]: number} = {};
    therapistData.forEach(therapist => {
      scores[therapist.id] = Math.floor(Math.random() * 20) + 80; // 80-100% compatibility
    });
    setCompatibilityScores(scores);
  }, []);

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
              Meet our team of 9 specialized AI therapists, each with unique personalities, approaches, and expertise. 
              Powered by advanced AI with perfect memory, cultural intelligence, and 24/7 availability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-therapy-600">9</div>
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
                  <div className="h-48 bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden">
                    <Suspense fallback={<Skeleton className="w-full h-full" />}>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        // Start session with this therapist
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Session
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
                        <p className="text-sm font-medium mb-2">Cultural Competencies</p>
                        <div className="flex flex-wrap gap-1">
                          {therapist.culturalCompetencies.map((comp, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
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