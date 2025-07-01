import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Zap, Target, TrendingUp, Calendar } from 'lucide-react';
import { GoalAchievement } from '@/hooks/useGoalAchievements';
import { cn } from '@/lib/utils';

interface GoalAchievementsProps {
  achievements: GoalAchievement[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Star,
  Zap,
  Target,
  TrendingUp,
};

const GoalAchievements = ({ achievements }: GoalAchievementsProps) => {
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.pointsEarned, 0);
  
  const achievementsByType = achievements.reduce((acc, achievement) => {
    const type = achievement.achievement_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(achievement);
    return acc;
  }, {} as Record<string, GoalAchievement[]>);

  const getAchievementTypeColor = (type: string) => {
    switch (type) {
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'completion': return 'bg-green-100 text-green-800';
      case 'milestone': return 'bg-blue-100 text-blue-800';
      case 'improvement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Complete goals, build streaks, and reach milestones to unlock achievements and earn points!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{achievements.length}</p>
                <p className="text-sm opacity-90">Total Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm opacity-90">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{achievementsByType.completion?.length || 0}</p>
                <p className="text-sm opacity-90">Goals Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{achievementsByType.streak?.length || 0}</p>
                <p className="text-sm opacity-90">Streak Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement) => {
              const IconComponent = iconMap[achievement.icon] || Award;
              
              return (
                <div
                  key={achievement.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <IconComponent className="h-5 w-5 text-yellow-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{achievement.title}</h4>
                        {achievement.pointsEarned > 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs ml-2">
                            +{achievement.pointsEarned} pts
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={cn("text-xs", getAchievementTypeColor(achievement.achievement_type))}
                        >
                          {achievement.achievement_type}
                        </Badge>
                        
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(achievement.unlocked_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {achievements.length > 6 && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Showing 6 of {achievements.length} achievements
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      {Object.keys(achievementsByType).length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Achievement Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(achievementsByType).map(([type, typeAchievements]) => (
                <div key={type} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-therapy-600 mb-1">
                    {typeAchievements.length}
                  </div>
                  <Badge className={cn("text-xs", getAchievementTypeColor(type))}>
                    {type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalAchievements;