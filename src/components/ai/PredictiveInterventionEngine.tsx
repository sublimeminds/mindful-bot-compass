
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertTriangle, TrendingUp, Clock, Target, Zap } from 'lucide-react';

interface PredictiveInsight {
  id: string;
  type: 'early_warning' | 'opportunity' | 'recommendation' | 'pattern_break';
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'mood' | 'behavior' | 'social' | 'physical' | 'cognitive';
  interventions: InterventionSuggestion[];
  confidence: number;
  triggers: string[];
}

interface InterventionSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term';
  effectiveness: number;
  effort: 'low' | 'medium' | 'high';
  personalizedReason: string;
}

const PredictiveInterventionEngine = () => {
  const [predictions, setPredictions] = useState<PredictiveInsight[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictiveInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadPredictiveInsights();
  }, []);

  const loadPredictiveInsights = async () => {
    // Mock predictive data - would come from AI analysis
    const mockPredictions: PredictiveInsight[] = [
      {
        id: '1',
        type: 'early_warning',
        title: 'Potential Mood Decline',
        description: 'AI models predict a 78% chance of mood decline in the next 3-5 days based on current patterns.',
        probability: 78,
        timeframe: '3-5 days',
        severity: 'high',
        category: 'mood',
        confidence: 85,
        triggers: ['Work stress patterns', 'Sleep quality decline', 'Reduced social activity'],
        interventions: [
          {
            id: 'i1',
            title: 'Proactive Stress Management',
            description: 'Implement stress-reduction techniques before the predicted decline.',
            type: 'immediate',
            effectiveness: 82,
            effort: 'medium',
            personalizedReason: 'Previous success with mindfulness during similar patterns'
          },
          {
            id: 'i2',
            title: 'Schedule Social Connection',
            description: 'Plan engaging social activities to counteract isolation patterns.',
            type: 'short_term',
            effectiveness: 67,
            effort: 'low',
            personalizedReason: 'Social activities have consistently improved your mood'
          }
        ]
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Optimal Learning Window',
        description: 'Current state indicates high receptivity to cognitive behavioral techniques.',
        probability: 89,
        timeframe: 'Next 2 days',
        severity: 'medium',
        category: 'cognitive',
        confidence: 91,
        triggers: ['Positive mood trend', 'High engagement levels', 'Recent breakthrough'],
        interventions: [
          {
            id: 'i3',
            title: 'Advanced CBT Techniques',
            description: 'Introduce more complex cognitive restructuring exercises.',
            type: 'immediate',
            effectiveness: 88,
            effort: 'high',
            personalizedReason: 'Your analytical thinking style aligns well with advanced CBT'
          },
          {
            id: 'i4',
            title: 'Skill Generalization',
            description: 'Practice applying learned techniques to new situations.',
            type: 'short_term',
            effectiveness: 75,
            effort: 'medium',
            personalizedReason: 'You excel at applying concepts across different contexts'
          }
        ]
      },
      {
        id: '3',
        type: 'pattern_break',
        title: 'Breaking Negative Thought Cycle',
        description: 'AI detected opportunity to interrupt recurring negative thought patterns.',
        probability: 72,
        timeframe: 'Today',
        severity: 'medium',
        category: 'cognitive',
        confidence: 79,
        triggers: ['Pattern recognition', 'Timing alignment', 'Motivational readiness'],
        interventions: [
          {
            id: 'i5',
            title: 'Thought Stopping Technique',
            description: 'Use visualization and grounding to interrupt negative cycles.',
            type: 'immediate',
            effectiveness: 71,
            effort: 'low',
            personalizedReason: 'You respond well to visual and kinesthetic techniques'
          }
        ]
      },
      {
        id: '4',
        type: 'recommendation',
        title: 'Sleep Optimization',
        description: 'Personalized sleep improvement recommendations based on your patterns.',
        probability: 85,
        timeframe: 'This week',
        severity: 'low',
        category: 'physical',
        confidence: 88,
        triggers: ['Sleep data analysis', 'Mood correlation', 'Behavioral patterns'],
        interventions: [
          {
            id: 'i6',
            title: 'Customized Sleep Routine',
            description: 'Implement a personalized bedtime routine based on your preferences.',
            type: 'long_term',
            effectiveness: 83,
            effort: 'medium',
            personalizedReason: 'Your routine-oriented personality suits structured approaches'
          }
        ]
      }
    ];

    setPredictions(mockPredictions);
  };

  const runPredictiveAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    await loadPredictiveInsights();
    setIsAnalyzing(false);
  };

  const implementIntervention = async (intervention: InterventionSuggestion) => {
    console.log('Implementing intervention:', intervention.title);
    // Would integrate with session scheduling or notification system
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'early_warning': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'pattern_break': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const criticalPredictions = predictions.filter(p => p.severity === 'critical' || p.severity === 'high');
  const opportunityPredictions = predictions.filter(p => p.type === 'opportunity');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Predictive Intervention Engine</h1>
          <p className="text-muted-foreground">AI-powered insights for proactive mental health support</p>
        </div>
        <Button 
          onClick={runPredictiveAnalysis}
          disabled={isAnalyzing}
          className="flex items-center space-x-2"
        >
          <Brain className="h-4 w-4" />
          <span>{isAnalyzing ? 'Analyzing...' : 'Run Prediction'}</span>
        </Button>
      </div>

      {/* Critical Alerts */}
      {criticalPredictions.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention Required:</strong> {criticalPredictions.length} high-priority predictions detected. 
            Consider implementing preventive interventions.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{predictions.length}</div>
            <p className="text-sm text-muted-foreground">Active Predictions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{criticalPredictions.length}</div>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{opportunityPredictions.length}</div>
            <p className="text-sm text-muted-foreground">Opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">
              {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)}%
            </div>
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Predictions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div 
                  key={prediction.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPrediction?.id === prediction.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(prediction.type)}
                      <h3 className="font-medium">{prediction.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(prediction.severity)}>
                        {prediction.severity}
                      </Badge>
                      <Badge variant="outline">
                        {prediction.probability}%
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {prediction.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{prediction.timeframe}</span>
                    </div>
                    <span className="capitalize">{prediction.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intervention Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedPrediction ? 'Recommended Interventions' : 'Select a Prediction'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPrediction ? (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-medium mb-2">{selectedPrediction.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedPrediction.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedPrediction.triggers.map((trigger, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Confidence: </span>
                    <span>{selectedPrediction.confidence}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPrediction.interventions.map((intervention) => (
                    <div key={intervention.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{intervention.title}</h4>
                        <Badge variant={intervention.type === 'immediate' ? 'default' : 'secondary'}>
                          {intervention.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {intervention.description}
                      </p>
                      
                      <div className="text-xs bg-blue-50 p-2 rounded mb-3">
                        <strong>Why this works for you:</strong> {intervention.personalizedReason}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex space-x-4">
                          <span>Effectiveness: <strong>{intervention.effectiveness}%</strong></span>
                          <span className={getEffortColor(intervention.effort)}>
                            Effort: <strong>{intervention.effort}</strong>
                          </span>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => implementIntervention(intervention)}
                        >
                          Implement
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a prediction to view recommended interventions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveInterventionEngine;
