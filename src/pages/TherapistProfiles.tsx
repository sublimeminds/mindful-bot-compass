import React, { useState, useMemo, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Heart, 
  Shield, 
  Star, 
  Play,
  Users,
  Award,
  Clock,
  Globe,
  Crown,
  Search,
  Filter,
  Volume2,
  MessageCircle,
  User,
  ThumbsUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { profileImageService } from '@/services/profileImageService';
import { subscriptionService } from '@/services/subscriptionService';

interface Therapist {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communicationStyle: string;
  icon: string;
  colorScheme: string;
  tier: 'standard' | 'premium' | 'plus';
  voiceSampleUrl?: string;
  videoIntroUrl?: string;
  profileImageUrl?: string;
  background?: string;
  reviews?: TherapistReview[];
  averageRating?: number;
}

interface TherapistReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const therapistsData: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Cognitive Behavioral Therapist',
    description: 'Specializes in anxiety and depression using evidence-based CBT techniques with a warm, supportive approach.',
    background: 'Dr. Sarah Chen brings over 15 years of clinical experience to TherapySync. She completed her Ph.D. in Clinical Psychology at Stanford University and specialized training in Cognitive Behavioral Therapy at the Beck Institute. Dr. Chen has worked extensively with individuals struggling with anxiety disorders, depression, and stress-related conditions. Her approach combines evidence-based CBT techniques with mindfulness practices, creating a warm and supportive therapeutic environment. She believes in empowering clients with practical tools they can use in their daily lives. Dr. Chen has published research on the effectiveness of digital CBT interventions and is passionate about making mental health care more accessible through technology. Her multicultural background allows her to work effectively with diverse populations, and she speaks fluent English, Mandarin, and Cantonese.',
    approach: 'Cognitive Behavioral Therapy',
    specialties: ['Anxiety', 'Depression', 'Stress Management', 'CBT'],
    communicationStyle: 'Warm, direct, and solution-focused',
    icon: 'Brain',
    colorScheme: 'from-therapy-500 to-therapy-600',
    tier: 'premium',
    voiceSampleUrl: '/audio/sample-voice-1.mp3',
    videoIntroUrl: '/videos/sample-video-1.mp4',
    profileImageUrl: '/images/therapist-1.jpg',
    averageRating: 4.8,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'Jennifer M.',
        rating: 5,
        comment: 'Dr. Chen helped me overcome my anxiety with practical CBT techniques. Her warm approach made me feel comfortable from day one.',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Mark T.',
        rating: 5,
        comment: 'Outstanding therapist. The CBT tools she taught me have been life-changing for managing my depression.',
        createdAt: '2024-01-10'
      }
    ]
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    title: 'Trauma Specialist',
    description: 'Expert in trauma-informed care and EMDR therapy for PTSD treatment with a gentle, patient-centered approach.',
    background: 'Dr. Michael Rodriguez is a licensed clinical psychologist with specialized expertise in trauma therapy and EMDR (Eye Movement Desensitization and Reprocessing). He earned his doctorate from UCLA and completed advanced training at the EMDR International Association. With over 12 years of experience treating trauma survivors, Dr. Rodriguez has worked with veterans, first responders, and civilians who have experienced various forms of trauma. His gentle, patient-centered approach creates a safe space for healing. He is bilingual in English and Spanish and has extensive experience working with diverse communities. Dr. Rodriguez is certified in multiple trauma therapies including EMDR, Trauma-Focused CBT, and Somatic Experiencing. He believes in the resilience of the human spirit and works collaboratively with clients to help them reclaim their lives after trauma.',
    approach: 'EMDR Therapy',
    specialties: ['Trauma', 'PTSD', 'EMDR', 'Crisis Intervention'],
    communicationStyle: 'Gentle, patient, and trauma-informed',
    icon: 'Heart',
    colorScheme: 'from-calm-500 to-calm-600',
    tier: 'plus',
    voiceSampleUrl: '/audio/sample-voice-2.mp3',
    videoIntroUrl: '/videos/sample-video-2.mp4',
    profileImageUrl: '/images/therapist-2.jpg',
    averageRating: 4.9,
    reviews: [
      {
        id: '3',
        userId: 'user3',
        userName: 'Sarah K.',
        rating: 5,
        comment: 'Dr. Rodriguez helped me process my trauma with such care and expertise. EMDR therapy with him was transformative.',
        createdAt: '2024-01-20'
      }
    ]
  },
  {
    id: '3',
    name: 'Dr. Emily Johnson',
    title: 'Mindfulness-Based Therapist',
    description: 'Focuses on mindfulness-based approaches and emotional regulation skills with a compassionate, mindful presence.',
    approach: 'Dialectical Behavior Therapy',
    specialties: ['Mindfulness', 'Emotional Regulation', 'DBT', 'Stress'],
    communicationStyle: 'Compassionate, mindful, and accepting',
    icon: 'Shield',
    colorScheme: 'from-harmony-500 to-harmony-600',
    tier: 'standard',
    voiceSampleUrl: '/audio/sample-voice-3.mp3',
    videoIntroUrl: '/videos/sample-video-3.mp4',
    profileImageUrl: '/images/therapist-3.jpg'
  },
  {
    id: '4',
    name: 'Dr. David Lee',
    title: 'Anxiety and Stress Management',
    description: 'Provides effective strategies for managing anxiety and stress using cognitive and behavioral techniques.',
    approach: 'Cognitive Behavioral Therapy',
    specialties: ['Anxiety', 'Stress Management', 'CBT', 'Relaxation Techniques'],
    communicationStyle: 'Empathetic, supportive, and practical',
    icon: 'Brain',
    colorScheme: 'from-therapy-500 to-therapy-600',
    tier: 'premium',
    voiceSampleUrl: '/audio/sample-voice-4.mp3',
    videoIntroUrl: '/videos/sample-video-4.mp4',
    profileImageUrl: '/images/therapist-4.jpg'
  },
  {
    id: '5',
    name: 'Dr. Maria Garcia',
    title: 'Relationship and Family Therapist',
    description: 'Specializes in improving relationships and resolving family conflicts with a systemic approach.',
    approach: 'Family Systems Therapy',
    specialties: ['Relationship Issues', 'Family Conflict', 'Communication', 'Divorce Recovery'],
    communicationStyle: 'Collaborative, understanding, and solution-oriented',
    icon: 'Heart',
    colorScheme: 'from-calm-500 to-calm-600',
    tier: 'plus',
    voiceSampleUrl: '/audio/sample-voice-5.mp3',
    videoIntroUrl: '/videos/sample-video-5.mp4',
    profileImageUrl: '/images/therapist-5.jpg'
  },
  {
    id: '6',
    name: 'Dr. James Wilson',
    title: 'Addiction and Recovery Specialist',
    description: 'Offers support and guidance for individuals overcoming addiction with a focus on long-term recovery.',
    approach: 'Motivational Interviewing',
    specialties: ['Addiction', 'Recovery', 'Substance Abuse', 'Relapse Prevention'],
    communicationStyle: 'Encouraging, non-judgmental, and goal-focused',
    icon: 'Shield',
    colorScheme: 'from-harmony-500 to-harmony-600',
    tier: 'standard',
    voiceSampleUrl: '/audio/sample-voice-6.mp3',
    videoIntroUrl: '/videos/sample-video-6.mp4',
    profileImageUrl: '/images/therapist-6.jpg'
  }
];

