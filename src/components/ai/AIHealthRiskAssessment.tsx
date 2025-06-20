import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Brain, Heart, Activity } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: Array<{
    category: string;
    level: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
  confidence: number;
  lastUpdated: Date;
}

const AIHealthRiskAssessment = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runAssessment();
  }, [user]);

  const runAssessment = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate AI assessment
    const mockAssessment: RiskAssessment = {
      overallRisk: 'medium',
      riskFactors: [
        {
          category: 'Session Engagement',
          level: 'low',
          description: 'Consistent session attendance',
          recommendation: 'Continue current engagement level'
        },
        {
          category: 'Mood Stability',
          level: 'medium',
          description: 'Some mood fluctuations',
          recommendation: 'Monitor mood and adjust therapy as needed'
        }
      ],
      confidence: 75,
      lastUpdated: new Date()
    };

    setAssessment(mockAssessment);
    setIsLoading(false);

    if (mockAssessment.overallRisk === 'high') {
      toast({
        title: "High Risk Alert",
        description: "Immediate action is required. Contact support.",
        variant: "destructive",
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              AI Health Risk Assessment
            </CardTitle>
            <Button variant="outline" onClick={runAssessment} disabled={isLoading}>
              {isLoading ? 'Assessing...' : 'Run Assessment'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center">
              <Brain className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Analyzing your data...</p>
            </div>
          ) : assessment ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Overall Risk:</h3>
                <Badge className={getRiskColor(assessment.overallRisk)}>
                  {assessment.overallRisk}
                </Badge>
              </div>
              <Progress value={assessment.confidence} />
              <p className="text-sm text-muted-foreground">
                Last updated: {assessment.lastUpdated.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No assessment data available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {assessment?.overallRisk === 'high' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High risk detected. Please contact support immediately.
          </AlertDescription>
        </Alert>
      )}

      {assessment && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assessment.riskFactors.map((factor, index) => (
                <div key={index} className="p-4 rounded-md border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{factor.category}</h4>
                      <p className="text-xs text-muted-foreground">{factor.description}</p>
                    </div>
                    <Badge className={getRiskColor(factor.level)}>{factor.level}</Badge>
                  </div>
                  <p className="text-xs text-blue-500 mt-2">Recommendation: {factor.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIHealthRiskAssessment;
