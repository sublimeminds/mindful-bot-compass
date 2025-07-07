import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, AlertTriangle, TrendingUp } from 'lucide-react';

const EmotionAnalysis = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emotion Analysis</h1>
          <p className="text-muted-foreground mt-1">Advanced emotional intelligence and pattern recognition</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto text-anxiety-500 mb-2" />
              <p className="text-sm text-muted-foreground">Anxiety</p>
              <p className="text-2xl font-bold">3.2</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="h-6 w-6 mx-auto text-depression-500 mb-2" />
              <p className="text-sm text-muted-foreground">Depression</p>
              <p className="text-2xl font-bold">2.1</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 mx-auto text-resilience-500 mb-2" />
              <p className="text-sm text-muted-foreground">Resilience</p>
              <p className="text-2xl font-bold">7.8</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto text-stability-500 mb-2" />
              <p className="text-sm text-muted-foreground">Stability</p>
              <p className="text-2xl font-bold">6.5</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Emotional Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Advanced emotion analysis and AI insights will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionAnalysis;