import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Stethoscope } from 'lucide-react';
import { healthcareProviderIntegrationService } from '@/services/healthcareProviderIntegrationService';
import { b2bPlatformService } from '@/services/b2bPlatformService';
import { advancedAnalyticsService } from '@/services/advancedAnalyticsService';

const EnterpriseB2BDashboard = () => {
  const [stats, setStats] = useState({
    providers: 0,
    b2bClients: 0,
    whiteLabelInstances: 0,
    corporatePrograms: 0
  });

  useEffect(() => {
    const loadStats = () => {
      setStats({
        providers: healthcareProviderIntegrationService.getProviders().length,
        b2bClients: b2bPlatformService.getClients().length,
        whiteLabelInstances: b2bPlatformService.getWhiteLabelConfigs().length,
        corporatePrograms: b2bPlatformService.getCorporatePrograms().length
      });
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-enterprise-50 to-b2b-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-enterprise-900 mb-2">Enterprise & B2B Solutions</h1>
          <p className="text-enterprise-600 text-lg">Phase 15 Week 3: Healthcare integrations and business solutions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-enterprise-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-enterprise-700">Healthcare Providers</CardTitle>
              <Stethoscope className="h-4 w-4 text-enterprise-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-enterprise-900">{stats.providers}</div>
              <p className="text-xs text-enterprise-600">EHR Integrations</p>
              <Badge variant="default" className="text-xs mt-2">Active</Badge>
            </CardContent>
          </Card>

          <Card className="border-enterprise-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-enterprise-700">B2B Clients</CardTitle>
              <Building2 className="h-4 w-4 text-enterprise-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-enterprise-900">{stats.b2bClients}</div>
              <p className="text-xs text-enterprise-600">Enterprise Accounts</p>
              <Badge variant="secondary" className="text-xs mt-2">Growing</Badge>
            </CardContent>
          </Card>

          <Card className="border-enterprise-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-enterprise-700">White Label</CardTitle>
              <Users className="h-4 w-4 text-enterprise-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-enterprise-900">{stats.whiteLabelInstances}</div>
              <p className="text-xs text-enterprise-600">Custom Solutions</p>
              <Badge variant="default" className="text-xs mt-2">Deployed</Badge>
            </CardContent>
          </Card>

          <Card className="border-enterprise-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-enterprise-700">Corporate Programs</CardTitle>
              <BarChart3 className="h-4 w-4 text-enterprise-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-enterprise-900">{stats.corporatePrograms}</div>
              <p className="text-xs text-enterprise-600">Wellness Initiatives</p>
              <Badge variant="default" className="text-xs mt-2">Running</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-enterprise-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-enterprise-900">Enterprise Features</CardTitle>
              <CardDescription>Healthcare and B2B platform capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">EHR Integration (FHIR)</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">Clinical Workflows</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">Insurance Claims</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">White Label Platform</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">Advanced Analytics</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-enterprise-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-enterprise-900">Implementation Status</CardTitle>
              <CardDescription>Phase 15 Week 3 deliverables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">Healthcare Provider Integrations</span>
                  <Badge variant="default" className="text-xs">✓ Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">B2B Platform</span>
                  <Badge variant="default" className="text-xs">✓ Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">Corporate Wellness</span>
                  <Badge variant="default" className="text-xs">✓ Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">API Marketplace</span>
                  <Badge variant="default" className="text-xs">✓ Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-enterprise-800">Advanced Analytics</span>
                  <Badge variant="default" className="text-xs">✓ Complete</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button className="bg-enterprise-600 hover:bg-enterprise-700">
            Explore Enterprise Solutions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseB2BDashboard;