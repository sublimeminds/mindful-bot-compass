
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Plus, Calendar, Trophy, TrendingUp, 
  CheckCircle, Clock, Star, BarChart3, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Goals = () => {
  const navigate = useNavigate();
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  useSafeSEO({
    title: 'Goal Tracking & Management - Mental Health Goals | TherapySync',
    description: 'Set, track, and achieve your mental health goals with AI-powered insights and personalized guidance.',
    keywords: 'goal tracking, mental health goals, SMART goals, progress tracking, personal development'
  });

  const activeGoals = [
    {
      id: 1,
      title: 'Practice Daily Mindfulness',
      description: 'Complete 10 minutes of mindfulness meditation each day',
      category: 'Mindfulness',
      progress: 75,
      target: 30,
      current: 23,
      unit: 'days',
      deadline: '2024-02-15',
      priority: 'High',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 2,
      title: 'Improve Sleep Quality',
      description: 'Maintain consistent sleep schedule and 8 hours of sleep',
      category: 'Wellness',
      progress: 60,
      target: 21,
      current: 13,
      unit: 'nights',
      deadline: '2024-02-10',
      priority: 'Medium',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 3,
      title: 'Social Connection Goals',
      description: 'Reach out to friends and family members weekly',
      category: 'Relationships',
      progress: 85,
      target: 8,
      current: 7,
      unit: 'connections',
      deadline: '2024-02-20',
      priority: 'High',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const completedGoals = [
    {
      title: 'Complete CBT Course',
      description: 'Finish 8-week cognitive behavioral therapy program',
      completedDate: '2024-01-15',
      category: 'Learning'
    },
    {
      title: 'Anxiety Management',
      description: 'Reduce daily anxiety levels using breathing techniques',
      completedDate: '2024-01-10',
      category: 'Mental Health'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-indigo-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Target className="h-4 w-4 mr-2" />
              Goal Tracking
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Achieve Your Mental Health Goals
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Set SMART goals, track your progress, and celebrate achievements with AI-powered insights and personalized guidance.
            </p>

            <Button
              size="lg"
              onClick={() => setShowNewGoalForm(true)}
              className="bg-gradient-to-r from-therapy-500 to-indigo-500 hover:from-therapy-600 hover:to-indigo-600 text-white border-0 px-8 py-6 text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Set New Goal
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Target, label: 'Active Goals', value: '3', color: 'from-blue-500 to-indigo-500' },
              { icon: Trophy, label: 'Completed', value: '12', color: 'from-green-500 to-emerald-500' },
              { icon: TrendingUp, label: 'Avg Progress', value: '73%', color: 'from-purple-500 to-violet-500' },
              { icon: Star, label: 'Streak Days', value: '15', color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
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

          {/* Active Goals */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Active Goals
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map((goal) => {
                const daysLeft = getDaysUntilDeadline(goal.deadline);
                return (
                  <Card key={goal.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {goal.category}
                        </Badge>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-therapy-600">{goal.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600 text-sm">{goal.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold">{goal.current}/{goal.target} {goal.unit}</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <p className="text-xs text-slate-500">{goal.progress}% complete</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar className="h-4 w-4" />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-4 w-4" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white border-0">
                          Update Progress
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Completed Goals */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Recent Achievements
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedGoals.map((goal, index) => (
                <Card key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 mb-1">{goal.title}</h3>
                        <p className="text-sm text-green-600 mb-2">{goal.description}</p>
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            {goal.category}
                          </Badge>
                          <span>Completed {new Date(goal.completedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-therapy-50 to-indigo-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Goal Insights
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-6 w-6 text-therapy-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-therapy-600 mb-1">Goal Recommendation</h3>
                      <p className="text-sm text-slate-600">Based on your progress, consider adding a stress management goal to complement your mindfulness practice.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-600 mb-1">Progress Insight</h3>
                      <p className="text-sm text-slate-600">You're 23% more likely to achieve goals when you check in daily. Keep up the momentum!</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-1">Timing Optimization</h3>
                      <p className="text-sm text-slate-600">Your most productive goal completion time is in the morning. Schedule important tasks then.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Trophy className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-orange-600 mb-1">Achievement Pattern</h3>
                      <p className="text-sm text-slate-600">You complete goals 40% faster when they're broken into weekly milestones.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Goals;
