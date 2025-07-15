import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Globe, Edit, Archive } from 'lucide-react';

const SuperAdminContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <FileText className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Content Management</h1>
              <p className="text-slate-400">Manage therapeutic content, resources, and materials</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">2,847</p>
                <p className="text-sm text-slate-400">Content Items</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">847</p>
                <p className="text-sm text-slate-400">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">23</p>
                <p className="text-sm text-slate-400">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">15</p>
                <p className="text-sm text-slate-400">Languages</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Content Library</CardTitle>
            <CardDescription className="text-slate-400">
              Therapeutic content management and localization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Content management interface will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminContent;