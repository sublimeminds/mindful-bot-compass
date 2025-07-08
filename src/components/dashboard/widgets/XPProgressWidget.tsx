import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Zap, Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { Link } from 'react-router-dom';

const XPProgressWidget = () => {
  const { userXP, getXPProgress, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-therapy-100 rounded mb-2"></div>
            <div className="h-2 bg-therapy-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userXP) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-therapy-700 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-center text-sm text-muted-foreground">
            Start your journey to earn XP!
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = getXPProgress();

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-therapy-700 flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Level {userXP.current_level}
          </div>
          <Badge variant="secondary" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            {userXP.total_xp} XP
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <Progress 
            value={progress.percentage} 
            className="h-2"
          />
          
          <div className="flex justify-between text-xs text-therapy-600">
            <span>{progress.current} / {progress.needed} XP</span>
            <span>{Math.round(progress.percentage)}%</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-therapy-700">{userXP.weekly_xp}</div>
              <div className="text-muted-foreground">This Week</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-therapy-700">{userXP.monthly_xp}</div>
              <div className="text-muted-foreground">This Month</div>
            </div>
          </div>

          <Link 
            to="/gamification-dashboard"
            className="block w-full mt-3"
          >
            <div className="text-xs text-therapy-600 hover:text-therapy-700 transition-colors text-center py-1 border border-therapy-200 rounded-md hover:border-therapy-300">
              <Trophy className="h-3 w-3 inline mr-1" />
              View Progress
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default XPProgressWidget;