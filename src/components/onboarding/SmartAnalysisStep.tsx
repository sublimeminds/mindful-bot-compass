
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Target, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { smartTherapyService, IntakeAnalysis } from '@/services/smartTherapyService';
import { useToast } from '@/hooks/use-toast';

interface SmartAnalysisStepProps {
  onNext: () => void;
  onBack: () => void;
}

const SmartAnalysisStep = ({ onNext, onBack }: SmartAnalysisStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState<IntakeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      performAnalysis();
    }
  }, [user]);

  const performAnalysis = async () => {
    if (!user) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      const result = await smartTherapyService.analyzeIntakeData(user.id);
      setAnalysis(result);

      toast({
        title: "Analysis Complete",
        description: "Your personalized therapy recommendations are ready!",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze your data. Please try again.');
      toast({
        title: "Analysis Error",
        description: "We couldn't complete your analysis. Please try again.",
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
              <Brain className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">AI Analysis in Progress</h2>
          <p className="text-muted-foreground">
            Our AI is analyzing your responses to create personalized recommendations...
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing your data...</span>
                <span className="text-sm text-muted-foreground">This may take a moment</span>
              </div>
              <Progress value={66} className="w-full" />
              <div className="text-xs text-muted-foreground text-center">
                ✓ Intake data processed • ✓ Assessments analyzed • ⟳ Generating recommendations...
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
          <Button onClick={performAnalysis}>
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
            <Brain className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Personalized Analysis</h2>
        <p className="text-muted-foreground">
          Based on your responses, we've created a personalized therapy plan
        </p>
      </div>

      {/* Risk Level Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Risk Assessment</span>
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
              Estimated therapy duration: {analysis.estimatedDuration} weeks
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

      {/* Treatment Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Recommended Interventions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.interventionPriorities.map((priority, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-harmony-100 text-harmony-600 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <span className="text-sm">{priority}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Therapy Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Treatment Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.treatmentRecommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-harmony-50 rounded-lg border border-harmony-200">
                <div className="text-sm font-medium text-harmony-800">
                  {recommendation}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personality Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Your Profile Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Communication Style</div>
              <div className="text-sm">{analysis.personalityProfile.communicationStyle || 'Supportive'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Social Support</div>
              <div className="text-sm">{analysis.personalityProfile.socialSupport}/10</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Sleep Quality</div>
              <div className="text-sm">{analysis.personalityProfile.sleepQuality}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Exercise Level</div>
              <div className="text-sm">{analysis.personalityProfile.exerciseLevel}</div>
            </div>
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

export default SmartAnalysisStep;
