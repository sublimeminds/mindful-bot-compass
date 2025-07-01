
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { useUserGoals } from '@/hooks/useUserGoals';
import CreateGoalDialog from './CreateGoalDialog';
import GoalCard from './GoalCard';

const GoalTracker = () => {
  const { data: goals = [], isLoading, error } = useUserGoals();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading goals. Please try again.</p>
      </div>
    );
  }

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.currentValue / goal.targetValue) * 100, 0) / goals.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
                <p className="text-sm opacity-90">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-harmony-500 to-balance-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
                <p className="text-sm opacity-90">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-flow-500 to-therapy-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{totalProgress}%</p>
                <p className="text-sm opacity-90">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-calm-500 to-harmony-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{goals.length}</p>
                <p className="text-sm opacity-90">Total Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Goal
        </Button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
            <p className="text-gray-600 mb-4">
              Start your journey by creating your first goal. Set targets for mental wellness, 
              personal growth, or any area you'd like to improve.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {/* Create Goal Dialog */}
      <CreateGoalDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
};

export default GoalTracker;
