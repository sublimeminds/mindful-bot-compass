import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const XPProgressBar = () => {
  const { userXP, getXPProgress, isLoading } = useGamification();

  if (isLoading || !userXP) {
    return (
      <div className="animate-pulse bg-therapy-50 rounded-lg p-4">
        <div className="h-4 bg-therapy-100 rounded mb-2"></div>
        <div className="h-2 bg-therapy-100 rounded"></div>
      </div>
    );
  }

  const progress = getXPProgress();

  return (
    <div className="bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg p-4 border border-therapy-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-therapy-600" />
          <span className="font-semibold text-therapy-900">Level {userXP.current_level}</span>
          <Badge variant="secondary" className="ml-2">
            <Zap className="h-3 w-3 mr-1" />
            {userXP.total_xp.toLocaleString()} XP
          </Badge>
        </div>
        <div className="text-sm text-therapy-600">
          {progress.current} / {progress.needed} XP
        </div>
      </div>
      
      <Progress 
        value={progress.percentage} 
        className="h-3"
      />
      
      <div className="flex justify-between text-xs text-therapy-600 mt-2">
        <span>Weekly: {userXP.weekly_xp} XP</span>
        <span>Monthly: {userXP.monthly_xp} XP</span>
      </div>
    </div>
  );
};

export default XPProgressBar;