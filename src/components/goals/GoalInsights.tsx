import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  PartyPopper, 
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { GoalInsight } from '@/hooks/useGoalInsights';
import { UserGoal } from '@/hooks/useUserGoals';
import { cn } from '@/lib/utils';

interface GoalInsightsProps {
  insights: GoalInsight[];
  goals: UserGoal[];
}

const insightIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  recommendation: Lightbulb,
  warning: AlertTriangle,
  celebration: PartyPopper,
  tip: Brain,
};

const GoalInsights = ({ insights, goals }: GoalInsightsProps) => {
  const [viewedInsights, setViewedInsights] = useState<Set<string>>(new Set());

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'celebration': return 'bg-green-100 text-green-800 border-green-200';
      case 'tip': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    const IconComponent = insightIcons[type] || Brain;
    return IconComponent;
  };

  const markAsViewed = async (insightId: string) => {
    if (!viewedInsights.has(insightId)) {
      setViewedInsights(prev => new Set([...prev, insightId]));
      // TODO: Update insight as viewed in backend
    }
  };

  const markAsActedUpon = async (insightId: string) => {
    // TODO: Update insight as acted upon in backend
    console.log('Marking insight as acted upon:', insightId);
  };

  const priorityInsights = insights
    .filter(insight => insight.priority >= 7)
    .sort((a, b) => b.priority - a.priority);

  const regularInsights = insights
    .filter(insight => insight.priority < 7)
    .sort((a, b) => b.priority - a.priority);

  if (insights.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Insights Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          AI insights will appear here as you track your goals and make progress. 
          These personalized recommendations help optimize your goal achievement.
        </p>
      </div>
    );
  }

  const renderInsightCard = (insight: GoalInsight, isPriority = false) => {
    const IconComponent = getInsightIcon(insight.insight_type);
    const isViewed = viewedInsights.has(insight.id) || insight.viewed_at;
    const isActedUpon = insight.acted_upon_at;
    const relatedGoal = insight.goal_id ? goals.find(g => g.id === insight.goal_id) : null;

    return (
      <Card 
        key={insight.id}
        className={cn(
          "transition-all duration-200 hover:shadow-md cursor-pointer",
          isPriority && "border-2 border-therapy-300 bg-therapy-50/50",
          !isViewed && "border-l-4 border-l-therapy-500"
        )}
        onClick={() => markAsViewed(insight.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg", getInsightTypeColor(insight.insight_type).replace('text-', 'bg-').replace('800', '100'))}>
                <IconComponent className={cn("h-5 w-5", getInsightTypeColor(insight.insight_type).split(' ')[1])} />
              </div>
              
              <div className="flex-1">
                <CardTitle className="text-base flex items-center space-x-2">
                  <span>{insight.title}</span>
                  {isPriority && <Badge className="bg-red-100 text-red-800 text-xs">High Priority</Badge>}
                </CardTitle>
                
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={cn("text-xs", getInsightTypeColor(insight.insight_type))}>
                    {insight.insight_type}
                  </Badge>
                  
                  {relatedGoal && (
                    <Badge variant="outline" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      {relatedGoal.title}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="text-xs">
                    {Math.round(insight.confidence_score * 100)}% confidence
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isViewed && (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
              {isActedUpon && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">
            {insight.description}
          </p>

          {insight.action_items && insight.action_items.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Recommended Actions:</h4>
              <ul className="space-y-1">
                {insight.action_items.map((action, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <span className="text-therapy-500 mt-1">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(insight.created_at).toLocaleDateString()}</span>
              </span>
              
              {insight.expires_at && (
                <span className="flex items-center space-x-1 text-orange-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Expires {new Date(insight.expires_at).toLocaleDateString()}</span>
                </span>
              )}
            </div>

            {!isActedUpon && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsActedUpon(insight.id);
                }}
                className="text-xs"
              >
                Mark as Done
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Insights Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-therapy-600 mb-1">
              {insights.length}
            </div>
            <div className="text-sm text-gray-600">Total Insights</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {priorityInsights.length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {insights.filter(i => i.viewed_at).length}
            </div>
            <div className="text-sm text-gray-600">Viewed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {insights.filter(i => i.acted_upon_at).length}
            </div>
            <div className="text-sm text-gray-600">Acted Upon</div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Insights */}
      {priorityInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>High Priority Insights</span>
          </h3>
          <div className="space-y-4">
            {priorityInsights.map(insight => renderInsightCard(insight, true))}
          </div>
        </div>
      )}

      {/* Regular Insights */}
      {regularInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>AI Recommendations</span>
          </h3>
          <div className="space-y-4">
            {regularInsights.map(insight => renderInsightCard(insight))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalInsights;