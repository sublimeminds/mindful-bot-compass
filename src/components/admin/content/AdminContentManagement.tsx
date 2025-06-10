
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users, Mail, Settings } from 'lucide-react';
import TherapistManagement from './TherapistManagement';
import NotificationTemplates from './NotificationTemplates';
import ContentLibrary from './ContentLibrary';
import ContentSettings from './ContentSettings';

const AdminContentManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <FileText className="h-6 w-6 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Content Management</h1>
          <p className="text-gray-400">Manage therapists, templates, and content</p>
        </div>
      </div>

      {/* Content Management Tabs */}
      <Tabs defaultValue="therapists" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="therapists" className="data-[state=active]:bg-purple-600">
            <Users className="h-4 w-4 mr-2" />
            Therapists
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-purple-600">
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="library" className="data-[state=active]:bg-purple-600">
            <FileText className="h-4 w-4 mr-2" />
            Content Library
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="therapists">
          <TherapistManagement />
        </TabsContent>

        <TabsContent value="templates">
          <NotificationTemplates />
        </TabsContent>

        <TabsContent value="library">
          <ContentLibrary />
        </TabsContent>

        <TabsContent value="settings">
          <ContentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentManagement;
