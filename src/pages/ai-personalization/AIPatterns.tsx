import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, Target, Activity } from 'lucide-react';

const AIPatterns = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">AI Patterns</h1>
          <p className="text-muted-foreground">Behavioral and therapeutic patterns identified by AI analysis</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <BarChart3 className="w-4 h-4 mr-1" />
          Pattern Analysis
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-therapy-500" />
              <span>Temporal Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Morning Sessions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-therapy-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Afternoon Sessions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-calm-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                  <span className="text-sm font-medium">62%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Evening Sessions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-harmony-500 h-2 rounded-full" style={{ width: '47%' }}></div>
                  </div>
                  <span className="text-sm font-medium">47%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-calm-500" />
              <span>Goal Achievement Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-therapy-50 rounded-lg">
                <p className="font-medium text-sm">Weekly Goal Success Rate</p>
                <p className="text-2xl font-bold text-therapy-600">78%</p>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </div>
              <div className="p-3 bg-calm-50 rounded-lg">
                <p className="font-medium text-sm">Consistency Score</p>
                <p className="text-2xl font-bold text-calm-600">82%</p>
                <p className="text-xs text-muted-foreground">Excellent adherence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-harmony-500" />
            <span>Engagement Patterns</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-therapy-50 to-therapy-100 rounded-lg">
              <p className="text-3xl font-bold text-therapy-600">24</p>
              <p className="text-sm text-muted-foreground">Sessions This Month</p>
              <p className="text-xs text-therapy-600">+3 from target</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-calm-50 to-calm-100 rounded-lg">
              <p className="text-3xl font-bold text-calm-600">18m</p>
              <p className="text-sm text-muted-foreground">Avg Session Length</p>
              <p className="text-xs text-calm-600">Optimal range</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-harmony-50 to-harmony-100 rounded-lg">
              <p className="text-3xl font-bold text-harmony-600">92%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-xs text-harmony-600">Excellent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPatterns;