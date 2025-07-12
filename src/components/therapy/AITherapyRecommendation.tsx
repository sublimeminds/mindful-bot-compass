import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Target, ArrowRight, CheckCircle } from 'lucide-react';

interface TherapyApproach {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  system_prompt_addition: string;
  target_conditions: string[];
  effectiveness_score: number;
}

interface ApproachRecommendation {
  approach: TherapyApproach;
  confidence: number;
  reasoning: string;
  suitability_factors: string[];
}

interface AITherapyRecommendationProps {
  onApproachSelected: (approach: TherapyApproach) => void;
}

const AITherapyRecommendation = ({ onApproachSelected }: AITherapyRecommendationProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<{
    primary: ApproachRecommendation | null;
    secondary: ApproachRecommendation | null;
    dual_approach_strategy: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      getAIRecommendation();
    }
  }, [user]);

  const getAIRecommendation = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's current conditions from their profile/assessments
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Call the AI recommendation function
      const { data, error } = await supabase.functions.invoke('recommend-therapy-approaches', {
        body: {
          userId: user.id,
          currentConditions: ['anxiety', 'stress'], // This would come from actual assessment
          sessionContext: {
            mood: 6,
            recentTopics: ['work stress', 'relationships'],
            crisisIndicators: { risk_level: 0 }
          }
        }
      });

      if (error) throw error;

      setRecommendation(data);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRecommendation = (approach: TherapyApproach) => {
    onApproachSelected(approach);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  if (!recommendation?.primary) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Unable to generate therapy recommendations at this time.</p>
          <Button onClick={getAIRecommendation} variant="outline" className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-therapy-50 to-calm-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-therapy-600" />
            AI-Recommended Therapy Approach
          </CardTitle>
          <p className="text-muted-foreground">
            Based on your assessment and current needs, I recommend the following therapeutic approach for today's session.
          </p>
        </CardHeader>
      </Card>

      {/* Primary Recommendation */}
      <Card className="border-therapy-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {recommendation.primary.approach.name}
            </CardTitle>
            <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
              {Math.round(recommendation.primary.confidence * 100)}% confidence
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {recommendation.primary.approach.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Why This Approach?
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {recommendation.primary.reasoning}
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendation.primary.suitability_factors.map((factor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Key Techniques</h4>
            <ul className="space-y-1">
              {recommendation.primary.approach.techniques.slice(0, 4).map((technique, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-therapy-600" />
                  {technique}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={() => handleAcceptRecommendation(recommendation.primary!.approach)}
              className="bg-therapy-600 hover:bg-therapy-700"
            >
              Start {recommendation.primary.approach.name} Session
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={getAIRecommendation}>
              Get New Recommendation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Recommendation */}
      {recommendation.secondary && (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Alternative: {recommendation.secondary.approach.name}
              <Badge variant="outline">
                {Math.round(recommendation.secondary.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {recommendation.secondary.reasoning}
            </p>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => handleAcceptRecommendation(recommendation.secondary!.approach)}
              className="w-full"
            >
              Use {recommendation.secondary.approach.name} Instead
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Strategy Explanation */}
      {recommendation.dual_approach_strategy && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Session Strategy</h4>
            <p className="text-sm text-muted-foreground">
              {recommendation.dual_approach_strategy}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITherapyRecommendation;