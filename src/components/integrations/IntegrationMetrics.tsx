
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Zap 
} from 'lucide-react';

interface IntegrationMetricsProps {
  totalEvents: number;
  successRate: number;
  averageResponseTime: number;
  eventsLast24h: number;
}

const IntegrationMetrics: React.FC<IntegrationMetricsProps> = ({
  totalEvents,
  successRate,
  averageResponseTime,
  eventsLast24h
}) => {
  const formatResponseTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-therapy-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-therapy-600" />
            <div>
              <p className="text-sm font-medium">Total Events</p>
              <p className="text-2xl font-bold">{totalEvents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-therapy-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-therapy-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Avg Response</p>
              <p className="text-2xl font-bold">
                {formatResponseTime(averageResponseTime)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-therapy-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">Last 24h</p>
              <p className="text-2xl font-bold">{eventsLast24h}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationMetrics;
