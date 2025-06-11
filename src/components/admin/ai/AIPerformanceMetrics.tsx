
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Zap, DollarSign } from 'lucide-react';

const AIPerformanceMetrics = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-400" />
            AI Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Avg Response Time</h3>
              <p className="text-2xl font-bold text-blue-400">1.2s</p>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Tokens/Session</h3>
              <p className="text-2xl font-bold text-yellow-400">457</p>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Cost/Session</h3>
              <p className="text-2xl font-bold text-green-400">$0.14</p>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <Activity className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Uptime</h3>
              <p className="text-2xl font-bold text-purple-400">99.9%</p>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p>Real-time performance monitoring and optimization features coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPerformanceMetrics;
