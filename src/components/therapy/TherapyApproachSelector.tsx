import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Heart, Target, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

interface TherapyApproach {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  target_conditions: string[];
  effectiveness_score: number;
  estimated_duration_weeks: number;
}

interface TherapyApproachSelectorProps {
  onApproachSelected: (approach: TherapyApproach) => void;
  currentApproachId?: string;
}

const TherapyApproachSelector = ({ onApproachSelected, currentApproachId }: TherapyApproachSelectorProps) => {
  const { user } = useAuth();
  const [approaches, setApproaches] = useState<TherapyApproach[]>([]);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(currentApproachId || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTherapyApproaches();
  }, []);

  const loadTherapyApproaches = async () => {
    try {
      const { data, error } = await supabase
        .from('therapeutic_approach_configs')
        .select('*')
        .order('effectiveness_score', { ascending: false });

      if (error) throw error;
      setApproaches(data || []);
    } catch (error) {
      console.error('Error loading therapy approaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApproach = async (approach: TherapyApproach) => {
    if (!user) return;

    try {
      // Save user's approach preference
      const { error } = await supabase
        .from('user_therapy_preferences')
        .upsert({
          user_id: user.id,
          preferred_approach_id: approach.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSelectedApproach(approach.id);
      onApproachSelected(approach);
    } catch (error) {
      console.error('Error selecting approach:', error);
    }
  };

  const getApproachColor = (name: string) => {
    const colors: Record<string, string> = {
      'CBT': 'from-blue-500 to-blue-600',
      'ACT': 'from-green-500 to-green-600',
      'EMDR': 'from-purple-500 to-purple-600',
      'SFBT': 'from-yellow-500 to-yellow-600',
      'Narrative': 'from-pink-500 to-pink-600',
      'IFS': 'from-indigo-500 to-indigo-600',
      'EFT': 'from-red-500 to-red-600',
      'Somatic': 'from-orange-500 to-orange-600',
      'MI': 'from-teal-500 to-teal-600',
      'Gestalt': 'from-cyan-500 to-cyan-600'
    };
    return colors[name] || 'from-therapy-500 to-therapy-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold therapy-text-gradient mb-2">Choose Your Therapy Approach</h2>
        <p className="text-muted-foreground">Select the therapeutic approach that best fits your needs and goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {approaches.map((approach) => (
          <Card 
            key={approach.id} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedApproach === approach.id 
                ? 'ring-2 ring-therapy-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleSelectApproach(approach)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{approach.name}</CardTitle>
                {selectedApproach === approach.id && (
                  <CheckCircle className="h-5 w-5 text-therapy-600" />
                )}
              </div>
              <div className={`h-1 rounded-full bg-gradient-to-r ${getApproachColor(approach.name)}`} />
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {approach.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Effectiveness</span>
                  <span className="font-medium">{Math.round(approach.effectiveness_score * 100)}%</span>
                </div>
                <Progress value={approach.effectiveness_score * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>Duration: {approach.estimated_duration_weeks} weeks</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {approach.techniques.slice(0, 2).map((technique, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {technique}
                    </Badge>
                  ))}
                  {approach.techniques.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{approach.techniques.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className={`w-full ${
                    selectedApproach === approach.id 
                      ? 'bg-therapy-600 hover:bg-therapy-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  size="sm"
                >
                  {selectedApproach === approach.id ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Selected
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-1" />
                      Select Approach
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedApproach && (
        <Card className="bg-therapy-50 border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-therapy-600" />
                <span className="font-medium">Approach selected! Ready to start your personalized session.</span>
              </div>
              <ArrowRight className="h-5 w-5 text-therapy-600" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TherapyApproachSelector;