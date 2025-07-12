import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';

interface ProgressTrackerProps {
  therapyPlan: any;
  onProgressUpdate: () => void;
}

const ProgressTracker = ({ therapyPlan, onProgressUpdate }: ProgressTrackerProps) => {
  if (!therapyPlan) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Plan</h3>
          <p className="text-muted-foreground">
            Create a therapy plan to track your progress
          </p>
        </CardContent>
      </Card>
    );
  }

  const phases = [
    { name: 'Assessment', description: 'Initial evaluation and goal setting' },
    { name: 'Skill Building', description: 'Learning coping strategies and techniques' },
    { name: 'Integration', description: 'Applying skills in daily life' },
    { name: 'Maintenance', description: 'Sustaining progress and preventing relapse' }
  ];

  const currentPhaseIndex = phases.findIndex(phase => 
    phase.name.toLowerCase() === therapyPlan.current_phase.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completion Progress</span>
              <span className="text-sm text-muted-foreground">{therapyPlan.progress_percentage}%</span>
            </div>
            <Progress value={therapyPlan.progress_percentage} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{therapyPlan.sessions_per_week}</p>
                <p className="text-sm text-muted-foreground">Sessions per week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{therapyPlan.estimated_duration_weeks}</p>
                <p className="text-sm text-muted-foreground">Total weeks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Current Phase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{therapyPlan.current_phase}</h3>
              <Badge variant="default">Phase {currentPhaseIndex + 1} of {therapyPlan.total_phases}</Badge>
            </div>
            
            <div className="space-y-3">
              {phases.map((phase, index) => (
                <div key={phase.name} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  index === currentPhaseIndex ? 'bg-primary/10 border border-primary/20' :
                  index < currentPhaseIndex ? 'bg-green-50 border border-green-200' :
                  'bg-muted/50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentPhaseIndex ? 'bg-primary text-primary-foreground' :
                    index < currentPhaseIndex ? 'bg-green-500 text-white' :
                    'bg-muted'
                  }`}>
                    {index < currentPhaseIndex ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{phase.name}</p>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {therapyPlan.milestones && therapyPlan.milestones.length > 0 ? (
            <div className="space-y-4">
              {therapyPlan.milestones.map((milestone: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <Badge variant={milestone.progress >= 100 ? "default" : "secondary"}>
                      {milestone.progress >= 100 ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.progress || 0}%</span>
                    </div>
                    <Progress value={milestone.progress || 0} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No milestones set for this plan
            </p>
          )}
        </CardContent>
      </Card>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {therapyPlan.goals && therapyPlan.goals.length > 0 ? (
            <div className="space-y-4">
              {therapyPlan.goals.map((goal: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge variant={goal.progress >= 100 ? "default" : "secondary"}>
                      {goal.progress >= 100 ? "Achieved" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress || 0}%</span>
                    </div>
                    <Progress value={goal.progress || 0} className="h-2" />
                  </div>
                  {goal.targetDate && (
                    <div className="flex items-center mt-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No goals set for this plan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;