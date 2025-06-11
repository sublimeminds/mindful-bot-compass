
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

const AnalyticsInsights = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-orange-400" />
            Analytics & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Improvement Rate</h3>
              <p className="text-2xl font-bold text-green-400">87.3%</p>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Active Users</h3>
              <p className="text-2xl font-bold text-blue-400">2,847</p>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Avg Sessions</h3>
              <p className="text-2xl font-bold text-purple-400">4.2</p>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p>Advanced analytics and reporting features coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsInsights;
