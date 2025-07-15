import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Server, Database, Cpu } from 'lucide-react';

const SuperAdminSystem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
              <Settings className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">System Configuration</h1>
              <p className="text-slate-400">Configure system settings, infrastructure, and parameters</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">99.9%</p>
                <p className="text-sm text-slate-400">System Uptime</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">247ms</p>
                <p className="text-sm text-slate-400">Response Time</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">67%</p>
                <p className="text-sm text-slate-400">CPU Usage</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">12.4GB</p>
                <p className="text-sm text-slate-400">Memory Usage</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">System Control Panel</CardTitle>
            <CardDescription className="text-slate-400">
              Infrastructure management and system configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">System configuration interface will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminSystem;