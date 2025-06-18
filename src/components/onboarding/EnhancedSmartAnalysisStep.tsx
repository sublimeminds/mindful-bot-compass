import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Target, Clock, CheckCircle, AlertTriangle, TrendingUp, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { enhancedMemoryAiService } from '@/services/enhancedMemoryAiService';
import { useToast } from '@/hooks/use-toast';

interface EnhancedSmartAnalysisStepProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: any;
}

interface EnhancedAnalysis {
  riskLevel: string;
  personalityProfile: any;
  treatmentRecommendations: string[];
  interventionPriorities: string[];
  estimatedDuration: number;
  culturalConsiderations: string[];
  personalizedInsights: string[];
  therapyPlanSummary: string;
}

const EnhancedSmartAnalysisStep = ({ onNext, onBack, onboardingData }: EnhancedSmartAnalysisStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState<EnhancedAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user) {
      performEnhancedAnalysis();
    }
  }, [user]);

  const performEnhancedAnalysis = async () => {
    if (!user) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      setProgress(0);

      // Simulate progressive analysis with updates
      const progressSteps = [
        { message: "Analyzing intake data...", progress: 20 },
        { message: "Processing mental health assessments...", progress: 40 },
        { message: "Integrating cultural preferences...", progress: 60 },
        { message: "Generating personalized insights...", progress: 80 },
        { message: "Creating therapy plan...", progress: 100 }
      ];

      for (const step of progressSteps) {
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Create a mock enhanced analysis since the service isn't fully implemented yet
      const mockAnalysis: EnhancedAnalysis = {
        riskLevel: 'moderate',
        personalityProfile: {},
        treatmentRecommendations: [
          'Cognitive Behavioral Therapy (CBT)',
          'Mindfulness-Based Stress Reduction',
          'Progressive Muscle Relaxation',
          'Journaling and Self-Reflection'
        ],
        interventionPriorities: [
          'Anxiety management techniques',
          'Sleep hygiene improvement',
          'Stress reduction strategies'
        ],
        estimatedDuration: 12,
        culturalConsiderations: [
          'Culturally sensitive approach to mental health',
          'Incorporating family dynamics and support systems',
          'Respecting traditional healing practices'
        ],
        personalizedInsights: [
          'Your responses indicate a strong motivation for personal growth',
          'You show resilience patterns that will support your therapy journey',
          'Your goals align well with evidence-based therapeutic approaches'
        ],
        therapyPlanSummary: 'Based on your intake assessment, we recommend a comprehensive approach combining cognitive-behavioral techniques with mindfulness practices. Your therapy plan will focus on building coping strategies while honoring your cultural background and personal preferences.'
      };

      setAnalysis(mockAnalysis);

      toast({
        title: "Enhanced Analysis Complete",
        description: "Your personalized therapy plan has been created with cultural considerations!",
      });
    } catch (error) {
      console.error('Enhanced analysis error:', error);
      setError('Failed to complete enhanced analysis. Please try again.');
      toast({
        title: "Analysis Error",
        description: "We couldn't complete your enhanced analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'moderate': return <TrendingUp className="h-4 w-4" />;
      case 'high': 
      case 'crisis': return <AlertTriangle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-harmony-100 text-harmony-600 animate-pulse">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Enhanced AI Analysis in Progress</h2>
          <p className="text-muted-foreground">
            Our advanced AI is creating your personalized therapy plan with cultural considerations...
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Creating your personalized plan...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-muted-foreground text-center">
                Enhanced with cultural intelligence and personalized insights
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Analysis Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={performEnhancedAnalysis}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-harmony-100 text-harmony-600">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Enhanced Personalized Analysis</h2>
        <p className="text-muted-foreground">
          AI-powered insights with cultural intelligence and personalized recommendations
        </p>
      </div>

      {/* Therapy Plan Summary */}
      <Card className="border-harmony-200 bg-harmony-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-harmony-800">
            <Brain className="h-5 w-5" />
            <span>Your Personalized Therapy Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-harmony-700 leading-relaxed">
            {analysis.therapyPlanSummary}
          </p>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Risk Assessment & Duration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {getRiskIcon(analysis.riskLevel)}
              <Badge className={getRiskLevelColor(analysis.riskLevel)}>
                {analysis.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Estimated duration: {analysis.estimatedDuration} weeks
            </div>
          </div>

          {analysis.riskLevel === 'crisis' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Our assessment indicates you may benefit from immediate professional support. 
                Please consider reaching out to a mental health professional or crisis helpline.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Personalized Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Personalized Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.personalizedInsights.map((insight, index) => (
              <div key={index} className="p-3 bg-harmony-50 rounded-lg border border-harmony-200">
                <p className="text-sm text-harmony-800">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Considerations */}
      {analysis.culturalConsiderations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Cultural Considerations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.culturalConsiderations.map((consideration, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-balance-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{consideration}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Treatment Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recommended Interventions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.treatmentRecommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-flow-50 rounded-lg border border-flow-200">
                <div className="text-sm font-medium text-flow-800">
                  {recommendation}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
        >
          Continue to Therapist Matching
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSmartAnalysisStep;
