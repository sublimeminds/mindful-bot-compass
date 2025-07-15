import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Users, BarChart3 } from 'lucide-react';

const SuperAdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Activity className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Platform Analytics</h1>
              <p className="text-slate-400">Comprehensive platform metrics and usage analytics</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">3,247</p>
                <p className="text-sm text-slate-400">Daily Sessions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">+12.4%</p>
                <p className="text-sm text-slate-400">Growth Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">47min</p>
                <p className="text-sm text-slate-400">Avg Session</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">89.2%</p>
                <p className="text-sm text-slate-400">Satisfaction</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Usage Analytics</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time platform performance and user engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Analytics dashboard will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminAnalytics;