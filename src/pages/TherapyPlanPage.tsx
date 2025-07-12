import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Target, TrendingUp, Clock, User } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TherapyPlanCreationWizard from '@/components/therapy/TherapyPlanCreationWizard';
import SessionScheduler from '@/components/scheduling/SessionScheduler';
import ProgressTracker from '@/components/therapy/ProgressTracker';

interface TherapyPlan {
  id: string;
  title: string;
  description: string;
  focus_areas: string[];
  current_phase: string;
  total_phases: number;
  progress_percentage: number;
  goals: any[];
  milestones: any[];
  sessions_per_week: number;
  estimated_duration_weeks: number;
  therapist_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ScheduledSession {
  id: string;
  scheduled_for: string;
  therapist_id: string;
  session_type: string;
  duration_minutes: number;
  status: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
}

const TherapyPlanPage = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [therapyPlans, setTherapyPlans] = useState<TherapyPlan[]>([]);
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([]);
  const [activeTab, setActiveTab] = useState('plans');
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTherapyPlans();
      loadScheduledSessions();
    }
  }, [user]);

  const loadTherapyPlans = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('therapy_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTherapyPlans(data || []);
    } catch (error) {
      console.error('Error loading therapy plans:', error);
      toast({
        title: "Error",
        description: "Failed to load therapy plans.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadScheduledSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('scheduled_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(10);

      if (error) throw error;
      setScheduledSessions(data || []);
    } catch (error) {
      console.error('Error loading scheduled sessions:', error);
    }
  };

  const handlePlanCreated = async (planData: any) => {
    setShowCreationWizard(false);
    await loadTherapyPlans();
    toast({
      title: "Success",
      description: "Therapy plan created successfully!",
    });
  };

  const activePlan = therapyPlans.find(plan => plan.is_active);
  const upcomingSession = scheduledSessions[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Therapy Plans</h1>
          <p className="text-muted-foreground">Manage your personalized therapy journey</p>
        </div>
        <Button 
          onClick={() => setShowCreationWizard(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Active Plan Overview */}
      {activePlan && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{activePlan.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{activePlan.description}</p>
              </div>
              <Badge variant="default">Active Plan</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress
                </div>
                <Progress value={activePlan.progress_percentage} className="h-2" />
                <p className="text-sm font-medium">{activePlan.progress_percentage}% Complete</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Target className="h-4 w-4 mr-2" />
                  Current Phase
                </div>
                <Badge variant="outline">{activePlan.current_phase}</Badge>
                <p className="text-sm">Phase {Math.floor(activePlan.progress_percentage / (100 / activePlan.total_phases)) + 1} of {activePlan.total_phases}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Therapist
                </div>
                <p className="font-medium">{activePlan.therapist_id}</p>
                <p className="text-sm text-muted-foreground">{activePlan.sessions_per_week} sessions/week</p>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Focus Areas:</p>
              <div className="flex flex-wrap gap-2">
                {activePlan.focus_areas.map((area, index) => (
                  <Badge key={index} variant="secondary">{area}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Session */}
      {upcomingSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Next Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{upcomingSession.session_type} Session</p>
                <p className="text-sm text-muted-foreground">
                  with {upcomingSession.therapist_id}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(upcomingSession.scheduled_for).toLocaleString()}
                  <span className="ml-2">({upcomingSession.duration_minutes} min)</span>
                </div>
              </div>
              <Button onClick={() => navigate('/quick-chat')}>
                Join Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {therapyPlans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Therapy Plans Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first therapy plan to start your personalized journey
                </p>
                <Button onClick={() => setShowCreationWizard(true)}>
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {therapyPlans.map((plan) => (
                <Card key={plan.id} className={plan.is_active ? 'border-primary/50' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {plan.is_active && <Badge>Active</Badge>}
                        <Badge variant="outline">{plan.current_phase}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={plan.progress_percentage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>{plan.progress_percentage}% Complete</span>
                        <span>{plan.sessions_per_week} sessions/week</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.focus_areas.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <SessionScheduler 
            userId={user?.id || ''}
            therapyPlanId={activePlan?.id}
            onSessionScheduled={loadScheduledSessions}
          />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTracker 
            therapyPlan={activePlan}
            onProgressUpdate={loadTherapyPlans}
          />
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Therapy Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {activePlan?.goals && activePlan.goals.length > 0 ? (
                <div className="space-y-4">
                  {activePlan.goals.map((goal: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                      <Progress value={goal.progress || 0} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No goals set for current plan</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showCreationWizard && (
        <TherapyPlanCreationWizard
          userId={user?.id || ''}
          onPlanCreated={handlePlanCreated}
          onCancel={() => setShowCreationWizard(false)}
        />
      )}
    </div>
  );
};

export default TherapyPlanPage;