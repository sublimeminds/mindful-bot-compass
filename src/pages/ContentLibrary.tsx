import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentCurationDashboard from '@/components/content/ContentCurationDashboard';
import DigitalResourceManager from '@/components/content/DigitalResourceManager';
import ContentRecommendationEngine from '@/components/content/ContentRecommendationEngine';
import { BookOpen, FolderOpen, Sparkles, Archive } from 'lucide-react';

const ContentLibrary = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Content Library...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive digital library with AI-powered curation and personalized recommendations
          </p>
        </div>

        <Tabs defaultValue="curation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curation" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Content Curation</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span>Resource Manager</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="archive" className="flex items-center space-x-2">
              <Archive className="h-4 w-4" />
              <span>Archive</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curation">
            <ContentCurationDashboard />
          </TabsContent>

          <TabsContent value="resources">
            <DigitalResourceManager />
          </TabsContent>

          <TabsContent value="recommendations">
            <ContentRecommendationEngine />
          </TabsContent>

          <TabsContent value="archive" className="space-y-6">
            <div className="text-center py-12">
              <Archive className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
              <h3 className="text-xl font-semibold mb-2">Content Archive</h3>
              <p className="text-muted-foreground">
                Access archived content, version history, and backup resources
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default ContentLibrary;