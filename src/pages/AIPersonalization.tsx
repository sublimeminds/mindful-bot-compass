import React from 'react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Heart, Settings } from 'lucide-react';

const AIPersonalization = () => {
  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-therapy-800">AI Personalization</h1>
            <p className="text-muted-foreground">
              Discover how AI adapts your therapy experience
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-therapy-600" />
                Adaptive Therapy Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI creates personalized therapy plans that evolve based on your progress
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-calm-600" />
                Mood-Based Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time mood tracking adjusts AI responses automatically
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-balance-600" />
                Goal-Aligned Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Every session is tailored to your personal mental health goals
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default AIPersonalization;