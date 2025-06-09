
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Target, 
  Plus, 
  Search, 
  Filter,
  Trophy,
  TrendingUp,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Goal, GoalService, GoalTemplate } from "@/services/goalService";
import GoalCard from "@/components/goals/GoalCard";
import GoalTemplates from "@/components/goals/GoalTemplates";
import GoalForm from "@/components/goals/GoalForm";
import GoalDetailsModal from "@/components/goals/GoalDetailsModal";

const Goals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [templates, setTemplates] = useState<GoalTemplate[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | undefined>();
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadGoals();
      loadTemplates();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    try {
      const userGoals = await GoalService.getGoals(user.id);
      const goalInsights = await GoalService.getGoalInsights(user.id);
      setGoals(userGoals);
      setInsights(goalInsights);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const loadTemplates = () => {
    const goalTemplates = GoalService.getGoalTemplates();
    setTemplates(goalTemplates);
  };

  const handleCreateGoal = async (goalData: any, milestones: any[]) => {
    if (!user) return;

    try {
      await GoalService.createGoal({ ...goalData, userId: user.id }, milestones);
      loadGoals();
      setShowForm(false);
      setSelectedTemplate(undefined);
      setEditingGoal(undefined);

      toast({
        title: "Goal Created",
        description: "Your new goal has been created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, progress: number) => {
    try {
      const updatedGoal = await GoalService.updateGoalProgress(goalId, progress);
      if (updatedGoal) {
        loadGoals();
        toast({
          title: "Progress Updated",
          description: `Goal progress updated to ${progress}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectTemplate = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('create');
    setShowForm(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setActiveTab('create');
    setShowForm(true);
  };

  const handleViewDetails = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleGoalUpdated = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    setSelectedGoal(updatedGoal);
    loadGoals(); // Refresh insights
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || goal.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && goal.isCompleted) ||
                         (statusFilter === 'active' && !goal.isCompleted) ||
                         (statusFilter === 'overdue' && !goal.isCompleted && new Date() > goal.targetDate);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
                Goal Setting & Progress
              </h1>
              <p className="text-muted-foreground">
                Set SMART goals and track your mental health progress
              </p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setSelectedTemplate(undefined);
              setEditingGoal(undefined);
              setActiveTab('create');
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>

        {/* Overview Stats */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-therapy-500" />
                  <div>
                    <p className="text-2xl font-bold">{insights.totalGoals}</p>
                    <p className="text-sm text-muted-foreground">Total Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{insights.completedGoals}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{insights.completedMilestones}</p>
                    <p className="text-sm text-muted-foreground">Milestones</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(insights.completionRate)}%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">My Goals</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="create">
              {showForm ? (editingGoal ? 'Edit Goal' : 'Create Goal') : 'Create Goal'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search goals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="habit-building">Habit Building</SelectItem>
                      <SelectItem value="therapy-specific">Therapy Specific</SelectItem>
                      <SelectItem value="personal-growth">Personal Growth</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Goals Grid */}
            {filteredGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdateProgress={handleUpdateProgress}
                    onEdit={handleEditGoal}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {goals.length === 0 ? 'No goals yet' : 'No goals match your filters'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {goals.length === 0 
                      ? 'Start setting goals to track your mental health progress'
                      : 'Try adjusting your search or filter criteria'
                    }
                  </p>
                  {goals.length === 0 && (
                    <Button onClick={() => setActiveTab('templates')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Goal
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <GoalTemplates
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            {showForm ? (
              <GoalForm
                template={selectedTemplate}
                existingGoal={editingGoal}
                onSubmit={handleCreateGoal}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedTemplate(undefined);
                  setEditingGoal(undefined);
                  setActiveTab('overview');
                }}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Create a New Goal</h3>
                  <p className="text-muted-foreground mb-4">
                    Start with a template or create a custom goal from scratch
                  </p>
                  <div className="space-x-4">
                    <Button onClick={() => setActiveTab('templates')}>
                      Browse Templates
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(true)}>
                      Create Custom Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Goal Details Modal */}
        <GoalDetailsModal
          goal={selectedGoal}
          isOpen={!!selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onEdit={handleEditGoal}
          onGoalUpdated={handleGoalUpdated}
        />
      </div>
    </div>
  );
};

export default Goals;
