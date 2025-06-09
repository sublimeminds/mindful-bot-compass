
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calendar, MessageSquare } from "lucide-react";

interface ProgressStatsProps {
  stats: {
    totalSessions: number;
    totalMessages: number;
    averageMoodImprovement: number;
    weeklyGoal: number;
    weeklyProgress: number;
    longestStreak: number;
  };
}

const ProgressStats = ({ stats }: ProgressStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            Therapy sessions completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">
            Total conversations
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mood Improvement</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageMoodImprovement > 0 ? '+' : ''}{stats.averageMoodImprovement.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average per session
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyProgress}/{stats.weeklyGoal}</div>
          <Progress 
            value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
            className="mt-2" 
          />
          <p className="text-xs text-muted-foreground mt-1">
            Sessions this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressStats;
