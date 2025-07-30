import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Brain, Lightbulb, Target, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  color: string;
  icon: React.ComponentType<any>;
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
  }
];

const TherapistTeamCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % therapistPersonalities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTherapist = () => {
    setCurrentIndex((prev) => (prev + 1) % therapistPersonalities.length);
    setIsAutoPlaying(false);
  };

  const prevTherapist = () => {
    setCurrentIndex((prev) => (prev - 1 + therapistPersonalities.length) % therapistPersonalities.length);
    setIsAutoPlaying(false);
  };

  const goToTherapist = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTherapist = therapistPersonalities[currentIndex];
  const avatarId = getAvatarIdForTherapist(currentTherapist.id);

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Meet Your AI Therapy Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Professional AI Therapists
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each AI therapist has a unique personality, specialization, and therapeutic approach tailored to different needs and preferences.
          </p>
        </div>

        {/* Main Carousel Card */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card to-muted/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Avatar Section */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className={`absolute inset-0 bg-gradient-to-r ${currentTherapist.color} rounded-full blur-xl opacity-30 scale-110`} />
                    <div className="relative w-48 h-48 mx-auto">
                      <Professional2DAvatar
                        therapistId={avatarId}
                        therapistName={currentTherapist.name}
                        size="xl"
                        emotion="encouraging"
                        className="w-full h-full"
                        showName={false}
                      />
                    </div>
                  </div>
                  
                  {/* Rating & Status */}
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">4.9</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Online Now
                    </Badge>
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{currentTherapist.name}</h3>
                    <p className="text-lg font-medium text-primary mb-3">{currentTherapist.title}</p>
                    <p className="text-muted-foreground leading-relaxed">{currentTherapist.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <currentTherapist.icon className="h-4 w-4 text-primary" />
                      Therapeutic Approach
                    </h4>
                    <p className="text-muted-foreground italic">{currentTherapist.approach}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentTherapist.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/5">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-6" size="lg">
                    Start Session with {currentTherapist.name.split(' ')[1]}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background border border-primary/20 hover:bg-primary hover:text-primary-foreground shadow-lg"
            onClick={prevTherapist}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background border border-primary/20 hover:bg-primary hover:text-primary-foreground shadow-lg"
            onClick={nextTherapist}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {therapistPersonalities.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => goToTherapist(index)}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">14+</div>
            <div className="text-sm text-muted-foreground">AI Therapists</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">Availability</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Specializations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">4.9★</div>
            <div className="text-sm text-muted-foreground">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapistTeamCarousel;