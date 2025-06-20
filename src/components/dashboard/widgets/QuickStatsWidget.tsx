
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, Heart, Brain, Target } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const QuickStatsWidget = () => {
  const stats: StatItem[] = [
    {
      label: 'Avg Mood',
      value: '7.2',
      change: '+0.8',
      trend: 'up',
      icon: <Heart className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      label: 'Session Time',
      value: '28m',
      change: '+5m',
      trend: 'up',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Wellness Score',
      value: '8.1',
      change: '+1.2',
      trend: 'up',
      icon: <Brain className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Goals Progress',
      value: '67%',
      change: '+12%',
      trend: 'up',
      icon: <Target className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stat.value}</span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsWidget;
