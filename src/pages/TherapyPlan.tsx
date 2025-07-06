import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  User,
  BookOpen,
  Award,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TherapyPlan {
  id: string;
  title: string;
  description: string;
  therapist_id: string;
  goals: any; // JSON type from database
  current_phase: string;
  total_phases: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  assignment_type: string; // Updated to match database
  due_date: string;
  completed: boolean;
  completed_at?: string;
}

interface SessionHistory {
  id: string;
  start_time: string;
  end_time?: string;
  effectiveness_score?: number;
  key_insights: string[];
  therapist_notes?: string;
}

const TherapyPlan = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [therapyPlan, setTherapyPlan] = useState<TherapyPlan | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [currentTherapist, setCurrentTherapist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      loadTherapyData();
    }
  }, [user, loading, navigate]);

  const loadTherapyData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load current therapist
      const { data: therapistData } = await supabase
        .from('therapeutic_relationship')
        .select(`
          *,
          therapist_personalities (*)
        `)
        .eq('user_id', user.id)
        .single();

      if (therapistData) {
        setCurrentTherapist(therapistData.therapist_personalities);
      }

      // Load therapy plan from database
      const { data: planData } = await supabase
        .from('therapy_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (planData) {
        setTherapyPlan(planData);
      }

      let currentPlan = planData;
      if (!currentPlan) {
        // Create a default therapy plan if none exists
        const { data: newPlan } = await supabase
          .from('therapy_plans')
          .insert([{
            user_id: user.id,
            therapist_id: therapistData?.therapist_id || '1',
            title: 'Personalized Therapy Plan',
            description: 'A comprehensive therapy plan tailored to your specific needs and goals.',
            goals: [
              'Improve emotional well-being',
              'Develop healthy coping strategies',
              'Build resilience and self-awareness',
              'Enhance communication skills'
            ]
          }])
          .select()
          .single();
        
        if (newPlan) {
          setTherapyPlan(newPlan);
          currentPlan = newPlan;
        }
      }

      // Load assignments from database
      const { data: assignmentData } = await supabase
        .from('therapy_assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (assignmentData && assignmentData.length > 0) {
        setAssignments(assignmentData);
      } else {
        // Create default assignments if none exist
        const defaultAssignments = [
          {
            user_id: user.id,
            therapy_plan_id: currentPlan?.id,
            title: 'Daily Mindfulness Practice',
            description: 'Practice 10 minutes of mindfulness meditation each day',
            assignment_type: 'practice',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            user_id: user.id,
            therapy_plan_id: currentPlan?.id,
            title: 'Mood Journal',
            description: 'Track your daily mood and note any patterns or triggers',
            assignment_type: 'reflection',
            due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];

        const { data: createdAssignments } = await supabase
          .from('therapy_assignments')
          .insert(defaultAssignments)
          .select();
        
        if (createdAssignments) {
          setAssignments(createdAssignments);
        }
      }

      // Load session history
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(10);

      if (sessions) {
        setSessionHistory(sessions.map(session => ({
          id: session.id,
          start_time: session.start_time,
          end_time: session.end_time,
          effectiveness_score: Math.floor(Math.random() * 40) + 60, // Mock data
          key_insights: [
            'Improved focus during morning sessions',
            'Stress levels decreased with breathing exercises'
          ],
          therapist_notes: 'Good progress on attention management techniques'
        })));
      }

    } catch (error) {
      console.error('Error loading therapy data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load your therapy plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('therapy_assignments')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', assignmentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, completed: true, completed_at: new Date().toISOString() }
          : assignment
      ));
      
      toast({
        title: "Assignment Completed!",
        description: "Great job! Your progress has been recorded.",
      });
    } catch (error) {
      console.error('Error completing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to complete assignment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading || isLoading) {
    return (
      <BulletproofDashboardLayout>
        <div className="p-6 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </BulletproofDashboardLayout>
    );
  }

  return (
    <BulletproofDashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Therapy Plan</h1>
            <p className="text-gray-600 mt-1">
              Track your progress and manage your therapeutic journey
            </p>
          </div>
          {currentTherapist && (
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <User className="h-8 w-8 text-therapy-600" />
                <div>
                  <p className="font-semibold">Dr. {currentTherapist.name}</p>
                  <p className="text-sm text-gray-600">{currentTherapist.approach}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current Plan Overview */}
        {therapyPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {therapyPlan.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{therapyPlan.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Current Phase</p>
                  <Badge variant="secondary">{therapyPlan.current_phase}</Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Overall Progress</p>
                  <div className="space-y-1">
                    <Progress value={therapyPlan.progress_percentage} className="h-2" />
                    <p className="text-sm text-gray-600">{therapyPlan.progress_percentage}% Complete</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Goals</p>
                  <p className="text-sm text-gray-600">
                    {Array.isArray(therapyPlan.goals) ? therapyPlan.goals.length : 0} Active Goals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <Badge variant={
                          assignment.assignment_type === 'exercise' ? 'default' :
                          assignment.assignment_type === 'reflection' ? 'secondary' :
                          assignment.assignment_type === 'reading' ? 'outline' : 'destructive'
                        }>
                          {assignment.assignment_type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{assignment.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {assignment.completed ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm">Completed</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => completeAssignment(assignment.id)}
                          size="sm"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Therapy Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(therapyPlan?.goals) ? therapyPlan.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                    <div className="w-8 h-8 rounded-full bg-therapy-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-therapy-600">{index + 1}</span>
                    </div>
                    <span className="flex-1">{goal}</span>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                )) : (
                  <p className="text-gray-500">No goals set</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessionHistory.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">
                        {new Date(session.start_time).toLocaleDateString()}
                      </p>
                      {session.effectiveness_score && (
                        <Badge variant={session.effectiveness_score > 80 ? 'default' : 'secondary'}>
                          {session.effectiveness_score}% Effective
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {session.key_insights.map((insight, index) => (
                        <p key={index}>• {insight}</p>
                      ))}
                      {session.therapist_notes && (
                        <p className="italic">Note: {session.therapist_notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Assignments Completed</span>
                        <span>2/4</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Session Attendance</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Week Streak</p>
                        <p className="text-xs text-gray-600">Completed 7 days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        ✅
                      </div>
                      <div>
                        <p className="font-semibold text-sm">First Assignment</p>
                        <p className="text-xs text-gray-600">Completed first task</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BulletproofDashboardLayout>
  );
};

export default TherapyPlan;