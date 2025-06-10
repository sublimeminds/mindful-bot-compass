
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  lastOccurrence: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  triggers: string[];
  interventions: string[];
}

interface Anomaly {
  id: string;
  type: 'engagement' | 'mood' | 'usage' | 'response';
  description: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: string;
  suggestedAction: string;
}

const BehavioralPatternRecognition = () => {
  const { user } = useAuth();
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeBehavioralPatterns();
  }, [user]);

  const analyzeBehavioralPatterns = async () => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockPatterns: BehaviorPattern[] = [
      {
        id: '1',
        name: 'Evening Session Preference',
        description: 'User consistently schedules therapy sessions between 6-8 PM',
        frequency: 85,
        lastOccurrence: '2024-06-09',
        impact: 'positive',
        confidence: 92,
        triggers: ['End of workday', 'Transition time', 'Quiet environment'],
        interventions: ['Continue evening scheduling', 'Prepare guided wind-down sessions']
      },
      {
        id: '2',
        name: 'Stress-Response Pattern',
        description: 'Increased session frequency during high-stress periods',
        frequency: 73,
        lastOccurrence: '2024-06-08',
        impact: 'positive',
        confidence: 88,
        triggers: ['Work deadlines', 'Family events', 'Schedule changes'],
        interventions: ['Proactive stress management', 'Preventive check-ins']
      },
      {
        id: '3',
        name: 'Weekend Avoidance',
        description: 'Tendency to skip sessions on weekends',
        frequency: 67,
        lastOccurrence: '2024-06-07',
        impact: 'negative',
        confidence: 79,
        triggers: ['Social activities', 'Relaxed schedule', 'Different routine'],
        interventions: ['Flexible weekend options', 'Brief check-in reminders']
      }
    ];

    const mockAnomalies: Anomaly[] = [
      {
        id: '1',
        type: 'engagement',
        description: 'Sudden decrease in session duration (30% below average)',
        severity: 'medium',
        detectedAt: '2024-06-09T14:30:00Z',
        suggestedAction: 'Send supportive check-in message'
      },
      {
        id: '2',
        type: 'mood',
        description: 'Mood ratings consistently lower than typical range',
        severity: 'high',
        detectedAt: '2024-06-08T16:00:00Z',
        suggestedAction: 'Schedule priority intervention call'
      }
    ];

    setPatterns(mockPatterns);
    setAnomalies(mockAnomalies);
    setIsAnalyzing(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-indigo-500" />
              <CardTitle>Behavioral Pattern Recognition</CardTitle>
            </div>
            <Button 
              variant="outline" 
              onClick={analyzeBehavioralPatterns}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing behavioral patterns and detecting anomalies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-indigo-500">{patterns.length}</p>
                <p className="text-xs text-muted-foreground">Patterns Detected</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-green-500">
                  {patterns.filter(p => p.impact === 'positive').length}
                </p>
                <p className="text-xs text-muted-foreground">Positive Patterns</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-red-500">{anomalies.length}</p>
                <p className="text-xs text-muted-foreground">Anomalies Found</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-purple-500">
                  {Math.round(patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Anomalies Alert */}
      {anomalies.filter(a => a.severity === 'high').length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>High-priority anomalies detected!</strong> 
            {` ${anomalies.filter(a => a.severity === 'high').length} pattern(s) require immediate attention.`}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patterns">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          {patterns.map((pattern) => (
            <Card key={pattern.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{pattern.name}</h3>
                        <Badge className={getImpactColor(pattern.impact)}>
                          {pattern.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{pattern.description}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{pattern.frequency}% frequency</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm text-indigo-600">{pattern.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Common Triggers</span>
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.triggers.map((trigger, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Recommended Interventions</span>
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {pattern.interventions.map((intervention, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{intervention}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last seen: {new Date(pattern.lastOccurrence).toLocaleDateString()}</span>
                    <span>Pattern ID: {pattern.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          {anomalies.map((anomaly) => (
            <Card key={anomaly.id} className={`border-l-4 ${getSeverityColor(anomaly.severity)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(anomaly.severity)}
                      <h3 className="font-semibold capitalize">{anomaly.type} Anomaly</h3>
                      <Badge variant="outline" className="text-xs capitalize">
                        {anomaly.severity} severity
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Suggested Action:</strong> {anomaly.suggestedAction}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(anomaly.detectedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {anomalies.length === 0 && !isAnalyzing && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Anomalies Detected</h3>
                <p className="text-muted-foreground">
                  All behavioral patterns are within expected ranges.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehavioralPatternRecognition;
