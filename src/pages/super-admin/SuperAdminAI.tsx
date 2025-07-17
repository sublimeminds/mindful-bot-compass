import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Cpu, Zap, Settings } from 'lucide-react';
import { TherapyMonitoringDashboard } from '@/components/admin/therapy/TherapyMonitoringDashboard';

const SuperAdminAI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">AI Management</h1>
              <p className="text-slate-400">Configure AI models, routing, and performance optimization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">12</p>
                <p className="text-sm text-slate-400">Active Models</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">98.7%</p>
                <p className="text-sm text-slate-400">Success Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">234ms</p>
                <p className="text-sm text-slate-400">Avg Response</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">$1,247</p>
                <p className="text-sm text-slate-400">Monthly Cost</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">AI Model Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Advanced AI system management and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">AI management interface will be implemented here.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Therapy Session Monitoring</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time therapy session monitoring and quality metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TherapyMonitoringDashboard />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAI;