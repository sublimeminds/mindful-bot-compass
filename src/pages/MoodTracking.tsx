
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, TrendingUp, Calendar, Brain, Smile, Frown,
  Meh, Sun, Cloud, CloudRain, BarChart3, Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MoodTracking = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  useSafeSEO({
    title: 'Mood Tracking & Analytics - Mental Health Insights | TherapySync',
    description: 'Track your daily mood, identify patterns, and gain insights into your mental health journey with AI-powered analytics.',
    keywords: 'mood tracking, mental health analytics, mood patterns, emotional wellness, mood diary'
  });

  const moods = [
    { value: 1, icon: Frown, label: 'Very Low', color: 'text-red-500 bg-red-50' },
    { value: 2, icon: CloudRain, label: 'Low', color: 'text-orange-500 bg-orange-50' },
    { value: 3, icon: Meh, label: 'Neutral', color: 'text-yellow-500 bg-yellow-50' },
    { value: 4, icon: Sun, label: 'Good', color: 'text-green-500 bg-green-50' },
    { value: 5, icon: Smile, label: 'Excellent', color: 'text-blue-500 bg-blue-50' }
  ];

  const moodData = [
    { date: '2024-01-01', mood: 3, energy: 3, stress: 4 },
    { date: '2024-01-02', mood: 4, energy: 4, stress: 3 },
    { date: '2024-01-03', mood: 3, energy: 2, stress: 5 },
    { date: '2024-01-04', mood: 5, energy: 5, stress: 2 },
    { date: '2024-01-05', mood: 4, energy: 4, stress: 3 },
    { date: '2024-01-06', mood: 3, energy: 3, stress: 4 },
    { date: '2024-01-07', mood: 4, energy: 4, stress: 2 }
  ];

  const weeklyStats = {
    averageMood: 3.7,
    moodTrend: '+0.3',
    bestDay: 'Thursday',
    commonTriggers: ['Work stress', 'Sleep quality', 'Social interactions']
  };

  const insights = [
    {
      title: 'Mood Pattern',
      description: 'Your mood tends to improve throughout the week, with Thursday being your best day.',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Sleep Connection',
      description: 'Good sleep quality correlates with 40% better mood ratings the next day.',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Stress Impact',
      description: 'High stress days are followed by 25% lower mood scores. Consider stress management.',
      icon: Target,
      color: 'from-purple-500 to-violet-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-indigo-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Heart className="h-4 w-4 mr-2" />
              Mood Tracking
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Track Your Emotional Journey
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Monitor your daily mood, discover patterns, and gain valuable insights into your mental health with AI-powered analytics and personalized recommendations.
            </p>
          </div>

          {/* Daily Mood Check-in */}
          <Card className="mb-12 bg-gradient-to-r from-therapy-50 to-indigo-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                  How are you feeling today?
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4 mb-6">
                {moods.map((mood) => {
                  const IconComponent = mood.icon;
                  return (
                    <Button
                      key={mood.value}
                      variant={selectedMood === mood.value ? "default" : "outline"}
                      className={`flex flex-col items-center p-6 h-auto ${
                        selectedMood === mood.value 
                          ? 'bg-therapy-600 hover:bg-therapy-700 text-white' 
                          : `${mood.color} hover:scale-105`
                      } transition-all duration-200`}
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      <IconComponent className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>
              <div className="text-center">
                <Button 
                  size="lg"
                  disabled={selectedMood === null}
                  className="bg-gradient-to-r from-therapy-500 to-indigo-500 hover:from-therapy-600 hover:to-indigo-600 text-white border-0"
                >
                  Log Today's Mood
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Heart, label: 'Avg Mood', value: weeklyStats.averageMood.toFixed(1), color: 'from-pink-500 to-rose-500' },
              { icon: TrendingUp, label: 'Trend', value: weeklyStats.moodTrend, color: 'from-green-500 to-emerald-500' },
              { icon: Calendar, label: 'Best Day', value: weeklyStats.bestDay, color: 'from-blue-500 to-indigo-500' },
              { icon: BarChart3, label: 'Tracking Days', value: '30', color: 'from-purple-500 to-violet-500' }
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

          {/* Mood Chart */}
          <Card className="mb-12 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                  Mood Trends (Last 7 Days)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    />
                    <YAxis domain={[1, 5]} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value, name) => [value, name === 'mood' ? 'Mood' : name === 'energy' ? 'Energy' : 'Stress']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#8b5cf6" 
                      fill="url(#moodGradient)" 
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center mb-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-therapy-600">{insight.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{insight.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Common Triggers */}
          <Card className="bg-gradient-to-r from-therapy-50 to-indigo-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                  Common Mood Triggers
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-3">
                {weeklyStats.commonTriggers.map((trigger, index) => (
                  <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                    {trigger}
                  </Badge>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/therapy-chat')}
                  className="border-therapy-300 text-therapy-700 hover:bg-therapy-50"
                >
                  Discuss Triggers with AI Therapist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MoodTracking;
