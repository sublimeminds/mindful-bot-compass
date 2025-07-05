import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Heart, 
  Target, 
  Award, 
  Calendar,
  TrendingUp,
  Settings,
  Edit,
  Star,
  Clock
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  
  useSafeSEO({
    title: 'My Profile - TherapySync',
    description: 'View and manage your TherapySync profile, progress, and achievements.',
    keywords: 'profile, progress, achievements, mental health journey'
  });

  // Mock user data - in real app, fetch from API
  const userData = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    joinDate: '2024-01-15',
    totalSessions: 12,
    streakDays: 7,
    currentMood: 8.2,
    planType: 'Premium',
    profileImage: null
  };

  const achievements = [
    { 
      id: 1, 
      title: '7-Day Streak', 
      description: 'Consistent daily check-ins', 
      icon: '🔥', 
      date: 'Today',
      type: 'streak'
    },
    { 
      id: 2, 
      title: 'First Month', 
      description: 'Completed first month of therapy', 
      icon: '🎉', 
      date: 'Yesterday',
      type: 'milestone'
    },
    { 
      id: 3, 
      title: 'Mood Master', 
      description: 'Tracked mood consistently', 
      icon: '😊', 
      date: '2 days ago',
      type: 'habit'
    },
    { 
      id: 4, 
      title: 'Goal Setter', 
      description: 'Set and achieved first goal', 
      icon: '🎯', 
      date: '1 week ago',
      type: 'achievement'
    }
  ];

  const stats = [
    { label: 'Total Sessions', value: userData.totalSessions, icon: Heart, color: 'from-therapy-500 to-calm-500' },
    { label: 'Current Streak', value: `${userData.streakDays} days`, icon: Target, color: 'from-harmony-500 to-balance-500' },
    { label: 'Average Mood', value: userData.currentMood.toFixed(1), icon: TrendingUp, color: 'from-flow-500 to-therapy-500' },
    { label: 'Plan Type', value: userData.planType, icon: Award, color: 'from-calm-500 to-harmony-500' }
  ];

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'streak': return 'from-orange-500 to-red-500';
      case 'milestone': return 'from-purple-500 to-pink-500';
      case 'habit': return 'from-green-500 to-emerald-500';
      case 'achievement': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <SafeComponentWrapper name="ProfilePage">
      <BulletproofDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  {userData.profileImage ? (
                    <img src={userData.profileImage} alt="Profile" className="w-full h-full rounded-full" />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                  <p className="text-therapy-100 mb-2">{userData.email}</p>
                  <div className="flex items-center space-x-4 text-sm text-therapy-100">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(userData.joinDate).toLocaleDateString()}
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {userData.planType} Plan
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Overview */}
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-therapy-800">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Mental Health Journey</span>
                      <span className="text-sm text-slate-500">78% Complete</span>
                    </div>
                    <Progress value={78} className="h-3" />
                    <p className="text-xs text-slate-500 mt-1">Keep up the great work!</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Weekly Goals</span>
                      <span className="text-sm text-slate-500">3/4 Complete</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    <p className="text-xs text-slate-500 mt-1">1 goal remaining this week</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Mood Consistency</span>
                      <span className="text-sm text-slate-500">12 day streak</span>
                    </div>
                    <Progress value={85} className="h-3" />
                    <p className="text-xs text-slate-500 mt-1">Excellent consistency!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-therapy-800">
                  <Settings className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0">
                  <Heart className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
                <Button variant="outline" className="w-full justify-start border-therapy-200 text-therapy-600 hover:bg-therapy-50">
                  <Target className="h-4 w-4 mr-2" />
                  Update Goals
                </Button>
                <Button variant="outline" className="w-full justify-start border-therapy-200 text-therapy-600 hover:bg-therapy-50">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start border-therapy-200 text-therapy-600 hover:bg-therapy-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-therapy-800">
                <Award className="h-5 w-5 mr-2" />
                Recent Achievements
                <Badge variant="outline" className="ml-2 text-therapy-600 border-therapy-200">
                  {achievements.length} earned
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl bg-gradient-to-r ${getAchievementColor(achievement.type)} text-white shadow-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{achievement.icon}</span>
                          <h3 className="font-semibold">{achievement.title}</h3>
                        </div>
                        <p className="text-white/90 text-sm mb-2">{achievement.description}</p>
                        <div className="flex items-center text-xs text-white/80">
                          <Clock className="h-3 w-3 mr-1" />
                          {achievement.date}
                        </div>
                      </div>
                      <Star className="h-5 w-5 text-white/80" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </BulletproofDashboardLayout>
    </SafeComponentWrapper>
  );
};

export default Profile;