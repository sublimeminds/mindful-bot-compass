import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { Link } from 'react-router-dom';

const RecentAchievementsWidget = () => {
  const { userAchievements, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Card className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-therapy-100 rounded"></div>
            <div className="h-3 bg-therapy-100 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentAchievements = userAchievements?.slice(0, 3) || [];

  return (
    <Card className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-therapy-700 flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Recent Achievements
          </div>
          <Badge variant="secondary" className="text-xs">
            {userAchievements?.length || 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {recentAchievements.length > 0 ? (
            <>
              <div className="space-y-2">
                {recentAchievements.map((achievement, index) => (
                  <div key={achievement.id} className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      <Star className="h-3 w-3 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-therapy-700 truncate">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{achievement.xp_reward} XP
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs capitalize"
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                ))}
              </div>

              <Link 
                to="/gamification-dashboard"
                className="block w-full mt-3"
              >
                <div className="text-xs text-therapy-600 hover:text-therapy-700 transition-colors text-center py-1 border border-therapy-200 rounded-md hover:border-therapy-300">
                  <ArrowRight className="h-3 w-3 inline mr-1" />
                  View All Achievements
                </div>
              </Link>
            </>
          ) : (
            <div className="text-center text-xs text-muted-foreground py-4">
              Complete your first activity to earn achievements!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAchievementsWidget;