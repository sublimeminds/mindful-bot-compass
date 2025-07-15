
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Lightbulb, Target, Users, Compass, Sparkles, Info } from "lucide-react";
import GradientButton from '@/components/ui/GradientButton';
import { useTranslation } from 'react-i18next';

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  icon: React.ComponentType<any>;
  specialties: string[];
  color: string;
  matchingGoals: string[];
  matchingPreferences: string[];
}

const therapistPersonalities: TherapistPersonality[] = [
  {
    id: 'cbt-specialist',
    name: 'Dr. Sarah Chen',
    title: 'CBT Specialist',
    description: 'Focuses on identifying and changing negative thought patterns through evidence-based techniques.',
    approach: 'Structured, goal-oriented, practical problem-solving',
    icon: Brain,
    specialties: ['Anxiety', 'Depression', 'Thought Patterns'],
    color: 'from-blue-500 to-blue-600',
    matchingGoals: ['reduce anxiety', 'manage depression', 'build confidence'],
    matchingPreferences: ['cognitive behavioral therapy (cbt)']
  },
  {
    id: 'mindfulness-coach',
    name: 'Dr. Maya Patel',
    title: 'Mindfulness Coach',
    description: 'Emphasizes present-moment awareness and mindful living practices for emotional regulation.',
    approach: 'Gentle, reflective, mindfulness-based',
    icon: Heart,
    specialties: ['Stress', 'Mindfulness', 'Emotional Regulation'],
    color: 'from-green-500 to-green-600',
    matchingGoals: ['manage stress', 'improve sleep', 'manage anger'],
    matchingPreferences: ['mindfulness & meditation']
  },
  {
    id: 'solution-focused',
    name: 'Dr. Alex Rodriguez',
    title: 'Solution-Focused Therapist',
    description: 'Concentrates on finding solutions and building on existing strengths.',
    approach: 'Optimistic, strength-based, future-focused',
    icon: Lightbulb,
    specialties: ['Goal Setting', 'Personal Growth', 'Motivation'],
    color: 'from-yellow-500 to-orange-500',
    matchingGoals: ['find life purpose', 'build confidence', 'develop coping skills'],
    matchingPreferences: ['solution-focused therapy', 'positive psychology']
  },
  {
    id: 'trauma-informed',
    name: 'Dr. Jordan Kim',
    title: 'Trauma-Informed Therapist',
    description: 'Specializes in trauma-sensitive approaches with emphasis on safety and healing.',
    approach: 'Compassionate, patient, trauma-sensitive',
    icon: Target,
    specialties: ['Trauma Recovery', 'PTSD', 'Safety'],
    color: 'from-purple-500 to-purple-600',
    matchingGoals: ['work through trauma', 'set boundaries'],
    matchingPreferences: ['trauma-informed care']
  },
  {
    id: 'relationship-counselor',
    name: 'Dr. Taylor Morgan',
    title: 'Relationship Counselor',
    description: 'Focuses on improving communication, relationships, and social connections.',
    approach: 'Empathetic, communication-focused, interpersonal',
    icon: Users,
    specialties: ['Relationships', 'Communication', 'Social Skills'],
    color: 'from-pink-500 to-rose-500',
    matchingGoals: ['improve relationships', 'improve communication'],
    matchingPreferences: ['talk therapy']
  },
  {
    id: 'holistic-wellness',
    name: 'Dr. River Stone',
    title: 'Holistic Wellness Guide',
    description: 'Takes a whole-person approach considering mental, physical, and spiritual well-being.',
    approach: 'Integrative, holistic, wellness-focused',
    icon: Compass,
    specialties: ['Holistic Health', 'Life Balance', 'Wellness'],
    color: 'from-teal-500 to-cyan-500',
    matchingGoals: ['find life purpose', 'improve sleep'],
    matchingPreferences: ['positive psychology', 'mindfulness & meditation']
  }
];

interface TherapistPersonalityStepProps {
  selectedPersonality: string | null;
  selectedGoals: string[];
  selectedPreferences: string[];
  onPersonalitySelect: (personalityId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const TherapistPersonalityStep = ({ 
  selectedPersonality, 
  selectedGoals,
  selectedPreferences,
  onPersonalitySelect, 
  onNext, 
  onBack 
}: TherapistPersonalityStepProps) => {
  const { t } = useTranslation();
  const getMatchScore = (therapist: TherapistPersonality) => {
    let score = 0;
    
    // Goal matching with specialty alignment
    const goalMatches = selectedGoals.filter(goal => 
      therapist.specialties.some(specialty => 
        specialty.toLowerCase().includes(goal.toLowerCase()) ||
        goal.toLowerCase().includes(specialty.toLowerCase())
      )
    ).length;
    
    // Approach preference matching
    const approachMatches = selectedPreferences.filter(pref => {
      const prefLower = pref.toLowerCase();
      const approachLower = therapist.approach.toLowerCase();
      return approachLower.includes(prefLower) || prefLower.includes(approachLower);
    }).length;
    
    // Personality compatibility (simulate based on therapist specialties)
    const personalityScore = Math.min(3, therapist.specialties.length);
    
    return goalMatches * 2 + approachMatches * 2 + personalityScore;
  };

  const sortedTherapists = [...therapistPersonalities].sort((a, b) => getMatchScore(b) - getMatchScore(a));
  const bestMatch = sortedTherapists[0];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t('onboarding.completion.choosingTherapist')}</h2>
        <p className="text-muted-foreground">
          Based on your assessment, here are therapists matched to your specific needs and preferences.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Flexible choice:</p>
            <p>You can easily switch to any therapist anytime in your profile settings. Each has a unique approach to help you.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedTherapists.map((personality, index) => {
          const IconComponent = personality.icon;
          const isSelected = selectedPersonality === personality.id;
          const matchScore = getMatchScore(personality);
          const isBestMatch = personality.id === bestMatch.id && matchScore > 0;
          
          return (
            <Card 
              key={personality.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg relative ${
                isSelected 
                  ? 'ring-2 ring-harmony-500 bg-harmony-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onPersonalitySelect(personality.id)}
            >
              {isBestMatch && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-harmony-500 to-flow-500 text-white px-3 py-1 flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Best Match</span>
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${personality.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{personality.name}</CardTitle>
                    <p className="text-sm text-harmony-600 font-medium">
                      {personality.title}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {personality.description}
                </p>
                
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    Approach: {personality.approach}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {personality.specialties.map((specialty, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {matchScore > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-harmony-600 font-medium">
                      ✨ Matches {matchScore} of your preferences
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
          💡 Don't worry - you can easily change your therapist anytime in settings
        </p>
      </div>

      {!selectedPersonality && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Please select a therapist to continue with your personalized therapy plan
          </p>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <GradientButton variant="outline" onClick={onBack}>
          {t('common.back')}
        </GradientButton>
        <GradientButton 
          onClick={onNext}
          disabled={!selectedPersonality}
          className={!selectedPersonality ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Continue with {selectedPersonality ? sortedTherapists.find(t => t.id === selectedPersonality)?.name : 'Selected Therapist'}
        </GradientButton>
      </div>
    </div>
  );
};

export { therapistPersonalities };
export default TherapistPersonalityStep;
