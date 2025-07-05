import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Heart, 
  Brain, 
  Star, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communication_style: string;
  experience_level: string;
  color_scheme: string;
  icon: string;
  effectiveness_areas: any;
  personality_traits: any;
}

interface CompatibilityScore {
  therapist_id: string;
  score: number;
  matching_factors: string[];
}

const TherapistSelection = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [therapists, setTherapists] = useState<TherapistPersonality[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [compatibilityScores, setCompatibilityScores] = useState<CompatibilityScore[]>([]);
  const [currentTherapist, setCurrentTherapist] = useState<TherapistPersonality | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      loadTherapistData();
    }
  }, [user, loading, navigate]);

  const loadTherapistData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load available therapists
      const { data: therapistData, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      
      if (therapistData) {
        setTherapists(therapistData);
        calculateCompatibilityScores(therapistData);
      }

      // Check if user already has a therapist assigned
      const { data: currentRelationship } = await supabase
        .from('therapeutic_relationship')
        .select(`
          therapist_id,
          therapist_personalities (*)
        `)
        .eq('user_id', user.id)
        .single();

      if (currentRelationship?.therapist_personalities) {
        setCurrentTherapist(currentRelationship.therapist_personalities);
        setSelectedTherapist(currentRelationship.therapist_id);
      }

    } catch (error) {
      console.error('Error loading therapist data:', error);
      toast({
        title: "Error Loading Therapists",
        description: "Failed to load therapist information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompatibilityScores = async (therapistList: TherapistPersonality[]) => {
    if (!user) return;

    try {
      // Get user's AI analysis and cultural profile for matching
      const { data: aiAnalysis } = await supabase
        .from('ai_therapy_analysis')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: culturalProfile } = await supabase
        .from('user_cultural_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false);

      // Calculate compatibility scores based on user data
      const scores = therapistList.map(therapist => {
        let score = 60; // Base score
        const matchingFactors: string[] = [];

        // Match based on specialties and user goals
        if (goals && goals.length > 0) {
          const userGoalCategories = goals.map(g => g.category).filter(Boolean);
          const specialtyMatch = therapist.specialties.some(specialty => 
            userGoalCategories.some(category => 
              specialty.toLowerCase().includes(category.toLowerCase()) ||
              category.toLowerCase().includes(specialty.toLowerCase())
            )
          );
          
          if (specialtyMatch) {
            score += 20;
            matchingFactors.push('Specialty alignment with your goals');
          }
        }

        // Match communication style with cultural preferences
        if (culturalProfile?.communication_style === therapist.communication_style) {
          score += 15;
          matchingFactors.push('Communication style match');
        }

        // Match therapy approach preferences
        if (culturalProfile?.therapy_approach_preferences?.includes(therapist.approach)) {
          score += 10;
          matchingFactors.push('Preferred therapy approach');
        }

        // Match based on AI analysis recommendations
        if (aiAnalysis?.treatment_recommendations?.recommended_approaches?.includes(therapist.approach)) {
          score += 15;
          matchingFactors.push('AI-recommended approach');
        }

        // Experience level matching
        if (aiAnalysis?.computed_risk_level === 'high' && therapist.experience_level === 'expert') {
          score += 10;
          matchingFactors.push('Experience level for your needs');
        }

        return {
          therapist_id: therapist.id,
          score: Math.min(score, 95), // Cap at 95%
          matching_factors: matchingFactors
        };
      });

      // Sort by score
      scores.sort((a, b) => b.score - a.score);
      setCompatibilityScores(scores);

      // Auto-select the highest scoring therapist if none selected
      if (!selectedTherapist && scores.length > 0) {
        setSelectedTherapist(scores[0].therapist_id);
      }

    } catch (error) {
      console.error('Error calculating compatibility:', error);
    }
  };

  const saveTherapistSelection = async () => {
    if (!user || !selectedTherapist) return;

    setIsSaving(true);
    try {
      const selectedTherapistData = therapists.find(t => t.id === selectedTherapist);
      
      // Save or update therapeutic relationship
      const { error: relationshipError } = await supabase
        .from('therapeutic_relationship')
        .upsert({
          user_id: user.id,
          therapist_id: selectedTherapist,
          trust_level: 0.7, // Starting trust level
          rapport_score: 0.6, // Starting rapport
          communication_preferences: {
            preferred_style: selectedTherapistData?.communication_style,
            session_frequency: 'weekly'
          },
          last_interaction: new Date().toISOString()
        });

      if (relationshipError) throw relationshipError;

      // Update compatibility score
      const compatibilityScore = compatibilityScores.find(c => c.therapist_id === selectedTherapist);
      if (compatibilityScore) {
        const { error: compatibilityError } = await supabase
          .from('therapist_compatibility')
          .upsert({
            user_id: user.id,
            therapist_id: selectedTherapist,
            compatibility_score: compatibilityScore.score / 100,
            effectiveness_metrics: {
              matching_factors: compatibilityScore.matching_factors,
              initial_score: compatibilityScore.score
            },
            last_interaction: new Date().toISOString()
          });

        if (compatibilityError) throw compatibilityError;
      }

      toast({
        title: "Therapist Selected!",
        description: `Dr. ${selectedTherapistData?.name} is now your assigned therapist.`,
      });

      // Navigate to therapy plan or dashboard
      navigate('/therapy-plan');

    } catch (error) {
      console.error('Error saving therapist selection:', error);
      toast({
        title: "Error Saving Selection",
        description: "Failed to save your therapist selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCompatibilityScore = (therapistId: string) => {
    return compatibilityScores.find(c => c.therapist_id === therapistId)?.score || 60;
  };

  const getMatchingFactors = (therapistId: string) => {
    return compatibilityScores.find(c => c.therapist_id === therapistId)?.matching_factors || [];
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-therapy-600" />
            Choose Your Therapist
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your assessment and goals, we've matched you with the most compatible therapists. 
            {currentTherapist ? ' You can change your therapist anytime if your needs evolve.' : ''}
          </p>
        </div>

        {currentTherapist && (
          <Card className="border-therapy-200 bg-therapy-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-therapy-700">
                <CheckCircle className="h-5 w-5" />
                Current Therapist
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-therapy-100 flex items-center justify-center">
                <User className="h-8 w-8 text-therapy-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">Dr. {currentTherapist.name}</p>
                <p className="text-gray-600">{currentTherapist.description}</p>
                <Badge variant="secondary" className="mt-1">{currentTherapist.approach}</Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/therapy-plan')}
              >
                View Therapy Plan
              </Button>
            </CardContent>
          </Card>
        )}

        <RadioGroup value={selectedTherapist} onValueChange={setSelectedTherapist}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {therapists.map((therapist) => {
              const compatibilityScore = getCompatibilityScore(therapist.id);
              const matchingFactors = getMatchingFactors(therapist.id);
              
              return (
                <div key={therapist.id} className="relative">
                  <Label htmlFor={therapist.id} className="cursor-pointer">
                    <Card className={`transition-all duration-200 hover:shadow-lg ${
                      selectedTherapist === therapist.id 
                        ? 'ring-2 ring-therapy-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${therapist.color_scheme} flex items-center justify-center text-white font-bold`}>
                              {therapist.icon === 'Brain' ? <Brain className="h-6 w-6" /> : 
                               therapist.icon === 'Heart' ? <Heart className="h-6 w-6" /> : 
                               <User className="h-6 w-6" />}
                            </div>
                            <div>
                              <CardTitle className="text-lg">Dr. {therapist.name}</CardTitle>
                              <p className="text-sm text-gray-600">{therapist.title}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold">{compatibilityScore}%</span>
                            </div>
                            <Badge variant={compatibilityScore > 80 ? 'default' : 'secondary'}>
                              {compatibilityScore > 80 ? 'Excellent Match' : 'Good Match'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 text-sm">{therapist.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                              Specialties
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {therapist.specialties.slice(0, 3).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                              Approach
                            </p>
                            <Badge variant="secondary">{therapist.approach}</Badge>
                          </div>
                          
                          {matchingFactors.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Why This Match
                              </p>
                              <div className="space-y-1">
                                {matchingFactors.slice(0, 2).map((factor, index) => (
                                  <p key={index} className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {factor}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium">Compatibility</span>
                              <span>{compatibilityScore}%</span>
                            </div>
                            <Progress value={compatibilityScore} className="h-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                  
                  <RadioGroupItem
                    value={therapist.id}
                    id={therapist.id}
                    className="absolute top-4 right-4"
                  />
                </div>
              );
            })}
          </div>
        </RadioGroup>

        <div className="flex justify-center pt-6">
          <Button
            onClick={saveTherapistSelection}
            disabled={!selectedTherapist || isSaving}
            size="lg"
            className="min-w-48"
          >
            {isSaving ? (
              "Saving..."
            ) : currentTherapist ? (
              "Update Therapist"
            ) : (
              <>
                Continue to Therapy Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TherapistSelection;