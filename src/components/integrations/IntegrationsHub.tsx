import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Settings, Zap, MessageSquare, CreditCard, BarChart3, Database } from 'lucide-react';

const IntegrationsHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('featured');

  const integrations = [
    {
      id: 'whatsapp',
      name: 'WhatsApp AI Therapy',
      description: 'Chat with your AI therapist directly on WhatsApp',
      category: 'communication',
      status: 'active',
      icon: MessageSquare,
      href: '/integrations/whatsapp'
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Manage your subscription and billing with Stripe',
      category: 'billing',
      status: 'active',
      icon: CreditCard,
      href: '/integrations/stripe'
    },
    {
      id: 'analytics',
      name: 'Enhanced Analytics',
      description: 'Track your progress and gain insights into your therapy journey',
      category: 'analytics',
      status: 'active',
      icon: BarChart3,
      href: '/integrations/analytics'
    },
    {
      id: 'ehr',
      name: 'EHR Integration',
      description: 'Connect with your existing Electronic Health Record system',
      category: 'medical',
      status: 'inactive',
      icon: Database,
      href: '/integrations/ehr'
    },
    {
      id: 'zapier',
      name: 'Zapier Automation',
      description: 'Connect TherapySync with thousands of other apps',
      category: 'automation',
      status: 'inactive',
      icon: Zap,
      href: '/integrations/zapier'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Integrations Hub</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>
            <TabsContent value="featured" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.slice(0, 3).map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <Card key={integration.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{integration.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        <div className="mt-4">{getStatusBadge(integration.status)}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="all" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <Card key={integration.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{integration.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        <div className="mt-4">{getStatusBadge(integration.status)}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="manage" className="pt-6">
              <div>
                <p>Manage your active integrations here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsHub;
