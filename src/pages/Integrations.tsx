
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import WhatsAppIntegration from '@/components/integrations/WhatsAppIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Smartphone, Zap, Shield } from 'lucide-react';

const Integrations = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Integrations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-therapy-900">Integrations</h1>
            <p className="text-therapy-600 mt-2">
              Connect your favorite platforms to enhance your therapy experience
            </p>
          </div>
          <Badge variant="outline" className="text-therapy-600 border-therapy-300">
            <Zap className="h-4 w-4 mr-1" />
            Beta
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-therapy-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-therapy-500" />
                <div>
                  <p className="text-sm text-therapy-600">Available</p>
                  <p className="text-2xl font-bold text-therapy-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-therapy-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-therapy-600">Connected</p>
                  <p className="text-2xl font-bold text-therapy-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-therapy-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-therapy-600">Security</p>
                  <p className="text-2xl font-bold text-therapy-900">HIPAA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Tabs */}
        <Tabs defaultValue="messaging" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messaging" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messaging</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2" disabled>
              <Zap className="h-4 w-4" />
              <span>API Access</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center space-x-2" disabled>
              <Shield className="h-4 w-4" />
              <span>Webhooks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messaging" className="space-y-6">
            <WhatsAppIntegration />
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-therapy-600">API integration features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-therapy-600">Webhook configuration coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Integrations;
