import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Target, Clock } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

interface BehavioralPattern {
  id: string;
  pattern_type: string;
  frequency_score: number;
  effectiveness_score: number;
  pattern_data: any;
  first_identified: string;
  last_occurred: string;
}

const BehavioralPatternRecognition = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [patterns, setPatterns] = useState<BehavioralPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBehavioralPatterns();
    }
  }, [user]);

  const loadBehavioralPatterns = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockPatterns: BehavioralPattern[] = [
        {
          id: '1',
          pattern_type: 'stress_trigger',
          frequency_score: 0.8,
          effectiveness_score: 0.6,
          pattern_data: { trigger: 'work_meetings', coping_strategy: 'deep_breathing' },
          first_identified: new Date().toISOString(),
          last_occurred: new Date().toISOString()
        }
      ];
      setPatterns(mockPatterns);
    } catch (error) {
      console.error('Error loading behavioral patterns:', error);
      toast({
        title: 'Error',
        description: 'Failed to load behavioral patterns.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (score: number) => {
    if (score > 0.7) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (score < 0.4) {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    } else {
      return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (score: number) => {
    if (score > 0.7) {
      return 'bg-green-100 text-green-800';
    } else if (score < 0.4) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Behavioral Pattern Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading patterns...</div>
          ) : (
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div key={pattern.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{pattern.pattern_type}</h3>
                  <p className="text-sm text-muted-foreground">
                    Frequency: {(pattern.frequency_score * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BehavioralPatternRecognition;
