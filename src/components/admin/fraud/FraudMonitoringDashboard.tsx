import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  Globe, 
  TrendingUp, 
  Users, 
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Percent,
  BarChart3,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import FraudAlertManager from './FraudAlertManager';
import RegionalAnalytics from './RegionalAnalytics';
import UserInvestigationPanel from './UserInvestigationPanel';
import TrustLevelManager from './TrustLevelManager';
import RealTimeFraudFeed from './RealTimeFraudFeed';

interface FraudStats {
  totalAlerts: number;
  activeAlerts: number;
  resolvedToday: number;
  averageResolutionTime: number;
  topAbusedCountries: Array<{ country: string; incidents: number }>;
  trustLevelDistribution: Record<string, number>;
  revenueImpact: number;
}

const FraudMonitoringDashboard = () => {
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchFraudStats();
  }, []);

  const fetchFraudStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch alert statistics
      const { data: alertsData, error: alertsError } = await supabase
        .from('regional_pricing_alerts')
        .select('*');

      if (alertsError) throw alertsError;

      // Fetch trust level distribution
      const { data: trustData, error: trustError } = await supabase
        .from('user_location_confidence')
        .select('trust_level');

      if (trustError) throw trustError;

      // Calculate statistics
      const totalAlerts = alertsData?.length || 0;
      const activeAlerts = alertsData?.filter(alert => !alert.resolved_at).length || 0;
      const resolvedToday = alertsData?.filter(alert => 
        alert.resolved_at && 
        new Date(alert.resolved_at).toDateString() === new Date().toDateString()
      ).length || 0;

      // Trust level distribution
      const trustDistribution = trustData?.reduce((acc: Record<string, number>, item) => {
        acc[item.trust_level] = (acc[item.trust_level] || 0) + 1;
        return acc;
      }, {}) || {};

      setStats({
        totalAlerts,
        activeAlerts,
        resolvedToday,
        averageResolutionTime: 2.4, // hours
        topAbusedCountries: [
          { country: 'VPN Usage', incidents: 45 },
          { country: 'AR', incidents: 23 },
          { country: 'IN', incidents: 18 },
          { country: 'PK', incidents: 12 },
          { country: 'BD', incidents: 8 }
        ],
        trustLevelDistribution: trustDistribution,
        revenueImpact: 12450.67
      });
    } catch (error) {
      console.error('Error fetching fraud stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fraud monitoring statistics',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading fraud monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Regional Fraud Monitoring</h1>
          <p className="text-gray-400">Industry-leading fraud prevention and trust management system</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-600 text-white">
            <Shield className="h-4 w-4 mr-1" />
            System Active
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            <Settings className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold text-white">{stats?.activeAlerts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">-12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved Today</p>
                <p className="text-3xl font-bold text-white">{stats?.resolvedToday || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Clock className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-blue-400 text-sm">Avg: {stats?.averageResolutionTime}h</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue Impact</p>
                <p className="text-3xl font-bold text-white">${stats?.revenueImpact?.toLocaleString() || '0'}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Percent className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-yellow-400 text-sm">Protected revenue</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Trust Score</p>
                <p className="text-3xl font-bold text-white">94.2%</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">+2.1% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alert Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
            <Globe className="h-4 w-4 mr-2" />
            Regional Analytics
          </TabsTrigger>
          <TabsTrigger value="investigation" className="data-[state=active]:bg-blue-600">
            <Eye className="h-4 w-4 mr-2" />
            User Investigation
          </TabsTrigger>
          <TabsTrigger value="trust" className="data-[state=active]:bg-blue-600">
            <Shield className="h-4 w-4 mr-2" />
            Trust Management
          </TabsTrigger>
          <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Real-time Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Country Abuse Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Top Abused Regions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topAbusedCountries.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-3">#{index + 1}</Badge>
                        <span className="text-white">{country.country}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-400 font-bold mr-2">{country.incidents}</span>
                        <span className="text-gray-400 text-sm">incidents</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Trust Level Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats?.trustLevelDistribution || {}).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          level === 'trusted' ? 'bg-green-400' :
                          level === 'building' ? 'bg-yellow-400' :
                          level === 'suspicious' ? 'bg-red-400' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-white capitalize">{level}</span>
                      </div>
                      <span className="text-gray-300">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => setActiveTab('alerts')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Alerts
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('investigation')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Investigate
                </Button>
                <Button 
                  variant="outline" 
                  onClick={fetchFraudStats}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <FraudAlertManager onStatsUpdate={fetchFraudStats} />
        </TabsContent>

        <TabsContent value="analytics">
          <RegionalAnalytics />
        </TabsContent>

        <TabsContent value="investigation">
          <UserInvestigationPanel />
        </TabsContent>

        <TabsContent value="trust">
          <TrustLevelManager onStatsUpdate={fetchFraudStats} />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeFraudFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudMonitoringDashboard;