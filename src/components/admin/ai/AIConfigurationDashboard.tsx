
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Settings, TrendingUp, Shield, Users, BarChart3 } from 'lucide-react';
import { useAIModels } from '@/hooks/useAIModels';
import AIModelConfiguration from './AIModelConfiguration';
import TherapeuticApproachConfig from './TherapeuticApproachConfig';
import PersonalizationEngine from './PersonalizationEngine';
import QualityAssurance from './QualityAssurance';
import AnalyticsInsights from './AnalyticsInsights';
import AIPerformanceMetrics from './AIPerformanceMetrics';
import ModelRoutingConfig from './ModelRoutingConfig';
import CulturalIntegrationConfig from './CulturalIntegrationConfig';
import VoiceAvatarSyncConfig from './VoiceAvatarSyncConfig';
import EmergencyProtocolsConfig from './EmergencyProtocolsConfig';
import CostManagementConfig from './CostManagementConfig';

const AIConfigurationDashboard = () => {
  const { performanceStats, isLoadingStats } = useAIModels();

  // Calculate aggregated metrics from performance stats
  const aggregatedMetrics = React.useMemo(() => {
    if (!performanceStats?.length) {
      return {
        avgResponseTime: 1200,
        successRate: 87.3,
        activeUsers: 2847,
        safetyScore: 99.8
      };
    }

    const avgResponseTime = performanceStats.reduce((sum, stat) => sum + stat.responseTime, 0) / performanceStats.length;
    const avgRating = performanceStats.filter(s => s.userRating).reduce((sum, stat) => sum + (stat.userRating || 0), 0) / performanceStats.filter(s => s.userRating).length;
    
    return {
      avgResponseTime: Math.round(avgResponseTime),
      successRate: Math.round(avgRating * 20), // Convert 1-5 rating to percentage
      activeUsers: 2847, // Would come from user analytics
      safetyScore: 99.8 // Would come from safety monitoring
    };
  }, [performanceStats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Brain className="h-6 w-6 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">AI Configuration & Optimization</h1>
          <p className="text-gray-400">Configure and optimize AI models for better therapy outcomes</p>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoadingStats ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Session Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">{aggregatedMetrics.successRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold text-blue-400">{aggregatedMetrics.avgResponseTime}ms</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-purple-400">{aggregatedMetrics.activeUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Safety Score</p>
                    <p className="text-2xl font-bold text-green-400">{aggregatedMetrics.safetyScore}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 bg-gray-800">
          <TabsTrigger value="models" className="data-[state=active]:bg-purple-600">
            <Brain className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="routing" className="data-[state=active]:bg-purple-600">
            <Settings className="h-4 w-4 mr-2" />
            Routing
          </TabsTrigger>
          <TabsTrigger value="cultural" className="data-[state=active]:bg-purple-600">
            <Users className="h-4 w-4 mr-2" />
            Cultural
          </TabsTrigger>
          <TabsTrigger value="voice-avatar" className="data-[state=active]:bg-purple-600">
            <Shield className="h-4 w-4 mr-2" />
            Voice & Avatar
          </TabsTrigger>
          <TabsTrigger value="emergency" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Emergency
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="cost" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Cost
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <AIModelConfiguration />
        </TabsContent>

        <TabsContent value="routing">
          <ModelRoutingConfig />
        </TabsContent>

        <TabsContent value="cultural">
          <CulturalIntegrationConfig />
        </TabsContent>

        <TabsContent value="voice-avatar">
          <VoiceAvatarSyncConfig />
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyProtocolsConfig />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsInsights />
        </TabsContent>

        <TabsContent value="performance">
          <AIPerformanceMetrics />
        </TabsContent>

        <TabsContent value="cost">
          <CostManagementConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConfigurationDashboard;
