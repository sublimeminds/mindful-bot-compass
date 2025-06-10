
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Activity, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RiskFactor {
  name: string;
  level: 'low' | 'medium' | 'high';
  score: number;
  description: string;
  trending: 'improving' | 'stable' | 'worsening';
}

interface InterventionRecommendation {
  priority: 'immediate' | 'urgent' | 'routine';
  title: string;
  description: string;
  actions: string[];
}

const AIHealthRiskAssessment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [overallRiskScore, setOverallRiskScore] = useState<number>(0);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [recommendations, setRecommendations] = useState<InterventionRecommendation[]>([]);
  const [isAssessing, setIsAssessing] = useState(false);
  const [lastAssessment, setLastAssessment] = useState<Date | null>(null);

  useEffect(() => {
    runRiskAssessment();
  }, [user]);

  const runRiskAssessment = async () => {
    setIsAssessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate AI risk assessment
    const mockRiskFactors: RiskFactor[] = [
      {
        name: 'Session Engagement',
        level: 'low',
        score: 15,
        description: 'Consistent session attendance and active participation',
        trending: 'stable'
      },
      {
        name: 'Mood Stability',
        level: 'medium',
        score: 35,
        description: 'Some mood fluctuations but within manageable range',
        trending: 'improving'
      },
      {
        name: 'Crisis Indicators',
        level: 'low',
        score: 8,
        description: 'No immediate crisis indicators detected',
        trending: 'stable'
      },
      {
        name: 'Support System',
        level: 'low',
        score: 12,
        description: 'Strong social support network identified',
        trending: 'stable'
      }
    ];

    const mockRecommendations: InterventionRecommendation[] = [
      {
        priority: 'routine',
        title: 'Continue Current Therapy Plan',
        description: 'Current therapeutic approach is showing positive results',
        actions: [
          'Maintain weekly session schedule',
          'Continue mood tracking',
          'Practice learned coping strategies'
        ]
      },
      {
        priority: 'urgent',
        title: 'Enhanced Mood Monitoring',
        description: 'Increase frequency of mood check-ins due to recent fluctuations',
        actions: [
          'Daily mood logging for 2 weeks',
          'Trigger-based intervention alerts',
          'Weekly therapist check-ins'
        ]
      }
    ];

    const overallScore = Math.round(mockRiskFactors.reduce((sum, factor) => sum + factor.score, 0) / mockRiskFactors.length);

    setRiskFactors(mockRiskFactors);
    setRecommendations(mockRecommendations);
    setOverallRiskScore(overallScore);
    setLastAssessment(new Date());
    setIsAssessing(false);

    // Show notification based on risk level
    if (overallScore > 60) {
      toast({
        title: "Risk Assessment Alert",
        description: "Elevated risk detected. Additional support recommended.",
        variant: "destructive",
      });
    }
  };

  const getRiskLevelInfo = (score: number) => {
    if (score < 30) {
      return {
        level: 'Low Risk',
        color: 'text-green-600',
        bg: 'bg-green-100',
        icon: CheckCircle,
        description: 'Minimal intervention needed'
      };
    } else if (score < 60) {
      return {
        level: 'Medium Risk',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        icon: AlertTriangle,
        description: 'Enhanced monitoring recommended'
      };
    } else {
      return {
        level: 'High Risk',
        color: 'text-red-600',
        bg: 'bg-red-100',
        icon: AlertTriangle,
        description: 'Immediate intervention required'
      };
    }
  };

  const riskInfo = getRiskLevelInfo(overallRiskScore);
  const RiskIcon = riskInfo.icon;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'border-red-500 bg-red-50';
      case 'urgent': return 'border-yellow-500 bg-yellow-50';
      case 'routine': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'improving': return '📈';
      case 'worsening': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <CardTitle>AI Health Risk Assessment</CardTitle>
            </div>
            <Button 
              variant="outline" 
              onClick={runRiskAssessment}
              disabled={isAssessing}
            >
              {isAssessing ? 'Assessing...' : 'Run Assessment'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAssessing ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing mental health indicators and risk factors...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Risk Score */}
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${riskInfo.bg}`}>
                  <RiskIcon className={`h-5 w-5 ${riskInfo.color}`} />
                  <span className={`font-semibold ${riskInfo.color}`}>{riskInfo.level}</span>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{overallRiskScore}/100</div>
                  <Progress value={overallRiskScore} className="h-3 w-48 mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">{riskInfo.description}</p>
                </div>
              </div>

              {lastAssessment && (
                <div className="text-center text-sm text-muted-foreground">
                  Last assessment: {lastAssessment.toLocaleString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* High Risk Alert */}
      {overallRiskScore > 60 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>Elevated risk detected.</strong> Additional support and monitoring recommended.
            </span>
            <Button size="sm" className="ml-4">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Risk Factor Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{factor.name}</h4>
                    <Badge className={getLevelColor(factor.level)}>
                      {factor.level}
                    </Badge>
                    <span className="text-sm">{getTrendingIcon(factor.trending)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{factor.score}</div>
                  <div className="text-xs text-muted-foreground">Risk Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intervention Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 border-l-4 rounded-lg ${getPriorityColor(rec.priority)}`}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge variant="outline" className="capitalize">
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium">Recommended Actions:</h5>
                    <ul className="text-sm space-y-1">
                      {rec.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start space-x-2">
                          <span className="text-muted-foreground">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIHealthRiskAssessment;
