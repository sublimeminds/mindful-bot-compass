
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import WhatsAppAdminPanel from '@/components/admin/integrations/WhatsAppAdminPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Zap, Webhook } from 'lucide-react';

const AdminIntegrations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MessageSquare className="h-6 w-6 text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Integration Management</h1>
          <p className="text-gray-400">Configure and manage system-wide integrations</p>
        </div>
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="whatsapp" className="data-[state=active]:bg-blue-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp Business
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-blue-600" disabled>
            <Zap className="h-4 w-4 mr-2" />
            API Management
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-blue-600" disabled>
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <WhatsAppAdminPanel />
        </TabsContent>

        <TabsContent value="api">
          <div className="text-center py-8 text-gray-400">
            API management features coming soon...
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="text-center py-8 text-gray-400">
            Webhook management features coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminIntegrations;
