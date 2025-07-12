import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { therapyApproachService } from '@/services/therapyApproachService';
import { liveAnalyticsService } from '@/services/liveAnalyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Lightbulb,
  Sparkles
} from 'lucide-react';

interface TherapyPlan {
  id: string;
  primaryApproach: {
    name: string;
    techniques: string[];
    effectiveness: number;
  };
  secondaryApproach?: {
    name: string;
    techniques: string[];
    effectiveness: number;
  };
  goals: string[];
  timeline: {
    phase1: string;
    phase2: string;
    phase3: string;
  };
  expectedOutcomes: string[];
  riskFactors: string[];
  adaptations: string[];
}

interface UserAnalysis {
  primaryConcerns: string[];
  moodPatterns: string[];
  strengths: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  recommendedApproaches: string[];
}

const TherapyPlanGenerator = () => {
  const { user } = useAuth();
  const [userAnalysis, setUserAnalysis] = useState<UserAnalysis | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<TherapyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserAnalysis();
    }
  }, [user]);

  const loadUserAnalysis = async () => {
    if (!user) return;
    
    try {
      // Get user's session history and analysis
      const analysis = await liveAnalyticsService.getUserAnalysis(user.id);
      setUserAnalysis(analysis);
    } catch (error) {
      console.error('Error loading user analysis:', error);
    }
  };

  const generateTherapyPlan = async () => {
    if (!user || !userAnalysis) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Simulate progressive generation
      const progressSteps = [
        { progress: 20, message: 'Analyzing user data...' },
        { progress: 40, message: 'Matching therapy approaches...' },
        { progress: 60, message: 'Creating personalized plan...' },
        { progress: 80, message: 'Optimizing treatment sequence...' },
        { progress: 100, message: 'Finalizing recommendations...' }
      ];

      for (const step of progressSteps) {
        setGenerationProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generate the actual plan
      const plan = await therapyApproachService.generatePersonalizedPlan(
        user.id, 
        userInput || 'General therapy support'
      );
      
      setGeneratedPlan(plan);
    } catch (error) {
      console.error('Error generating therapy plan:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Therapy Plan Generator</h2>
        <p className="text-gray-600">
          Generate a personalized therapy plan based on your unique needs and patterns
        </p>
      </div>

      {/* User Analysis Summary */}
      {userAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-therapy-600" />
              Your Therapy Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Primary Concerns</h4>
                <div className="space-y-1">
                  {userAnalysis.primaryConcerns.map((concern, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Mood Patterns</h4>
                <div className="space-y-1">
                  {userAnalysis.moodPatterns.map((pattern, index) => (
                    <Badge key={index} variant="secondary" className="mr-1">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Strengths</h4>
                <div className="space-y-1">
                  {userAnalysis.strengths.map((strength, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 mr-1">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Risk Level</h4>
                <Badge className={getRiskBadgeColor(userAnalysis.riskLevel)}>
                  {userAnalysis.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Generation Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-therapy-600" />
            Generate Your Therapy Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to focus on in therapy? (Optional)
            </label>
            <Textarea
              placeholder="e.g., managing anxiety, improving relationships, processing trauma, building confidence..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={3}
            />
          </div>
          
          {isGenerating ? (
            <div className="space-y-3">
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Generating your personalized therapy plan...
              </p>
            </div>
          ) : (
            <Button 
              onClick={generateTherapyPlan}
              className="w-full bg-therapy-600 hover:bg-therapy-700"
              disabled={!userAnalysis}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Personalized Plan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Generated Plan */}
      {generatedPlan && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Your Personalized Therapy Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Primary Approach */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Primary Approach</h3>
                  <div className="border rounded-lg p-4 bg-therapy-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{generatedPlan.primaryApproach.name}</h4>
                      <Badge className="bg-therapy-600">
                        {(generatedPlan.primaryApproach.effectiveness * 100).toFixed(0)}% match
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Key Techniques:</p>
                      <div className="flex flex-wrap gap-1">
                        {generatedPlan.primaryApproach.techniques.map((technique, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Approach */}
                {generatedPlan.secondaryApproach && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Secondary Approach</h3>
                    <div className="border rounded-lg p-4 bg-calm-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{generatedPlan.secondaryApproach.name}</h4>
                        <Badge variant="secondary">
                          {(generatedPlan.secondaryApproach.effectiveness * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Supporting Techniques:</p>
                        <div className="flex flex-wrap gap-1">
                          {generatedPlan.secondaryApproach.techniques.map((technique, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Treatment Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-therapy-600" />
                Treatment Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-therapy-600 mb-2">Phase 1: Foundation</h4>
                    <p className="text-sm text-gray-600">{generatedPlan.timeline.phase1}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-therapy-600 mb-2">Phase 2: Development</h4>
                    <p className="text-sm text-gray-600">{generatedPlan.timeline.phase2}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-therapy-600 mb-2">Phase 3: Integration</h4>
                    <p className="text-sm text-gray-600">{generatedPlan.timeline.phase3}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals and Outcomes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-therapy-600" />
                  Therapy Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedPlan.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-therapy-600" />
                  Expected Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedPlan.expectedOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button className="bg-therapy-600 hover:bg-therapy-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept This Plan
            </Button>
            <Button variant="outline" onClick={generateTherapyPlan}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapyPlanGenerator;