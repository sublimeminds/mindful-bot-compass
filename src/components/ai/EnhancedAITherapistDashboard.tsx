import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Heart, Target, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTherapistMatchingService } from '@/services/enhancedTherapistMatchingService';
import { AITherapyPlanService } from '@/services/aiTherapyPlanService';
import { IntelligentAssignmentService } from '@/services/intelligentAssignmentService';
import { TherapeuticMemoryService } from '@/services/therapeuticMemoryService';
// import { CrisisDetectionService } from '@/services/crisisDetectionService';

interface DashboardState {
  therapistCompatibility: any;
  therapyPlan: any;
  assignments: any[];
  memoryInsights: any[];
  crisisAssessment: any;
  loading: boolean;
}

const EnhancedAITherapistDashboard = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState>({
    therapistCompatibility: null,
    therapyPlan: null,
    assignments: [],
    memoryInsights: [],
    crisisAssessment: null,
    loading: true
  });

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      // Load all AI-powered data
      const [
        compatibilityData,
        planData,
        assignmentsData,
        insightsData,
        crisisData
      ] = await Promise.all([
        loadTherapistCompatibility(),
        loadTherapyPlan(),
        loadCurrentAssignments(),
        loadMemoryInsights(),
        loadCrisisAssessment()
      ]);

      setState({
        therapistCompatibility: compatibilityData,
        therapyPlan: planData,
        assignments: assignmentsData,
        memoryInsights: insightsData,
        crisisAssessment: crisisData,
        loading: false
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const loadTherapistCompatibility = async () => {
    try {
      const { data: assessment } = await supabase
        .from('therapist_assessments')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (assessment) {
        // Handle compatibility_scores safely - it might be null or missing
        const compatibilityScores = assessment.compatibility_scores || {};
        
        return {
          selectedTherapist: assessment.selected_therapist_id,
          compatibilityScores,
          recommendations: assessment.recommended_therapists
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading therapist compatibility:', error);
      return null;
    }
  };

  const loadTherapyPlan = async () => {
    try {
      const { data: plan } = await supabase
        .from('therapy_plans')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .maybeSingle();

      return plan;
    } catch (error) {
      console.error('Error loading therapy plan:', error);
      return null;
    }
  };

  const loadCurrentAssignments = async () => {
    try {
      const { data: assignments } = await supabase
        .from('therapy_assignments')
        .select('*')
        .eq('user_id', user!.id)
        .is('completed_at', null)
        .order('due_date', { ascending: true })
        .limit(5);

      return assignments || [];
    } catch (error) {
      console.error('Error loading assignments:', error);
      return [];
    }
  };

  const loadMemoryInsights = async () => {
    try {
      if (user?.id) {
        const insights = await TherapeuticMemoryService.generateMemoryInsights(user.id);
        return insights.slice(0, 3); // Top 3 insights
      }
      return [];
    } catch (error) {
      console.error('Error loading memory insights:', error);
      return [];
    }
  };

  const loadCrisisAssessment = async () => {
    try {
      if (user?.id) {
        // For now, return null to avoid the complex crisis detection
        // In production, this would call: 
        // const assessment = await CrisisDetectionService.performCrisisAssessment(user.id);
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error loading crisis assessment:', error);
      return null;
    }
  };

  const generateNewAssignments = async () => {
    try {
      if (!user?.id || !state.therapyPlan) return;

      const assignments = await IntelligentAssignmentService.generateAdaptiveAssignments(
        user.id,
        state.therapyPlan.id,
        state.therapyPlan.current_phase,
        {} // User capabilities would be loaded here
      );

      setState(prev => ({
        ...prev,
        assignments: [...prev.assignments, ...assignments]
      }));
    } catch (error) {
      console.error('Error generating assignments:', error);
    }
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading AI Insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Crisis Alert */}
      {state.crisisAssessment && state.crisisAssessment.overall_risk_level !== 'low' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Elevated risk detected:</strong> {state.crisisAssessment.overall_risk_level} risk level. 
            {state.crisisAssessment.immediate_risk && " Immediate intervention may be needed."}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-therapy-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Therapy Dashboard</h1>
            <p className="text-gray-600">Personalized insights and recommendations</p>
          </div>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          Refresh Insights
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compatibility">Therapist Match</TabsTrigger>
          <TabsTrigger value="plan">Therapy Plan</TabsTrigger>
          <TabsTrigger value="assignments">Smart Assignments</TabsTrigger>
          <TabsTrigger value="insights">Memory Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Therapist Compatibility */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Therapist Match</CardTitle>
              </CardHeader>
              <CardContent>
                {state.therapistCompatibility?.compatibilityScores && Object.keys(state.therapistCompatibility.compatibilityScores).length > 0 ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-therapy-600">
                      {Math.round((Object.values(state.therapistCompatibility.compatibilityScores)[0] as number) * 100) || 85}%
                    </div>
                    <p className="text-xs text-gray-600">Compatibility Score</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-therapy-600">--</div>
                    <p className="text-xs text-gray-600">No assessment yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Therapy Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Therapy Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {state.therapyPlan ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-therapy-600">
                      {state.therapyPlan.progress_percentage}%
                    </div>
                    <p className="text-xs text-gray-600">{state.therapyPlan.current_phase}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No plan yet</p>
                )}
              </CardContent>
            </Card>

            {/* Active Assignments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-therapy-600">
                    {state.assignments.length}
                  </div>
                  <p className="text-xs text-gray-600">Pending Tasks</p>
                </div>
              </CardContent>
            </Card>

            {/* Insights Available */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">New Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-therapy-600">
                    {state.memoryInsights.length}
                  </div>
                  <p className="text-xs text-gray-600">Available</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={generateNewAssignments}
                  className="flex items-center space-x-2"
                >
                  <Target className="h-4 w-4" />
                  <span>Generate New Assignments</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/therapy-chat'}
                  className="flex items-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Start Therapy Session</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Therapist Compatibility Tab */}
        <TabsContent value="compatibility" className="space-y-6">
          {state.therapistCompatibility ? (
            <Card>
              <CardHeader>
                <CardTitle>AI Therapist Compatibility Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {state.therapistCompatibility.recommendations?.map((rec: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{rec.therapist?.name}</h4>
                          <Badge variant="secondary">
                            {Math.round(rec.compatibility_score * 100)}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.therapist?.title}</p>
                        <div className="space-y-1">
                          {rec.reasoning?.slice(0, 2).map((reason: string, i: number) => (
                            <p key={i} className="text-xs text-gray-500">• {reason}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Complete your assessment to see AI-powered therapist matches</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Therapy Plan Tab */}
        <TabsContent value="plan" className="space-y-6">
          {state.therapyPlan ? (
            <Card>
              <CardHeader>
                <CardTitle>{state.therapyPlan.title}</CardTitle>
                <p className="text-gray-600">{state.therapyPlan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-gray-600">{state.therapyPlan.progress_percentage}%</span>
                    </div>
                    <Progress value={state.therapyPlan.progress_percentage} className="h-2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Phase</h4>
                    <Badge variant="outline">{state.therapyPlan.current_phase}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Total Phases</h4>
                    <span className="text-gray-600">{state.therapyPlan.total_phases} phases planned</span>
                  </div>
                </div>

                {state.therapyPlan.goals && (
                  <div>
                    <h4 className="font-medium mb-2">Therapy Goals</h4>
                    <div className="space-y-2">
                      {state.therapyPlan.goals.slice(0, 3).map((goal: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{goal.title || goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your personalized therapy plan will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Smart Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Intelligent Assignments</h3>
            <Button onClick={generateNewAssignments} variant="outline" size="sm">
              Generate New
            </Button>
          </div>

          {state.assignments.length > 0 ? (
            <div className="space-y-4">
              {state.assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{assignment.estimated_duration_minutes} min</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {assignment.difficulty_level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {assignment.assignment_type}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button size="sm">
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No assignments yet. Generate your first AI-powered assignments!</p>
                <Button onClick={generateNewAssignments} className="mt-4">
                  Generate Assignments
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Memory Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {state.memoryInsights.length > 0 ? (
            <div className="space-y-4">
              {state.memoryInsights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {insight.type === 'pattern' && <TrendingUp className="h-5 w-5 text-blue-500" />}
                        {insight.type === 'progress' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {insight.type === 'concern' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        {insight.type === 'opportunity' && <Target className="h-5 w-5 text-purple-500" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(insight.confidence_score * 100)}% confidence
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        
                        {insight.actionable_suggestions && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Suggested Actions:</p>
                            {insight.actionable_suggestions.slice(0, 2).map((suggestion: string, i: number) => (
                              <p key={i} className="text-xs text-gray-500">• {suggestion}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">AI insights will appear here as you engage with therapy</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAITherapistDashboard;