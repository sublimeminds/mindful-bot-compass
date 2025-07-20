
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Languages, Zap, FileText } from 'lucide-react';
import BulkTranslationInterface from './BulkTranslationInterface';

const AdminTranslationDashboard = () => {
  const [activeTab, setActiveTab] = useState('bulk-translation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-therapy-500/10 border border-therapy-500/20">
              <Languages className="h-6 w-6 text-therapy-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Translation Management</h1>
              <p className="text-slate-400">AI-powered content translation and localization</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-therapy-400" />
                <p className="text-2xl font-bold text-slate-100">13</p>
                <p className="text-sm text-slate-400">Supported Languages</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold text-green-400">200+</p>
                <p className="text-sm text-slate-400">Translation Keys</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-2xl font-bold text-yellow-400">AI</p>
                <p className="text-sm text-slate-400">Powered Translation</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center">
                <Languages className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold text-blue-400">DE</p>
                <p className="text-sm text-slate-400">Current Target</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Translation Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="bulk-translation" className="data-[state=active]:bg-therapy-600">
              <Zap className="h-4 w-4 mr-2" />
              Bulk Translation
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-therapy-600">
              <FileText className="h-4 w-4 mr-2" />
              Review & Approve
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-therapy-600">
              <Languages className="h-4 w-4 mr-2" />
              Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-translation">
            <BulkTranslationInterface />
          </TabsContent>

          <TabsContent value="review">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Translation Review</CardTitle>
                <CardDescription className="text-slate-400">
                  Review and approve AI-generated translations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Translation review interface will be available after bulk translation is completed.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Translation Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage existing translations and language files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Translation management tools coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminTranslationDashboard;
