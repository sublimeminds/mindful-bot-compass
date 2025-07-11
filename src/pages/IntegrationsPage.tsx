import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Settings, 
  Link as LinkIcon, 
  MessageSquare,
  Smartphone,
  Globe,
  Calendar,
  Bell
} from 'lucide-react';
import WhatsAppSetup from '@/components/integrations/functional/WhatsAppSetup';
import PlatformIntegrationsManager from '@/components/integrations/functional/PlatformIntegrationsManager';

const IntegrationsPage = () => {

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
          Integrations
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect TherapySync with your favorite apps and services
        </p>
      </div>

      {/* Integration Categories */}
      <div className="grid gap-6">
        {/* WhatsApp Integration */}
        <WhatsAppSetup />

        {/* Platform Integrations Manager */}
        <PlatformIntegrationsManager />
      </div>
    </div>
  );
};

export default IntegrationsPage;