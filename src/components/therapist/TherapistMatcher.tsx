
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, User, Heart, Brain } from 'lucide-react';
import Enhanced3DAvatar from '@/components/avatar/Enhanced3DAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';

interface TherapistMatcherProps {
  onTherapistSelected: (therapistId: string) => void;
  onClose: () => void;
}

const TherapistMatcher = ({ onTherapistSelected, onClose }: TherapistMatcherProps) => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);

  // Mock therapist data with realistic compatibility scores
  const therapists = [
    {
      id: 'ed979f27-2491-43f1-a779-5095febb68b2',
      name: 'Dr. Sarah Chen',
      specialties: ['Anxiety', 'Depression', 'CBT'],
      approach: 'Cognitive Behavioral Therapy',
      matchScore: 92,
      experience: '8 years',
      rating: 4.9,
      description: 'Specializes in anxiety and depression using evidence-based CBT techniques.'
    },
    {
      id: '9492ab1a-eab2-4c5f-a8e3-40870b2ca857',
      name: 'Dr. Maya Patel',
      specialties: ['Mindfulness', 'Stress', 'Emotional Regulation'],
      approach: 'Mindfulness-Based Therapy',
      matchScore: 87,
      experience: '10 years',
      rating: 4.8,
      description: 'Emphasizes present-moment awareness and mindful living practices.'
    },
    {
      id: '0772c602-306b-42ad-b610-2dc15ba06714',
      name: 'Dr. Alex Rodriguez',
      specialties: ['Goal Setting', 'Personal Growth', 'Motivation'],
      approach: 'Solution-Focused Therapy',
      matchScore: 84,
      experience: '6 years',
      rating: 4.7,
      description: 'Concentrates on finding solutions and building on existing strengths.'
    },
    {
      id: '2fee5506-ee6d-4504-bab7-2ba922bdc99a',
      name: 'Dr. Jordan Kim',
      specialties: ['Trauma', 'PTSD', 'Safety'],
      approach: 'Trauma-Informed Therapy',
      matchScore: 79,
      experience: '12 years',
      rating: 4.9,
      description: 'Specializes in trauma-sensitive approaches with emphasis on safety and healing.'
    },
    {
      id: '84148de7-b04d-4547-9d9b-80665efbd4af',
      name: 'Dr. Taylor Morgan',
      specialties: ['Relationships', 'Communication', 'Social Skills'],
      approach: 'Relationship Counseling',
      matchScore: 75,
      experience: '9 years',
      rating: 4.6,
      description: 'Focuses on improving communication, relationships, and social connections.'
    },
    {
      id: '79298cfb-6997-4cc6-9b21-ffaacb525c54',
      name: 'Dr. River Stone',
      specialties: ['Holistic Health', 'Life Balance', 'Wellness'],
      approach: 'Holistic Wellness',
      matchScore: 71,
      experience: '7 years',
      rating: 4.5,
      description: 'Takes a whole-person approach considering mental, physical, and spiritual well-being.'
    }
  ];

  const handleSelectTherapist = (therapistId: string) => {
    setSelectedTherapist(therapistId);
  };

  const handleConfirmSelection = () => {
    if (selectedTherapist) {
      onTherapistSelected(selectedTherapist);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-6 w-6 mr-2 text-therapy-500" />
            Find Your Perfect Therapist Match
          </CardTitle>
          <p className="text-muted-foreground">
            Based on your preferences and needs, we've found these therapists that would be a great fit for you.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <Card 
            key={therapist.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTherapist === therapist.id 
                ? 'ring-2 ring-therapy-500 shadow-lg' 
                : 'hover:ring-1 hover:ring-therapy-200'
            }`}
            onClick={() => handleSelectTherapist(therapist.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {/* 3D Avatar Preview */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-therapy-50 to-calm-50">
                    <Suspense fallback={<Skeleton className="w-full h-full" />}>
                     <Enhanced3DAvatar
                        therapistId={getAvatarIdForTherapist(therapist.id)}
                        therapistName={therapist.name}
                        emotion="neutral"
                        showControls={false}
                      />
                    </Suspense>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{therapist.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{therapist.approach}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
                  {therapist.matchScore}% match
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{therapist.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {therapist.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Brain className="h-4 w-4 text-therapy-500" />
                  <span>{therapist.experience}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{therapist.rating}</span>
                </div>
              </div>

              {selectedTherapist === therapist.id && (
                <div className="flex items-center space-x-2 text-therapy-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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
    </div>
  );
};

export default TherapistMatcher;
