
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentManager from '@/components/content/ContentManager';
import ResourceLibrary from '@/components/content/ResourceLibrary';
import { Library, BookOpen, Collection } from 'lucide-react';

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
            Access curated mental health resources, educational content, and therapeutic materials
          </p>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Browse Resources</span>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center space-x-2">
              <Library className="h-4 w-4" />
              <span>Collections</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <ContentManager />
          </TabsContent>

          <TabsContent value="collections">
            <ResourceLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default ContentLibrary;
