import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Shield, Languages, Zap } from 'lucide-react';
import { globalInfrastructureService } from '@/services/globalInfrastructureService';
import { complianceService } from '@/services/complianceService';
import { advancedLocalizationService } from '@/services/advancedLocalizationService';

const GlobalScaleDashboard = () => {
  const [regionData, setRegionData] = useState<any>(null);
  const [complianceStatus, setComplianceStatus] = useState<any[]>([]);
  const [languageConfig, setLanguageConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [regions, compliance, language] = await Promise.all([
          globalInfrastructureService.monitorGlobalPerformance(),
          complianceService.assessCompliance('US', ['health_data', 'personal_data']),
          advancedLocalizationService.detectUserLanguageAndCulture()
        ]);

        setRegionData(regions);
        setComplianceStatus(compliance);
        setLanguageConfig(language);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-global-50 to-scale-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-global-600 mx-auto mb-4"></div>
          <p className="text-global-600 font-medium">Loading Global Scale Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-global-50 to-scale-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-global-900 mb-2">Global Scale & AI Excellence</h1>
          <p className="text-global-600 text-lg">Phase 15: Worldwide deployment and cutting-edge AI capabilities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Global Infrastructure */}
          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">Global Infrastructure</CardTitle>
              <Globe className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">{regionData?.regions?.length || 0}</div>
              <p className="text-xs text-global-600">Active Regions</p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {regionData?.globalAverage ? `${Math.round(regionData.globalAverage)}ms avg` : 'Loading...'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">Compliance</CardTitle>
              <Shield className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">
                {complianceStatus.length > 0 ? `${Math.round(complianceStatus[0]?.score || 0)}%` : 'Loading...'}
              </div>
              <p className="text-xs text-global-600">Compliance Score</p>
              <div className="mt-2">
                <Badge 
                  variant={complianceStatus[0]?.status === 'compliant' ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {complianceStatus[0]?.status || 'Checking...'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">Localization</CardTitle>
              <Languages className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">20+</div>
              <p className="text-xs text-global-600">Supported Languages</p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {languageConfig?.language?.name || 'Auto-detected'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Excellence */}
          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">AI Excellence</CardTitle>
              <Zap className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">Next-Gen</div>
              <p className="text-xs text-global-600">AI Models Ready</p>
              <div className="mt-2">
                <Badge variant="default" className="text-xs">
                  Multi-modal
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-global-900">Global Infrastructure Status</CardTitle>
              <CardDescription>Real-time status of regional deployments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {regionData?.regions?.map((region: any) => (
                  <div key={region.id} className="flex items-center justify-between p-2 rounded-lg bg-global-50">
                    <span className="font-medium text-global-900">{region.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-global-600">{Math.round(region.latency)}ms</span>
                      <Badge variant={region.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                        {region.status}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-global-600">Loading region data...</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-global-900">Phase 15 Features</CardTitle>
              <CardDescription>Global Scale & AI Excellence implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-global-800">Global Infrastructure</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-global-800">Compliance Automation</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-global-800">Advanced Localization</span>
                  <Badge variant="default" className="text-xs">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-global-800">Next-Gen AI Features</span>
                  <Badge variant="secondary" className="text-xs">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button className="bg-global-600 hover:bg-global-700">
            Explore Advanced Features
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalScaleDashboard;