
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Lightbulb, Target, Users, Compass, Sparkles, Info } from "lucide-react";

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
  const getMatchScore = (therapist: TherapistPersonality) => {
    let score = 0;
    const goalMatches = therapist.matchingGoals.filter(goal => 
      selectedGoals.some(selected => selected.toLowerCase().includes(goal))
    ).length;
    const prefMatches = therapist.matchingPreferences.filter(pref => 
      selectedPreferences.some(selected => selected.toLowerCase().includes(pref))
    ).length;
    return goalMatches + prefMatches;
  };

  const sortedTherapists = [...therapistPersonalities].sort((a, b) => getMatchScore(b) - getMatchScore(a));
  const bestMatch = sortedTherapists[0];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your AI Therapist</h2>
        <p className="text-muted-foreground">
          We've matched therapists based on your goals and preferences
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
        <Button variant="outline" size="sm" className="text-xs">
          💡 Don't worry - you can easily change your therapist anytime in settings
        </Button>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedPersonality}
          className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
        >
          Continue with {selectedPersonality ? sortedTherapists.find(t => t.id === selectedPersonality)?.name : 'Therapist'}
        </Button>
      </div>
    </div>
  );
};

export { therapistPersonalities };
export default TherapistPersonalityStep;
