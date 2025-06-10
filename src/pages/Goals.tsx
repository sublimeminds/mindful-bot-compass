
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Target, TrendingUp, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { GoalService, Goal, GoalTemplate } from "@/services/goalService";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import GoalTemplates from "@/components/goals/GoalTemplates";
import GoalDetailsModal from "@/components/goals/GoalDetailsModal";
import { useToast } from "@/hooks/use-toast";

const Goals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { data: goals = [], isLoading, refetch } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => user ? GoalService.getGoals(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: insights } = useQuery({
    queryKey: ['goal-insights', user?.id],
    queryFn: () => user ? GoalService.getGoalInsights(user.id) : null,
    enabled: !!user?.id,
  });

  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailsOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleCreateFromTemplate = async (template: GoalTemplate, customizations: any) => {
    if (!user) return;

    try {
      await GoalService.createGoalFromTemplate(template.id, user.id, customizations);
      refetch();
      toast({
        title: "Goal Created",
        description: `Your goal "${template.title}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, progress: number, note?: string) => {
    try {
      await GoalService.updateGoalProgress(goalId, progress, note);
      refetch();
      toast({
        title: "Progress Updated",
        description: "Your goal progress has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">Loading your goals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Target className="h-6 w-6 mr-2" />
                My Goals
              </h1>
              <p className="text-muted-foreground">
                Track your progress and achieve your therapy objectives
              </p>
            </div>
          </div>
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>

        {/* Quick Stats */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Total Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insights.totalGoals}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{insights.completedGoals}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(insights.completionRate)}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insights.completedMilestones}/{insights.totalMilestones}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
            <TabsTrigger value="templates">Goal Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={() => handleGoalClick(goal)}
                    onEdit={() => handleEditGoal(goal)}
                    onUpdateProgress={handleUpdateProgress}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active goals</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating your first goal or choosing from our templates.
                  </p>
                  <Button onClick={() => setActiveTab('templates')}>
                    Browse Templates
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={() => handleGoalClick(goal)}
                    onEdit={() => handleEditGoal(goal)}
                    onUpdateProgress={handleUpdateProgress}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No completed goals yet</h3>
                  <p className="text-muted-foreground">
                    Keep working on your active goals to see them here when completed.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <GoalTemplates onCreateFromTemplate={handleCreateFromTemplate} />
          </TabsContent>
        </Tabs>

        {/* Goal Details Modal */}
        <GoalDetailsModal
          goal={selectedGoal}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedGoal(null);
          }}
          onUpdateProgress={handleUpdateProgress}
        />

        {/* Goal Form Modal */}
        <GoalForm
          goal={editingGoal}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGoal(null);
          }}
          onSuccess={() => {
            refetch();
            setIsFormOpen(false);
            setEditingGoal(null);
          }}
        />
      </div>
    </div>
  );
};

export default Goals;
