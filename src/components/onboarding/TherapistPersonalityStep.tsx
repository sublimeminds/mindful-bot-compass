
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Lightbulb, Target, Users, Compass } from "lucide-react";

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  icon: React.ComponentType<any>;
  specialties: string[];
  color: string;
}

const therapistPersonalities: TherapistPersonality[] = [
  {
    id: 'cbt-specialist',
    name: 'Dr. Sarah Chen',
    title: 'CBT Specialist',
    description: 'Focuses on identifying and changing negative thought patterns through evidence-based cognitive behavioral therapy techniques.',
    approach: 'Structured, goal-oriented, practical problem-solving',
    icon: Brain,
    specialties: ['Anxiety', 'Depression', 'Thought Patterns', 'Behavioral Change'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'mindfulness-coach',
    name: 'Dr. Maya Patel',
    title: 'Mindfulness Coach',
    description: 'Emphasizes present-moment awareness, meditation, and mindful living practices for emotional regulation.',
    approach: 'Gentle, reflective, mindfulness-based',
    icon: Heart,
    specialties: ['Stress', 'Mindfulness', 'Emotional Regulation', 'Self-Compassion'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'solution-focused',
    name: 'Dr. Alex Rodriguez',
    title: 'Solution-Focused Therapist',
    description: 'Concentrates on finding solutions and building on existing strengths rather than dwelling on problems.',
    approach: 'Optimistic, strength-based, future-focused',
    icon: Lightbulb,
    specialties: ['Goal Setting', 'Personal Growth', 'Motivation', 'Life Transitions'],
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'trauma-informed',
    name: 'Dr. Jordan Kim',
    title: 'Trauma-Informed Therapist',
    description: 'Specializes in trauma-sensitive approaches with emphasis on safety, trust, and healing.',
    approach: 'Compassionate, patient, trauma-sensitive',
    icon: Target,
    specialties: ['Trauma Recovery', 'PTSD', 'Safety', 'Healing'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'relationship-counselor',
    name: 'Dr. Taylor Morgan',
    title: 'Relationship Counselor',
    description: 'Focuses on improving communication, relationships, and social connections.',
    approach: 'Empathetic, communication-focused, interpersonal',
    icon: Users,
    specialties: ['Relationships', 'Communication', 'Social Skills', 'Conflict Resolution'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'holistic-wellness',
    name: 'Dr. River Stone',
    title: 'Holistic Wellness Guide',
    description: 'Takes a whole-person approach considering mental, physical, and spiritual well-being.',
    approach: 'Integrative, holistic, wellness-focused',
    icon: Compass,
    specialties: ['Holistic Health', 'Life Balance', 'Wellness', 'Self-Discovery'],
    color: 'from-teal-500 to-cyan-500'
  }
];

interface TherapistPersonalityStepProps {
  selectedPersonality: string | null;
  onPersonalitySelect: (personalityId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const TherapistPersonalityStep = ({ 
  selectedPersonality, 
  onPersonalitySelect, 
  onNext, 
  onBack 
}: TherapistPersonalityStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your AI Therapist</h2>
        <p className="text-muted-foreground">
          Select the therapeutic approach and personality that resonates most with you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {therapistPersonalities.map((personality) => {
          const IconComponent = personality.icon;
          const isSelected = selectedPersonality === personality.id;
          
          return (
            <Card 
              key={personality.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-therapy-500 bg-therapy-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onPersonalitySelect(personality.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${personality.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{personality.name}</CardTitle>
                    <p className="text-sm text-therapy-600 font-medium">
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
                  {personality.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedPersonality}
          className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export { therapistPersonalities };
export default TherapistPersonalityStep;
