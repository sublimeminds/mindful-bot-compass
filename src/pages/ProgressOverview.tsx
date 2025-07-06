import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  TrendingUp, 
  Award, 
  Target,
  Heart,
  Brain,
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
  BarChart3,
  Users,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProgressOverviewData {
  id: string;
  overview_type: string;
  period_start: string;
  period_end: string;
  summary_data: any;
  insights: any; // JSON type from database
  recommendations: any; // JSON type from database
  mood_trend: number;
  session_count: number;
  goals_completed: number;
  assignments_completed: number;
}

const ProgressOverview = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [overviewData, setOverviewData] = useState<ProgressOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      generateOverview();
    }
  }, [user, loading, navigate]);

  const generateOverview = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if we have an overview for this month
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      let { data: existingOverview } = await supabase
        .from('progress_overviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('overview_type', 'monthly')
        .gte('period_start', monthStart.toISOString().split('T')[0])
        .lte('period_end', monthEnd.toISOString().split('T')[0])
        .single();

      if (!existingOverview) {
        // Generate new overview data
        const [sessionsResponse, goalsResponse, moodResponse, assignmentsResponse] = await Promise.all([
          supabase.from('therapy_sessions').select('*').eq('user_id', user.id).gte('start_time', monthStart.toISOString()),
          supabase.from('goals').select('*').eq('user_id', user.id).gte('updated_at', monthStart.toISOString()),
          supabase.from('mood_entries').select('overall').eq('user_id', user.id).gte('created_at', monthStart.toISOString()),
          supabase.from('therapy_assignments').select('*').eq('user_id', user.id).eq('completed', true).gte('completed_at', monthStart.toISOString())
        ]);

        const sessions = sessionsResponse.data || [];
        const goals = goalsResponse.data || [];
        const moods = moodResponse.data || [];
        const assignments = assignmentsResponse.data || [];

        const avgMood = moods.length > 0 ? moods.reduce((acc, mood) => acc + mood.overall, 0) / moods.length : 0;
        
        const insights = [
          sessions.length > 4 ? "You've been consistently attending therapy sessions!" : "Try to maintain regular therapy sessions for better progress.",
          avgMood > 7 ? "Your mood has been trending positively this month!" : "Consider focusing on mood-boosting activities.",
          goals.length > 2 ? "Excellent goal achievement this month!" : "Set more achievable goals to build momentum."
        ];

        const recommendations = [
          "Continue your current therapy routine",
          "Consider setting 2-3 new goals for next month",
          "Practice daily mindfulness for 10 minutes",
          "Schedule regular check-ins with your therapist"
        ];

        // Create the overview
        const { data: newOverview } = await supabase
          .from('progress_overviews')
          .insert([{
            user_id: user.id,
            overview_type: 'monthly',
            period_start: monthStart.toISOString().split('T')[0],
            period_end: monthEnd.toISOString().split('T')[0],
            summary_data: {
              totalMinutes: sessions.reduce((acc: number, s: any) => acc + 50, 0), // Default 50 min sessions
              averageEffectiveness: 85,
              topAchievements: goals.slice(0, 3).map((g: any) => g.title || 'Goal')
            },
            insights,
            recommendations,
            mood_trend: avgMood,
            session_count: sessions.length,
            goals_completed: goals.length,
            assignments_completed: assignments.length
          }])
          .select()
          .single();

        setOverviewData(newOverview);
      } else {
        setOverviewData(existingOverview);
      }
    } catch (error) {
      console.error('Error generating overview:', error);
      toast({
        title: "Error",
        description: "Failed to generate your progress overview.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progressSteps = [
    {
      title: "Your Therapy Journey",
      icon: <Brain className="h-12 w-12 text-therapy-600" />,
      content: "Let's take a look at your mental health progress this month"
    },
    {
      title: "Sessions Completed",
      icon: <Calendar className="h-12 w-12 text-blue-600" />,
      content: `You attended ${overviewData?.session_count || 0} therapy sessions`
    },
    {
      title: "Goals Achieved",
      icon: <Target className="h-12 w-12 text-green-600" />,
      content: `${overviewData?.goals_completed || 0} goals completed this month`
    },
    {
      title: "Mood Trends",
      icon: <Heart className="h-12 w-12 text-pink-600" />,
      content: `Average mood: ${overviewData?.mood_trend?.toFixed(1) || 'N/A'}/10`
    },
    {
      title: "Assignments Done",
      icon: <CheckCircle className="h-12 w-12 text-purple-600" />,
      content: `${overviewData?.assignments_completed || 0} therapeutic assignments completed`
    }
  ];

  const nextStep = () => {
    if (currentStep < progressSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  if (loading || isLoading) {
    return (
      <BulletproofDashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
            <p className="text-therapy-600 font-medium">Generating Your Progress Overview...</p>
          </div>
        </div>
      </BulletproofDashboardLayout>
    );
  }

  if (showSummary) {
    return (
      <BulletproofDashboardLayout>
        <div className="p-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Mental Health Journey</h1>
            <p className="text-gray-600">Here's your comprehensive progress summary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Sessions</h3>
              <p className="text-2xl font-bold text-blue-600">{overviewData?.session_count || 0}</p>
            </Card>
            <Card className="text-center p-6">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Goals</h3>
              <p className="text-2xl font-bold text-green-600">{overviewData?.goals_completed || 0}</p>
            </Card>
            <Card className="text-center p-6">
              <Heart className="h-8 w-8 mx-auto mb-2 text-pink-600" />
              <h3 className="font-semibold">Avg Mood</h3>
              <p className="text-2xl font-bold text-pink-600">{overviewData?.mood_trend?.toFixed(1) || 'N/A'}</p>
            </Card>
            <Card className="text-center p-6">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Tasks</h3>
              <p className="text-2xl font-bold text-purple-600">{overviewData?.assignments_completed || 0}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.isArray(overviewData?.insights) ? overviewData.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">No insights available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.isArray(overviewData?.recommendations) ? overviewData.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-therapy-600 mt-1 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">No recommendations available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-6">
            <Button onClick={() => navigate('/dashboard')} size="lg">
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </BulletproofDashboardLayout>
    );
  }

  const currentStepData = progressSteps[currentStep];

  return (
    <BulletproofDashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <Card className="w-full max-w-md text-center p-8">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 text-lg">
              {currentStepData.content}
            </p>
          </div>

          <div className="mb-6">
            <Progress value={(currentStep + 1) / progressSteps.length * 100} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              {currentStep + 1} of {progressSteps.length}
            </p>
          </div>

          <Button onClick={nextStep} size="lg" className="w-full">
            {currentStep < progressSteps.length - 1 ? 'Continue' : 'View Summary'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </BulletproofDashboardLayout>
  );
};

export default ProgressOverview;