
import React, { useState, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  User, 
  Heart, 
  Brain, 
  Users, 
  Star,
  Volume2,
  Languages,
  Clock,
  Shield,
  Award,
  Crown,
  Zap,
  Lock,
  CheckCircle,
  Search,
  Filter,
  MessageCircle,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { enhancedVoiceService } from '@/services/voiceService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface TherapistProfile {
  id: string;
  name: string;
  voiceId: string;
  voiceName: string;
  avatar: string;
  specializations: string[];
  approach: string;
  personality: string[];
  languages: string[];
  experience: string;
  rating: number;
  sampleText: string;
  background: string;
  techniques: string[];
  culturalBackground: string;
  premiumFeatures: string[];
  voiceQuality: 'standard' | 'premium' | 'plus';
  planRequired: 'free' | 'premium' | 'plus';
  reviews: {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  detailedBackground: string;
  profileImage: string;
}

const TherapistProfiles = () => {
  const { user } = useSimpleApp();
  const userPlan: 'free' | 'premium' | 'plus' = user ? 'premium' : 'free';
  
  useSEO({
    title: 'AI Therapist Profiles - TherapySync',
    description: 'Meet our AI therapists with unique personalities, specializations, and voice profiles.',
    keywords: 'AI therapists, therapy voices, mental health professionals, AI personalities'
  });

  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const therapists: TherapistProfile[] = [
    {
      id: 'dr-sarah-chen',
      name: 'Dr. Sarah Chen',
      voiceId: '9BWtsMINqrJLrRacOk9x',
      voiceName: 'Aria',
      avatar: '👩‍⚕️',
      profileImage: '/api/placeholder/300/300',
      specializations: ['Anxiety Disorders', 'Cognitive Behavioral Therapy', 'Stress Management'],
      approach: 'Evidence-based CBT with mindfulness integration',
      personality: ['Empathetic', 'Direct', 'Supportive', 'Professional'],
      languages: ['English', 'Mandarin', 'Spanish'],
      experience: '15+ years in clinical psychology',
      rating: 4.9,
      sampleText: "Hello, I'm Dr. Sarah Chen. I specialize in helping people overcome anxiety and develop practical coping strategies. My approach combines evidence-based cognitive behavioral therapy with mindfulness techniques to create lasting positive change.",
      background: "Dr. Chen brings over 15 years of experience in clinical psychology, specializing in anxiety disorders and stress management.",
      detailedBackground: "Dr. Sarah Chen earned her Ph.D. in Clinical Psychology from Stanford University, where she specialized in cognitive-behavioral interventions for anxiety disorders. With over 15 years of experience in both clinical practice and research, Dr. Chen has published numerous peer-reviewed articles on the efficacy of CBT techniques combined with mindfulness practices. Her approach is deeply rooted in evidence-based methodologies, yet she brings a warm, empathetic presence that puts clients at ease. Dr. Chen has worked extensively with individuals from diverse cultural backgrounds, particularly focusing on the intersection of cultural identity and mental health. She has served as a consultant for several Fortune 500 companies, developing workplace mental health programs, and has been featured in Psychology Today for her innovative approaches to anxiety treatment. Her therapeutic philosophy centers on empowering individuals to become their own agents of change, providing them with practical tools and strategies that extend far beyond the therapy session. Dr. Chen is fluent in English, Mandarin, and Spanish, allowing her to serve clients from various linguistic backgrounds with cultural sensitivity and understanding.",
      techniques: ['CBT', 'Mindfulness', 'Exposure Therapy', 'Stress Reduction'],
      culturalBackground: 'Chinese-American, culturally sensitive to Asian mental health perspectives',
      premiumFeatures: ['Real-time emotion detection', 'Voice analysis', 'Advanced CBT protocols'],
      voiceQuality: 'premium',
      planRequired: 'premium',
      reviews: [
        {
          id: '1',
          userId: 'user1',
          userName: 'Alex M.',
          rating: 5,
          comment: 'Dr. Chen helped me overcome my social anxiety. Her approach is both scientific and compassionate.',
          date: '2024-01-15'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Maria L.',
          rating: 5,
          comment: 'The CBT techniques she taught me have been life-changing. Highly recommend!',
          date: '2024-01-10'
        }
      ]
    },
    {
      id: 'dr-michael-rodriguez',
      name: 'Dr. Michael Rodriguez',
      voiceId: 'N2lVS1w4EtoT3dr4eOWO',
      voiceName: 'Callum',
      avatar: '👨‍⚕️',
      profileImage: '/api/placeholder/300/300',
      specializations: ['Trauma Recovery', 'EMDR', 'Post-Traumatic Stress'],
      approach: 'Trauma-informed care with somatic awareness',
      personality: ['Gentle', 'Patient', 'Trauma-informed', 'Calming'],
      languages: ['English', 'Spanish', 'Portuguese'],
      experience: '12+ years in trauma therapy',
      rating: 4.8,
      sampleText: "I'm Dr. Michael Rodriguez, and I specialize in trauma recovery and EMDR therapy. My gentle, trauma-informed approach helps you process difficult experiences at your own pace, creating a safe space for healing.",
      background: "Dr. Rodriguez is a trauma specialist with expertise in EMDR and somatic therapies.",
      detailedBackground: "Dr. Michael Rodriguez holds a Doctorate in Clinical Psychology from UCLA and is a certified EMDR therapist with over 12 years of specialized experience in trauma recovery. His journey into trauma therapy began during his early clinical training when he witnessed the transformative power of EMDR in helping survivors reclaim their lives. Dr. Rodriguez has worked extensively with veterans, survivors of domestic violence, and individuals who have experienced complex trauma. His approach integrates traditional EMDR techniques with somatic awareness practices, recognizing that trauma is stored not just in the mind but throughout the body. He has completed advanced training in Somatic Experiencing and is certified in Trauma-Sensitive Yoga. Dr. Rodriguez has presented at numerous conferences on trauma treatment and has contributed to research on the effectiveness of integrative approaches to PTSD treatment. His gentle, patient demeanor creates a safe therapeutic environment where clients feel heard and understood. He is particularly skilled at working with clients who have experienced betrayal trauma and has developed specialized protocols for addressing trust issues in the therapeutic relationship. Fluent in English, Spanish, and Portuguese, Dr. Rodriguez serves diverse communities and understands the cultural nuances that can impact trauma recovery.",
      techniques: ['EMDR', 'Somatic Therapy', 'Trauma-Informed Care', 'Body Awareness'],
      culturalBackground: 'Latino background with bilingual therapy expertise',
      premiumFeatures: ['Trauma-specific voice modulation', 'Crisis detection', 'EMDR guided sessions'],
      voiceQuality: 'plus',
      planRequired: 'plus',
      reviews: [
        {
          id: '3',
          userId: 'user3',
          userName: 'David K.',
          rating: 5,
          comment: 'Dr. Rodriguez created such a safe space for me to process my trauma. His EMDR sessions were incredibly effective.',
          date: '2024-01-12'
        }
      ]
    },
    {
      id: 'dr-emily-johnson',
      name: 'Dr. Emily Johnson',
      voiceId: 'XB0fDUnXU5powFXDhCwa',
      voiceName: 'Charlotte',
      avatar: '👩‍🏫',
      profileImage: '/api/placeholder/300/300',
      specializations: ['Mindfulness', 'Meditation', 'Wellness Coaching'],
      approach: 'Holistic wellness with mindfulness practices',
      personality: ['Soothing', 'Wise', 'Mindful', 'Peaceful'],
      languages: ['English', 'French', 'German'],
      experience: '10+ years in mindfulness therapy',
      rating: 4.9,
      sampleText: "Welcome, I'm Dr. Emily Johnson. I guide people toward inner peace through mindfulness and meditation practices. Together, we'll explore techniques that bring calm and clarity to your daily life.",
      background: "Dr. Johnson is a mindfulness expert who integrates meditation practices with traditional therapy.",
      detailedBackground: "Dr. Emily Johnson earned her Ph.D. in Contemplative Psychology from Naropa University and has spent over 10 years integrating Eastern mindfulness practices with Western psychological approaches. Her journey began during her own meditation retreat in Tibet, where she experienced firsthand the profound healing power of mindfulness. Dr. Johnson is a certified Mindfulness-Based Stress Reduction (MBSR) instructor and has trained under renowned meditation teachers including Jon Kabat-Zinn and Tara Brach. She has established mindfulness programs in hospitals, schools, and corporate settings, helping thousands of individuals develop greater emotional regulation and stress resilience. Her research on the neuroplasticity effects of meditation has been published in leading psychological journals. Dr. Johnson's approach is gentle yet transformative, helping clients develop a sustainable meditation practice that fits their lifestyle. She specializes in working with high-achieving individuals who struggle with perfectionism and burnout, teaching them how to find balance and inner peace. Her sessions often incorporate guided visualizations, breathing techniques, and body awareness practices. Dr. Johnson is fluent in English, French, and German, and has studied various contemplative traditions from around the world, bringing a rich multicultural perspective to her practice.",
      techniques: ['Mindfulness-Based Therapy', 'Meditation', 'Breathwork', 'Body Scan'],
      culturalBackground: 'European training in mindfulness and meditation practices',
      premiumFeatures: ['Guided meditation voices', 'Breathing analytics', 'Mindfulness tracking'],
      voiceQuality: 'premium',
      planRequired: 'premium',
      reviews: [
        {
          id: '4',
          userId: 'user4',
          userName: 'Sarah T.',
          rating: 5,
          comment: 'Dr. Johnson taught me meditation techniques that completely changed my stress levels. So peaceful and wise.',
          date: '2024-01-08'
        }
      ]
    },
    {
      id: 'dr-james-wilson',
      name: 'Dr. James Wilson',
      voiceId: 'nPczCjzI2devNBz1zQrb',
      voiceName: 'Brian',
      avatar: '👨‍🎓',
      profileImage: '/api/placeholder/300/300',
      specializations: ['ADHD', 'Autism Spectrum', 'Neurodevelopmental Disorders'],
      approach: 'Neurodiversity-affirming therapy with practical strategies',
      personality: ['Patient', 'Understanding', 'Structured', 'Neurodiverse-affirming'],
      languages: ['English', 'Sign Language', 'German'],
      experience: '11+ years in neurodevelopmental therapy',
      rating: 4.9,
      sampleText: "I'm Dr. James Wilson, and I specialize in supporting individuals with ADHD, autism, and other neurodevelopmental differences. My approach celebrates neurodiversity while providing practical tools for success.",
      background: "Dr. Wilson is a neurodiversity specialist who works with individuals across the autism spectrum and those with ADHD.",
      detailedBackground: "Dr. James Wilson holds a Ph.D. in Developmental Psychology from Harvard University with a specialization in autism spectrum disorders and ADHD. With over 11 years of experience, Dr. Wilson has dedicated his career to understanding and supporting neurodivergent individuals. As someone who is on the autism spectrum himself, he brings both professional expertise and lived experience to his practice. Dr. Wilson is a strong advocate for the neurodiversity movement, believing that neurological differences should be recognized and respected as natural variations of human diversity rather than disorders to be cured. He has developed innovative therapeutic approaches that focus on building on individual strengths rather than trying to eliminate differences. His work includes creating sensory-friendly therapeutic environments and developing executive function coaching programs. Dr. Wilson has consulted for major technology companies to create more inclusive workplaces for neurodivergent employees. He is fluent in American Sign Language and has worked extensively with deaf and hard-of-hearing individuals who are also on the autism spectrum. His research on the intersection of sensory processing and emotional regulation has been groundbreaking in the field. Dr. Wilson's approach is highly structured and predictable, which provides comfort for many neurodivergent clients, while also being flexible enough to accommodate individual needs and preferences.",
      techniques: ['Applied Behavior Analysis', 'Social Skills Training', 'Executive Function Coaching', 'Sensory Integration'],
      culturalBackground: 'Neurodiversity advocate with specialized training in autism and ADHD',
      premiumFeatures: ['Sensory-adapted voices', 'Executive function tools', 'Special needs protocols'],
      voiceQuality: 'plus',
      planRequired: 'plus',
      reviews: [
        {
          id: '5',
          userId: 'user5',
          userName: 'Rachel P.',
          rating: 5,
          comment: 'As someone with ADHD, Dr. Wilson understood my challenges like no one else. His strategies actually work!',
          date: '2024-01-05'
        }
      ]
    }
  ];

  // Get unique values for filters
  const allSpecializations = Array.from(new Set(therapists.flatMap(t => t.specializations)));
  const allLanguages = Array.from(new Set(therapists.flatMap(t => t.languages)));
  const allExperience = Array.from(new Set(therapists.map(t => t.experience)));
  const allPlans = ['free', 'premium', 'plus'];

  // Filter therapists based on search and filters
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialization = specializationFilter === 'all' || 
                                 therapist.specializations.some(spec => spec === specializationFilter);
    
    const matchesLanguage = languageFilter === 'all' || 
                           therapist.languages.includes(languageFilter);
    
    const matchesExperience = experienceFilter === 'all' || 
                             therapist.experience === experienceFilter;
    
    const matchesPlan = planFilter === 'all' || therapist.planRequired === planFilter;
    
    return matchesSearch && matchesSpecialization && matchesLanguage && matchesExperience && matchesPlan;
  });

  const playVoiceSample = async (therapist: TherapistProfile) => {
    if (playingVoice === therapist.id) {
      enhancedVoiceService.stop();
      setPlayingVoice(null);
      return;
    }

    // Check if premium voice requires upgrade
    if (therapist.voiceQuality !== 'standard' && userPlan === 'free') {
      alert('Premium voice features require a subscription. Please upgrade to access high-quality voices.');
      return;
    }

    if (therapist.voiceQuality === 'plus' && userPlan !== 'plus') {
      alert('Plus voice features require a Plus subscription. Please upgrade to access advanced voice analytics.');
      return;
    }

    setIsLoading(true);
    setPlayingVoice(therapist.id);

    try {
      await enhancedVoiceService.playTherapistMessage(
        therapist.sampleText,
        therapist.id
      );
    } catch (error) {
      console.error('Error playing voice sample:', error);
    } finally {
      setIsLoading(false);
      setPlayingVoice(null);
    }
  };

  const getVoiceQualityBadge = (quality: string) => {
    switch (quality) {
      case 'plus':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Crown className="h-3 w-3 mr-1" />Plus</Badge>;
      case 'premium':
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"><Zap className="h-3 w-3 mr-1" />Premium</Badge>;
      default:
        return <Badge variant="outline">Standard</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'plus':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Crown className="h-3 w-3 mr-1" />Plus Plan</Badge>;
      case 'premium':
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"><Zap className="h-3 w-3 mr-1" />Premium Plan</Badge>;
      default:
        return <Badge variant="outline">Free Plan</Badge>;
    }
  };

  const canAccessTherapist = (therapist: TherapistProfile) => {
    if (therapist.planRequired === 'free') return true;
    if (therapist.planRequired === 'premium' && (userPlan === 'premium' || userPlan === 'plus')) return true;
    if (therapist.planRequired === 'plus' && userPlan === 'plus') return true;
    return false;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <MobileOptimizedLayout>
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent mb-6">
              Meet Your AI Therapists
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Each AI therapist has a unique personality, specialization, and voice. 
              Find the perfect match for your therapy journey with advanced filtering options.
            </p>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search therapists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {allSpecializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {allLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  {allExperience.map(exp => (
                    <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Plan Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {allPlans.map(plan => (
                    <SelectItem key={plan} value={plan}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredTherapists.length} of {therapists.length} therapists
            </p>
          </div>

          {/* Therapist Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTherapists.map((therapist) => (
              <Card key={therapist.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-harmony-500 to-flow-500 flex items-center justify-center text-2xl">
                      {therapist.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl">{therapist.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          {renderStars(therapist.rating)}
                          <span className="text-sm text-muted-foreground ml-1">({therapist.rating})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getVoiceQualityBadge(therapist.voiceQuality)}
                        {getPlanBadge(therapist.planRequired)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{therapist.experience}</p>
                      <p className="text-sm text-muted-foreground">{therapist.approach}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Specializations */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {therapist.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Languages className="h-4 w-4 mr-2" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {therapist.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Personality */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Personality
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {therapist.personality.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Voice Sample */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Voice Sample
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 italic">
                      "{therapist.sampleText.substring(0, 100)}..."
                    </p>
                    {canAccessTherapist(therapist) ? (
                      <Button
                        onClick={() => playVoiceSample(therapist)}
                        className="w-full"
                        disabled={isLoading}
                      >
                        {playingVoice === therapist.id ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Play Voice Sample
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
                        onClick={() => window.location.href = '/plans'}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Upgrade to Access
                      </Button>
                    )}
                  </div>

                  {/* Recent Reviews */}
                  {therapist.reviews.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Recent Reviews
                      </h4>
                      <div className="space-y-2">
                        {therapist.reviews.slice(0, 2).map((review) => (
                          <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{review.userName}</span>
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    {canAccessTherapist(therapist) ? (
                      <Button className="flex-1 bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
                        onClick={() => window.location.href = '/plans'}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-harmony-900 mb-4">
              Ready to Start Your Therapy Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Choose your AI therapist and begin personalized therapy sessions with advanced voice technology and evidence-based approaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
                onClick={() => window.location.href = '/register'}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/plans'}
              >
                <Crown className="h-5 w-5 mr-2" />
                View All Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

export default TherapistProfiles;
