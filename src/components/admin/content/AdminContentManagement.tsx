
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Brain, Bell, Plus } from 'lucide-react';
import TherapistManagement from './TherapistManagement';
import NotificationTemplates from './NotificationTemplates';

const AdminContentManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Content Management</h1>
            <p className="text-gray-400">Manage therapists, techniques, and notifications</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="therapists" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="therapists" className="data-[state=active]:bg-blue-600">
            <Brain className="h-4 w-4 mr-2" />
            Therapists
          </TabsTrigger>
          <TabsTrigger value="techniques" className="data-[state=active]:bg-blue-600">
            <FileText className="h-4 w-4 mr-2" />
            Techniques
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="therapists">
          <TherapistManagement />
        </TabsContent>

        <TabsContent value="techniques">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Therapy Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Therapy techniques management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentManagement;
