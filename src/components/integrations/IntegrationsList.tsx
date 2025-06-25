
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Slack, 
  Calendar, 
  Smartphone, 
  Database, 
  Zap,
  Plus
} from 'lucide-react';
import { Integration } from '@/hooks/useRealIntegrations';

interface IntegrationsListProps {
  integrations: Integration[];
  onIntegrationClick: (integration: Integration) => void;
}

const IntegrationsList: React.FC<IntegrationsListProps> = ({
  integrations,
  onIntegrationClick
}) => {
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
      case 'ehr':
        return <Database className="h-6 w-6 text-blue-700" />;
      case 'mobile':
        return <Smartphone className="h-6 w-6 text-green-500" />;
      default:
        return <Zap className="h-6 w-6 text-therapy-600" />;
    }
  };

  if (integrations.length === 0) {
    return (
      <Card className="border-therapy-200">
        <CardContent className="p-8 text-center">
          <Plus className="h-12 w-12 text-therapy-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-therapy-800 mb-2">
            No integrations available
          </h3>
          <p className="text-therapy-600 mb-4">
            Integrations will appear here once they are configured in the system.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map(integration => (
        <div key={integration.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-3">
            {getIntegrationIcon(integration.type)}
            <div>
              <h4 className="font-medium">{integration.name}</h4>
              <p className="text-sm text-gray-600">
                {integration.description || 'No description available'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="capitalize">
              {integration.type}
            </Badge>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onIntegrationClick(integration)}
            >
              Configure
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntegrationsList;
