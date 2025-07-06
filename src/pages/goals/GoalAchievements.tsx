import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const GoalAchievements = () => {
  const achievements = [
    {
      id: 1,
      title: "Mindfulness Master",
      description: "Completed 30 consecutive days of mindfulness practice",
      dateAchieved: "2024-01-10",
      category: "Mindfulness",
      points: 500,
      rarity: "Gold"
    },
    {
      id: 2,
      title: "Consistency Champion",
      description: "Maintained weekly therapy sessions for 3 months",
      dateAchieved: "2024-01-05",
      category: "Consistency",
      points: 300,
      rarity: "Silver"
    },
    {
      id: 3,
      title: "Goal Crusher",
      description: "Achieved 5 personal goals in a single month",
      dateAchieved: "2023-12-28",
      category: "Achievement",
      points: 750,
      rarity: "Platinum"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Platinum':
        return 'bg-purple-100 text-purple-800';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Silver':
        return 'bg-gray-100 text-gray-800';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Goal Achievements</h1>
          <p className="text-muted-foreground">Celebrate your progress and milestones</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          Achievement System
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">12</p>
            <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">2,350</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">Level 7</p>
            <p className="text-sm text-muted-foreground">Current Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">45</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{achievement.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getRarityColor(achievement.rarity)}>
                    {achievement.rarity}
                  </Badge>
                  <Badge variant="outline">{achievement.category}</Badge>
                  <Badge variant="outline" className="text-therapy-600">
                    {achievement.points} pts
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{achievement.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-therapy-500" />
                  <span className="text-sm">Achieved on {achievement.dateAchieved}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Share Achievement
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Target className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
              <p className="font-medium">Perfect Week</p>
              <p className="text-sm text-muted-foreground">Complete all weekly goals</p>
              <p className="text-xs text-therapy-600">Progress: 5/7 days</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
              <p className="font-medium">Rising Star</p>
              <p className="text-sm text-muted-foreground">Reach Level 10</p>
              <p className="text-xs text-calm-600">Progress: Level 7/10</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Calendar className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
              <p className="font-medium">Century Club</p>
              <p className="text-sm text-muted-foreground">100-day streak</p>
              <p className="text-xs text-harmony-600">Progress: 45/100 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalAchievements;