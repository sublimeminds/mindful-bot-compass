
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Target, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { smartTherapyService, IntakeAnalysis } from '@/services/smartTherapyService';
import { useToast } from '@/hooks/use-toast';

interface SmartAnalysisStepProps {
  onNext: () => void;
  onBack: () => void;
}

const SmartAnalysisStep = ({ onNext, onBack }: SmartAnalysisStepProps) => {
  const { user } = useSimpleApp();
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
          <p className="text-muted-foreground mb-6">
            Our AI is analyzing your responses to create personalized therapy recommendations...
          </p>
          <Progress value={66} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            This usually takes 30-60 seconds
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-between">
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

  if (!analysis) {
    return (
      <div className="space-y-6">
        <p>No analysis data available.</p>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={performAnalysis}>
            Retry Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
        <p className="text-muted-foreground">
          Here's your personalized therapy profile based on our AI analysis.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Target className="h-5 w-5 mr-2" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={getRiskLevelColor(analysis.riskLevel)}>
                  {getRiskIcon(analysis.riskLevel)}
                  <span className="ml-1 capitalize">{analysis.riskLevel} Risk</span>
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Confidence: {analysis.confidence}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Brain className="h-5 w-5 mr-2" />
              Recommended Approaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendedApproaches.map((approach, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{approach}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Clock className="h-5 w-5 mr-2" />
              Session Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Recommended Frequency</p>
              <p className="text-sm text-muted-foreground">{analysis.sessionRecommendations.frequency}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Session Duration</p>
              <p className="text-sm text-muted-foreground">{analysis.sessionRecommendations.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium">Focus Areas</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.sessionRecommendations.focusAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue Setup
        </Button>
      </div>
    </div>
  );
};

export default SmartAnalysisStep;
