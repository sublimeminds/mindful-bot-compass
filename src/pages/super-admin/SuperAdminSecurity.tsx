import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, AlertCircle } from 'lucide-react';

const SuperAdminSecurity = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Shield className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Security & Audit</h1>
              <p className="text-slate-400">Monitor security events, audit logs, and system access</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">0</p>
                <p className="text-sm text-slate-400">Security Breaches</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">23</p>
                <p className="text-sm text-slate-400">Failed Logins</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">1,247</p>
                <p className="text-sm text-slate-400">Audit Events</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">5</p>
                <p className="text-sm text-slate-400">Admin Sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Security Dashboard</CardTitle>
            <CardDescription className="text-slate-400">
              Comprehensive security monitoring and audit trail management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Security monitoring interface will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminSecurity;