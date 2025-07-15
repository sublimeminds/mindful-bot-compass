import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Languages, CheckCircle, Clock } from 'lucide-react';

const SuperAdminTranslations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Globe className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Translation Management</h1>
              <p className="text-slate-400">Manage multilingual content and AI-powered translations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">42</p>
                <p className="text-sm text-slate-400">Languages</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">18,247</p>
                <p className="text-sm text-slate-400">Translations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">147</p>
                <p className="text-sm text-slate-400">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">96.3%</p>
                <p className="text-sm text-slate-400">Quality Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Translation Pipeline</CardTitle>
            <CardDescription className="text-slate-400">
              AI-powered translation system with quality assurance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Translation management interface will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminTranslations;