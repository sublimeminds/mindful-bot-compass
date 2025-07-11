
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, User, Heart, Brain } from 'lucide-react';
import SafeTherapistAvatarCard from '@/components/avatar/SafeTherapistAvatarCard';
import SafeAvatarModal from '@/components/avatar/SafeAvatarModal';
import SimpleFavoriteButton from '@/components/therapist/SimpleFavoriteButton';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';

interface TherapistMatcherProps {
  onTherapistSelected: (therapistId: string) => void;
  onClose: () => void;
  assessmentMatches?: any[];
}

const TherapistMatcher = ({ onTherapistSelected, onClose, assessmentMatches }: TherapistMatcherProps) => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [modalTherapist, setModalTherapist] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <div key={therapist.id} className="relative">
              <SafeTherapistAvatarCard
                therapist={{
                  id: therapist.id,
                  name: therapist.name,
                  title: therapist.approach,
                  description: therapist.description,
                  approach: therapist.approach,
                  specialties: therapist.specialties,
                  communicationStyle: `${therapist.experience} • ${therapist.rating}⭐`,
                  icon: '🧠',
                  colorScheme: 'from-therapy-500 to-calm-500'
                }}
                isSelected={selectedTherapist === therapist.id}
                showMiniAvatar={true}
                onSelect={() => handleSelectTherapist(therapist.id)}
              />
              <div className="absolute top-4 right-4">
                <SimpleFavoriteButton 
                  therapistId={therapist.id}
                  therapistName={therapist.name}
                  size="sm"
                  variant="ghost"
                />
              </div>
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
