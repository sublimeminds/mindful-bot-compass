
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, Heart, Brain } from 'lucide-react';

interface TherapistMatcherProps {
  onTherapistSelected: (therapistId: string) => void;
  onClose: () => void;
}

const TherapistMatcher = ({ onTherapistSelected, onClose }: TherapistMatcherProps) => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);

  // Mock therapist data
  const therapists = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      specialties: ['Anxiety', 'Depression', 'CBT'],
      approach: 'Cognitive Behavioral Therapy',
      matchScore: 95,
      experience: '8 years',
      rating: 4.9,
      description: 'Specializes in anxiety and depression using evidence-based CBT techniques.'
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      specialties: ['Trauma', 'PTSD', 'EMDR'],
      approach: 'EMDR Therapy',
      matchScore: 88,
      experience: '12 years',
      rating: 4.8,
      description: 'Expert in trauma-informed care and EMDR therapy for PTSD treatment.'
    },
    {
      id: '3',
      name: 'Dr. Emily Johnson',
      specialties: ['Mindfulness', 'Stress', 'DBT'],
      approach: 'Dialectical Behavior Therapy',
      matchScore: 82,
      experience: '6 years',
      rating: 4.7,
      description: 'Focuses on mindfulness-based approaches and emotional regulation skills.'
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
                <div>
                  <CardTitle className="text-lg">{therapist.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{therapist.approach}</p>
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