const TherapistProfiles = () => {
  const { user } = useSimpleApp();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState<string>('free');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [accessLevel, setAccessLevel] = useState('all');
  const [therapists, setTherapists] = useState(therapistsData);

  // Fetch user subscription data
  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (user?.id) {
        const subscription = await subscriptionService.getUserSubscription(user.id);
        if (subscription) {
          // Map subscription plan names to our tier system
          const planMapping: Record<string, string> = {
            'Free': 'free',
            'Basic': 'premium', 
            'Premium': 'plus'
          };
          setUserPlan(planMapping[subscription.planId] || 'free');
        }
      }
    };

    fetchUserSubscription();
  }, [user]);

  const hasStandardAccess = userPlan === 'free' || userPlan === 'premium' || userPlan === 'plus';
  const hasPremiumAccess = userPlan === 'premium' || userPlan === 'plus';
  const hasPlusAccess = userPlan === 'plus';

  const specialties = useMemo(() => {
    const allSpecialties = therapists.reduce((acc: string[], therapist) => {
      return [...acc, ...therapist.specialties];
    }, []);
    return Array.from(new Set(allSpecialties));
  }, [therapists]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSpecialtyFilter = (value: string) => {
    setSpecialtyFilter(value);
  };

  const handleAccessLevelFilter = (value: string) => {
    setAccessLevel(value);
  };

  const filteredTherapists = useMemo(() => {
    return therapists.filter(therapist => {
      if (accessLevel === 'standard' && therapist.tier !== 'standard') return false;
      if (accessLevel === 'premium' && therapist.tier === 'plus') return false;
      if (accessLevel === 'plus' && therapist.tier !== 'plus') return false;

      if (therapist.tier === 'premium' && !hasPremiumAccess) return false;
      if (therapist.tier === 'plus' && !hasPlusAccess) return false;

      const searchRegex = new RegExp(searchTerm, 'i');
      if (
        !searchRegex.test(therapist.name) &&
        !searchRegex.test(therapist.title) &&
        !searchRegex.test(therapist.description) &&
        !therapist.specialties.some(specialty => searchRegex.test(specialty))
      ) {
        return false;
      }

      if (specialtyFilter && !therapist.specialties.includes(specialtyFilter)) {
        return false;
      }

      return true;
    });
  }, [searchTerm, specialtyFilter, accessLevel, hasPremiumAccess, hasPlusAccess]);

  const canAccessTherapist = (tier: string) => {
    if (tier === 'standard') return true;
    if (tier === 'premium') return hasPremiumAccess;
    if (tier === 'plus') return hasPlusAccess;
    return false;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderTherapistCard = (therapist: Therapist) => {
    const canAccess = canAccessTherapist(therapist.tier);

    return (
      <Card key={therapist.id} className="relative">
        {therapist.tier === 'plus' && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-therapy-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Plus Exclusive
            </Badge>
          </div>
        )}
        {therapist.tier === 'premium' && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-harmony-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Premium Access
            </Badge>
          </div>
        )}
        <CardHeader>
          <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
            <img
              src={therapist.profileImageUrl || '/api/placeholder/300/300'}
              alt={therapist.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardTitle className="text-xl font-bold text-center">{therapist.name}</CardTitle>
          <p className="text-muted-foreground text-center">{therapist.title}</p>
          
          {/* Rating Display */}
          {therapist.averageRating && (
            <div className="flex justify-center items-center space-x-2 mt-2">
              <div className="flex">
                {renderStars(Math.round(therapist.averageRating))}
              </div>
              <span className="text-sm text-muted-foreground">
                {therapist.averageRating} ({therapist.reviews?.length || 0} reviews)
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">{therapist.description}</p>
          <div className="flex justify-center space-x-2 mb-4">
            {therapist.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          {canAccess ? (
            <div className="flex justify-center space-x-4">
              {therapist.voiceSampleUrl && (
                <Button variant="outline" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
              {therapist.videoIntroUrl && (
                <Button variant="outline" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              )}
              <Button onClick={() => navigate('/therapy')} className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with {therapist.name.split(' ')[1]}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {therapist.tier === 'premium' ? 'Premium Plan Required' : 'Plus Plan Required'}
              </p>
              <Button 
                onClick={() => navigate('/plans')} 
                className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Access
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <MobileOptimizedLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent mb-4">
              Meet Our AI Therapists
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our diverse team of AI therapists, each with unique specializations and approaches. 
              Find the perfect match for your mental wellness journey.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Input type="text" placeholder="Search therapists..." onChange={handleSearch} />
            <Select onValueChange={handleSpecialtyFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleAccessLevelFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access Levels</SelectItem>
                <SelectItem value="standard">Standard Access</SelectItem>
                <SelectItem value="premium">Premium Access</SelectItem>
                <SelectItem value="plus">Plus Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Therapist Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTherapists.length > 0 ? (
              filteredTherapists.map(therapist => renderTherapistCard(therapist))
            ) : (
              <div className="text-center col-span-full">
                <p className="text-muted-foreground">No therapists found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <Card className="mt-16 border-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Connect with an AI Therapist?</h2>
              <p className="text-therapy-100 mb-8 max-w-2xl mx-auto text-lg">
                Explore our AI therapists and start your personalized mental wellness journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/therapy')}
                  size="lg"
                  className="bg-white text-therapy-700 hover:bg-therapy-50"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start a Session
                </Button>
                <Button 
                  onClick={() => navigate('/plans')}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Explore Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

export default TherapistProfiles;
