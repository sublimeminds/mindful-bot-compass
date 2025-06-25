
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  BarChart3, 
  Puzzle
} from 'lucide-react';
import { useRealIntegrations } from '@/hooks/useRealIntegrations';
import IntegrationConfigCard from './IntegrationConfigCard';
import IntegrationMetrics from './IntegrationMetrics';
import IntegrationsList from './IntegrationsList';
import IntegrationsFilter from './IntegrationsFilter';

const RealIntegrationsHub = () => {
  const { integrations, loading } = useRealIntegrations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (integration.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Integrations', count: integrations.length },
    { value: 'ehr', label: 'EHR Systems', count: integrations.filter(i => i.type === 'ehr').length },
    { value: 'calendar', label: 'Calendar', count: integrations.filter(i => i.type === 'calendar').length },
    { value: 'mobile', label: 'Mobile', count: integrations.filter(i => i.type === 'mobile').length }
  ];

  // Mock analytics data - in real app this would come from the analytics service
  const analyticsData = {
    totalEvents: 42,
    successRate: 95.2,
    averageResponseTime: 250,
    eventsLast24h: 8
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Puzzle className="h-6 w-6 text-therapy-600" />
        <div>
          <h1 className="text-3xl font-bold text-therapy-900">Real Integrations Hub</h1>
          <p className="text-therapy-600 mt-2">
            Connect and manage your therapy platform integrations
          </p>
        </div>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Manage</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center space-x-2">
            <Puzzle className="h-4 w-4" />
            <span>Marketplace</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <IntegrationsFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIntegrations.map(integration => (
              <IntegrationConfigCard
                key={integration.id}
                integration={integration}
              />
            ))}
          </div>

          {filteredIntegrations.length === 0 && integrations.length > 0 && (
            <Card className="border-therapy-200">
              <CardContent className="p-8 text-center">
                <Puzzle className="h-12 w-12 text-therapy-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-therapy-800 mb-2">
                  No integrations found
                </h3>
                <p className="text-therapy-600">
                  Try adjusting your search terms or browse all integrations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-therapy-900">Integration Analytics</h2>
            </div>
            <IntegrationMetrics
              totalEvents={analyticsData.totalEvents}
              successRate={analyticsData.successRate}
              averageResponseTime={analyticsData.averageResponseTime}
              eventsLast24h={analyticsData.eventsLast24h}
            />
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card className="border-therapy-200">
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <IntegrationsList
                integrations={integrations}
                onIntegrationClick={(integration) => {
                  console.log('Configure integration:', integration);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealIntegrationsHub;
