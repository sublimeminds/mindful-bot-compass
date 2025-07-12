import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LiveAnalyticsDashboard from '@/components/analytics/LiveAnalyticsDashboard';
import { therapyApproachService } from '@/services/therapyApproachService';
import { liveAnalyticsService } from '@/services/liveAnalyticsService';
import { 
  Brain, 
  BarChart3, 
  Settings, 
  Users, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Zap,
  Database
} from 'lucide-react';

interface TherapyApproach {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  target_conditions: string[];
  effectiveness_score: number;
  is_active: boolean;
}

interface AnalyticsOverview {
  totalUsers: number;
  activeSessions: number;
  approachUsage: Record<string, number>;
  crisisIndicators: number;
  effectivenessScore: number;
}

const AdminTherapyPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [approaches, setApproaches] = useState<TherapyApproach[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      loadData();
    }
  }, [user, loading, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load therapy approaches
      const approachData = await therapyApproachService.getTherapyApproaches();
      setApproaches(approachData);

      // Load analytics overview
      const analyticsData = await liveAnalyticsService.getAnalyticsOverview();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApproachStatus = async (id: string, isActive: boolean) => {
    try {
      await therapyApproachService.updateApproachStatus(id, !isActive);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error updating approach status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredPage 
      title="Admin Access Required" 
      description="Sign in with admin credentials to access the therapy administration dashboard."
      redirectTo="/admin/therapy"
    />;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Therapy Administration</h1>
            <p className="text-gray-600">Manage therapy approaches and monitor system analytics</p>
          </div>
          <Button className="bg-therapy-600 hover:bg-therapy-700">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Analytics Overview Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.activeSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Crisis Indicators</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.crisisIndicators}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-therapy-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Effectiveness</p>
                    <p className="text-2xl font-bold text-gray-900">{(analytics.effectivenessScore * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Brain className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">AI Approaches</p>
                    <p className="text-2xl font-bold text-gray-900">{approaches.filter(a => a.is_active).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="approaches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="approaches">Therapy Approaches</TabsTrigger>
            <TabsTrigger value="analytics">Live Analytics</TabsTrigger>
            <TabsTrigger value="oversight">Professional Oversight</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Therapy Approaches Tab */}
          <TabsContent value="approaches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Therapy Approaches Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading therapy approaches...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approaches.map((approach) => (
                      <div key={approach.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{approach.name}</h3>
                              <Badge variant={approach.is_active ? "default" : "secondary"}>
                                {approach.is_active ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline">
                                {(approach.effectiveness_score * 100).toFixed(0)}% effective
                              </Badge>
                            </div>
                            <p className="text-gray-600 mt-1">{approach.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {approach.techniques.slice(0, 3).map((technique, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {technique}
                                </Badge>
                              ))}
                              {approach.techniques.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{approach.techniques.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleApproachStatus(approach.id, approach.is_active)}
                            >
                              {approach.is_active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <LiveAnalyticsDashboard />
          </TabsContent>

          {/* Professional Oversight Tab */}
          <TabsContent value="oversight" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Professional Oversight Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Professional Oversight</h3>
                  <p className="text-gray-600 mb-4">
                    Monitor AI therapy sessions requiring professional review
                  </p>
                  <Button className="bg-therapy-600 hover:bg-therapy-700">
                    View Flagged Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">AI Configuration</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Brain className="h-4 w-4 mr-2" />
                        Model Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Zap className="h-4 w-4 mr-2" />
                        Response Triggers
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="h-4 w-4 mr-2" />
                        Knowledge Base
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Analytics & Monitoring</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Crisis Detection
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Quality Metrics
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default AdminTherapyPage;