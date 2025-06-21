import React, { useState, useMemo } from 'react';
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
}

const therapistsData: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Cognitive Behavioral Therapist',
    description: 'Specializes in anxiety and depression using evidence-based CBT techniques with a warm, supportive approach.',
    approach: 'Cognitive Behavioral Therapy',
    specialties: ['Anxiety', 'Depression', 'Stress Management', 'CBT'],
    communicationStyle: 'Warm, direct, and solution-focused',
    icon: 'Brain',
    colorScheme: 'from-therapy-500 to-therapy-600',
    tier: 'premium',
    voiceSampleUrl: '/audio/sample-voice-1.mp3',
    videoIntroUrl: '/videos/sample-video-1.mp4',
    profileImageUrl: '/images/therapist-1.jpg'
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    title: 'Trauma Specialist',
    description: 'Expert in trauma-informed care and EMDR therapy for PTSD treatment with a gentle, patient-centered approach.',
    approach: 'EMDR Therapy',
    specialties: ['Trauma', 'PTSD', 'EMDR', 'Crisis Intervention'],
    communicationStyle: 'Gentle, patient, and trauma-informed',
    icon: 'Heart',
    colorScheme: 'from-calm-500 to-calm-600',
    tier: 'plus',
    voiceSampleUrl: '/audio/sample-voice-2.mp3',
    videoIntroUrl: '/videos/sample-video-2.mp4',
    profileImageUrl: '/images/therapist-2.jpg'
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
  
  const userPlan = user?.subscription?.plan || 'free';
  const hasStandardAccess = userPlan === 'free' || userPlan === 'premium' || userPlan === 'plus';
  const hasPremiumAccess = userPlan === 'premium' || userPlan === 'plus';
  const hasPlusAccess = userPlan === 'plus';

  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [accessLevel, setAccessLevel] = useState('all');
  const [therapists, setTherapists] = useState(therapistsData);

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

  const renderTherapistCard = (therapist: Therapist) => {
    const IconComponent = therapist.icon ? (Brain as any)[therapist.icon] : Brain;

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
