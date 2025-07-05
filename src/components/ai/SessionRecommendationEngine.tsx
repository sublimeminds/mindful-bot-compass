
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, TrendingUp, Star } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const SessionRecommendationEngine = () => {
  const { user } = useSimpleApp();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      // Mock recommendations
      const mockRecommendations = [
        {
          id: '1',
          type: 'technique',
          title: 'Try Progressive Muscle Relaxation',
          description: 'Based on your stress levels, this technique could help',
          priority: 'high',
          estimated_time: 15
        }
      ];
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Session Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading recommendations...</div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                      {rec.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {rec.estimated_time} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionRecommendationEngine;
