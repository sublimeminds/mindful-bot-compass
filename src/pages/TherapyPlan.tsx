import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Target, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TherapyPlan = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchTherapyPlan();
      fetchGoals();
    }
  }, [user]);

  const fetchTherapyPlan = async () => {
    try {
      const { data } = await supabase
        .from('therapy_plans')
        .select('id, title, description, duration_weeks, focus_areas, therapeutic_approaches')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();
      
      setCurrentPlan(data);
    } catch (error) {
      console.error('Error fetching therapy plan:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      setGoals(data || []);
      
      // Calculate progress
      const completedGoals = data?.filter(goal => goal.is_completed).length || 0;
      const totalGoals = data?.length || 0;
      setProgress(totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Therapy Plan</h1>
          <p className="text-gray-600 mt-1">Personalized treatment roadmap and progress tracking</p>
        </div>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            <Progress value={progress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {goals.filter(g => g.status === 'completed').length} of {goals.length} goals completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Duration</CardTitle>
            <Clock className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentPlan ? `${currentPlan.duration_weeks} weeks` : 'Custom'}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated completion time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.filter(g => g.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Goals in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Plan Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals & Milestones</TabsTrigger>
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {currentPlan ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{currentPlan.title}</h3>
                    <p className="text-gray-600">{currentPlan.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Focus Areas</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentPlan.focus_areas?.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-therapy-100 text-therapy-700 rounded-full text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Techniques</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentPlan.therapeutic_approaches?.map((technique, index) => (
                          <span key={index} className="px-2 py-1 bg-calm-100 text-calm-700 rounded-full text-xs">
                            {technique}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Plan</h3>
                  <p className="text-gray-500 mb-4">Let's create a personalized therapy plan for you</p>
                  <Button>Create Therapy Plan</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        goal.status === 'completed' ? 'bg-green-500' : 
                        goal.status === 'active' ? 'bg-therapy-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-gray-500">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {goal.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                        goal.status === 'active' ? 'bg-therapy-100 text-therapy-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={(goal.current_value / goal.target_value) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Progress</span>
                      <span>{goal.current_value}/{goal.target_value}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="techniques">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['CBT', 'Mindfulness', 'DBT', 'ACT'].map((technique) => (
                  <div key={technique} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{technique}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Effective technique for your specific goals
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Session Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Regular sessions help maintain consistent progress toward your goals.
                </p>
                <Button>Schedule Next Session</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapyPlan;