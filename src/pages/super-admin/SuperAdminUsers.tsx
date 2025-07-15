import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, Filter, Download } from 'lucide-react';

const SuperAdminUsers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
              <p className="text-slate-400">Manage platform users, roles, and access permissions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">1,247</p>
                <p className="text-sm text-slate-400">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">987</p>
                <p className="text-sm text-slate-400">Active Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">45</p>
                <p className="text-sm text-slate-400">New This Week</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">3</p>
                <p className="text-sm text-slate-400">Flagged Accounts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">User Directory</CardTitle>
            <CardDescription className="text-slate-400">
              Comprehensive user management and oversight
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">User management interface will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminUsers;