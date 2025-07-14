import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Languages, 
  Globe, 
  FileText, 
  Link, 
  Search, 
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ContentTranslationManager from './ContentTranslationManager';
import URLTranslationManager from './URLTranslationManager';
import SEOTranslationManager from './SEOTranslationManager';
import TranslationJobsManager from './TranslationJobsManager';
import TranslationAnalytics from './TranslationAnalytics';

interface TranslationStats {
  totalTranslations: number;
  pendingApprovals: number;
  activeJobs: number;
  languageCoverage: number;
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

const AdminTranslationDashboard = () => {
  const [stats, setStats] = useState<TranslationStats>({
    totalTranslations: 0,
    pendingApprovals: 0,
    activeJobs: 0,
    languageCoverage: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTranslationStats();
  }, []);

  const loadTranslationStats = async () => {
    try {
      setLoading(true);
      
      // Load translation statistics
      const [
        { count: totalTranslations },
        { count: pendingApprovals },
        { count: activeJobs }
      ] = await Promise.all([
        supabase.from('content_translations').select('*', { count: 'exact', head: true }),
        supabase.from('content_translations').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('translation_jobs').select('*', { count: 'exact', head: true }).in('status', ['pending', 'running'])
      ]);

      // Calculate language coverage (mock for now)
      const languageCoverage = Math.round((totalTranslations || 0) / 100 * 100);

      setStats({
        totalTranslations: totalTranslations || 0,
        pendingApprovals: pendingApprovals || 0,
        activeJobs: activeJobs || 0,
        languageCoverage: Math.min(languageCoverage, 100),
        recentActivity: [
          { type: 'success', message: 'German translations completed for pricing page', timestamp: new Date().toISOString() },
          { type: 'pending', message: 'Spanish URL translations in progress', timestamp: new Date().toISOString() },
          { type: 'review', message: '12 translations pending review', timestamp: new Date().toISOString() }
        ]
      });
    } catch (error) {
      console.error('Error loading translation stats:', error);
      toast.error('Failed to load translation statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkTranslation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-translation', {
        body: {
          action: 'scan_content'
        }
      });

      if (error) throw error;

      // Start bulk translation job
      const { data: jobData, error: jobError } = await supabase.functions.invoke('admin-ai-translation', {
        body: {
          action: 'bulk_translate',
          jobName: 'Website Content Translation',
          jobType: 'bulk_content',
          sourceLanguage: 'en',
          targetLanguages: ['de', 'es', 'fr'],
          contextType: 'ui',
          items: data.content,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (jobError) throw jobError;

      toast.success('Bulk translation job started successfully');
      loadTranslationStats();
    } catch (error) {
      console.error('Error starting bulk translation:', error);
      toast.error('Failed to start bulk translation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Languages className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Translation Management</h1>
            <p className="text-gray-400">Manage multilingual content and SEO translations</p>
          </div>
        </div>
        <Button onClick={handleBulkTranslation} className="bg-blue-600 hover:bg-blue-700">
          <Zap className="h-4 w-4 mr-2" />
          Start Bulk Translation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Translations</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalTranslations}</div>
            <p className="text-xs text-green-400">Across all languages</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingApprovals}</div>
            <p className="text-xs text-yellow-400">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Jobs</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeJobs}</div>
            <p className="text-xs text-purple-400">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Language Coverage</CardTitle>
            <Globe className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.languageCoverage}%</div>
            <Progress value={stats.languageCoverage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-400" />}
                {activity.type === 'pending' && <Clock className="h-4 w-4 text-yellow-400" />}
                {activity.type === 'review' && <AlertCircle className="h-4 w-4 text-blue-400" />}
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-600">
            <FileText className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="urls" className="data-[state=active]:bg-blue-600">
            <Link className="h-4 w-4 mr-2" />
            URLs
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-blue-600">
            <Search className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentTranslationManager onStatsUpdate={loadTranslationStats} />
        </TabsContent>

        <TabsContent value="urls">
          <URLTranslationManager onStatsUpdate={loadTranslationStats} />
        </TabsContent>

        <TabsContent value="seo">
          <SEOTranslationManager onStatsUpdate={loadTranslationStats} />
        </TabsContent>

        <TabsContent value="jobs">
          <TranslationJobsManager onStatsUpdate={loadTranslationStats} />
        </TabsContent>

        <TabsContent value="analytics">
          <TranslationAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTranslationDashboard;