import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, Pause, RotateCcw, Sparkles, Timer, Wind } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSafeSEO } from '@/hooks/useSafeSEO';

interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  inhale: number;
  hold: number;
  exhale: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'A powerful technique for relaxation and sleep',
    duration: 240,
    inhale: 4,
    hold: 7,
    exhale: 8,
    difficulty: 'beginner',
    benefits: ['Reduces anxiety', 'Improves sleep', 'Calms mind']
  },
  {
    id: '2',
    title: 'Box Breathing',
    description: 'Equal-count breathing for focus and calm',
    duration: 300,
    inhale: 4,
    hold: 4,
    exhale: 4,
    difficulty: 'beginner',
    benefits: ['Improves focus', 'Reduces stress', 'Enhances performance']
  },
  {
    id: '3',
    title: 'Triangle Breathing',
    description: 'Three-part breathing without retention',
    duration: 180,
    inhale: 4,
    hold: 0,
    exhale: 4,
    difficulty: 'beginner',
    benefits: ['Gentle relaxation', 'Good for beginners', 'Reduces tension']
  },
  {
    id: '4',
    title: 'Extended Exhale',
    description: 'Longer exhale for deep relaxation',
    duration: 360,
    inhale: 4,
    hold: 2,
    exhale: 8,
    difficulty: 'intermediate',
    benefits: ['Deep relaxation', 'Activates parasympathetic system', 'Calms emotions']
  },
  {
    id: '5',
    title: 'Power Breathing',
    description: 'Energizing breath for focus and clarity',
    duration: 240,
    inhale: 6,
    hold: 2,
    exhale: 6,
    difficulty: 'intermediate',
    benefits: ['Increases energy', 'Improves focus', 'Enhances alertness']
  },
  {
    id: '6',
    title: 'Advanced Pranayama',
    description: 'Complex breathing pattern for experienced practitioners',
    duration: 480,
    inhale: 6,
    hold: 12,
    exhale: 6,
    difficulty: 'advanced',
    benefits: ['Deep meditation', 'Spiritual growth', 'Advanced relaxation']
  }
];

const BreathingExercisesPage = () => {
  const { user } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);

  useSafeSEO({
    title: 'Breathing Exercises - Guided Breathing Techniques | TherapySync',
    description: 'Practice guided breathing exercises including 4-7-8 breathing, box breathing, and more. Reduce stress and anxiety with proven breathing techniques.',
    keywords: 'breathing exercises, meditation, stress relief, anxiety reduction, pranayama, mindfulness'
  });

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setTotalTimeLeft(exercise.duration);
    setCurrentPhase('inhale');
    setPhaseTimeLeft(exercise.inhale);
    setIsActive(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPhaseInstruction = () => {
    if (!selectedExercise) return '';
    
    switch (currentPhase) {
      case 'inhale': return `Breathe in slowly for ${selectedExercise.inhale} seconds`;
      case 'hold': return selectedExercise.hold > 0 ? `Hold your breath for ${selectedExercise.hold} seconds` : 'Continue breathing';
      case 'exhale': return `Exhale slowly for ${selectedExercise.exhale} seconds`;
      default: return '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Breathing Exercises
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Practice guided breathing techniques to reduce stress, improve focus, and enhance your overall well-being.
            </p>
          </div>

          {!selectedExercise ? (
            /* Exercise Selection */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BREATHING_EXERCISES.map((exercise) => (
                <Card key={exercise.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Wind className="h-5 w-5 text-therapy-600" />
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{exercise.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{Math.floor(exercise.duration / 60)}m</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{exercise.inhale}-{exercise.hold}-{exercise.exhale}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {exercise.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-therapy-500 rounded-full" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => startExercise(exercise)}
                      className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Active Exercise */
            <div className="max-w-2xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Wind className="h-6 w-6 text-therapy-600" />
                    <span>{selectedExercise.title}</span>
                  </CardTitle>
                  <CardDescription>{selectedExercise.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  {/* Timer Display */}
                  <div className="space-y-4">
                    <div className="text-5xl font-mono font-bold text-therapy-600">
                      {formatTime(totalTimeLeft)}
                    </div>
                    
                    {/* Phase Indicator */}
                    <div className="space-y-2">
                      <div className="text-2xl font-medium text-gray-900 capitalize">
                        {currentPhase === 'hold' && selectedExercise.hold === 0 ? 'Continue' : currentPhase}
                      </div>
                      <div className="text-lg text-gray-600">
                        {getPhaseInstruction()}
                      </div>
                      <div className="text-3xl font-bold text-therapy-500">
                        {phaseTimeLeft}
                      </div>
                    </div>
                  </div>

                  {/* Breathing Circle */}
                  <div className="flex justify-center">
                    <div className={`w-32 h-32 rounded-full border-4 transition-all duration-1000 ${
                      currentPhase === 'inhale' 
                        ? 'border-blue-400 scale-110 shadow-lg shadow-blue-200' 
                        : currentPhase === 'hold'
                        ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-200'
                        : 'border-green-400 scale-90 shadow-lg shadow-green-200'
                    }`}>
                      <div className={`w-full h-full rounded-full transition-all duration-1000 ${
                        currentPhase === 'inhale' 
                          ? 'bg-blue-100' 
                          : currentPhase === 'hold'
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                      }`} />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsActive(!isActive)}
                    >
                      {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedExercise(null);
                        setIsActive(false);
                        setCurrentPhase('inhale');
                        setPhaseTimeLeft(0);
                        setTotalTimeLeft(0);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Choose Different Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingExercisesPage;