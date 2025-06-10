
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Clock, Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InsightsWidget = () => {
  const navigate = useNavigate();

  // Mock insights data
  const insights = [
    {
      id: 1,
      type: "trend",
      title: "Mood Pattern Detected",
      description: "Your mood tends to improve after therapy sessions",
      icon: TrendingUp,
      priority: "high",
      action: "View Mood Analytics"
    },
    {
      id: 2,
      type: "recommendation",
      title: "Optimal Session Time",
      description: "You're most engaged during morning sessions",
      icon: Clock,
      priority: "medium",
      action: "Schedule Morning Session"
    },
    {
      id: 3,
      type: "achievement",
      title: "Consistency Streak",
      description: "You've maintained 7 days of regular check-ins",
      icon: Brain,
      priority: "low",
      action: "Keep It Up!"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInsightAction = (insight: any) => {
    // Navigate based on insight type
    switch (insight.type) {
      case 'trend':
        navigate('/analytics');
        break;
      case 'recommendation':
        navigate('/chat');
        break;
      case 'achievement':
        navigate('/goals');
        break;
      default:
        navigate('/analytics');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-therapy-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.slice(0, 2).map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-therapy-600 mt-1" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInsightAction(insight)}
                    className="text-xs text-therapy-600 hover:text-therapy-700 p-0 h-auto"
                  >
                    {insight.action}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/analytics')}
          className="w-full mt-3"
        >
          View All Insights
        </Button>
      </CardContent>
    </Card>
  );
};

export default InsightsWidget;
