import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [activeGoals, setActiveGoals] = useState<any[]>([]);
  const [completedGoals, setCompletedGoals] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', target_value: 10 });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      setGoals(data || []);
      setActiveGoals(data?.filter(g => !g.is_completed) || []);
      setCompletedGoals(data?.filter(g => g.is_completed) || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const createGoal = async () => {
    if (!newGoal.title.trim() || !user) return;

    try {
      await supabase.from('goals').insert({
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description,
        target_value: newGoal.target_value,
        current_progress: 0,
        category: 'therapy',
        target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'personal'
      });

      setNewGoal({ title: '', description: '', target_value: 10 });
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    try {
      await supabase
        .from('goals')
        .update({ current_progress: currentValue })
        .eq('id', goalId);
      fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const overallProgress = goals.length > 0 
    ? (completedGoals.length / goals.length) * 100 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals & Milestones</h1>
          <p className="text-gray-600 mt-1">Track your therapy goals and celebrate achievements</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Practice mindfulness daily"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe your goal and how you'll achieve it"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Target Value</label>
                <Input
                  type="number"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={createGoal} className="w-full">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedGoals.length} of {goals.length} goals completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">Goals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Goals worked on</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
          <TabsTrigger value="templates">Goal Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeGoals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{goal.title}</h3>
                        <p className="text-sm text-gray-500">{goal.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => updateGoalProgress(goal.id, goal.current_progress + 1)}
                      >
                        Update Progress
                      </Button>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{goal.current_progress}/{goal.target_value}</span>
                      </div>
                      <Progress value={(goal.current_progress / goal.target_value) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{goal.title}</h3>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full mt-2 inline-block">
                        Completed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Daily Mindfulness', description: 'Practice mindfulness for 10 minutes daily' },
              { title: 'Mood Tracking', description: 'Log your mood twice daily for better awareness' },
              { title: 'Gratitude Practice', description: 'Write 3 things you\'re grateful for each day' },
              { title: 'Social Connection', description: 'Reach out to a friend or family member weekly' }
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-medium">{template.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  <Button size="sm" className="mt-3">Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;