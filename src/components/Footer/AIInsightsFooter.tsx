import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  Users,
  Clock,
  Star,
  Activity,
  CheckCircle
} from 'lucide-react';

const AIInsightsFooter = () => {
  return (
    <div className="bg-gradient-to-r from-therapy-50 to-calm-50 border-t border-therapy-200 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Real-time AI Status */}
          <Card className="bg-white/60 backdrop-blur-sm border-therapy-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm font-medium">AI Status</span>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Response Time</span>
                  <span className="font-medium">&lt;500ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Models Active</span>
                  <span className="font-medium">3/3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card className="bg-white/60 backdrop-blur-sm border-therapy-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-harmony-600" />
                <span className="text-sm font-medium">Today's Progress</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Therapy Goals</span>
                    <span>2/3</span>
                  </div>
                  <Progress value={67} className="h-1" />
                </div>
                <div className="text-xs text-muted-foreground">
                  Great progress! Keep it up.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Insights */}
          <Card className="bg-white/60 backdrop-blur-sm border-therapy-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-flow-600" />
                <span className="text-sm font-medium">Community</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Active Users</span>
                  <span className="font-medium">50K+</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Success Rate</span>
                  <span className="font-medium text-green-600">96.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/60 backdrop-blur-sm border-therapy-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-calm-600" />
                <span className="text-sm font-medium">Quick Actions</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <button className="text-xs p-1 rounded bg-therapy-100 hover:bg-therapy-200 transition-colors">
                  Mood Check
                </button>
                <button className="text-xs p-1 rounded bg-therapy-100 hover:bg-therapy-200 transition-colors">
                  Goals
                </button>
                <button className="text-xs p-1 rounded bg-therapy-100 hover:bg-therapy-200 transition-colors">
                  Sessions
                </button>
                <button className="text-xs p-1 rounded bg-therapy-100 hover:bg-therapy-200 transition-colors">
                  Chat AI
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsFooter;