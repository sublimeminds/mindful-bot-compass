import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity, Target, Heart, Shield, Zap, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CrisisDetectionService } from '@/services/crisisDetectionService';
import TherapistMatcher from '@/components/therapist/TherapistMatcher';

interface AIStatusOverview {
  therapistCompatibility: number;
  crisisRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  memoryRecallAccuracy: number;
  therapyPlanPhase: string;
  activeInsights: number;
  emergingPatterns: string[];
}

const AIIntegrationHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aiStatus, setAiStatus] = useState<AIStatusOverview | null>(null);
  const [showTherapistMatcher, setShowTherapistMatcher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAIStatus = async () => {
      if (!user?.id) return;
      
      try {
        // Simulate loading AI status data
        const status: AIStatusOverview = {
          therapistCompatibility: 92,
          crisisRiskLevel: 'low',
          memoryRecallAccuracy: 87,
          therapyPlanPhase: 'Phase 2: Building Coping Skills',
          activeInsights: 3,
          emergingPatterns: ['Improved mood consistency', 'Better sleep patterns', 'Increased engagement']
        };
        
        setAiStatus(status);
      } catch (error) {
        console.error('Error loading AI status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAIStatus();
  }, [user?.id]);

  const handleTherapistSelected = (therapistId: string) => {
    setShowTherapistMatcher(false);
    navigate('/therapy-chat');
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (showTherapistMatcher) {
    return (
      <TherapistMatcher
        onTherapistSelected={handleTherapistSelected}
        onClose={() => setShowTherapistMatcher(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!aiStatus) {
    return (
      <div className="text-center py-8">
        <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Unable to load AI status</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Status Overview */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-therapy-700 mb-2">AI Intelligence Hub</h1>
        <p className="text-gray-600">Your personalized AI therapy ecosystem working together</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Heart className="h-4 w-4 mr-2 text-therapy-600" />
              Therapist Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-therapy-700">
              {aiStatus.therapistCompatibility}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Compatibility Score</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-3 w-full"
              onClick={() => setShowTherapistMatcher(true)}
            >
              Optimize Match
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2 text-therapy-600" />
              Crisis Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getRiskLevelColor(aiStatus.crisisRiskLevel)} mb-2`}>
              {aiStatus.crisisRiskLevel.toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-600">Risk Level</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-3 w-full"
              onClick={() => navigate('/crisis-support')}
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Brain className="h-4 w-4 mr-2 text-therapy-600" />
              Memory Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-therapy-700">
              {aiStatus.memoryRecallAccuracy}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Recall Precision</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-therapy-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiStatus.memoryRecallAccuracy}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Therapy Plan Phase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-therapy-600" />
            Active Therapy Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{aiStatus.therapyPlanPhase}</h3>
              <p className="text-sm text-gray-600">AI-adapted based on your progress</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/therapy-plan')}
            >
              View Full Plan
            </Button>
          </div>
          
          {/* Progress Indicators */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Phase Progress</span>
              <span>67%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-therapy-600 h-2 rounded-full w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights & Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-therapy-600" />
              Active AI Insights
              <Badge variant="secondary" className="ml-2">
                {aiStatus.activeInsights}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-therapy-25 rounded-lg">
                <p className="text-sm font-medium">Mood Pattern Recognition</p>
                <p className="text-xs text-gray-600">Your evening mood has improved 40% this week</p>
              </div>
              <div className="p-3 bg-therapy-25 rounded-lg">
                <p className="text-sm font-medium">Sleep-Anxiety Correlation</p>
                <p className="text-xs text-gray-600">Better sleep correlates with lower anxiety (87% confidence)</p>
              </div>
              <div className="p-3 bg-therapy-25 rounded-lg">
                <p className="text-sm font-medium">Coping Strategy Effectiveness</p>
                <p className="text-xs text-gray-600">Breathing exercises show 73% success rate for you</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-therapy-600" />
              Emerging Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiStatus.emergingPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">{pattern}</span>
                </div>
              ))}
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/therapy-chat')}
            >
              <Brain className="h-6 w-6 mb-2" />
              <span className="text-xs">Enhanced Chat</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/goals')}
            >
              <Target className="h-6 w-6 mb-2" />
              <span className="text-xs">Smart Goals</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/mood-tracker')}
            >
              <Heart className="h-6 w-6 mb-2" />
              <span className="text-xs">Mood Analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/ai-personalization')}
            >
              <Settings className="h-6 w-6 mb-2" />
              <span className="text-xs">AI Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIIntegrationHub;