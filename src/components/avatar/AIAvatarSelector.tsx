
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Sparkles, Shield, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAvatar {
  id: string;
  name: string;
  personality: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  specialties: string[];
  moodAdaptation: {
    happy: string;
    sad: string;
    anxious: string;
    calm: string;
  };
}

const avatars: AIAvatar[] = [
  {
    id: 'compassionate-companion',
    name: 'Compassionate Companion',
    personality: 'Warm, empathetic, and nurturing',
    description: 'A gentle AI that provides emotional support with warmth and understanding.',
    icon: <Heart className="w-8 h-8" />,
    color: 'from-pink-500 to-rose-500',
    specialties: ['Emotional Support', 'Active Listening', 'Comfort'],
    moodAdaptation: {
      happy: 'Celebrates your joy with enthusiasm and encouragement',
      sad: 'Offers gentle comfort and validates your feelings',
      anxious: 'Provides calming reassurance and grounding techniques',
      calm: 'Maintains peaceful presence and thoughtful conversation'
    }
  },
  {
    id: 'mindful-mentor',
    name: 'Mindful Mentor',
    personality: 'Wise, balanced, and insightful',
    description: 'A thoughtful AI that guides you through mindfulness and self-discovery.',
    icon: <Brain className="w-8 h-8" />,
    color: 'from-purple-500 to-indigo-500',
    specialties: ['Mindfulness', 'CBT Techniques', 'Self-Reflection'],
    moodAdaptation: {
      happy: 'Helps you reflect on positive experiences mindfully',
      sad: 'Guides through emotional processing with gentle wisdom',
      anxious: 'Teaches breathing exercises and mindfulness practices',
      calm: 'Explores deeper insights and personal growth'
    }
  },
  {
    id: 'energetic-encourager',
    name: 'Energetic Encourager',
    personality: 'Upbeat, motivating, and optimistic',
    description: 'An inspiring AI that motivates you to reach your goals and overcome challenges.',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-orange-500 to-yellow-500',
    specialties: ['Motivation', 'Goal Setting', 'Positive Psychology'],
    moodAdaptation: {
      happy: 'Amplifies your energy and celebrates achievements',
      sad: 'Gently lifts your spirits with hope and encouragement',
      anxious: 'Redirects focus to strengths and coping strategies',
      calm: 'Channels peace into productive goal-setting'
    }
  },
  {
    id: 'protective-guardian',
    name: 'Protective Guardian',
    personality: 'Strong, reliable, and reassuring',
    description: 'A steadfast AI that helps you feel safe and builds your inner strength.',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    specialties: ['Trauma Support', 'Safety Planning', 'Boundary Setting'],
    moodAdaptation: {
      happy: 'Reinforces your strength and celebrates resilience',
      sad: 'Provides protective comfort and emotional safety',
      anxious: 'Creates sense of security and control',
      calm: 'Builds on inner strength and confidence'
    }
  }
];

const AIAvatarSelector = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
  };

  const handleSaveSelection = () => {
    if (!selectedAvatar) {
      toast({
        title: "No Avatar Selected",
        description: "Please select an AI avatar to continue.",
        variant: "destructive"
      });
      return;
    }

    // Here we would save the selection to the database
    // For now, we'll just show a success message
    toast({
      title: "Avatar Selected!",
      description: `You've chosen ${avatars.find(a => a.id === selectedAvatar)?.name} as your AI companion.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {avatars.map((avatar) => (
          <Card 
            key={avatar.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedAvatar === avatar.id 
                ? 'ring-2 ring-therapy-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleAvatarSelect(avatar.id)}
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${avatar.color} text-white`}>
                  {avatar.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{avatar.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {avatar.personality}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{avatar.description}</p>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {avatar.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Mood Adaptation:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600">{avatar.moodAdaptation.happy}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">{avatar.moodAdaptation.calm}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSaveSelection}
          className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white px-8 py-2"
          disabled={!selectedAvatar}
        >
          Select This AI Companion
        </Button>
      </div>
    </div>
  );
};

export default AIAvatarSelector;
