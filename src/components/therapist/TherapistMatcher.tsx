
import React, { useState, Suspense, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, User, Heart, Brain, Search, Sparkles, CheckCircle } from 'lucide-react';
import SafeTherapistAvatarCard from '@/components/avatar/SafeTherapistAvatarCard';
import SafeAvatarModal from '@/components/avatar/SafeAvatarModal';
import SimpleFavoriteButton from '@/components/therapist/SimpleFavoriteButton';
import TherapistSelectionFlow from '@/components/therapist/TherapistSelectionFlow';
import TherapistSearchFilters from '@/components/therapist/TherapistSearchFilters';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { useAITherapistMatching } from '@/hooks/useAITherapistMatching';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';

interface TherapistMatcherProps {
  onTherapistSelected: (therapistId: string) => void;
  onClose: () => void;
  assessmentMatches?: any[];
  assessmentId?: string;
  userAssessment?: any; // Add user assessment data for AI matching
}

const TherapistMatcher = ({ onTherapistSelected, onClose, assessmentMatches, assessmentId, userAssessment }: TherapistMatcherProps) => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedTherapistData, setSelectedTherapistData] = useState<any>(null);
  const [modalTherapist, setModalTherapist] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSelectionFlow, setShowSelectionFlow] = useState(false);
  const [filteredTherapists, setFilteredTherapists] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [aiMatchResults, setAiMatchResults] = useState<any>(null);
  const [showAiMatches, setShowAiMatches] = useState(false);
  
  const { isMatching, matchTherapists } = useAITherapistMatching();

  // Enhanced therapist data with more details for AI matching
  const allTherapists = [
    {
      id: 'ed979f27-2491-43f1-a779-5095febb68b2',
      name: 'Dr. Sarah Chen',
      specialties: ['Anxiety', 'Depression', 'CBT'],
      approach: 'Cognitive Behavioral Therapy',
      matchScore: 92,
      experience: '8 years',
      rating: 4.9,
      totalReviews: 127,
      description: 'Specializes in anxiety and depression using evidence-based CBT techniques.',
      communicationStyle: 'Direct and structured',
      culturalCompetencies: ['Asian cultures', 'LGBTQ+ affirming'],
      sessionStyle: 'Structured with homework assignments',
      personalityType: 'Analytical and supportive'
    },
    {
      id: '9492ab1a-eab2-4c5f-a8e3-40870b2ca857',
      name: 'Dr. Maya Patel',
      specialties: ['Mindfulness', 'Stress', 'Emotional Regulation'],
      approach: 'Mindfulness-Based Therapy',
      matchScore: 87,
      experience: '10 years',
      rating: 4.8,
      totalReviews: 98,
      description: 'Emphasizes present-moment awareness and mindful living practices.',
      communicationStyle: 'Gentle and reflective',
      culturalCompetencies: ['South Asian cultures', 'Spiritual/religious integration'],
      sessionStyle: 'Flexible with mindfulness practices',
      personalityType: 'Empathetic and intuitive'
    },
    {
      id: '0772c602-306b-42ad-b610-2dc15ba06714',
      name: 'Dr. Alex Rodriguez',
      specialties: ['Goal Setting', 'Personal Growth', 'Motivation'],
      approach: 'Solution-Focused Therapy',
      matchScore: 84,
      experience: '6 years',
      rating: 4.7,
      totalReviews: 76,
      description: 'Concentrates on finding solutions and building on existing strengths.',
      communicationStyle: 'Encouraging and action-oriented',
      culturalCompetencies: ['Hispanic/Latino cultures', 'Career and life transitions'],
      sessionStyle: 'Goal-focused with practical exercises',
      personalityType: 'Motivational and pragmatic'
    },
    {
      id: '2fee5506-ee6d-4504-bab7-2ba922bdc99a',
      name: 'Dr. Jordan Kim',
      specialties: ['Trauma', 'PTSD', 'Safety'],
      approach: 'Trauma-Informed Therapy',
      matchScore: 79,
      experience: '12 years',
      rating: 4.9,
      totalReviews: 156,
      description: 'Specializes in trauma-sensitive approaches with emphasis on safety and healing.',
      communicationStyle: 'Patient and validating',
      culturalCompetencies: ['Military/veteran families', 'Trauma-informed care'],
      sessionStyle: 'Safety-first with gradual exposure',
      personalityType: 'Calm and steadfast'
    },
    {
      id: '84148de7-b04d-4547-9d9b-80665efbd4af',
      name: 'Dr. Taylor Morgan',
      specialties: ['Relationships', 'Communication', 'Social Skills'],
      approach: 'Relationship Counseling',
      matchScore: 75,
      experience: '9 years',
      rating: 4.6,
      totalReviews: 89,
      description: 'Focuses on improving communication, relationships, and social connections.',
      communicationStyle: 'Interactive and collaborative',
      culturalCompetencies: ['Couples therapy', 'Social anxiety'],
      sessionStyle: 'Interactive with role-playing exercises',
      personalityType: 'Warm and interpersonally skilled'
    },
    {
      id: '79298cfb-6997-4cc6-9b21-ffaacb525c54',
      name: 'Dr. River Stone',
      specialties: ['Holistic Health', 'Life Balance', 'Wellness'],
      approach: 'Holistic Wellness',
      matchScore: 71,
      experience: '7 years',
      rating: 4.5,
      totalReviews: 67,
      description: 'Takes a whole-person approach considering mental, physical, and spiritual well-being.',
      communicationStyle: 'Holistic and integrative',
      culturalCompetencies: ['Alternative medicine', 'Spiritual practices'],
      sessionStyle: 'Flexible with mind-body techniques',
      personalityType: 'Open-minded and integrative'
    },
    // New specialized therapists
    {
      id: 'dr-luna-martinez',
      name: 'Dr. Luna Martinez',
      specialties: ['Eating Disorders', 'Body Image', 'Nutrition Psychology'],
      approach: 'Eating Disorder Recovery',
      matchScore: 89,
      experience: '7 years',
      rating: 4.8,
      totalReviews: 92,
      description: 'Specializes in eating disorder recovery with compassionate, evidence-based approaches.',
      communicationStyle: 'Gentle and understanding',
      culturalCompetencies: ['Latino cultures', 'Body positivity'],
      sessionStyle: 'Nurturing with meal planning support',
      personalityType: 'Compassionate and patient'
    },
    {
      id: 'dr-felix-chen',
      name: 'Dr. Felix Chen',
      specialties: ['OCD', 'Anxiety Disorders', 'Compulsive Behaviors'],
      approach: 'OCD-Specialized Therapy',
      matchScore: 91,
      experience: '9 years',
      rating: 4.9,
      totalReviews: 134,
      description: 'Expert in OCD treatment using ERP and specialized cognitive approaches.',
      communicationStyle: 'Methodical and reassuring',
      culturalCompetencies: ['Asian cultures', 'Perfectionism'],
      sessionStyle: 'Structured exposure therapy',
      personalityType: 'Patient and systematic'
    },
    {
      id: 'dr-river-thompson',
      name: 'Dr. River Thompson',
      specialties: ['Bipolar Disorder', 'Mood Regulation', 'Medication Management'],
      approach: 'Bipolar Disorder Management',
      matchScore: 88,
      experience: '12 years',
      rating: 4.8,
      totalReviews: 156,
      description: 'Specializes in bipolar disorder with focus on mood stabilization and life balance.',
      communicationStyle: 'Steady and supportive',
      culturalCompetencies: ['Native American cultures', 'Mood disorders'],
      sessionStyle: 'Consistent monitoring and support',
      personalityType: 'Stable and experienced'
    },
    {
      id: 'dr-nova-sleep',
      name: 'Dr. Nova Sleep',
      specialties: ['Sleep Disorders', 'Insomnia', 'Sleep Hygiene'],
      approach: 'Sleep Therapy',
      matchScore: 85,
      experience: '6 years',
      rating: 4.7,
      totalReviews: 78,
      description: 'Expert in sleep disorders with cognitive-behavioral approaches to better sleep.',
      communicationStyle: 'Calming and peaceful',
      culturalCompetencies: ['Middle Eastern cultures', 'Sleep medicine'],
      sessionStyle: 'Relaxing with sleep scheduling',
      personalityType: 'Soothing and methodical'
    },
    {
      id: 'dr-sage-williams',
      name: 'Dr. Sage Williams',
      specialties: ['Grief Counseling', 'Loss', 'Bereavement Support'],
      approach: 'Grief and Loss Therapy',
      matchScore: 86,
      experience: '11 years',
      rating: 4.9,
      totalReviews: 143,
      description: 'Compassionate grief counseling helping navigate loss and find healing.',
      communicationStyle: 'Empathetic and supportive',
      culturalCompetencies: ['African American cultures', 'Faith-based healing'],
      sessionStyle: 'Gentle processing and support',
      personalityType: 'Wise and comforting'
    },
    {
      id: 'dr-phoenix-carter',
      name: 'Dr. Phoenix Carter',
      specialties: ['Career Coaching', 'Life Transitions', 'Professional Development'],
      approach: 'Career and Life Coaching',
      matchScore: 82,
      experience: '8 years',
      rating: 4.6,
      totalReviews: 89,
      description: 'Empowers career growth and life transitions with strategic coaching approaches.',
      communicationStyle: 'Motivational and strategic',
      culturalCompetencies: ['Professional development', 'Leadership coaching'],
      sessionStyle: 'Goal-oriented with action plans',
      personalityType: 'Inspiring and strategic'
    },
    {
      id: 'dr-sky-anderson',
      name: 'Dr. Sky Anderson',
      specialties: ['Child Therapy', 'Adolescent Counseling', 'Family Systems'],
      approach: 'Child and Adolescent Therapy',
      matchScore: 87,
      experience: '6 years',
      rating: 4.8,
      totalReviews: 94,
      description: 'Specializes in child and teen therapy with family-centered approaches.',
      communicationStyle: 'Playful and age-appropriate',
      culturalCompetencies: ['Youth development', 'Family dynamics'],
      sessionStyle: 'Interactive with creative techniques',
      personalityType: 'Energetic and understanding'
    },
    {
      id: 'dr-willow-grace',
      name: 'Dr. Willow Grace',
      specialties: ['Elder Care', 'Aging', 'Memory Support'],
      approach: 'Geriatric Therapy',
      matchScore: 83,
      experience: '15 years',
      rating: 4.7,
      totalReviews: 67,
      description: 'Compassionate care for seniors focusing on aging, memory, and life transitions.',
      communicationStyle: 'Patient and respectful',
      culturalCompetencies: ['Elder care', 'Memory care'],
      sessionStyle: 'Gentle with reminiscence therapy',
      personalityType: 'Wise and patient'
    }
  ];

  // Use AI matched therapists if available, otherwise filtered or all therapists
  const getDisplayTherapists = () => {
    if (showAiMatches && aiMatchResults?.recommendations) {
      return aiMatchResults.recommendations.map((rec: any) => {
        const therapist = allTherapists.find(t => t.id === rec.therapistId);
        return therapist ? {
          ...therapist,
          aiMatchScore: rec.compatibilityScore,
          aiReasonings: rec.strengths,
          aiRecommendations: rec.reasoning,
          aiApproach: rec.recommendedApproach
        } : null;
      }).filter(Boolean);
    }
    return filteredTherapists.length > 0 ? filteredTherapists : allTherapists;
  };
  
  const therapists = getDisplayTherapists();

  const handleSelectTherapist = (therapistId: string) => {
    setSelectedTherapist(therapistId);
    const therapist = therapists.find(t => t.id === therapistId);
    setSelectedTherapistData(therapist);
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = [...allTherapists];

    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.specialties.some((s: string) => s.toLowerCase().includes(query))
      );
    }

    // Apply specialty filters
    if (filters.specialties.length > 0) {
      filtered = filtered.filter(t =>
        filters.specialties.some((s: string) => t.specialties.includes(s))
      );
    }

    // Apply approach filter
    if (filters.approach) {
      filtered = filtered.filter(t => t.approach === filters.approach);
    }

    setFilteredTherapists(filtered);
  };

  const handleClearFilters = () => {
    setFilteredTherapists([]);
  };

  const handleViewTherapist = (therapist: any) => {
    setModalTherapist({
      ...therapist,
      avatarId: getAvatarIdForTherapist(therapist.id),
      title: therapist.approach,
      specialties: therapist.specialties
    });
    setIsModalOpen(true);
  };

  const handleConfirmSelection = () => {
    if (selectedTherapist && selectedTherapistData) {
      setShowSelectionFlow(true);
    }
  };

  const handleSelectionComplete = () => {
    if (selectedTherapist) {
      onTherapistSelected(selectedTherapist);
    }
  };

  const handleBackToSelection = () => {
    setShowSelectionFlow(false);
  };

  // Run AI matching when component mounts if userAssessment is available
  useEffect(() => {
    if (userAssessment && !aiMatchResults && !isMatching) {
      handleAIMatching();
    }
  }, [userAssessment]);

  const handleAIMatching = async () => {
    if (!userAssessment) {
      console.warn('No user assessment data available for AI matching');
      return;
    }

    console.log('🤖 Starting AI therapist matching...');
    const results = await matchTherapists(userAssessment, allTherapists);
    
    if (results) {
      setAiMatchResults(results);
      setShowAiMatches(true);
      console.log('✅ AI matching completed:', results);
    }
  };

  const renderMatchFactors = (therapist: any) => {
    if (!showAiMatches || !therapist.aiReasonings) {
      return (
        <div className="space-y-1">
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Specializes in your primary concerns
          </div>
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Matches your communication preferences
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {therapist.aiReasonings?.slice(0, 3).map((reason: string, index: number) => (
          <div key={index} className="flex items-center text-xs text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            {reason}
          </div>
        ))}
        {therapist.aiMatchScore && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <span className="text-xs font-medium text-therapy-600">AI Compatibility</span>
            <span className="text-xs font-bold text-therapy-700">{therapist.aiMatchScore}%</span>
          </div>
        )}
      </div>
    );
  };

  if (showSelectionFlow && selectedTherapistData) {
    return (
      <TherapistSelectionFlow
        selectedTherapist={selectedTherapistData}
        assessmentId={assessmentId}
        onComplete={handleSelectionComplete}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              {showAiMatches ? (
                <Sparkles className="h-6 w-6 mr-2 text-therapy-500" />
              ) : (
                <User className="h-6 w-6 mr-2 text-therapy-500" />
              )}
              {showAiMatches ? 'AI-Powered Therapist Matches' : 'Find Your Perfect Therapist Match'}
            </div>
            <div className="flex space-x-2">
              {userAssessment && (
                <Button 
                  variant={showAiMatches ? "default" : "outline"}
                  onClick={() => setShowAiMatches(!showAiMatches)}
                  disabled={isMatching}
                  className={showAiMatches ? "bg-therapy-600 hover:bg-therapy-700" : ""}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isMatching ? 'Analyzing...' : (showAiMatches ? 'AI Matches' : 'Get AI Matches')}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Search className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </CardTitle>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              {showAiMatches 
                ? 'Our AI has analyzed your assessment and matched you with the most compatible therapists.' 
                : 'Based on your preferences and needs, we\'ve found these therapists that would be a great fit for you.'
              }
            </p>
            {showAiMatches && aiMatchResults?.userProfile && (
              <div className="bg-therapy-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-therapy-700 mb-1">AI Analysis Summary:</p>
                <p className="text-xs text-therapy-600">
                  Primary concerns: {aiMatchResults.userProfile.primaryConcerns?.join(', ') || 'General support'}
                  {aiMatchResults.userProfile.communicationStyle && (
                    <> • Communication style: {aiMatchResults.userProfile.communicationStyle}</>
                  )}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {showFilters && (
        <TherapistSearchFilters
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((therapist, index) => (
          <div key={therapist.id} className="relative">
            <Card className={`h-full transition-all duration-200 hover:shadow-lg ${
              selectedTherapist === therapist.id 
                ? 'ring-2 ring-therapy-500 shadow-therapy-glow' 
                : 'hover:shadow-md'
            }`}>
              <CardContent className="p-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <Professional2DAvatar
                      therapistId={therapist.id}
                      therapistName={therapist.name}
                      size="md"
                      showName={false}
                      therapeuticMode={false}
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {therapist.name}
                    </h3>
                    <p className="text-sm text-therapy-600 font-medium">
                      {therapist.approach}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{therapist.experience}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{therapist.rating}</span>
                      </div>
                    </div>
                  </div>
                  {showAiMatches && therapist.aiMatchScore && (
                    <div className="flex-shrink-0 text-center">
                      <div className="bg-therapy-100 text-therapy-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {therapist.aiMatchScore}% Match
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {therapist.description}
                </p>

                {/* Specialties */}
                <div className="mb-4">
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
                </div>

                {/* Match Factors */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Why This Matches You</p>
                  {renderMatchFactors(therapist)}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectTherapist(therapist.id)}
                  variant={selectedTherapist === therapist.id ? "default" : "outline"}
                  className={`w-full ${
                    selectedTherapist === therapist.id 
                      ? 'bg-therapy-600 hover:bg-therapy-700' 
                      : 'hover:bg-therapy-50'
                  }`}
                >
                  {selectedTherapist === therapist.id ? 'Selected' : 'Select Therapist'}
                </Button>
              </CardContent>
            </Card>

            {/* Favorite Button */}
            <div className="absolute top-4 right-4">
              <SimpleFavoriteButton 
                therapistId={therapist.id}
                therapistName={therapist.name}
                size="sm"
                variant="ghost"
              />
            </div>

            {/* AI Match Badge */}
            {showAiMatches && index < 3 && (
              <div className="absolute -top-2 -left-2">
                <div className="bg-gradient-to-r from-therapy-500 to-therapy-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                  #{index + 1} AI Pick
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <Button
          variant="outline"
          onClick={() => {
            const selected = therapists.find(t => t.id === selectedTherapist);
            if (selected) handleViewTherapist(selected);
          }}
          disabled={!selectedTherapist}
          className="mr-4"
        >
          Preview Therapist
        </Button>
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleConfirmSelection}
          disabled={!selectedTherapist}
          className="bg-therapy-600 hover:bg-therapy-700"
        >
          Continue with Selected Therapist
        </Button>
      </div>

      <SafeAvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        therapist={modalTherapist}
      />
    </div>
  );
};

export default TherapistMatcher;
