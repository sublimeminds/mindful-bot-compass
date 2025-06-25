
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Settings, 
  BarChart3, 
  Puzzle, 
  MessageSquare,
  Calendar,
  Slack,
  Smartphone,
  Database,
  Zap
} from 'lucide-react';
import { useRealIntegrations } from '@/hooks/useRealIntegrations';
import IntegrationConfigCard from './IntegrationConfigCard';
import AnalyticsIntegration from './AnalyticsIntegration';

const RealIntegrationsHub = () => {
  const { integrations, loading } = useRealIntegrations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="h-6 w-6 text-green-600" />;
      case 'slack':
        return <Slack className="h-6 w-6 text-purple-600" />;
      case 'calendar':
        return <Calendar className="h-6 w-6 text-blue-600" />;
      case 'sms':
        return <Smartphone className="h-6 w-6 text-orange-600" />;
      case 'database':
        return <Database className="h-6 w-6 text-gray-600" />;
      default:
        return <Zap className="h-6 w-6 text-therapy-600" />;
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Integrations', count: integrations.length },
    { value: 'communication', label: 'Communication', count: integrations.filter(i => ['whatsapp', 'slack', 'sms'].includes(i.type)).length },
    { value: 'productivity', label: 'Productivity', count: integrations.filter(i => ['calendar', 'database'].includes(i.type)).length },
    { value: 'analytics', label: 'Analytics', count: integrations.filter(i => i.type === 'analytics').length }
  ];

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
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIntegrations.map(integration => (
              <IntegrationConfigCard
                key={integration.id}
                integration={integration}
              />
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
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
          <AnalyticsIntegration />
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card className="border-therapy-200">
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map(integration => (
                  <div key={integration.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      {getIntegrationIcon(integration.type)}
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">
                        {integration.type}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealIntegrationsHub;
