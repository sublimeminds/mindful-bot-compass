import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Phone, Users, Clock } from 'lucide-react';

const SuperAdminCrisis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Crisis Management</h1>
              <p className="text-slate-400">Monitor and manage crisis interventions and emergency responses</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">2</p>
                <p className="text-sm text-slate-400">Active Alerts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">12</p>
                <p className="text-sm text-slate-400">This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">98.7%</p>
                <p className="text-sm text-slate-400">Response Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">3.2min</p>
                <p className="text-sm text-slate-400">Avg Response</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Crisis Monitoring</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time crisis detection and intervention management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Crisis management interface will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminCrisis;