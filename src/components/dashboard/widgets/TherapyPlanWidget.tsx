import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Assignment {
  id: string;
  title: string;
  type: 'exercise' | 'reflection' | 'reading' | 'practice';
  due_date: string;
  completed: boolean;
}

interface TherapyProgress {
  current_phase: string;
  progress_percentage: number;
  goals_completed: number;
  total_goals: number;
  weekly_streak: number;
}

const TherapyPlanWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [progress, setProgress] = useState<TherapyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTherapyPlanData();
    }
  }, [user]);

  const loadTherapyPlanData = async () => {
    if (!user) return;

    try {
      // Load current week's assignments (mock data for now)
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Daily Mood Check-in',
          type: 'reflection',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true
        },
        {
          id: '2',
          title: 'Breathing Exercise',
          type: 'practice',
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        },
        {
          id: '3',
          title: 'Cognitive Reframing',
          type: 'exercise',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        }
      ];
      setAssignments(mockAssignments);

      // Load therapy progress
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      const completedGoals = goals?.filter(g => g.is_completed).length || 0;
      const totalGoals = goals?.length || 0;

      // Mock progress data
      const mockProgress: TherapyProgress = {
        current_phase: 'Phase 2: Skill Building',
        progress_percentage: 45,
        goals_completed: completedGoals,
        total_goals: Math.max(totalGoals, 4),
        weekly_streak: 3
      };
      setProgress(mockProgress);

    } catch (error) {
      console.error('Error loading therapy plan data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'exercise': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reflection': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reading': return 'bg-green-100 text-green-800 border-green-200';
      case 'practice': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAssignmentIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '💪';
      case 'reflection': return '🤔';
      case 'reading': return '📚';
      case 'practice': return '🎯';
      default: return '📝';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingAssignments = assignments.filter(a => !a.completed);
  const completedAssignments = assignments.filter(a => a.completed);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-therapy-600" />
            <span>Therapy Plan</span>
          </div>
          {progress && (
            <Badge variant="outline" className="text-xs">
              {progress.current_phase}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        {progress && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-therapy-600 font-semibold">
                {progress.progress_percentage}%
              </span>
            </div>
            <Progress value={progress.progress_percentage} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-therapy-50 rounded">
                <div className="text-lg font-bold text-therapy-600">
                  {progress.goals_completed}
                </div>
                <div className="text-xs text-muted-foreground">Goals</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">
                  {completedAssignments.length}
                </div>
                <div className="text-xs text-muted-foreground">Done</div>
              </div>
              <div className="p-2 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">
                  {progress.weekly_streak}
                </div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Current Assignments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              This Week's Tasks
            </h4>
            <Badge variant="secondary" className="text-xs">
              {pendingAssignments.length} pending
            </Badge>
          </div>

          <div className="space-y-2">
            {assignments.slice(0, 3).map((assignment) => (
              <div
                key={assignment.id}
                className={`flex items-center gap-3 p-2 rounded-lg border ${
                  assignment.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {assignment.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{getAssignmentIcon(assignment.type)}</span>
                    <span className={`text-sm font-medium truncate ${
                      assignment.completed ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      {assignment.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getAssignmentTypeColor(assignment.type)}`}
                    >
                      {assignment.type}
                    </Badge>
                    
                    {!assignment.completed && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            onClick={() => navigate('/therapy-plan')}
            size="sm" 
            className="flex-1 gap-2"
          >
            <BookOpen className="h-3 w-3" />
            Full Plan
          </Button>
          
          <Button 
            onClick={() => navigate('/chat')}
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <TrendingUp className="h-3 w-3" />
            Session
          </Button>
        </div>

        {/* Quick Achievement */}
        {progress && progress.weekly_streak > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <Award className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-yellow-800">
                  {progress.weekly_streak} Day Streak! 🔥
                </p>
                <p className="text-xs text-yellow-700">
                  Keep up the great progress!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapyPlanWidget;