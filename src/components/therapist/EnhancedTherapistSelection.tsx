import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  Heart,
  Star,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Activity,
  Calendar,
  MessageCircle,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface EnhancedTherapist {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communication_style: string;
  experience_level: string;
  color_scheme: string;
  icon: string;
  aiCompatibility: {
    overall_score: number;
    memory_alignment: number;
    cultural_sensitivity: number;
    communication_match: number;
    goal_alignment: number;
    crisis_handling: number;
  };
  predictedOutcomes: {
    therapy_effectiveness: number;
    session_engagement: number;
    goal_achievement_rate: number;
    crisis_prevention: number;
  };
  therapeuticMemoryAnalysis: {
    previous_experience: boolean;
    memory_patterns: string[];
    breakthrough_likelihood: number;
    rapport_prediction: number;
  };
  culturalIntegration: {
    cultural_match: number;
    family_dynamics_understanding: number;
    communication_adaptation: number;
  };
}

const EnhancedTherapistSelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState<EnhancedTherapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [currentTherapist, setCurrentTherapist] = useState<EnhancedTherapist | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnhancedTherapistData = async () => {
      if (!user) return;
      
      try {
        // Simulate enhanced AI analysis of therapist compatibility
        const mockTherapists: EnhancedTherapist[] = [
          {
            id: '1',
            name: 'Dr. Sarah Chen',
            title: 'Cognitive Behavioral Therapist',
            description: 'Specializes in anxiety and depression using evidence-based CBT techniques with cultural sensitivity.',
            approach: 'Cognitive Behavioral Therapy',
            specialties: ['Anxiety', 'Depression', 'Cultural Integration', 'CBT'],
            communication_style: 'Direct but supportive',
            experience_level: 'Expert',
            color_scheme: 'from-therapy-500 to-therapy-600',
            icon: 'Brain',
            aiCompatibility: {
              overall_score: 94,
              memory_alignment: 96,
              cultural_sensitivity: 92,
              communication_match: 95,
              goal_alignment: 91,
              crisis_handling: 93
            },
            predictedOutcomes: {
              therapy_effectiveness: 89,
              session_engagement: 92,
              goal_achievement_rate: 87,
              crisis_prevention: 94
            },
            therapeuticMemoryAnalysis: {
              previous_experience: true,
              memory_patterns: ['Trust building', 'Cultural exploration', 'Anxiety management'],
              breakthrough_likelihood: 88,
              rapport_prediction: 93
            },
            culturalIntegration: {
              cultural_match: 95,
              family_dynamics_understanding: 91,
              communication_adaptation: 94
            }
          },
          {
            id: '2',
            name: 'Dr. Maya Patel',
            title: 'Mindfulness-Based Therapist',
            description: 'Focuses on mindfulness and holistic approaches with emphasis on work-life balance.',
            approach: 'Mindfulness-Based Stress Reduction',
            specialties: ['Mindfulness', 'Stress Management', 'Work-Life Balance', 'Holistic Health'],
            communication_style: 'Gentle and reflective',
            experience_level: 'Senior',
            color_scheme: 'from-harmony-500 to-harmony-600',
            icon: 'Heart',
            aiCompatibility: {
              overall_score: 86,
              memory_alignment: 84,
              cultural_sensitivity: 89,
              communication_match: 82,
              goal_alignment: 88,
              crisis_handling: 85
            },
            predictedOutcomes: {
              therapy_effectiveness: 83,
              session_engagement: 87,
              goal_achievement_rate: 85,
              crisis_prevention: 81
            },
            therapeuticMemoryAnalysis: {
              previous_experience: false,
              memory_patterns: ['Mindfulness practice', 'Stress reduction', 'Balance seeking'],
              breakthrough_likelihood: 82,
              rapport_prediction: 86
            },
            culturalIntegration: {
              cultural_match: 88,
              family_dynamics_understanding: 84,
              communication_adaptation: 87
            }
          },
          {
            id: '3',
            name: 'Dr. Alex Rodriguez',
            title: 'Solution-Focused Therapist',
            description: 'Specializes in goal-oriented therapy with rapid results and practical solutions.',
            approach: 'Solution-Focused Brief Therapy',
            specialties: ['Goal Setting', 'Problem Solving', 'Personal Growth', 'Achievement'],
            communication_style: 'Results-oriented and encouraging',
            experience_level: 'Mid-level',
            color_scheme: 'from-flow-500 to-flow-600',
            icon: 'Target',
            aiCompatibility: {
              overall_score: 79,
              memory_alignment: 78,
              cultural_sensitivity: 75,
              communication_match: 83,
              goal_alignment: 94,
              crisis_handling: 72
            },
            predictedOutcomes: {
              therapy_effectiveness: 81,
              session_engagement: 84,
              goal_achievement_rate: 92,
              crisis_prevention: 74
            },
            therapeuticMemoryAnalysis: {
              previous_experience: false,
              memory_patterns: ['Achievement focus', 'Solution seeking', 'Goal orientation'],
              breakthrough_likelihood: 76,
              rapport_prediction: 82
            },
            culturalIntegration: {
              cultural_match: 77,
              family_dynamics_understanding: 73,
              communication_adaptation: 81
            }
          }
        ];

        // Simulate AI analysis of user's therapeutic needs
        const mockAiAnalysis = {
          primaryNeeds: ['Anxiety management', 'Cultural integration', 'Family dynamics'],
          communicationPreference: 'Direct but supportive',
          culturalConsiderations: ['Asian family expectations', 'Work-life balance'],
          therapeuticHistory: {
            previousSuccess: ['CBT techniques', 'Cultural exploration'],
            challenges: ['Mindfulness practices', 'Group settings'],
            breakthroughPatterns: ['Trust-based relationships', 'Cultural validation']
          },
          riskFactors: ['High stress environment', 'Cultural conflict'],
          protectiveFactors: ['Strong motivation', 'Family support', 'Self-awareness']
        };

        // Sort therapists by compatibility score
        const sortedTherapists = mockTherapists.sort((a, b) => 
          b.aiCompatibility.overall_score - a.aiCompatibility.overall_score
        );

        setTherapists(sortedTherapists);
        setAiAnalysis(mockAiAnalysis);
        
        // Auto-select the highest scoring therapist
        if (sortedTherapists.length > 0) {
          setSelectedTherapist(sortedTherapists[0].id);
          setCurrentTherapist(sortedTherapists[0]);
        }

      } catch (error) {
        console.error('Error loading enhanced therapist data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEnhancedTherapistData();
  }, [user]);

  const handleTherapistSelection = (therapistId: string) => {
    setSelectedTherapist(therapistId);
    const therapist = therapists.find(t => t.id === therapistId);
    setCurrentTherapist(therapist || null);
  };

  const confirmSelection = () => {
    if (selectedTherapist) {
      navigate('/therapy-chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-6xl">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="h-8 w-8 text-therapy-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI-Enhanced Therapist Matching</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI has analyzed your therapeutic history, cultural background, and personal goals 
            to find the perfect therapist match for your continued growth.
          </p>
        </div>

        {/* AI Analysis Summary */}
        {aiAnalysis && (
          <Card className="border-therapy-200 bg-therapy-50/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-therapy-600" />
                <span>AI Analysis Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Primary Therapeutic Needs</h4>
                  <div className="space-y-1">
                    {aiAnalysis.primaryNeeds.map((need: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1 mb-1">
                        {need}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cultural Considerations</h4>
                  <div className="space-y-1">
                    {aiAnalysis.culturalConsiderations.map((consideration: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {consideration}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Success Patterns</h4>
                  <div className="space-y-1">
                    {aiAnalysis.therapeuticHistory.previousSuccess.map((pattern: string, index: number) => (
                      <Badge key={index} className="bg-green-100 text-green-800 mr-1 mb-1">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Therapist Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {therapists.map((therapist, index) => (
            <Card 
              key={therapist.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedTherapist === therapist.id 
                  ? 'ring-2 ring-therapy-500 shadow-xl scale-105' 
                  : 'hover:shadow-lg hover:scale-102'
              } ${index === 0 ? 'border-therapy-300' : ''}`}
              onClick={() => handleTherapistSelection(therapist.id)}
            >
              {index === 0 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-therapy-600 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    Best Match
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${therapist.color_scheme} flex items-center justify-center text-white`}>
                      {therapist.icon === 'Brain' ? <Brain className="h-6 w-6" /> : 
                       therapist.icon === 'Heart' ? <Heart className="h-6 w-6" /> : 
                       <Target className="h-6 w-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">Dr. {therapist.name}</CardTitle>
                      <p className="text-sm text-gray-600">{therapist.title}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-therapy-600">
                        {therapist.aiCompatibility.overall_score}%
                      </span>
                    </div>
                    <Badge className="bg-therapy-100 text-therapy-700 text-xs">
                      AI Match
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{therapist.description}</p>
                
                {/* Compatibility Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    AI Compatibility Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="flex justify-between">
                        <span>Memory Alignment</span>
                        <span>{therapist.aiCompatibility.memory_alignment}%</span>
                      </div>
                      <Progress value={therapist.aiCompatibility.memory_alignment} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Cultural Match</span>
                        <span>{therapist.aiCompatibility.cultural_sensitivity}%</span>
                      </div>
                      <Progress value={therapist.aiCompatibility.cultural_sensitivity} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Communication</span>
                        <span>{therapist.aiCompatibility.communication_match}%</span>
                      </div>
                      <Progress value={therapist.aiCompatibility.communication_match} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Goal Alignment</span>
                        <span>{therapist.aiCompatibility.goal_alignment}%</span>
                      </div>
                      <Progress value={therapist.aiCompatibility.goal_alignment} className="h-1" />
                    </div>
                  </div>
                </div>

                {/* Predicted Outcomes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Predicted Therapeutic Outcomes
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span>Effectiveness: {therapist.predictedOutcomes.therapy_effectiveness}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-3 w-3 text-blue-500" />
                      <span>Engagement: {therapist.predictedOutcomes.session_engagement}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-3 w-3 text-purple-500" />
                      <span>Goal Success: {therapist.predictedOutcomes.goal_achievement_rate}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-orange-500" />
                      <span>Crisis Prevention: {therapist.predictedOutcomes.crisis_prevention}%</span>
                    </div>
                  </div>
                </div>

                {/* Therapeutic Memory Insights */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Memory-Based Insights
                  </h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Breakthrough Likelihood</span>
                      <span className="font-medium">{therapist.therapeuticMemoryAnalysis.breakthrough_likelihood}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rapport Prediction</span>
                      <span className="font-medium">{therapist.therapeuticMemoryAnalysis.rapport_prediction}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {therapist.therapeuticMemoryAnalysis.memory_patterns.slice(0, 2).map((pattern, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedTherapist === therapist.id && (
                  <div className="flex items-center space-x-2 text-therapy-600 bg-therapy-50 p-2 rounded">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Selected for Therapy</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analysis for Selected Therapist */}
        {currentTherapist && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis: Dr. {currentTherapist.name}</CardTitle>
              <p className="text-muted-foreground">
                Deep dive into why this therapist is an excellent match for your therapeutic journey
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compatibility" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                  <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                  <TabsTrigger value="memory">Memory Sync</TabsTrigger>
                  <TabsTrigger value="cultural">Cultural Fit</TabsTrigger>
                </TabsList>

                <TabsContent value="compatibility" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(currentTherapist.aiCompatibility).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-bold text-therapy-600">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="outcomes" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(currentTherapist.predictedOutcomes).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-bold text-harmony-600">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="memory" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Memory Pattern Analysis</h4>
                      <div className="space-y-2">
                        {currentTherapist.therapeuticMemoryAnalysis.memory_patterns.map((pattern, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-1">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Breakthrough Likelihood</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={currentTherapist.therapeuticMemoryAnalysis.breakthrough_likelihood} className="flex-1" />
                          <span className="font-medium">{currentTherapist.therapeuticMemoryAnalysis.breakthrough_likelihood}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rapport Prediction</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={currentTherapist.therapeuticMemoryAnalysis.rapport_prediction} className="flex-1" />
                          <span className="font-medium">{currentTherapist.therapeuticMemoryAnalysis.rapport_prediction}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cultural" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(currentTherapist.culturalIntegration).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-bold text-flow-600">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={confirmSelection}
            disabled={!selectedTherapist}
            size="lg"
            className="min-w-48 bg-therapy-600 hover:bg-therapy-700"
          >
            Start AI-Enhanced Therapy
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTherapistSelection;